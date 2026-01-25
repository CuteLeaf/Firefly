import { sidebarLayoutConfig } from "../config";
import { widgetManager } from "./widget-manager";

// 响应式侧边栏配置
export const getResponsiveSidebarConfig = (isPostPage = false) => {
	const globalSidebarEnabled = sidebarLayoutConfig.enable;
	let sidebarPosition = sidebarLayoutConfig.position || "left";

	// 如果配置了在文章详情页显示右侧边栏，且当前是文章详情页，则强制使用双侧边栏模式
	if (
		sidebarPosition === "left" &&
		isPostPage &&
		sidebarLayoutConfig.showRightSidebarOnPostPage
	) {
		sidebarPosition = "both";
	}

	const isBothSidebars = sidebarPosition === "both";

	return {
		globalSidebarEnabled,
		sidebarPosition,
		isBothSidebars,
		mobileShowSidebar:
			globalSidebarEnabled && widgetManager.shouldShowSidebar("mobile"),
		tabletShowSidebar:
			globalSidebarEnabled && widgetManager.shouldShowSidebar("tablet"),
		desktopShowSidebar:
			globalSidebarEnabled && widgetManager.shouldShowSidebar("desktop"),
		// 检查左右侧边栏是否有组件
		hasLeftComponents:
			isBothSidebars && widgetManager.hasComponentsInSidebar("left"),
		hasRightComponents:
			isBothSidebars && widgetManager.hasComponentsInSidebar("right"),
		// 检查各设备上左右侧边栏是否有可见组件
		hasLeftComponentsMobile:
			isBothSidebars &&
			widgetManager.hasVisibleComponentsInSidebar("left", "mobile"),
		hasLeftComponentsTablet:
			isBothSidebars &&
			widgetManager.hasVisibleComponentsInSidebar("left", "tablet"),
		hasLeftComponentsDesktop:
			isBothSidebars &&
			widgetManager.hasVisibleComponentsInSidebar("left", "desktop"),
		hasRightComponentsMobile:
			isBothSidebars &&
			widgetManager.hasVisibleComponentsInSidebar("right", "mobile"),
		hasRightComponentsTablet:
			isBothSidebars &&
			widgetManager.hasVisibleComponentsInSidebar("right", "tablet"),
		hasRightComponentsDesktop:
			isBothSidebars &&
			widgetManager.hasVisibleComponentsInSidebar("right", "desktop"),
	};
};

// 生成网格布局类名
export const generateGridClasses = (
	config: ReturnType<typeof getResponsiveSidebarConfig>,
) => {
	const {
		mobileShowSidebar,
		tabletShowSidebar,
		desktopShowSidebar,
		isBothSidebars,
		hasLeftComponentsMobile,
		hasLeftComponentsTablet,
		hasLeftComponentsDesktop,
		hasRightComponentsMobile,
		hasRightComponentsTablet,
		hasRightComponentsDesktop,
	} = config;

	let gridCols = "";

	if (isBothSidebars) {
		// 双侧边栏布局 - 根据各设备上实际可见组件决定布局
		// 移动端
		let mobileGrid = "grid-cols-1";
		if (
			mobileShowSidebar &&
			hasLeftComponentsMobile &&
			hasRightComponentsMobile
		) {
			mobileGrid = "grid-cols-1";
		} else if (
			mobileShowSidebar &&
			(hasLeftComponentsMobile || hasRightComponentsMobile)
		) {
			mobileGrid = "grid-cols-1";
		}

		// 平板端
		let tabletGrid = "md:grid-cols-1";
		if (
			tabletShowSidebar &&
			hasLeftComponentsTablet &&
			hasRightComponentsTablet
		) {
			tabletGrid = "md:grid-cols-[17.5rem_1fr_17.5rem]";
		} else if (tabletShowSidebar && hasLeftComponentsTablet) {
			tabletGrid = "md:grid-cols-[17.5rem_1fr]";
		} else if (tabletShowSidebar && hasRightComponentsTablet) {
			tabletGrid = "md:grid-cols-[1fr_17.5rem]";
		}

		// 桌面端
		let desktopGrid = "lg:grid-cols-1";
		if (
			desktopShowSidebar &&
			hasLeftComponentsDesktop &&
			hasRightComponentsDesktop
		) {
			desktopGrid = "lg:grid-cols-[17.5rem_1fr_17.5rem]";
		} else if (desktopShowSidebar && hasLeftComponentsDesktop) {
			desktopGrid = "lg:grid-cols-[17.5rem_1fr]";
		} else if (desktopShowSidebar && hasRightComponentsDesktop) {
			desktopGrid = "lg:grid-cols-[1fr_17.5rem]";
		}

		gridCols = `${mobileGrid} ${tabletGrid} ${desktopGrid}`.trim();
	} else {
		// 单侧边栏布局（左侧）
		gridCols = `
			grid-cols-1
			${tabletShowSidebar ? "md:grid-cols-[17.5rem_1fr]" : "md:grid-cols-1"}
			${desktopShowSidebar ? "lg:grid-cols-[17.5rem_1fr]" : "lg:grid-cols-1"}
		`
			.trim()
			.replace(/\s+/g, " ");
	}

	return { gridCols };
};

// 生成侧边栏类名（用于单侧边栏或双侧边栏中的左侧）
export const generateSidebarClasses = (
	config: ReturnType<typeof getResponsiveSidebarConfig>,
) => {
	const {
		mobileShowSidebar,
		tabletShowSidebar,
		desktopShowSidebar,
		isBothSidebars,
	} = config;

	if (isBothSidebars) {
		// 左侧边栏
		return `
			mb-4 row-start-2 row-end-3 col-span-2 onload-animation
			${mobileShowSidebar ? "block" : "hidden"}
			${tabletShowSidebar ? "md:block md:row-start-1 md:row-end-2 md:max-w-[17.5rem] md:col-start-1 md:col-end-2" : "md:hidden"}
			${desktopShowSidebar ? "lg:block lg:row-start-1 lg:row-end-2 lg:max-w-[17.5rem] lg:col-start-1 lg:col-end-2" : "lg:hidden"}
		`
			.trim()
			.replace(/\s+/g, " ");
	}

	// 单侧边栏（左侧）
	return `
		mb-4 row-start-2 row-end-3 col-span-2 onload-animation
		${mobileShowSidebar ? "block" : "hidden"}
		${tabletShowSidebar ? "md:block md:row-start-1 md:row-end-2 md:max-w-[17.5rem] md:col-start-1 md:col-end-2" : "md:hidden"}
		${desktopShowSidebar ? "lg:block lg:row-start-1 lg:row-end-2 lg:max-w-[17.5rem] lg:col-start-1 lg:col-end-2" : "lg:hidden"}
	`
		.trim()
		.replace(/\s+/g, " ");
};

// 生成右侧边栏类名（仅用于双侧边栏）
export const generateRightSidebarClasses = (
	config: ReturnType<typeof getResponsiveSidebarConfig>,
) => {
	const {
		mobileShowSidebar,
		tabletShowSidebar,
		desktopShowSidebar,
		hasLeftComponentsTablet,
		hasLeftComponentsDesktop,
		hasRightComponentsMobile,
		hasRightComponentsTablet,
		hasRightComponentsDesktop,
	} = config;

	// 根据是否有左侧边栏决定列位置
	const tabletCol = hasLeftComponentsTablet
		? "md:col-start-3 md:col-end-4"
		: "md:col-start-2 md:col-end-3";
	const desktopCol = hasLeftComponentsDesktop
		? "lg:col-start-3 lg:col-end-4"
		: "lg:col-start-2 lg:col-end-3";

	// 根据是否有可见组件决定显示
	const mobileDisplay =
		mobileShowSidebar && hasRightComponentsMobile ? "block" : "hidden";
	const tabletDisplay =
		tabletShowSidebar && hasRightComponentsTablet
			? `md:block md:row-start-1 md:row-end-2 md:max-w-[17.5rem] ${tabletCol}`
			: "md:hidden";
	const desktopDisplay =
		desktopShowSidebar && hasRightComponentsDesktop
			? `lg:block lg:row-start-1 lg:row-end-2 lg:max-w-[17.5rem] ${desktopCol}`
			: "lg:hidden";

	return `
		mb-4 row-start-3 row-end-4 col-span-2 onload-animation
		${mobileDisplay}
		${tabletDisplay}
		${desktopDisplay}
	`
		.trim()
		.replace(/\s+/g, " ");
};

// 生成主内容类名
export const generateMainContentClasses = (
	config: ReturnType<typeof getResponsiveSidebarConfig>,
) => {
	const {
		mobileShowSidebar,
		tabletShowSidebar,
		desktopShowSidebar,
		isBothSidebars,
		hasLeftComponentsMobile,
		hasLeftComponentsTablet,
		hasLeftComponentsDesktop,
		hasRightComponentsMobile,
		hasRightComponentsTablet,
		hasRightComponentsDesktop,
	} = config;

	if (isBothSidebars) {
		// 双侧边栏布局：主内容区位置根据各设备上实际可见组件调整
		let mobileCol = "col-span-1";
		let tabletCol = "md:col-span-1";
		let desktopCol = "lg:col-span-1";

		// 移动端
		if (
			mobileShowSidebar &&
			hasLeftComponentsMobile &&
			hasRightComponentsMobile
		) {
			mobileCol = "col-span-2";
		} else if (
			mobileShowSidebar &&
			(hasLeftComponentsMobile || hasRightComponentsMobile)
		) {
			mobileCol = "col-span-2";
		}

		// 平板端
		if (
			tabletShowSidebar &&
			hasLeftComponentsTablet &&
			hasRightComponentsTablet
		) {
			// 三栏布局:主内容在中间
			tabletCol = "md:col-start-2 md:col-end-3";
		} else if (tabletShowSidebar && hasLeftComponentsTablet) {
			// 左侧边栏+主内容
			tabletCol = "md:col-start-2 md:col-end-3";
		} else if (tabletShowSidebar && hasRightComponentsTablet) {
			// 主内容+右侧边栏
			tabletCol = "md:col-start-1 md:col-end-2";
		}

		// 桌面端
		if (
			desktopShowSidebar &&
			hasLeftComponentsDesktop &&
			hasRightComponentsDesktop
		) {
			// 三栏布局:主内容在中间
			desktopCol = "lg:col-start-2 lg:col-end-3";
		} else if (desktopShowSidebar && hasLeftComponentsDesktop) {
			// 左侧边栏+主内容
			desktopCol = "lg:col-start-2 lg:col-end-3";
		} else if (desktopShowSidebar && hasRightComponentsDesktop) {
			// 主内容+右侧边栏
			desktopCol = "lg:col-start-1 lg:col-end-2";
		}

		return `transition-swup-fade overflow-hidden w-full ${mobileCol} ${tabletCol} ${desktopCol}`.trim();
	}

	// 单侧边栏（左侧）：主内容在右边
	return `
		transition-swup-fade overflow-hidden w-full
		${mobileShowSidebar ? "col-span-2" : "col-span-1"}
		${tabletShowSidebar ? "md:col-start-2 md:col-end-3" : "md:col-span-1"}
		${desktopShowSidebar ? "lg:col-start-2 lg:col-end-3" : "lg:col-span-1"}
	`
		.trim()
		.replace(/\s+/g, " ");
};
