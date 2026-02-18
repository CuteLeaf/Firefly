import { sidebarLayoutConfig } from "@/config";

export interface ResponsiveSidebarConfig {
	isBothSidebars: boolean;
	hasLeftComponents: boolean;
	hasRightComponents: boolean;
	mobileShowSidebar: boolean;
	tabletShowSidebar: boolean;
	desktopShowSidebar: boolean;
	position: "left" | "right" | "both";
	tabletSidebar: "left" | "right";
}

/**
 * 获取响应式侧边栏配置
 *
 * 响应式布局（硬编码）：
 * - 768px及以下: 隐藏侧栏，显示底部mobileBottomComponents
 * - 769px-1279px: 根据position和tabletSidebar配置显示侧栏
 * - 1280px及以上: 根据position配置显示侧栏
 */
export function getResponsiveSidebarConfig(): ResponsiveSidebarConfig {
	const position = sidebarLayoutConfig.position;
	const tabletSidebar = sidebarLayoutConfig.tabletSidebar ?? "left";

	const isBothSidebars = sidebarLayoutConfig.enable && position === "both";

	// position为right时，左侧组件不参与布局计算
	const hasLeftComponents =
		sidebarLayoutConfig.enable &&
		position !== "right" &&
		sidebarLayoutConfig.leftComponents.some((comp) => comp.enable);

	// position为left时，右侧组件不参与布局计算（即使启用也会被CSS隐藏）
	const hasRightComponents =
		sidebarLayoutConfig.enable &&
		position !== "left" &&
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
		position,
		tabletSidebar,
	};
}

/**
 * 生成网格列数CSS类
 *
 * 响应式设计：
 * - 768px及以下: 单列布局（grid-cols-1），隐藏侧栏，显示底部组件
 * - 769px-1279px: 根据position和tabletSidebar配置决定2列布局方向
 * - 1280px及以上: 根据position配置决定2列或3列布局
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
		// 双侧边栏
		if (config.tabletSidebar === "right") {
			// 平板端显示右侧栏: 769-1279px [内容+右侧栏], 1280px+ [左+中+右]
			gridCols =
				"grid-cols-1 md:grid-cols-[1fr_17.5rem] xl:grid-cols-[17.5rem_1fr_17.5rem]";
		} else {
			// 平板端显示左侧栏（默认）: 769-1279px [左侧栏+内容], 1280px+ [左+中+右]
			gridCols =
				"grid-cols-1 md:grid-cols-[17.5rem_1fr] xl:grid-cols-[17.5rem_1fr_17.5rem]";
		}
	} else if (config.hasLeftComponents && !config.hasRightComponents) {
		// 仅左侧边栏: 769px+显示左+中，768-以下单列
		gridCols = "grid-cols-1 md:grid-cols-[17.5rem_1fr]";
	} else if (!config.hasLeftComponents && config.hasRightComponents) {
		// 仅右侧边栏: 769px+显示中+右，768-以下单列
		gridCols = "grid-cols-1 md:grid-cols-[1fr_17.5rem]";
	}

	return { gridCols };
}

/**
 * 生成左侧边栏容器CSS类
 */
export function generateSidebarClasses(
	config: ResponsiveSidebarConfig,
): string {
	const classes = [
		"mb-4",
		"hidden",
		"md:col-span-1",
		"md:max-w-70",
		"md:row-start-1",
		"md:row-end-2",
		"md:col-start-1",
		"onload-animation",
	];

	if (config.isBothSidebars && config.tabletSidebar === "right") {
		// 双侧栏+平板端显示右侧栏：左侧栏仅在1280px+显示
		classes.push("xl:block");
	} else {
		// 默认：左侧栏769px+显示
		classes.push("md:block");
	}

	return classes.join(" ");
}

/**
 * 生成右侧边栏CSS类
 */
export function generateRightSidebarClasses(
	config: ResponsiveSidebarConfig,
): string {
	const classes = ["mb-4", "hidden", "onload-animation"];

	if (config.isBothSidebars && config.tabletSidebar === "right") {
		// 双侧栏+平板端显示右侧栏：769px+显示右侧栏
		classes.push(
			"md:block",
			"md:row-start-1",
			"md:row-end-2",
			"md:col-span-1",
			"md:max-w-70",
			"md:col-start-2", // 平板端在第2列
			"xl:col-start-3", // 桌面端在第3列
		);
	} else if (config.isBothSidebars) {
		// 双侧栏+平板端显示左侧栏（默认）：仅1280px+显示
		classes.push(
			"xl:block",
			"xl:row-start-1",
			"xl:row-end-2",
			"xl:col-span-1",
			"xl:max-w-70",
			"xl:col-start-3",
		);
	} else if (config.position === "right") {
		// 仅右侧栏模式（非双侧栏）：769px+显示，在第2列
		classes.push(
			"md:block",
			"md:row-start-1",
			"md:row-end-2",
			"md:col-span-1",
			"md:max-w-70",
			"md:col-start-2",
		);
	} else {
		// 其他情况：仅1280px+显示
		classes.push(
			"xl:block",
			"xl:row-start-1",
			"xl:row-end-2",
			"xl:col-span-1",
			"xl:max-w-70",
			"xl:col-start-3",
		);
	}

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
		if (config.tabletSidebar === "right") {
			// 双侧栏+平板端右侧栏: 平板端内容在第1列，桌面端内容在第2列
			classes.push("md:col-span-1");
			classes.push("md:col-start-1");
			classes.push("xl:col-span-1");
			classes.push("xl:col-start-2");
			classes.push("xl:col-end-3");
		} else {
			// 双侧栏+平板端左侧栏（默认）: 内容始终在第2列
			classes.push("md:col-span-1");
			classes.push("md:col-start-2");
			classes.push("xl:col-span-1");
			classes.push("xl:col-start-2");
			classes.push("xl:col-end-3");
		}
	} else if (config.hasLeftComponents && !config.hasRightComponents) {
		// 仅左侧边栏: 内容在第2列
		classes.push("md:col-span-1");
		classes.push("md:col-start-2");
	} else if (!config.hasLeftComponents && config.hasRightComponents) {
		// 仅右侧边栏: 内容在第1列
		classes.push("md:col-span-1");
		classes.push("md:col-start-1");
	} else {
		classes.push("col-span-1");
	}

	classes.push("min-w-0");
	classes.push("overflow-hidden");

	return classes.join(" ");
}
