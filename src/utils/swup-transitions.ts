import { expressiveCodeConfig, navbarMode, siteConfig } from "@/config";
import type { WALLPAPER_MODE } from "@/types/config";
import { scheduleContentOverflowEnhancements } from "@/utils/content-overflow-utils";
import { initializeFloatingPanels } from "@/utils/floating-panel-utils";
import {
	syncFullscreenBlur,
	syncFullscreenOverlays,
	updateFullscreenTitleParallax,
} from "@/utils/fullscreen-wallpaper-utils";
import {
	updateMainGridCols,
	updateSidebarComponentsVisibility,
} from "@/utils/grid-layout-utils";
import { scrollFunction } from "@/utils/scroll-utils";
import {
	syncBannerHomeTextVisibility,
	updateNavbarTransparency,
} from "@/utils/setting-utils";
import { pathsEqual, url } from "@/utils/url-utils";

/**
 * 进度条：WAAPI 驱动 transform/opacity（合成线程动画）。
 * 替代原 width 关键帧 + `void offsetWidth` 强制回流方案——后者在大型文章 DOM 上
 * 会触发整棵布局树同步重排，正是切页卡顿来源之一。
 */
function startProgressBar(): void {
	const bar = document.getElementById("progress-bar");
	if (!bar) return;
	bar.getAnimations().forEach((a) => {
		a.cancel();
	});
	bar.animate(
		[
			{ transform: "scaleX(0)", opacity: 1 },
			{ transform: "scaleX(0.95)", opacity: 1 },
		],
		{
			duration: 8000,
			easing: "cubic-bezier(0.1, 0.05, 0.1, 1)",
			fill: "forwards",
		},
	);
}

function finishProgressBar(): void {
	const bar = document.getElementById("progress-bar");
	if (!bar) return;
	bar.getAnimations().forEach((a) => {
		a.cancel();
	});
	bar.animate(
		[
			{ transform: "scaleX(1)", opacity: 1 },
			{ transform: "scaleX(1)", opacity: 0 },
		],
		{ duration: 500, easing: "ease-out", fill: "forwards" },
	);
}

/**
 * Swup 页面切换编排（从 Layout.astro 迁出）。
 * 注册 link:click / content:replace / visit:start / page:view / visit:end 钩子。
 */
function registerSwupHooks(): void {
	// 非首页全屏模式与 overlay 一致（内容在最上面），首页 hero 结构回顶即可，
	// 均无需自定义 swup 回顶行为，保留默认滚动到顶部
	// TODO: temp solution to change the height of the banner
	window.swup.hooks.on(
		"link:click",
		(_visit: unknown, { el }: { el: HTMLAnchorElement }) => {
			// Remove the delay for the first time page load
			document.documentElement.style.setProperty("--content-delay", "0ms");

			// 同页链接点击不需要过渡保护
			const targetHref = el.getAttribute("href") || "";
			const targetPathname = (() => {
				try {
					return new URL(targetHref, window.location.href).pathname;
				} catch {
					return targetHref;
				}
			})();
			const isSamePage = pathsEqual(targetPathname, window.location.pathname);
			if (isSamePage) {
				document.documentElement.classList.remove("is-page-transitioning");
			}
			if (!isSamePage) {
				// 添加页面切换保护，防止导航栏闪烁
				document.documentElement.classList.add("is-page-transitioning");
			}

			const navbar = document.getElementById("navbar-wrapper");
			if (navbar && navbarMode === "dynamic") {
				// 切页时先显示导航栏，避免新页从隐藏态开始；滚动逻辑会随滚动位置重新判断
				navbar.classList.remove("navbar-hidden");
				document.body.classList.remove("dynamic-navbar-hidden");
			} else if (navbar) {
				// fixed / static：切页时先显示导航栏，避免残留上一页（如滚到底部时隐藏）的 navbar-hidden，
				// 否则从其它页面切回首页时导航栏会保持隐藏、不再跨壁纸显示
				navbar.classList.remove("navbar-hidden");
			}
		},
	);
	window.swup.hooks.on("content:replace", () => {
		initializeFloatingPanels();

		// 侧边栏组件可见性由 page:view 统一更新（含 refreshSidebarStickyState 的
		// offsetHeight 布局读取），content:replace 不重复执行，避免每趟切页强制布局两次

		// 只处理katex元素的容器，使用浏览器原生滚动条
		scheduleContentOverflowEnhancements();

		// 重新初始化图标加载器
		import("@/utils/icon-loader").then(({ initIconLoader }) => {
			initIconLoader();
		});

		// 检查当前页面是否为文章页面（有TOC元素）
		const tocWrapper = document.getElementById("toc-wrapper");
		const isArticlePage = tocWrapper !== null;

		// 只在文章页面重新初始化桌面端 TOC 组件
		if (isArticlePage) {
			const tocElement = document.querySelector("table-of-contents");
			const tocInit = tocElement?.init;
			if (tocElement && typeof tocInit === "function") {
				setTimeout(() => {
					tocInit();
				}, 100);
			}
		}

		// 重新初始化semifull模式的滚动检测
		// （全屏模式跳过：导航栏状态由 updateNavbarTransparency 统一管理，
		//   避免切换页面时 initSemifullScrollDetection 重置 scrolled 导致背景闪烁）
		const navbar = document.getElementById("navbar");
		if (navbar) {
			const transparentMode = navbar.getAttribute("data-transparent-mode");
			const navWallpaperMode = document.documentElement.getAttribute(
				"data-wallpaper-mode",
			);

			if (transparentMode === "semifull" && navWallpaperMode !== "fullscreen") {
				// 重新调用初始化函数来重新绑定滚动事件
				if (typeof window.initSemifullScrollDetection === "function") {
					window.initSemifullScrollDetection();
				}
			}
		}
	});
	window.swup.hooks.on("visit:start", (visit: { to: { url: string } }) => {
		// Start progress bar（WAAPI 合成线程动画，不强制回流）
		startProgressBar();

		// 先回顶，让后续 FLIP 在 scroll=0 的坐标系内计算：
		// 若在切页后才回顶，FLIP 的 invert 是按切页前滚动位置校准的，scroll 一复位就会导致
		// 内容区从视口上方之外（滚动较深时 top<0）开始、再落回，表现为“冲过头再回落”。
		// 必须用 instant：html 上有 scroll-behavior:smooth（main.css），behavior:"auto" 会被当作平滑滚动，
		// 在 FLIP 期间与内容位移叠加、同样造成“顶到最顶部再回落”。
		// 移动端（<768）不使用即时回顶，避免闪烁（由 swup 默认滚动接管）
		if (window.innerWidth >= 768) {
			window.scrollTo({ top: 0, behavior: "instant" });
		}

		// 更新首页状态（body.is-home 驱动 CSS --content-top 等）
		const bodyElement = document.querySelector("body") as HTMLElement;
		const isHomePage = pathsEqual(visit.to.url, url("/"));
		const wasHome = bodyElement.classList.contains("is-home");
		const contentPanel = document.querySelector(
			".content-panel",
		) as HTMLElement | null;
		// FLIP 只在 is-home 状态变化（首页↔非首页）时才有意义；文章↔文章、首页↔首页
		// 类未变 → delta 必为 0，直接短路，避免常见切页白付两次强制布局读取
		if (isHomePage !== wasHome && contentPanel) {
			const oldTop = contentPanel.getBoundingClientRect().top; // 类切换前读
			bodyElement.classList.toggle("is-home", isHomePage);
			const newTop = contentPanel.getBoundingClientRect().top; // 类切换后读
			const delta = oldTop - newTop;
			// 全屏首页↔非首页 delta ≈ 92vh，总是超过 0.75 视口，此前被跳过导致内容区瞬间跳变；
			// 现在放行，改用与移动端横幅模式完全一致的标准 FLIP（强制回流提交 invert + CSS 过渡），
			// 让内容区整屏丝滑上移/下移（非全屏仍受 0.75 视口阈值保护）
			const isFullscreen =
				document.documentElement.getAttribute("data-wallpaper-mode") ===
				"fullscreen";
			if (
				delta !== 0 &&
				(isFullscreen || Math.abs(delta) <= window.innerHeight * 0.75)
			) {
				// 标准 FLIP：禁用过渡→设 invert transform→回流提交→启用过渡→移除 transform（触发合成动画）
				// 不再设置 will-change:transform——它把整个 .content-panel（含全页文字）预先且持续地提升为
				// 独立合成层，软导航结束后的旧光栅贴图因该提示而保留，导致残留发糊（#615）。
				// transform 过渡本身会在动画期间由浏览器自动提升到合成层（compositor 驱动，丝滑不减），
				// 动画结束后自动降级并按普通路径重光栅，文字恢复清晰。
				contentPanel.style.transition = "none";
				contentPanel.style.transform = `translateY(${delta}px)`;
				void contentPanel.offsetWidth;
				contentPanel.style.transition = "";
				contentPanel.style.transform = "";
			}
		}

		// Control navbar transparency based on page
		const navbar = document.getElementById("navbar");
		if (navbar) {
			navbar.setAttribute("data-is-home", isHomePage.toString());

			// 重新初始化semifull模式的滚动检测
			// （全屏模式跳过：导航栏状态由 updateNavbarTransparency 统一管理，
			//   避免切换页面时 initSemifullScrollDetection 重置 scrolled 导致背景闪烁）
			const transparentMode = navbar.getAttribute("data-transparent-mode");
			const navWallpaperMode = document.documentElement.getAttribute(
				"data-wallpaper-mode",
			);
			if (transparentMode === "semifull" && navWallpaperMode !== "fullscreen") {
				// 重新调用初始化函数来重新绑定滚动事件
				if (typeof window.initSemifullScrollDetection === "function") {
					window.initSemifullScrollDetection();
				}
			}
		}

		// 在移动端禁用文章列表容器的过渡动画，防止与主内容区位置变化冲突
		if (window.innerWidth < 1024) {
			const postListContainer = document.getElementById("post-list-container");
			if (postListContainer) {
				postListContainer.style.transition = "none";
			}
		}

		// increase the page height during page transition to prevent the scrolling animation from jumping
		const heightExtend = document.getElementById("page-height-extend");
		if (heightExtend) {
			heightExtend.classList.remove("hidden");
		}

		// Hide the TOC while scrolling back to top
		const toc = document.getElementById("toc-wrapper");
		if (toc) {
			toc.classList.add("toc-not-ready");
		}
	});
	window.swup.hooks.on("page:view", () => {
		// 更新网格列数和侧边栏组件可见性
		updateMainGridCols();
		updateSidebarComponentsVisibility();

		// 过渡结束后再量一次，避免顶部组件未就绪时读到 offsetHeight=0 而误删 mb-4
		// (sticky 与 top 组件之间间距只在 refreshSidebarStickyState 里恢复，延迟补偿一次更稳)
		window.setTimeout(() => updateSidebarComponentsVisibility(), 300);

		// hide the temp high element when the transition is done
		const heightExtend = document.getElementById("page-height-extend");
		if (heightExtend) {
			heightExtend.classList.remove("hidden");
		}

		// 页面切换完成后，同步全屏模式的标题视差位移（Swup 已替换容器内容）
		updateFullscreenTitleParallax();
		syncFullscreenOverlays();
		syncFullscreenBlur();
		// 页面切换后同步首页标题显隐（body.is-home 已更新，按新页面重算 hidden 类）
		syncBannerHomeTextVisibility();
		// 页面切换后按新页面刷新导航栏透明状态（全屏首页动态透明 / 非首页完全透明）
		updateNavbarTransparency(
			document.documentElement.getAttribute(
				"data-wallpaper-mode",
			) as WALLPAPER_MODE,
		);

		// 在移动端恢复文章列表容器的过渡动画（在主内容区位置动画完成后）
		const isMobile = window.innerWidth < 1024;
		if (isMobile) {
			setTimeout(() => {
				const postListContainer = document.getElementById(
					"post-list-container",
				);
				if (postListContainer) {
					postListContainer.style.transition = "";
				}
			}, 600); // 等待主内容区动画完成（0.4s + 0.1s delay + 100ms buffer）
		}

		// 同步主题状态 - 解决从首页进入文章页面时代码块渲染问题
		const storedTheme =
			localStorage.getItem("theme") ||
			siteConfig.themeColor.defaultMode ||
			"light";
		let isDark = false;

		// 处理 system 模式
		if (storedTheme === "system") {
			isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		} else {
			isDark = storedTheme === "dark";
		}

		const expectedTheme = isDark
			? expressiveCodeConfig.darkTheme
			: expressiveCodeConfig.lightTheme;
		const currentTheme = document.documentElement.getAttribute("data-theme");

		// 如果主题不匹配，静默更新（不触发事件，避免重新加载效果）
		if (currentTheme !== expectedTheme) {
			document.documentElement.setAttribute("data-theme", expectedTheme);
		}

		// 检查当前页面是否为文章页面，如果是则触发自定义事件用于初始化评论系统
		setTimeout(() => {
			if (document.getElementById("tcomment")) {
				// 触发自定义事件，通知评论系统页面已完全加载
				const pageLoadedEvent = new CustomEvent("firefly:page:loaded", {
					detail: {
						path: window.location.pathname,
						timestamp: Date.now(),
					},
				});
				document.dispatchEvent(pageLoadedEvent);
				console.log(
					"Layout: 触发 firefly:page:loaded 事件，路径:",
					window.location.pathname,
				);
			}
		}, 300);
	});
	window.swup.hooks.on("visit:end", (_visit: { to: { url: string } }) => {
		// Finish progress bar（WAAPI：快速填满后淡出）
		finishProgressBar();

		setTimeout(() => {
			const heightExtend = document.getElementById("page-height-extend");
			if (heightExtend) {
				heightExtend.classList.add("hidden");
			}

			// Just make the transition looks better
			const toc = document.getElementById("toc-wrapper");
			if (toc) {
				toc.classList.remove("toc-not-ready");
			}

			// 移除页面切换保护，恢复过渡动画
			document.documentElement.classList.remove("is-page-transitioning");
			scrollFunction();
		}, 200);
	});
}

/** 注册 Swup 钩子（swup 就绪时立即执行，否则等待 swup:enable 事件） */
export function setupSwupTransitions(): void {
	if (window?.swup?.hooks) {
		registerSwupHooks();
	} else {
		document.addEventListener("swup:enable", registerSwupHooks);
	}
}
