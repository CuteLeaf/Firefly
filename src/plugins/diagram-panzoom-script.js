/*
 * 图表 pan-zoom / 全屏交互脚本（共享）
 *
 * 为 .diagram-container 提供：
 *   - 拖拽平移（鼠标，触摸设备禁用拖拽避免干扰滚动）
 *   - 缩放控制栏（+、−、重置、全屏）
 *   - 双击放大/重置
 *   - 全屏 overlay（带独立缩放、Escape 关闭、自适应暗色背景）
 *   - 响应 astro:page-load（Swup）页面切换
 */
(() => {
	if (window._diagramPanZoomInit) return;
	window._diagramPanZoomInit = true;

	const MIN_SCALE = 0.5;
	const MAX_SCALE = 5;
	const SCALE_STEP = 1.2;
	const overlays = new Set();

	/** 根据当前主题选择可见的 SVG/img 目标 */
	function selectTarget(container) {
		var isDark = document.documentElement.classList.contains("dark");
		var lightEl = container.querySelector(".mermaid-svg-light svg");
		var darkEl = container.querySelector(".mermaid-svg-dark svg");
		if (lightEl && darkEl) return isDark ? darkEl : lightEl;
		return container.querySelector("svg, img, .diagram-panzoom-target");
	}

	function initInteraction(container) {
		if (container.dataset.pzInit === "true") return;
		container.dataset.pzInit = "true";

		// 收集所有可操作的目标元素（Mermaid 有 light+dark 两个 SVG）
		var targets = Array.from(
			container.querySelectorAll(
				".mermaid-svg-light svg, .mermaid-svg-dark svg",
			),
		);
		if (targets.length === 0) {
			const single = container.querySelector(
				"svg, img, .diagram-panzoom-target",
			);
			if (single) targets = [single];
		}
		if (targets.length === 0) return;

		// 动态获取当前可见目标（主题切换后自动跟随）
		const getActiveTarget = () => selectTarget(container) || targets[0];

		const state = { scale: 1, tx: 0, ty: 0 };
		const apply = () => {
			targets.forEach((t) => {
				t.style.transformOrigin = "center center";
				t.style.transform = `translate(${state.tx}px,${state.ty}px) scale(${state.scale})`;
			});
		};
		const clamp = (s) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));
		const reset = () => {
			state.scale = 1;
			state.tx = 0;
			state.ty = 0;
			apply();
		};
		const zoomBy = (f, ox, oy) => {
			const prev = state.scale;
			const next = clamp(prev * f);
			if (next === prev) return;
			if (typeof ox === "number" && typeof oy === "number") {
				const r = getActiveTarget().getBoundingClientRect();
				const dx = ox - (r.left + r.width / 2);
				const dy = oy - (r.top + r.height / 2);
				const ratio = next / prev;
				state.tx -= dx * (ratio - 1);
				state.ty -= dy * (ratio - 1);
			}
			state.scale = next;
			apply();
		};

		// 控制栏
		const controls = document.createElement("div");
		controls.className = "diagram-controls";
		[
			["+", "放大", () => zoomBy(SCALE_STEP)],
			["−", "缩小", () => zoomBy(1 / SCALE_STEP)],
			["↺", "重置", reset],
			["⛶", "全屏", () => openFullscreen(container)],
		].forEach((b) => {
			const el = document.createElement("button");
			el.type = "button";
			el.className = "diagram-ctrl-btn";
			el.textContent = b[0];
			el.title = b[1];
			el.addEventListener("click", (e) => {
				e.preventDefault();
				e.stopPropagation();
				b[2]();
			});
			controls.appendChild(el);
		});
		container.appendChild(controls);

		// 拖拽平移
		let dragging = false;
		let sx = 0;
		let sy = 0;
		let stx = 0;
		let sty = 0;
		container.addEventListener("pointerdown", (e) => {
			if (e.pointerType === "touch") return;
			if (e.button !== 0) return;
			if (e.target.closest(".diagram-controls")) return;
			dragging = true;
			sx = e.clientX;
			sy = e.clientY;
			stx = state.tx;
			sty = state.ty;
			container.setPointerCapture?.(e.pointerId);
			container.style.cursor = "grabbing";
		});
		container.addEventListener("pointermove", (e) => {
			if (!dragging) return;
			state.tx = stx + (e.clientX - sx);
			state.ty = sty + (e.clientY - sy);
			apply();
		});
		const endDrag = (e) => {
			if (!dragging) return;
			dragging = false;
			container.releasePointerCapture?.(e.pointerId);
			container.style.cursor = "";
		};
		container.addEventListener("pointerup", endDrag);
		container.addEventListener("pointercancel", endDrag);

		// 双击
		container.addEventListener("dblclick", (e) => {
			if (e.target.closest(".diagram-controls")) return;
			if (state.scale !== 1) reset();
			else zoomBy(SCALE_STEP * SCALE_STEP, e.clientX, e.clientY);
		});

		apply();
	}

	function openFullscreen(container) {
		// 重新选择当前主题对应的目标元素
		var currentTarget = selectTarget(container);
		if (!currentTarget) return;

		const overlay = document.createElement("div");
		overlay.className = "diagram-fullscreen-overlay";

		const content = document.createElement("div");
		content.className = "diagram-fs-content";

		const clone = currentTarget.cloneNode(true);
		clone.style.transform = "";
		content.appendChild(clone);

		const fsControls = document.createElement("div");
		fsControls.className = "diagram-fs-controls";

		const st = { scale: 1, tx: 0, ty: 0 };
		const apply = () => {
			clone.style.transformOrigin = "center center";
			clone.style.transform = `translate(${st.tx}px,${st.ty}px) scale(${st.scale})`;
		};
		const zoom = (f, ox, oy) => {
			const prev = st.scale;
			const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev * f));
			if (next === prev) return;
			if (typeof ox === "number" && typeof oy === "number") {
				const r = clone.getBoundingClientRect();
				const dx = ox - (r.left + r.width / 2);
				const dy = oy - (r.top + r.height / 2);
				const ratio = next / prev;
				st.tx -= dx * (ratio - 1);
				st.ty -= dy * (ratio - 1);
			}
			st.scale = next;
			apply();
		};
		const rst = () => {
			st.scale = 1;
			st.tx = 0;
			st.ty = 0;
			apply();
		};
		const close = () => {
			document.removeEventListener("keydown", onKey);
			overlay.remove();
			overlays.delete(overlay);
		};
		const onKey = (e) => {
			if (e.key === "Escape") close();
		};

		[
			["+", "放大", () => zoom(SCALE_STEP)],
			["−", "缩小", () => zoom(1 / SCALE_STEP)],
			["↺", "重置", rst],
			["✕", "关闭", close],
		].forEach((b) => {
			const el = document.createElement("button");
			el.type = "button";
			el.className = "diagram-ctrl-btn";
			el.textContent = b[0];
			el.title = b[1];
			el.addEventListener("click", (e) => {
				e.preventDefault();
				e.stopPropagation();
				b[2]();
			});
			fsControls.appendChild(el);
		});

		// 全屏滚轮缩放
		content.addEventListener(
			"wheel",
			(e) => {
				e.preventDefault();
				zoom(e.deltaY < 0 ? SCALE_STEP : 1 / SCALE_STEP, e.clientX, e.clientY);
			},
			{ passive: false },
		);

		// 全屏拖拽平移（支持鼠标和触摸）
		let fdrag = false;
		let fsx = 0;
		let fsy = 0;
		let fstx = 0;
		let fsty = 0;
		content.addEventListener("pointerdown", (e) => {
			if (e.target.closest(".diagram-fs-controls")) return;
			// 多指触摸时由 pinch 处理，跳过单指拖拽
			if (e.pointerType === "touch" && e.isPrimary === false) return;
			fdrag = true;
			fsx = e.clientX;
			fsy = e.clientY;
			fstx = st.tx;
			fsty = st.ty;
			content.setPointerCapture?.(e.pointerId);
		});
		content.addEventListener("pointermove", (e) => {
			if (!fdrag) return;
			st.tx = fstx + (e.clientX - fsx);
			st.ty = fsty + (e.clientY - fsy);
			apply();
		});
		const fEnd = (e) => {
			if (!fdrag) return;
			fdrag = false;
			content.releasePointerCapture?.(e.pointerId);
		};
		content.addEventListener("pointerup", fEnd);
		content.addEventListener("pointercancel", fEnd);

		// 双指缩放（pinch-to-zoom），基于手势初始状态计算避免闪烁
		let pinchDist = 0;
		let pinchScale = 1;
		let pinchTx = 0;
		let pinchTy = 0;
		let pinchCx = 0;
		let pinchCy = 0;
		content.addEventListener(
			"touchstart",
			(e) => {
				if (e.touches.length === 2) {
					e.preventDefault();
					const t0 = e.touches[0];
					const t1 = e.touches[1];
					pinchDist = Math.hypot(
						t1.clientX - t0.clientX,
						t1.clientY - t0.clientY,
					);
					pinchScale = st.scale;
					pinchTx = st.tx;
					pinchTy = st.ty;
					pinchCx = (t0.clientX + t1.clientX) / 2;
					pinchCy = (t0.clientY + t1.clientY) / 2;
				}
			},
			{ passive: false },
		);
		content.addEventListener(
			"touchmove",
			(e) => {
				if (e.touches.length === 2) {
					e.preventDefault();
					const t0 = e.touches[0];
					const t1 = e.touches[1];
					const newDist = Math.hypot(
						t1.clientX - t0.clientX,
						t1.clientY - t0.clientY,
					);
					const newScale = Math.min(
						MAX_SCALE,
						Math.max(MIN_SCALE, pinchScale * (newDist / pinchDist)),
					);
					const ratio = newScale / pinchScale;
					st.scale = newScale;
					st.tx = pinchCx - ratio * (pinchCx - pinchTx);
					st.ty = pinchCy - ratio * (pinchCy - pinchTy);
					apply();
				}
			},
			{ passive: false },
		);

		// 背景点击关闭
		overlay.addEventListener("click", (e) => {
			if (e.target === overlay) close();
		});

		overlay.appendChild(content);
		overlay.appendChild(fsControls);
		document.body.appendChild(overlay);
		overlays.add(overlay);
		document.addEventListener("keydown", onKey);
	}

	function closeAll() {
		overlays.forEach((o) => {
			o.remove();
		});
		overlays.clear();
	}

	function initAll() {
		document.querySelectorAll(".diagram-container").forEach((c) => {
			initInteraction(c);
		});
	}

	// 暴露 re-init 入口，供 PlantUML 重试等场景调用
	window._diagramPanZoomReinit = (container) => {
		// 清理旧的控制栏，避免重复（类名与 utils/diagramConstants.js 保持同步）
		const oldControls = container.querySelector(".diagram-controls");
		if (oldControls) oldControls.remove();
		container.dataset.pzInit = "false";
		initInteraction(container);
	};

	document.addEventListener("astro:before-preparation", closeAll);
	document.addEventListener("astro:page-load", () => {
		closeAll();
		initAll();
	});
	// 加密文章解密后，内容注入 DOM，需要重新初始化 pan-zoom
	document.addEventListener("password:decrypted", () => {
		setTimeout(initAll, 100);
	});
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initAll, { once: true });
	} else {
		initAll();
	}
})();
