import { sidebarLayoutConfig } from "@/config";

export interface ResponsiveSidebarConfig {
	isBothSidebars: boolean;
	hasLeftComponents: boolean;
	hasRightComponents: boolean;
	mobileShowSidebar: boolean;
	tabletShowSidebar: boolean;
	desktopShowSidebar: boolean;
}

/**
 * 获取响应式侧边栏配置
 * @param isPostPage - 是否为文章详情页
 */
export function getResponsiveSidebarConfig(isPostPage: boolean): ResponsiveSidebarConfig {
	const isBothSidebars =
		sidebarLayoutConfig.enable &&
		sidebarLayoutConfig.position === "both";

	const hasLeftComponents =
		sidebarLayoutConfig.enable &&
		sidebarLayoutConfig.leftComponents.some((comp) => {
			if (!comp.enable) return false;
			if (isPostPage && !comp.showOnPostPage) return false;
			if (!isPostPage && !comp.showOnNonPostPage) return false;
			return true;
		});

	const hasRightComponents =
		sidebarLayoutConfig.enable &&
		sidebarLayoutConfig.rightComponents.some((comp) => {
			if (!comp.enable) return false;
			if (isPostPage && !comp.showOnPostPage) return false;
			if (!isPostPage && !comp.showOnNonPostPage) return false;
			return true;
		});

	// 判断各断点是否显示侧边栏
	const mobileShowSidebar = sidebarLayoutConfig.enable;
	const tabletShowSidebar =
		sidebarLayoutConfig.enable &&
		(!sidebarLayoutConfig.hideSidebar || sidebarLayoutConfig.hideSidebar > 768);
	const desktopShowSidebar =
		sidebarLayoutConfig.enable &&
		(!sidebarLayoutConfig.hideSidebar || sidebarLayoutConfig.hideSidebar > 1024);

	return {
		isBothSidebars,
		hasLeftComponents,
		hasRightComponents,
		mobileShowSidebar,
		tabletShowSidebar,
		desktopShowSidebar,
	};
}

/**
 * 生成网格列数CSS类
 */
export function generateGridClasses(config: ResponsiveSidebarConfig): {
	gridCols: string;
} {
	let gridCols = "grid-cols-1";

	if (config.isBothSidebars && config.hasLeftComponents && config.hasRightComponents) {
		// 左右双侧边栏: 左 主 右
		gridCols = "lg:grid-cols-[17.5rem_1fr_17.5rem]";
	} else if (config.hasLeftComponents && !config.hasRightComponents) {
		// 仅左侧边栏
		gridCols = "lg:grid-cols-[17.5rem_1fr]";
	} else if (!config.hasLeftComponents && config.hasRightComponents) {
		// 仅右侧边栏
		gridCols = "lg:grid-cols-[1fr_17.5rem]";
	}

	return { gridCols };
}

/**
 * 生成侧边栏容器CSS类
 */
export function generateSidebarClasses(config: ResponsiveSidebarConfig): string {
	const classes = [
		"mb-4",
		"row-start-2",
		"row-end-3",
		"col-span-2",
		"lg:row-start-1",
		"lg:row-end-2",
		"lg:col-span-1",
		"lg:max-w-[17.5rem]",
		"onload-animation",
	];

	if (config.isBothSidebars && config.hasRightComponents) {
		// 双侧边栏时，左侧边栏添加特殊类
		classes.push("lg:col-start-1");
	}

	return classes.join(" ");
}

/**
 * 生成右侧边栏CSS类
 */
export function generateRightSidebarClasses(config: ResponsiveSidebarConfig): string {
	const classes = [
		"mb-4",
		"row-start-2",
		"row-end-3",
		"col-span-2",
		"lg:row-start-1",
		"lg:row-end-2",
		"lg:col-span-1",
		"lg:max-w-[17.5rem]",
		"onload-animation",
		"lg:col-start-3", // 右侧边栏在第3列
	];

	return classes.join(" ");
}

/**
 * 生成主内容区CSS类
 */
export function generateMainContentClasses(config: ResponsiveSidebarConfig): string {
	let classes = ["transition-main"];

	if (config.isBothSidebars && config.hasLeftComponents && config.hasRightComponents) {
		classes.push("col-span-1");
		classes.push("lg:col-start-2");
		classes.push("lg:col-end-3");
	} else if (config.hasLeftComponents && !config.hasRightComponents) {
		classes.push("col-span-1");
		classes.push("lg:col-start-2");
	} else if (!config.hasLeftComponents && config.hasRightComponents) {
		classes.push("col-span-1");
		classes.push("lg:col-start-1");
	} else {
		classes.push("col-span-2");
		classes.push("lg:col-span-1");
	}

	classes.push("min-w-0");
	classes.push("overflow-hidden");

	return classes.join(" ");
}
