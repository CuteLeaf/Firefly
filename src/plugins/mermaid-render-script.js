(() => {
	// 单例模式：检查是否已经初始化过
	if (window.mermaidInitialized) {
		return;
	}

	window.mermaidInitialized = true;

	// 记录当前主题状态，避免不必要的重新渲染
	let currentTheme = null;
	let isRendering = false; // 防止并发渲染
	let retryCount = 0;
	const MAX_RETRIES = 3;
	const RETRY_DELAY = 1000; // 1秒

	// 检查主题是否真的发生了变化
	function hasThemeChanged() {
		const isDark = document.documentElement.classList.contains("dark");
		const newTheme = isDark ? "dark" : "default";

		if (currentTheme !== newTheme) {
			currentTheme = newTheme;
			return true;
		}
		return false;
	}

	// 等待 Mermaid 库加载完成
	function waitForMermaid(timeout = 10000) {
		return new Promise((resolve, reject) => {
			const startTime = Date.now();

			function check() {
				if (window.mermaid && typeof window.mermaid.initialize === "function") {
					resolve(window.mermaid);
				} else if (Date.now() - startTime > timeout) {
					reject(new Error("Mermaid library failed to load within timeout"));
				} else {
					setTimeout(check, 100);
				}
			}

			check();
		});
	}

	// 设置 MutationObserver 监听 html 元素的 class 属性变化
	function setupMutationObserver() {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (
					mutation.type === "attributes" &&
					mutation.attributeName === "class"
				) {
					// 检查是否是 dark 类的变化
					const target = mutation.target;
					const wasDark = mutation.oldValue
						? mutation.oldValue.includes("dark")
						: false;
					const isDark = target.classList.contains("dark");

					if (wasDark !== isDark) {
						if (hasThemeChanged()) {
							// 延迟渲染，避免主题切换时的闪烁
							setTimeout(() => renderMermaidDiagrams(), 150);
						}
					}
				}
			});
		});

		// 开始观察 html 元素的 class 属性变化
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
			attributeOldValue: true,
		});
	}

	// 设置其他事件监听器
	function setupEventListeners() {
		// 监听页面切换
		document.addEventListener("astro:page-load", () => {
			// 重新初始化主题状态
			currentTheme = null;
			retryCount = 0; // 重置重试计数
			if (hasThemeChanged()) {
				setTimeout(() => renderMermaidDiagrams(), 100);
			}
		});

		// 监听页面可见性变化，页面重新可见时重新渲染
		document.addEventListener("visibilitychange", () => {
			if (!document.hidden) {
				setTimeout(() => renderMermaidDiagrams(), 200);
			}
		});
	}

	async function initializeMermaid() {
		try {
			await waitForMermaid();

			// 初始化 Mermaid 配置
			window.mermaid.initialize({
				startOnLoad: false,
				theme: "default",
				themeVariables: {
					fontFamily: "inherit",
					fontSize: "16px",
				},
				securityLevel: "loose",
				// 添加错误处理配置
				errorLevel: "warn",
				logLevel: "error",
			});

			// 渲染所有 Mermaid 图表
			await renderMermaidDiagrams();
		} catch (error) {
			console.error("Failed to initialize Mermaid:", error);
			// 如果初始化失败，尝试重新加载
			if (retryCount < MAX_RETRIES) {
				retryCount++;
				setTimeout(() => initializeMermaid(), RETRY_DELAY * retryCount);
			}
		}
	}

	async function renderMermaidDiagrams() {
		// 防止并发渲染
		if (isRendering) {
			return;
		}

		// 检查 Mermaid 是否可用
		if (!window.mermaid || typeof window.mermaid.render !== "function") {
			console.warn("Mermaid not available, skipping render");
			return;
		}

		isRendering = true;

		// 主题切换前销毁旧的 pan-zoom 实例
		destroyAllPanZoom();

		try {
			const mermaidElements = document.querySelectorAll(
				".mermaid[data-mermaid-code]",
			);

			if (mermaidElements.length === 0) {
				isRendering = false;
				return;
			}

			// 延迟检测主题，确保 DOM 已经更新
			await new Promise((resolve) => setTimeout(resolve, 100));

			const htmlElement = document.documentElement;
			const isDark = htmlElement.classList.contains("dark");
			const theme = isDark ? "dark" : "default";

			// 更新 Mermaid 主题（只需要更新一次）
			window.mermaid.initialize({
				startOnLoad: false,
				theme: theme,
				themeVariables: {
					fontFamily: "inherit",
					fontSize: "16px",
					// 强制应用主题变量
					primaryColor: isDark ? "#ffffff" : "#000000",
					primaryTextColor: isDark ? "#ffffff" : "#000000",
					primaryBorderColor: isDark ? "#ffffff" : "#000000",
					lineColor: isDark ? "#ffffff" : "#000000",
					secondaryColor: isDark ? "#333333" : "#f0f0f0",
					tertiaryColor: isDark ? "#555555" : "#e0e0e0",
				},
				securityLevel: "loose",
				errorLevel: "warn",
				logLevel: "error",
			});

			// 批量渲染所有图表，添加重试机制
			const renderPromises = Array.from(mermaidElements).map(
				async (element, index) => {
					let attempts = 0;
					const maxAttempts = 3;

					while (attempts < maxAttempts) {
						try {
							const code = element.getAttribute("data-mermaid-code");

							if (!code) {
								break;
							}

							// 显示加载状态
							element.innerHTML =
								'<div class="mermaid-loading">Rendering diagram...</div>';

							// 渲染图表
							const { svg } = await window.mermaid.render(
								`mermaid-${Date.now()}-${index}-${attempts}`,
								code,
							);

							element.innerHTML = svg;

							// 添加响应式支持
							const svgElement = element.querySelector("svg");
							if (svgElement) {
								svgElement.setAttribute("width", "100%");
								svgElement.removeAttribute("height");
								svgElement.style.maxWidth = "100%";
								svgElement.style.height = "auto";

								// 强制应用样式
								if (isDark) {
									svgElement.style.filter = "brightness(0.9) contrast(1.1)";
								} else {
									svgElement.style.filter = "none";
								}
							}

							// 渲染成功，跳出重试循环
							break;
						} catch (error) {
							attempts++;
							console.warn(
								`Mermaid rendering attempt ${attempts} failed for element ${index}:`,
								error,
							);

							if (attempts >= maxAttempts) {
								console.error(
									`Failed to render Mermaid diagram after ${maxAttempts} attempts:`,
									error,
								);
								element.innerHTML = `
									<div class="mermaid-error">
										<p>Failed to render diagram after ${maxAttempts} attempts.</p>
										<button onclick="location.reload()" style="margin-top: 8px; padding: 4px 8px; background: var(--primary); color: white; border: none; border-radius: 4px; cursor: pointer;">
											Retry Page
										</button>
									</div>
								`;
							} else {
								// 等待一段时间后重试
								await new Promise((resolve) =>
									setTimeout(resolve, 500 * attempts),
								);
							}
						}
					}
				},
			);

			// 等待所有渲染完成
			await Promise.all(renderPromises);
			retryCount = 0; // 重置重试计数

			// 渲染完成后初始化 pan-zoom
			initPanZoom();
		} catch (error) {
			console.error("Error in renderMermaidDiagrams:", error);

			// 如果渲染失败，尝试重新渲染
			if (retryCount < MAX_RETRIES) {
				retryCount++;
				setTimeout(() => renderMermaidDiagrams(), RETRY_DELAY * retryCount);
			}
		} finally {
			isRendering = false;
		}
	}

	// 初始化主题状态
	function initializeThemeState() {
		const isDark = document.documentElement.classList.contains("dark");
		currentTheme = isDark ? "dark" : "default";
	}

	// 加载 Mermaid 库
	async function loadMermaid() {
		if (typeof window.mermaid !== "undefined") {
			return Promise.resolve();
		}

		return new Promise((resolve, reject) => {
			const script = document.createElement("script");
			script.src =
				"https://cdnjs.cloudflare.com/ajax/libs/mermaid/11.12.0/mermaid.min.js";

			script.onload = () => {
				console.log("Mermaid library loaded successfully");
				resolve();
			};

			script.onerror = (error) => {
				console.error("Failed to load Mermaid library:", error);
				// 尝试备用 CDN
				const fallbackScript = document.createElement("script");
				fallbackScript.src =
					"https://unpkg.com/mermaid@11.12.0/dist/mermaid.min.js";

				fallbackScript.onload = () => {
					console.log("Mermaid library loaded from fallback CDN");
					resolve();
				};

				fallbackScript.onerror = () => {
					reject(
						new Error(
							"Failed to load Mermaid from both primary and fallback CDNs",
						),
					);
				};

				document.head.appendChild(fallbackScript);
			};

			document.head.appendChild(script);
		});
	}

	// 加载 svg-pan-zoom 库
	async function loadSvgPanZoom() {
		if (typeof window.svgPanZoom !== "undefined") {
			return Promise.resolve();
		}

		return new Promise((resolve, reject) => {
			const script = document.createElement("script");
			script.src =
				"https://unpkg.com/svg-pan-zoom@3.6.2/dist/svg-pan-zoom.min.js";
			script.onload = () => {
				resolve();
			};

			script.onerror = () => {
				// 尝试备用 CDN
				const fallbackScript = document.createElement("script");
				fallbackScript.src =
					"https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.6.2/dist/svg-pan-zoom.min.js";

				fallbackScript.onload = () => {
					resolve();
				};

				fallbackScript.onerror = () => {
					console.warn(
						"Failed to load svg-pan-zoom, pan/zoom features will be unavailable",
					);
					resolve(); // 不阻塞，只是功能降级
				};

				document.head.appendChild(fallbackScript);
			};

			document.head.appendChild(script);
		});
	}

	// 销毁所有 pan-zoom 实例
	function destroyAllPanZoom() {
		const containers = document.querySelectorAll(
			".mermaid-diagram-container[data-panzoom-init]",
		);
		containers.forEach((container) => {
			if (container._panZoomInstance) {
				try {
					container._panZoomInstance.destroy();
				} catch (e) {
					// 忽略销毁错误
				}
				container._panZoomInstance = null;
			}
			// 移除控制栏 DOM
			const controls = container.querySelector(".mermaid-controls");
			if (controls) {
				controls.remove();
			}
			container.removeAttribute("data-panzoom-init");
		});
	}

	// 初始化 pan-zoom 功能
	function initPanZoom() {
		if (typeof window.svgPanZoom !== "function") {
			return;
		}

		const containers = document.querySelectorAll(".mermaid-diagram-container");

		containers.forEach((container) => {
			if (container.hasAttribute("data-panzoom-init")) {
				return;
			}

			const svgElement = container.querySelector(".mermaid svg");
			if (!svgElement) {
				return;
			}

			// svg-pan-zoom 需要 SVG 有固定像素尺寸
			if (!svgElement.getAttribute("viewBox")) {
				return;
			}

			// 读取 CSS 约束后的实际渲染尺寸
			const rect = svgElement.getBoundingClientRect();
			svgElement.setAttribute("width", rect.width + "px");
			svgElement.setAttribute("height", rect.height + "px");
			svgElement.style.maxWidth = "none";
			svgElement.style.height = "";

			try {
				const panZoomInstance = window.svgPanZoom(svgElement, {
					panEnabled: true,
					zoomEnabled: true,
					controlIconsEnabled: false,
					mouseWheelZoomEnabled: true,
					dblClickZoomEnabled: true,
					minZoom: 0.5,
					maxZoom: 5,
					fit: true,
					center: true,
					zoomScaleSensitivity: 0.3,
				});

				container._panZoomInstance = panZoomInstance;
				container.setAttribute("data-panzoom-init", "true");

				// 创建控制栏
				const controlsDiv = document.createElement("div");
				controlsDiv.className = "mermaid-controls";

				const buttons = [
					{ label: "+", title: "放大", action: () => panZoomInstance.zoomIn() },
					{
						label: "\u2212",
						title: "缩小",
						action: () => panZoomInstance.zoomOut(),
					},
					{
						label: "\u21BA",
						title: "重置",
						action: () => {
							panZoomInstance.resetZoom();
							panZoomInstance.resetPan();
							panZoomInstance.center();
						},
					},
					{
						label: "\u26F6",
						title: "全屏",
						action: () => openFullscreen(container),
					},
				];

				buttons.forEach((btn) => {
					const button = document.createElement("button");
					button.className = "mermaid-ctrl-btn";
					button.textContent = btn.label;
					button.title = btn.title;
					button.addEventListener("click", (e) => {
						e.preventDefault();
						e.stopPropagation();
						btn.action();
					});
					controlsDiv.appendChild(button);
				});

				container.appendChild(controlsDiv);
			} catch (e) {
				console.warn("Failed to initialize svg-pan-zoom for a diagram:", e);
			}
		});
	}

	// 全屏查看
	function openFullscreen(container) {
		const svgElement = container.querySelector(".mermaid svg");
		if (!svgElement) return;

		// 创建 overlay
		const overlay = document.createElement("div");
		overlay.className = "mermaid-fullscreen-overlay";

		// 全屏内容区
		const content = document.createElement("div");
		content.className = "mermaid-fs-content";

		// 克隆 SVG
		const clonedSvg = svgElement.cloneNode(true);
		clonedSvg.style.filter = "";
		clonedSvg.setAttribute("width", "100%");
		clonedSvg.setAttribute("height", "100%");
		clonedSvg.style.maxWidth = "none";
		content.appendChild(clonedSvg);

		// 全屏控制栏
		const fsControls = document.createElement("div");
		fsControls.className = "mermaid-fs-controls";

		let fsInstance = null;

		const closeOverlay = () => {
			if (fsInstance) {
				try {
					fsInstance.destroy();
				} catch (e) {
					// 忽略
				}
			}
			overlay.remove();
			document.removeEventListener("keydown", escHandler);
		};

		const escHandler = (e) => {
			if (e.key === "Escape") {
				closeOverlay();
			}
		};

		const fsButtons = [
			{
				label: "+",
				title: "放大",
				action: () => fsInstance && fsInstance.zoomIn(),
			},
			{
				label: "\u2212",
				title: "缩小",
				action: () => fsInstance && fsInstance.zoomOut(),
			},
			{
				label: "\u21BA",
				title: "重置",
				action: () => {
					if (fsInstance) {
						fsInstance.resetZoom();
						fsInstance.resetPan();
						fsInstance.center();
					}
				},
			},
			{ label: "\u2715", title: "关闭", action: closeOverlay },
		];

		fsButtons.forEach((btn) => {
			const button = document.createElement("button");
			button.className = "mermaid-ctrl-btn";
			button.textContent = btn.label;
			button.title = btn.title;
			button.addEventListener("click", (e) => {
				e.preventDefault();
				e.stopPropagation();
				btn.action();
			});
			fsControls.appendChild(button);
		});

		overlay.appendChild(content);
		overlay.appendChild(fsControls);
		document.body.appendChild(overlay);

		// 点击背景关闭
		overlay.addEventListener("click", (e) => {
			if (e.target === overlay) {
				closeOverlay();
			}
		});

		// ESC 关闭
		document.addEventListener("keydown", escHandler);

		// 在 overlay 中的 SVG 上初始化 pan-zoom
		requestAnimationFrame(() => {
			try {
				fsInstance = window.svgPanZoom(clonedSvg, {
					panEnabled: true,
					zoomEnabled: true,
					controlIconsEnabled: false,
					mouseWheelZoomEnabled: true,
					dblClickZoomEnabled: true,
					minZoom: 0.3,
					maxZoom: 10,
					fit: true,
					center: true,
					zoomScaleSensitivity: 0.3,
				});
			} catch (e) {
				console.warn("Failed to initialize fullscreen pan-zoom:", e);
			}
		});
	}

	// 主初始化函数
	async function initialize() {
		try {
			// 设置监听器
			setupMutationObserver();
			setupEventListeners();

			// 初始化主题状态
			initializeThemeState();

			// 加载并初始化 Mermaid，同时加载 svg-pan-zoom
			await Promise.all([loadMermaid(), loadSvgPanZoom()]);
			await initializeMermaid();
		} catch (error) {
			console.error("Failed to initialize Mermaid system:", error);
		}
	}

	// 启动初始化
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initialize);
	} else {
		initialize();
	}
})();
