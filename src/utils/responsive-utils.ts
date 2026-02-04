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
 *
 * 响应式布局（硬编码）：
 * - 768px及以下: 隐藏侧栏，显示底部mobileBottomComponents
 * - 769px-1279px: 显示左侧栏，隐藏右侧栏
 * - 1280px及以上: 根据position配置显示侧栏
 */
export function getResponsiveSidebarConfig(): ResponsiveSidebarConfig {
	const isBothSidebars =
		sidebarLayoutConfig.enable && sidebarLayoutConfig.position === "both";

	const hasLeftComponents =
		sidebarLayoutConfig.enable &&
		sidebarLayoutConfig.leftComponents.some((comp) => comp.enable);

	// 当position为left时，右侧组件不参与布局计算（即使启用也会被CSS隐藏）
	const hasRightComponents =
		sidebarLayoutConfig.enable &&
		sidebarLayoutConfig.position === "both" &&
		sidebarLayoutConfig.rightComponents.some((comp) => comp.enable);

	// 响应式布局由 CSS 处理，这里仅用于判断是否有组件
	const mobileShowSidebar = false; // 768px及以下不显示侧边栏
	const tabletShowSidebar = sidebarLayoutConfig.enable; // 769px及以上显示
	const desktopShowSidebar = sidebarLayoutConfig.enable; // 1280px及以上显示

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
 *
 * 响应式设计：
 * - 768px及以下: 单列布局（grid-cols-1），隐藏侧栏，显示底部组件
 * - 769px-1279px: 2列布局（左侧栏 + 内容），隐藏右侧栏
 * - 1280px及以上: 3列或2列布局（根据是否有右侧栏）
 */
export function generateGridClasses(config: ResponsiveSidebarConfig): {
	gridCols: string;
} {
	let gridCols = "grid-cols-1";

	if (
		config.isBothSidebars &&
		config.hasLeftComponents &&
		config.hasRightComponents
	) {
		// 双侧边栏: 1280px+显示左+中+右，769-1279px显示左+中，768-以下单列
		gridCols =
			"grid-cols-1 md:grid-cols-[17.5rem_1fr] xl:grid-cols-[17.5rem_1fr_17.5rem]";
	} else if (config.hasLeftComponents && !config.hasRightComponents) {
		// 仅左侧边栏: 769px+显示左+中，768-以下单列
		gridCols = "grid-cols-1 md:grid-cols-[17.5rem_1fr]";
	} else if (!config.hasLeftComponents && config.hasRightComponents) {
		// 仅右侧边栏: 1200px+显示中+右，769-1199px显示中，768-以下单列
		gridCols = "grid-cols-1 xl:grid-cols-[1fr_17.5rem]";
	}

	return { gridCols };
}

/**
 * 生成侧边栏容器CSS类
 */
export function generateSidebarClasses(): string {
	const classes = [
		"mb-4",
		// 768px及以下隐藏，769px及以上显示
		"hidden",
		"md:block",
		"md:col-span-1",
		"md:max-w-70",
		"md:row-start-1",
		"md:row-end-2",
		"md:col-start-1",
		"onload-animation",
	];

	return classes.join(" ");
}

/**
 * 生成右侧边栏CSS类
 */
export function generateRightSidebarClasses(): string {
	const classes = [
		"mb-4",
		// 1280px以下隐藏，1280px及以上显示
		"hidden",
		"xl:block",
		"xl:row-start-1",
		"xl:row-end-2",
		"xl:col-span-1",
		"xl:max-w-70",
		"onload-animation",
		"xl:col-start-3", // 右侧边栏在第3列
	];

	return classes.join(" ");
}

/**
 * 生成主内容区CSS类
 */
export function generateMainContentClasses(
	config: ResponsiveSidebarConfig,
): string {
	const classes = [
		"transition-main",
		// 768px及以下: 单列布局
		"col-span-1",
	];

	if (
		config.isBothSidebars &&
		config.hasLeftComponents &&
		config.hasRightComponents
	) {
		// 769-1199px: 左 + 中，1200px+: 左 + 中 + 右
		classes.push("md:col-span-1");
		classes.push("md:col-start-2");
		classes.push("xl:col-span-1");
		classes.push("xl:col-start-2");
		classes.push("xl:col-end-3");
	} else if (config.hasLeftComponents && !config.hasRightComponents) {
		// 769px+: 左 + 中
		classes.push("md:col-span-1");
		classes.push("md:col-start-2");
	} else if (!config.hasLeftComponents && config.hasRightComponents) {
		// 1200px+: 中 + 右
		classes.push("xl:col-span-1");
		classes.push("xl:col-start-1");
	} else {
		classes.push("col-span-1");
	}

	classes.push("min-w-0");
	classes.push("overflow-hidden");

	return classes.join(" ");
}
