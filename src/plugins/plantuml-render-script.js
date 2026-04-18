/*
 * plantuml 图表客户端渲染与交互脚本
 *
 * 职责：
 *   - 根据 <html> 的 `dark` class，动态切换 .plantuml-image 的 data-light-src / data-dark-src
 *   - 加载失败时替换容器内容为错误提示 + 重试按钮
 *   - 为每个容器提供 pan-zoom（CSS transform）与全屏查看能力
 *   - 响应 astro:page-load（Swup）与主题切换事件
 *
 * 通过 IIFE + window.plantumlInitialized 防止在 Swup 场景下重复初始化。
 */
(() => {
	if (window.plantumlInitialized) {
		return;
	}
	window.plantumlInitialized = true;

	const MIN_SCALE = 0.5;
	const MAX_SCALE = 5;
	const SCALE_STEP = 1.2;

	/** @type {Set<HTMLElement>} 当前已打开的全屏 overlay 集合（跨页面清理用） */
	const fullscreenOverlays = new Set();

	/**
	 * 按当前主题为所有图片选择正确的 src。
	 * @returns {void}
	 */
	function applyTheme() {
		const isDark = document.documentElement.classList.contains("dark");
		const images = document.querySelectorAll(".plantuml-image");
		images.forEach((img) => {
			const light = img.getAttribute("data-light-src") || "";
			const dark = img.getAttribute("data-dark-src") || light;
			const next = isDark ? dark : light;
			if (next && img.getAttribute("src") !== next) {
				img.setAttribute("src", next);
			}
		});
	}

	/**
	 * 为单个图片绑定加载失败的降级 UI。
	 * @param {HTMLImageElement} img 图片元素
	 * @param {HTMLElement} container .plantuml-diagram-container
	 */
	function bindErrorHandler(img, container) {
		if (img.dataset.errorBound === "true") return;
		img.dataset.errorBound = "true";
		img.addEventListener("error", () => {
			if (container.dataset.errorShown === "true") return;
			container.dataset.errorShown = "true";
			const wrapper = container.querySelector(".plantuml-wrapper");
			if (!wrapper) return;
			wrapper.innerHTML = "";
			const errorBox = document.createElement("div");
			errorBox.className = "plantuml-error";
			const msg = document.createElement("p");
			msg.textContent = "PlantUML 图表加载失败，请检查网络或服务器状态";
			const retry = document.createElement("button");
			retry.type = "button";
			retry.textContent = "重试";
			retry.addEventListener("click", (event) => {
				event.preventDefault();
				event.stopPropagation();
				delete container.dataset.errorShown;
				wrapper.innerHTML = "";
				const newImg = new Image();
				newImg.className = "plantuml-image";
				newImg.alt = img.alt;
				newImg.setAttribute(
					"data-light-src",
					img.getAttribute("data-light-src") || "",
				);
				newImg.setAttribute(
					"data-dark-src",
					img.getAttribute("data-dark-src") || "",
				);
				newImg.loading = "lazy";
				newImg.decoding = "async";
				wrapper.appendChild(newImg);
				bindErrorHandler(newImg, container);
				bindLoadHandler(newImg, container);
				applyTheme();
			});
			errorBox.appendChild(msg);
			errorBox.appendChild(retry);
			wrapper.appendChild(errorBox);
		});
	}

	/**
	 * 为单个图片绑定 load 回调，在加载成功后初始化 pan-zoom 与控制栏。
	 * @param {HTMLImageElement} img 图片元素
	 * @param {HTMLElement} container .plantuml-diagram-container
	 */
	function bindLoadHandler(img, container) {
		if (img.dataset.loadBound === "true") return;
		img.dataset.loadBound = "true";
		const onLoad = () => initInteraction(container);
		if (img.complete && img.naturalWidth > 0) {
			queueMicrotask(onLoad);
		} else {
			img.addEventListener("load", onLoad, { once: true });
		}
	}

	/**
	 * 初始化指定容器上的缩放、平移、控制栏与双击行为。
	 * 重入安全：同一容器多次调用不会重复绑定。
	 *
	 * @param {HTMLElement} container .plantuml-diagram-container
	 */
	function initInteraction(container) {
		if (container.dataset.interactionInit === "true") return;
		const img = container.querySelector(".plantuml-image");
		if (!img) return;
		container.dataset.interactionInit = "true";

		const state = { scale: 1, translateX: 0, translateY: 0 };

		const applyTransform = () => {
			img.style.transformOrigin = "center center";
			img.style.transform = `translate(${state.translateX}px, ${state.translateY}px) scale(${state.scale})`;
		};

		const clampScale = (next) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));

		const reset = () => {
			state.scale = 1;
			state.translateX = 0;
			state.translateY = 0;
			applyTransform();
		};

		const zoomBy = (factor, originX, originY) => {
			const prev = state.scale;
			const next = clampScale(prev * factor);
			if (next === prev) return;
			if (typeof originX === "number" && typeof originY === "number") {
				const rect = img.getBoundingClientRect();
				const cx = rect.left + rect.width / 2;
				const cy = rect.top + rect.height / 2;
				const dx = originX - cx;
				const dy = originY - cy;
				const ratio = next / prev;
				state.translateX = state.translateX - dx * (ratio - 1);
				state.translateY = state.translateY - dy * (ratio - 1);
			}
			state.scale = next;
			applyTransform();
		};

		// 控制栏按钮
		const controls = document.createElement("div");
		controls.className = "plantuml-controls";
		const buttons = [
			{
				label: "+",
				title: "放大",
				action: () => zoomBy(SCALE_STEP),
			},
			{
				label: "\u2212",
				title: "缩小",
				action: () => zoomBy(1 / SCALE_STEP),
			},
			{ label: "\u21BA", title: "重置", action: reset },
			{
				label: "\u26F6",
				title: "全屏",
				action: () => openFullscreen(container),
			},
		];
		buttons.forEach((btn) => {
			const el = document.createElement("button");
			el.type = "button";
			el.className = "plantuml-ctrl-btn";
			el.textContent = btn.label;
			el.title = btn.title;
			el.addEventListener("click", (event) => {
				event.preventDefault();
				event.stopPropagation();
				btn.action();
			});
			controls.appendChild(el);
		});
		container.appendChild(controls);

		// 滚轮缩放
		container.addEventListener(
			"wheel",
			(event) => {
				if (!event.ctrlKey && !event.metaKey) {
					// 保持与 mermaid 一致：悬停时直接缩放
				}
				event.preventDefault();
				const factor = event.deltaY < 0 ? SCALE_STEP : 1 / SCALE_STEP;
				zoomBy(factor, event.clientX, event.clientY);
			},
			{ passive: false },
		);

		// 拖拽平移
		let isDragging = false;
		let startX = 0;
		let startY = 0;
		let startTx = 0;
		let startTy = 0;

		const onPointerDown = (event) => {
			if (event.button !== 0 && event.pointerType !== "touch") return;
			if (event.target.closest(".plantuml-controls")) return;
			isDragging = true;
			startX = event.clientX;
			startY = event.clientY;
			startTx = state.translateX;
			startTy = state.translateY;
			container.setPointerCapture?.(event.pointerId);
			container.style.cursor = "grabbing";
		};
		const onPointerMove = (event) => {
			if (!isDragging) return;
			state.translateX = startTx + (event.clientX - startX);
			state.translateY = startTy + (event.clientY - startY);
			applyTransform();
		};
		const onPointerUp = (event) => {
			if (!isDragging) return;
			isDragging = false;
			container.releasePointerCapture?.(event.pointerId);
			container.style.cursor = "";
		};
		container.addEventListener("pointerdown", onPointerDown);
		container.addEventListener("pointermove", onPointerMove);
		container.addEventListener("pointerup", onPointerUp);
		container.addEventListener("pointercancel", onPointerUp);

		// 双击放大/重置
		container.addEventListener("dblclick", (event) => {
			if (event.target.closest(".plantuml-controls")) return;
			if (state.scale !== 1) {
				reset();
			} else {
				zoomBy(SCALE_STEP * SCALE_STEP, event.clientX, event.clientY);
			}
		});

		applyTransform();
	}

	/**
	 * 打开全屏 overlay 展示指定容器中的图片。
	 * @param {HTMLElement} container .plantuml-diagram-container
	 */
	function openFullscreen(container) {
		const sourceImg = container.querySelector(".plantuml-image");
		if (!sourceImg) return;

		const overlay = document.createElement("div");
		overlay.className = "plantuml-fullscreen-overlay";

		const content = document.createElement("div");
		content.className = "plantuml-fs-content";

		const img = document.createElement("img");
		img.src = sourceImg.src;
		img.alt = sourceImg.alt;
		img.draggable = false;
		content.appendChild(img);

		const fsControls = document.createElement("div");
		fsControls.className = "plantuml-fs-controls";

		const state = { scale: 1, tx: 0, ty: 0 };
		const apply = () => {
			img.style.transformOrigin = "center center";
			img.style.transform = `translate(${state.tx}px, ${state.ty}px) scale(${state.scale})`;
		};
		const zoom = (factor, originX, originY) => {
			const prev = state.scale;
			const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev * factor));
			if (next === prev) return;
			if (typeof originX === "number" && typeof originY === "number") {
				const rect = img.getBoundingClientRect();
				const cx = rect.left + rect.width / 2;
				const cy = rect.top + rect.height / 2;
				const dx = originX - cx;
				const dy = originY - cy;
				const ratio = next / prev;
				state.tx = state.tx - dx * (ratio - 1);
				state.ty = state.ty - dy * (ratio - 1);
			}
			state.scale = next;
			apply();
		};
		const resetState = () => {
			state.scale = 1;
			state.tx = 0;
			state.ty = 0;
			apply();
		};

		const close = () => {
			document.removeEventListener("keydown", onKeyDown);
			overlay.remove();
			fullscreenOverlays.delete(overlay);
		};
		const onKeyDown = (event) => {
			if (event.key === "Escape") {
				close();
			}
		};

		const fsButtons = [
			{ label: "+", title: "放大", action: () => zoom(SCALE_STEP) },
			{
				label: "\u2212",
				title: "缩小",
				action: () => zoom(1 / SCALE_STEP),
			},
			{ label: "\u21BA", title: "重置", action: resetState },
			{ label: "\u2715", title: "关闭", action: close },
		];
		fsButtons.forEach((btn) => {
			const el = document.createElement("button");
			el.type = "button";
			el.className = "plantuml-ctrl-btn";
			el.textContent = btn.label;
			el.title = btn.title;
			el.addEventListener("click", (event) => {
				event.preventDefault();
				event.stopPropagation();
				btn.action();
			});
			fsControls.appendChild(el);
		});

		// overlay 内滚轮缩放
		content.addEventListener(
			"wheel",
			(event) => {
				event.preventDefault();
				const factor = event.deltaY < 0 ? SCALE_STEP : 1 / SCALE_STEP;
				zoom(factor, event.clientX, event.clientY);
			},
			{ passive: false },
		);

		// overlay 内拖拽平移
		let dragging = false;
		let sx = 0;
		let sy = 0;
		let stx = 0;
		let sty = 0;
		content.addEventListener("pointerdown", (event) => {
			if (event.target.closest(".plantuml-fs-controls")) return;
			dragging = true;
			sx = event.clientX;
			sy = event.clientY;
			stx = state.tx;
			sty = state.ty;
			content.setPointerCapture?.(event.pointerId);
		});
		content.addEventListener("pointermove", (event) => {
			if (!dragging) return;
			state.tx = stx + (event.clientX - sx);
			state.ty = sty + (event.clientY - sy);
			apply();
		});
		const endDrag = (event) => {
			if (!dragging) return;
			dragging = false;
			content.releasePointerCapture?.(event.pointerId);
		};
		content.addEventListener("pointerup", endDrag);
		content.addEventListener("pointercancel", endDrag);

		// 背景点击关闭
		overlay.addEventListener("click", (event) => {
			if (event.target === overlay) {
				close();
			}
		});

		overlay.appendChild(content);
		overlay.appendChild(fsControls);
		document.body.appendChild(overlay);
		fullscreenOverlays.add(overlay);
		document.addEventListener("keydown", onKeyDown);
	}

	/**
	 * 清理全部已打开的全屏 overlay；用于 Swup 页面切换前。
	 */
	function closeAllOverlays() {
		fullscreenOverlays.forEach((overlay) => {
			overlay.remove();
		});
		fullscreenOverlays.clear();
	}

	/**
	 * 扫描当前文档中的所有 .plantuml-diagram-container，初始化交互与降级。
	 */
	function initAll() {
		const containers = document.querySelectorAll(".plantuml-diagram-container");
		containers.forEach((container) => {
			const img = container.querySelector(".plantuml-image");
			if (!img) return;
			bindErrorHandler(img, container);
			bindLoadHandler(img, container);
		});
		applyTheme();
	}

	// 监听主题切换
	const themeObserver = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (
				mutation.type === "attributes" &&
				mutation.attributeName === "class"
			) {
				applyTheme();
				break;
			}
		}
	});
	themeObserver.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class"],
	});

	// Swup 导航清理
	document.addEventListener("astro:before-preparation", closeAllOverlays);
	document.addEventListener("astro:page-load", () => {
		closeAllOverlays();
		initAll();
	});

	// 初次加载
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initAll, { once: true });
	} else {
		initAll();
	}
})();
