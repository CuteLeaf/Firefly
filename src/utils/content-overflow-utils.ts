/**
 * 内容溢出增强：KaTeX 显示公式滚动条、宽表格横向滚动容器。
 * 由 Layout.astro 与 Swup 内容替换时调用。
 */

function initCustomScrollbar(): void {
	// 只处理katex元素的滚动条，使用浏览器原生滚动条
	const katexElements = document.querySelectorAll(
		".katex-display:not([data-scrollbar-initialized])",
	) as NodeListOf<HTMLElement>;
	katexElements.forEach((element) => {
		if (!element.parentNode) return;

		const container = document.createElement("div");
		container.className = "katex-display-container";
		element.parentNode.insertBefore(container, element);
		container.appendChild(element);

		// 使用浏览器原生滚动条，无自定义样式
		container.style.cssText = `
			overflow-x: auto;
		`;

		element.setAttribute("data-scrollbar-initialized", "true");
	});
}

function initHorizontalOverflowContainers(): void {
	const markdownTables = document.querySelectorAll(
		".custom-md table:not([data-horizontal-scroll-ready])",
	) as NodeListOf<HTMLElement>;

	markdownTables.forEach((table) => {
		if (
			table.parentElement?.classList.contains("horizontal-scroll-container")
		) {
			table.dataset.horizontalScrollReady = "true";
			return;
		}

		const container = document.createElement("div");
		container.className = "horizontal-scroll-container";
		table.parentNode?.insertBefore(container, table);
		container.appendChild(table);
		table.dataset.horizontalScrollReady = "true";
	});
}

function initContentOverflowEnhancements(): void {
	initCustomScrollbar();
	initHorizontalOverflowContainers();
}

/** rAF + 100ms 后各执行一次内容溢出增强（新内容注入后需多次扫；不做同步立即执行，避免切页换入时主线程卡顿） */
export function scheduleContentOverflowEnhancements(): void {
	requestAnimationFrame(() => {
		initContentOverflowEnhancements();
	});
	setTimeout(() => {
		initContentOverflowEnhancements();
	}, 100);
}

/** 注册页面加载 / 密码解密后的重新扫描监听（从 Layout.astro 迁出） */
export function registerContentOverflowListeners(): void {
	document.addEventListener(
		"astro:page-load",
		scheduleContentOverflowEnhancements,
	);
	document.addEventListener("password:decrypted", () => {
		setTimeout(scheduleContentOverflowEnhancements, 200);
	});
}
