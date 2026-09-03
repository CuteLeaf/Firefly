/**
 * 主网格列布局与侧边栏可见性 / 吸顶间距管理（从 Layout.astro 迁出）。
 */

const sidebarStickyState: Record<
	"left" | "right",
	{ topClass: "top-0" | "top-4"; hasVisibleTop: boolean }
> = {
	left: { topClass: "top-0", hasVisibleTop: false },
	right: { topClass: "top-0", hasVisibleTop: false },
};

// 检查当前页面是否为文章详情页
const isCurrentPagePost = (): boolean =>
	window.location.pathname.includes("/posts/") ||
	window.location.pathname.includes("/post/");

// Grid 列类常量
const GRID_COL_CLASSES = [
	"grid-cols-1",
	"md:grid-cols-[17.5rem_1fr]",
	"md:grid-cols-[1fr_17.5rem]",
	"xl:grid-cols-[17.5rem_1fr_17.5rem]",
];

// 多列布局下的列定位类（需在切换单列时清除）
const MULTI_COL_POS_CLASSES = [
	"md:col-start-1",
	"md:col-start-2",
	"xl:col-start-1",
	"xl:col-start-2",
	"xl:col-start-3",
	"xl:col-end-3",
	"md:col-span-1",
	"xl:col-span-1",
];

// 清除元素上的多列定位类
function clearColPositioning(
	...elements: (Element | null | undefined)[]
): void {
	for (const el of elements) {
		if (!el) continue;
		for (const cls of MULTI_COL_POS_CLASSES) el.classList.remove(cls);
	}
}

// 设置单列布局：grid 设为 grid-cols-1，清除子元素的多列定位类
function applySingleColLayout(mainGrid: Element): void {
	for (const cls of GRID_COL_CLASSES) mainGrid.classList.remove(cls);
	mainGrid.classList.add("grid-cols-1");
	const swupContainer = document.getElementById("swup-container");
	clearColPositioning(
		swupContainer,
		swupContainer?.parentElement,
		mainGrid.querySelector(".footer"),
	);
}

// 更新主网格的网格列数
export function updateMainGridCols(): void {
	const mainGrid = document.getElementById("main-grid");
	if (!mainGrid) return;

	const sidebarEnabled =
		mainGrid.getAttribute("data-sidebar-enable") !== "false";
	const sidebarHideOnPost =
		mainGrid.getAttribute("data-grid-hide-sidebar-on-post") === "true";
	const isPostPage = isCurrentPagePost();
	const sidebarPosition =
		mainGrid.getAttribute("data-sidebar-position") || "left";
	const tabletSidebar = mainGrid.getAttribute("data-tablet-sidebar") || "left";
	const showBothSidebarsOnPostPage =
		mainGrid.getAttribute("data-show-both-sidebars-on-post") === "true";

	// 侧边栏禁用 或 文章详情页隐藏侧边栏时，保持单列布局
	if (!sidebarEnabled || (isPostPage && sidebarHideOnPost)) {
		applySingleColLayout(mainGrid);
		return;
	}

	const shouldBothSidebars =
		isPostPage && sidebarPosition !== "both" && showBothSidebarsOnPostPage;

	let newGridClasses: string;

	if (sidebarPosition === "both" || shouldBothSidebars) {
		const effectiveTabletSidebar =
			shouldBothSidebars && sidebarPosition === "right"
				? "right"
				: tabletSidebar;
		newGridClasses =
			effectiveTabletSidebar === "right"
				? "grid-cols-1 md:grid-cols-[1fr_17.5rem] xl:grid-cols-[17.5rem_1fr_17.5rem]"
				: "grid-cols-1 md:grid-cols-[17.5rem_1fr] xl:grid-cols-[17.5rem_1fr_17.5rem]";
	} else if (sidebarPosition === "right") {
		newGridClasses = "grid-cols-1 md:grid-cols-[1fr_17.5rem]";
	} else {
		newGridClasses = "grid-cols-1 md:grid-cols-[17.5rem_1fr]";
	}

	for (const cls of GRID_COL_CLASSES) mainGrid.classList.remove(cls);
	for (const cls of newGridClasses.split(" "))
		if (cls) mainGrid.classList.add(cls);

	// position为right时，swup导航不会替换静态元素的class，需手动更新列定位
	if (sidebarPosition === "right") {
		const rightSidebar = document.getElementById("right-sidebar");
		const swupContainer = document.getElementById("swup-container");
		const swupWrapper = swupContainer?.parentElement;
		const footer = mainGrid.querySelector(".footer");

		if (shouldBothSidebars) {
			// 文章页临时双侧栏：主内容移到第2列，右侧栏移到第3列，页脚居中
			clearColPositioning(swupContainer, swupWrapper, footer);
			swupContainer?.classList.add(
				"md:col-start-2",
				"xl:col-start-2",
				"xl:col-end-3",
			);
			swupWrapper?.classList.add("md:col-start-2");
			rightSidebar?.classList.add("xl:col-start-3");
			footer?.classList.add("md:col-start-2", "xl:col-start-2");
		} else {
			// 非文章页：恢复2列布局定位（右侧栏保持 md:col-start-2 不变）
			clearColPositioning(swupContainer, swupWrapper, footer);
			rightSidebar?.classList.remove("xl:col-start-3");
			swupContainer?.classList.add("md:col-start-1");
			swupWrapper?.classList.add("md:col-start-1");
			footer?.classList.add("md:col-start-1", "xl:col-start-1");
		}
	}
}

// 更新侧边栏组件的可见性
export function updateSidebarComponentsVisibility(): void {
	const isPostPage = isCurrentPagePost();

	// 处理侧边栏级别的 hideSidebarOnPostPage 配置
	document
		.querySelectorAll<HTMLElement>("[data-hide-sidebar-on-post]")
		.forEach((wrapper) => {
			const hideOnPost =
				wrapper.getAttribute("data-hide-sidebar-on-post") === "true";
			if (isPostPage && hideOnPost) {
				wrapper.style.setProperty("display", "none", "important");
			} else {
				wrapper.style.removeProperty("display");
			}
		});

	// 处理组件级别的 showOnPostPage 配置
	document.querySelectorAll(".widget-hide-on-post").forEach((widget) => {
		isPostPage
			? widget.classList.add("hidden")
			: widget.classList.remove("hidden");
	});

	// 处理 hideOnNonPostPage === true 的组件
	document.querySelectorAll(".widget-hide-on-non-post").forEach((widget) => {
		!isPostPage
			? widget.classList.add("hidden")
			: widget.classList.remove("hidden");
	});

	// 组件可见性变化后，重新读取 top 容器可见性并重算 sticky 间距，避免 swup 切页后残留旧间距
	refreshSidebarStickyState();
}

// 重新读取侧边栏 top 容器的可见性并应用间距。
// 含 offsetHeight 布局读取，仅初始化 / 切页时调用；滚动路径使用缓存值，避免每帧强制布局
export function refreshSidebarStickyState(): void {
	(["left", "right"] as const).forEach((side) => {
		const sticky = document.getElementById(`${side}-sidebar-sticky`);
		if (!sticky) return;

		// 结构为：sidebar -> top 容器（可选） + sticky 容器
		const topContainer = sticky.previousElementSibling as HTMLElement | null;
		const hasVisibleTop = !!topContainer && topContainer.offsetHeight > 1;
		sidebarStickyState[side].hasVisibleTop = hasVisibleTop;

		// swup 从非文章页切换到文章页时，top 容器可能残留 mb-4，需要按可见性动态修正
		if (topContainer) {
			if (hasVisibleTop) {
				topContainer.classList.add("mb-4");
			} else {
				topContainer.classList.remove("mb-4");
			}
		}
	});

	updateSidebarStickySpacing();
}

// 根据当前滚动位置动态更新侧边栏 sticky 顶部偏移。
// 滚动路径：仅切换滚动相关的 top-0/top-4，不再读取布局（hasVisibleTop 由 refreshSidebarStickyState 缓存）
export function updateSidebarStickySpacing(): void {
	const scrollTop = document.documentElement.scrollTop || window.scrollY || 0;
	const isScrolled = scrollTop > 2;

	(["left", "right"] as const).forEach((side) => {
		const sticky = document.getElementById(`${side}-sidebar-sticky`);
		if (!sticky) return;

		// 仅切换顶部偏移；组件间距由容器常驻 gap-4 保持
		const nextTopClass: "top-0" | "top-4" =
			sidebarStickyState[side].hasVisibleTop || isScrolled ? "top-4" : "top-0";

		if (sidebarStickyState[side].topClass !== nextTopClass) {
			sticky.classList.remove(sidebarStickyState[side].topClass);
			sticky.classList.add(nextTopClass);
			sidebarStickyState[side].topClass = nextTopClass;
		}
	});
}
