/*
 * PlantUML 主题切换脚本
 *
 * 仅负责：
 *   - 根据 <html> 的 dark class 切换 .plantuml-image 的 src
 *   - 加载失败时显示错误提示 + 重试
 *   - 响应 astro:page-load（Swup）与主题切换事件
 *
 * pan-zoom / 全屏功能由共享的 rehype-diagram-panzoom 插件提供。
 */
(() => {
	if (window.plantumlThemeInit) return;
	window.plantumlThemeInit = true;

	function applyTheme() {
		const isDark = document.documentElement.classList.contains("dark");
		document.querySelectorAll(".plantuml-image").forEach((img) => {
			const light = img.getAttribute("data-light-src") || "";
			const dark = img.getAttribute("data-dark-src") || light;
			const next = isDark ? dark : light;
			if (next && img.getAttribute("src") !== next) {
				img.setAttribute("src", next);
			}
		});
	}

	function bindErrorHandler(img, container) {
		if (img.dataset.errorBound === "true") return;
		img.dataset.errorBound = "true";
		img.addEventListener("error", () => {
			if (container.dataset.errorShown === "true") return;
			container.dataset.errorShown = "true";
			const wrapper = container.querySelector(".diagram-wrapper");
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
				applyTheme();
				// 重新初始化 pan-zoom 交互
				if (window._diagramPanZoomReinit) {
					window._diagramPanZoomReinit(container);
				}
			});
			errorBox.appendChild(msg);
			errorBox.appendChild(retry);
			wrapper.appendChild(errorBox);
		});
	}

	function initAll() {
		document
			.querySelectorAll(".plantuml-diagram-container")
			.forEach((container) => {
				const img = container.querySelector(".plantuml-image");
				if (img) bindErrorHandler(img, container);
			});
		applyTheme();
	}

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

	document.addEventListener("astro:page-load", () => {
		initAll();
	});

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initAll, { once: true });
	} else {
		initAll();
	}
})();
