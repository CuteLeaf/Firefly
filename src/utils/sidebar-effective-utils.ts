import { sidebarLayoutConfig } from "@/config";
import {
	computeGridColumns,
	getResponsiveSidebarConfig,
	gridColumnVarsToStyle,
} from "@/utils/responsive-utils";

export interface EffectiveSidebarContext {
	isPostPage: boolean;
}

export interface EffectiveSidebarState {
	hideSidebarOnPostPage: boolean;
	hasLeftComponents: boolean;
	hasRightComponents: boolean;
	sidebarClass: string;
	staticBarClass: string;
	gridColumnStyle: string;
	/** #main-grid 需要的 data-* 属性，客户端 updateMainGridCols 据此重算几何 */
	gridDataAttrs: Record<string, string>;
}

/**
 * 组装侧栏渲染所需的派生状态与网格几何（SSR，纯配置读）。
 * hasLeft/RightComponents 只依据 enable + position，不含页面类型判定 —— 静态容器只 SSR 一次。
 */
export function getEffectiveSidebarState(
	ctx: EffectiveSidebarContext,
): EffectiveSidebarState {
	const { isPostPage } = ctx;

	const sidebarConfig = getResponsiveSidebarConfig();

	const hideSidebarOnPostPage =
		sidebarLayoutConfig.hideSidebarOnPostPage === true;

	const gridColumnVars = computeGridColumns({
		enabled: sidebarLayoutConfig.enable,
		position: sidebarLayoutConfig.position,
		tabletSidebar: sidebarConfig.tabletSidebar,
		hideSidebarOnPostPage,
		isPostPage,
		hasLeftWidgets: isPostPage
			? sidebarConfig.hasLeftWidgetsOnPost
			: sidebarConfig.hasLeftWidgetsOnNonPost,
		hasRightWidgets: isPostPage
			? sidebarConfig.hasRightWidgetsOnPost
			: sidebarConfig.hasRightWidgetsOnNonPost,
		noSidebarContentWidth: sidebarLayoutConfig.noSidebarContentWidth,
	});

	return {
		hideSidebarOnPostPage,
		hasLeftComponents: sidebarConfig.hasLeftComponents,
		hasRightComponents: sidebarConfig.hasRightComponents,
		// 定位类已由 #main-grid 的列几何接管，这里只剩与列位置无关的公共类
		sidebarClass: "mb-4 onload-animation",
		// 只裁横向、纵向放开：评论区浮层（如 Waline 表情面板）需能溢出内容列；
		// clip 不产生滚动容器，不影响列内吸顶。
		staticBarClass: "min-w-0 overflow-x-clip overflow-y-visible",
		gridColumnStyle: gridColumnVarsToStyle(gridColumnVars),
		gridDataAttrs: {
			"data-sidebar-enable": sidebarLayoutConfig.enable ? "true" : "false",
			"data-grid-hide-sidebar-on-post": hideSidebarOnPostPage
				? "true"
				: "false",
			"data-sidebar-position": sidebarLayoutConfig.position,
			"data-tablet-sidebar": sidebarConfig.tabletSidebar,
			// noSidebarContentWidth（0–1 比例），空串表示未配置
			"data-no-sidebar-content-width": String(
				sidebarLayoutConfig.noSidebarContentWidth ?? "",
			),
			"data-has-left-on-post": sidebarConfig.hasLeftWidgetsOnPost
				? "true"
				: "false",
			"data-has-left-on-non-post": sidebarConfig.hasLeftWidgetsOnNonPost
				? "true"
				: "false",
			"data-has-right-on-post": sidebarConfig.hasRightWidgetsOnPost
				? "true"
				: "false",
			"data-has-right-on-non-post": sidebarConfig.hasRightWidgetsOnNonPost
				? "true"
				: "false",
		},
	};
}
