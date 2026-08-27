import { backgroundWallpaper } from "@/config";
import { pathsEqual, url } from "@/utils/url-utils";

// 全屏壁纸模式：首页标题随滚动平滑上移并渐变消失（首屏完整显示，下滑淡出；壁纸保持 fixed）
const TITLE_FADE_RATIO = 0.5; // 滚动到半个视口高度后标题完全淡出
const BLUR_RAMP_SCROLL = 300; // px，首页下滑该距离后壁纸模糊达到配置的最大值（期间从 0 连续渐变）
const BLUR_QUANTIZE_STEP = 2; // px，模糊值量化步长，避免每帧都触发全屏 blur 重栅格化
let parallaxTicking = false;
let cachedMaxBlur: number | null = null; // 缓存的 --overlay-blur 解析值（仅在加载/滑块变化时刷新）
let lastWrittenBlur = ""; // 上次实际写入的 --fullscreen-blur，值未变则跳过写入

export function updateFullscreenTitleParallax(): void {
	const html = document.documentElement;
	const overlay = document.getElementById("banner-overlay-container");
	if (!overlay) return;
	// 非全屏或页面过渡中：复位（让 transition-swup-fade 的 CSS 生效）
	if (
		html.getAttribute("data-wallpaper-mode") !== "fullscreen" ||
		html.classList.contains("is-animating") ||
		html.classList.contains("is-changing")
	) {
		overlay.style.transform = "";
		overlay.style.opacity = "";
		return;
	}
	// 仅首页使用 hero 标题；非首页与 overlay 一致（无标题覆盖层）
	if (!pathsEqual(window.location.pathname, url("/"))) {
		overlay.style.transform = "";
		overlay.style.opacity = "";
		return;
	}
	const scrollY = window.pageYOffset || document.documentElement.scrollTop;
	// 标题随滚动上移，同时透明度渐变到 0（渐变消失，不弹跳）
	const fadeScroll = window.innerHeight * TITLE_FADE_RATIO;
	const ratio = Math.min(scrollY / fadeScroll, 1);
	overlay.style.transform = `translateY(${-scrollY}px)`;
	overlay.style.opacity = String(1 - ratio);
}

function requestFullscreenTitleParallax(): void {
	if (!parallaxTicking) {
		parallaxTicking = true;
		requestAnimationFrame(() => {
			parallaxTicking = false;
			updateFullscreenTitleParallax();
			syncFullscreenBlur();
		});
	}
}

// 非首页全屏壁纸模式：强制隐藏标题覆盖层（与 overlay 一致），
// 处理运行时切换 / Swup 导航后 banner 渲染的覆盖层残留（内联 !important，不依赖 CSS 是否已刷新）
export function syncFullscreenOverlays(): void {
	const mode = document.documentElement.getAttribute("data-wallpaper-mode");
	const isHome = pathsEqual(window.location.pathname, url("/"));
	const overlays = document.querySelectorAll(
		"#banner-overlay-container .banner-home-text-overlay, #banner-overlay-container .banner-page-title-overlay, #banner-overlay-container .banner-post-meta-overlay",
	);
	overlays.forEach((el) => {
		const element = el as HTMLElement;
		if (mode === "fullscreen" && !isHome) {
			element.style.setProperty("display", "none", "important");
		} else {
			element.style.removeProperty("display");
		}
	});
}

// 全屏壁纸模糊：首页从 0 随滚动连续渐变到配置的最大值，非首页固定为最大值（与 overlay 一致）
// 通过 --fullscreen-blur 变量驱动（复用 overlay 的 blur 配置），图片 CSS 恒为 blur(var(--fullscreen-blur))
// 性能：maxBlur 缓存（避免每帧 getComputedStyle）+ 2px 量化（值未变跳过写入），避免全屏 blur 逐帧重栅格化
export function syncFullscreenBlur(): void {
	const html = document.documentElement;
	const wrapper = document.getElementById("wallpaper-wrapper");
	if (!wrapper) return;
	if (html.getAttribute("data-wallpaper-mode") !== "fullscreen") {
		setBlurIfChanged(wrapper, "0px");
		return;
	}
	// 按设备开关决定全屏模式是否启用模糊（关闭则该设备上首页与非首页都保持清晰）
	if (!isBlurRampEnabled()) {
		setBlurIfChanged(wrapper, "0px");
		return;
	}
	// 读取当前生效的模糊配置（跟随设置面板滑块 / overlay.blur），已缓存，仅加载/滑块变化时重读
	const safeMax = cachedMaxBlur ?? readMaxBlur(wrapper);
	const isHome = pathsEqual(window.location.pathname, url("/"));
	if (!isHome) {
		setBlurIfChanged(wrapper, `${safeMax}px`);
		return;
	}
	const scrollY = window.pageYOffset || document.documentElement.scrollTop;
	const ratio = Math.min(scrollY / BLUR_RAMP_SCROLL, 1);
	setBlurIfChanged(wrapper, `${quantizeBlur(ratio * safeMax)}px`);
}

// 全屏壁纸模式的模糊渐变是否启用：按当前视口设备读取 fullscreen.blurRamp 配置（支持布尔或 { desktop, mobile }，未配置默认开启）
function isBlurRampEnabled(): boolean {
	const enable = backgroundWallpaper.fullscreen?.blurRamp?.enable;
	if (typeof enable === "boolean") return enable;
	if (!enable) return true;
	return window.innerWidth < 1024 ? enable.mobile : enable.desktop;
}

function readMaxBlur(wrapper: HTMLElement): number {
	const maxBlur = Number.parseFloat(
		window.getComputedStyle(wrapper).getPropertyValue("--overlay-blur"),
	);
	const safeMax = Number.isFinite(maxBlur) && maxBlur > 0 ? maxBlur : 0;
	cachedMaxBlur = safeMax;
	return safeMax;
}

function quantizeBlur(value: number): number {
	return Math.floor(value / BLUR_QUANTIZE_STEP) * BLUR_QUANTIZE_STEP;
}

function setBlurIfChanged(wrapper: HTMLElement, value: string): void {
	if (value === lastWrittenBlur) return;
	lastWrittenBlur = value;
	wrapper.style.setProperty("--fullscreen-blur", value);
}

/** 注册监听并做初始同步（从 Layout.astro 迁出） */
export function initFullscreenWallpaper(): void {
	window.addEventListener("scroll", requestFullscreenTitleParallax, {
		passive: true,
	});
	window.addEventListener("wallpaperModeChange", () => {
		requestAnimationFrame(updateFullscreenTitleParallax);
		syncFullscreenBlur();
	});
	window.addEventListener("wallpaperModeChange", syncFullscreenOverlays);
	updateFullscreenTitleParallax(); // 初始加载（浏览器可能恢复滚动位置）
	syncFullscreenOverlays(); // 初始加载时同步非首页覆盖层状态
	syncFullscreenBlur(); // 初始加载时同步壁纸模糊状态

	// 设置面板调整模糊滑块（--overlay-blur 变化）时，同步全屏壁纸的 --fullscreen-blur，
	// 否则非首页的模糊只在滚动/切页时才更新，滑块会表现为失效
	const wrapper = document.getElementById("wallpaper-wrapper");
	if (!wrapper) return;
	let lastOverlayBlur = wrapper.style.getPropertyValue("--overlay-blur");
	const observer = new MutationObserver(() => {
		const current = wrapper.style.getPropertyValue("--overlay-blur");
		if (current !== lastOverlayBlur) {
			lastOverlayBlur = current;
			cachedMaxBlur = null; // 配置已变，强制下次同步时重读
			syncFullscreenBlur();
		}
	});
	observer.observe(wrapper, { attributes: true, attributeFilter: ["style"] });
}

/** 模式初始化后同步（此时 data-wallpaper-mode 才是运行时模式） */
export function syncFullscreenStateAfterInit(): void {
	syncFullscreenBlur();
	syncFullscreenOverlays();
	updateFullscreenTitleParallax();
}
