import { sidebarLayoutConfig } from "@/config";

/** 侧栏列宽，全仓库唯一字面值出处 */
const SIDEBAR_WIDTH = "17.5rem";

const SIDEBAR_TRACK = "var(--grid-sidebar-width)";

export interface ResponsiveSidebarConfig {
	/**
	 * 该侧是否存在启用的组件，含 position 门控。
	 * 不含页面类型判定：position === "both" 时侧栏走静态容器、只 SSR 一次，
	 * 按页型收窄会让它永久变空。
	 */
	hasLeftComponents: boolean;
	hasRightComponents: boolean;
	tabletSidebar: "left" | "right";
	/** 以下四个只服务于列几何，不含 position 门控 */
	hasLeftWidgetsOnPost: boolean;
	hasLeftWidgetsOnNonPost: boolean;
	hasRightWidgetsOnPost: boolean;
	hasRightWidgetsOnNonPost: boolean;
}

/** 组件在给定页面类型下是否显示，与 SideBar.astro 的 widget-hide-* 规则同源 */
export function isWidgetVisibleOnPageType(
	comp: {
		enable: boolean;
		showOnPostPage?: boolean;
		hideOnNonPostPage?: boolean;
	},
	isPostPage: boolean,
): boolean {
	if (!comp.enable) return false;
	if (isPostPage && comp.showOnPostPage === false) return false;
	if (!isPostPage && comp.hideOnNonPostPage === true) return false;
	return true;
}

/**
 * 获取响应式侧边栏配置
 *
 * 响应式布局：
 * - 768px及以下: 隐藏侧栏，显示底部 mobileBottomComponents
 * - 769px-1279px: 根据 position 和 tabletSidebar 配置显示侧栏
 * - 1280px及以上: 根据 position 配置显示侧栏
 */
export function getResponsiveSidebarConfig(): ResponsiveSidebarConfig {
	const position = sidebarLayoutConfig.position;
	const tabletSidebar = sidebarLayoutConfig.tabletSidebar ?? "left";

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

	const visibleOn = (
		comps: {
			enable: boolean;
			showOnPostPage?: boolean;
			hideOnNonPostPage?: boolean;
		}[],
		isPostPage: boolean,
	): boolean =>
		comps.some((comp) => isWidgetVisibleOnPageType(comp, isPostPage));

	return {
		hasLeftComponents,
		hasRightComponents,
		tabletSidebar,
		hasLeftWidgetsOnPost: visibleOn(sidebarLayoutConfig.leftComponents, true),
		hasLeftWidgetsOnNonPost: visibleOn(
			sidebarLayoutConfig.leftComponents,
			false,
		),
		hasRightWidgetsOnPost: visibleOn(sidebarLayoutConfig.rightComponents, true),
		hasRightWidgetsOnNonPost: visibleOn(
			sidebarLayoutConfig.rightComponents,
			false,
		),
	};
}

/** computeGridColumns 的输入，SSR 与客户端共用同一组值 */
export interface GridColumnsInput {
	enabled: boolean;
	position: "left" | "right" | "both";
	tabletSidebar: "left" | "right";
	hideSidebarOnPostPage: boolean;
	isPostPage: boolean;
	hasLeftWidgets: boolean;
	hasRightWidgets: boolean;
	/** 无侧栏列时内容栏占包裹层总宽的比例（0–1），不设置或 ≥1 则铺满 */
	noSidebarContentWidth?: number;
}

/** #main-grid 的列几何，由 gridColumnVarsToStyle 序列化 */
export interface GridColumnVars {
	"--cols-md": string;
	"--cols-xl": string;
	"--left-display-md": "contents" | "none";
	"--left-display-xl": "contents" | "none";
	"--right-display-md": "contents" | "none";
	"--right-display-xl": "contents" | "none";
	/** 侧栏列宽。不能叫 --sidebar-width，那会遮蔽 variables.styl 里的同名全局变量 */
	"--grid-sidebar-width": string;
	/** 内容栏占包裹层总宽的比例（无单位，1 = 不收窄），按断点各自判定 */
	"--content-ratio-md": number;
	"--content-ratio-xl": number;
}

/** 按左右两侧是否占列生成轨道串 */
function trackSegments(left: boolean, right: boolean): string {
	if (left && right) return `${SIDEBAR_TRACK} 1fr ${SIDEBAR_TRACK}`;
	if (left) return `${SIDEBAR_TRACK} 1fr`;
	if (right) return `1fr ${SIDEBAR_TRACK}`;
	return "1fr";
}

/**
 * 计算 #main-grid 的列几何（SSR 与客户端共用的唯一真源）。
 * 侧栏包裹层是 display:contents，真正的 grid item 是内层元素，按 DOM 顺序自动放置即可。
 */
export function computeGridColumns(input: GridColumnsInput): GridColumnVars {
	// 整站禁用，或文章页整体隐藏侧栏
	const sidebarActive =
		input.enabled && !(input.isPostPage && input.hideSidebarOnPostPage);

	const leftIn =
		sidebarActive && input.hasLeftWidgets && input.position !== "right";
	const rightIn =
		sidebarActive && input.hasRightWidgets && input.position !== "left";

	// 平板端：position 为 both 时只显示 tabletSidebar 指定的那一侧
	const mdLeft =
		leftIn &&
		(input.position === "left" ||
			(input.position === "both" && input.tabletSidebar === "left"));
	const mdRight =
		rightIn &&
		(input.position === "right" ||
			(input.position === "both" && input.tabletSidebar === "right"));

	// 侧栏已启用但本断点无侧栏列 → 内容栏按比例收窄；比例钳到 [0,1]，1 即不收窄
	// 闸门用 enabled 而非 sidebarActive：enable: false 时仍铺满。md 与 xl 需各自判定
	const raw = input.noSidebarContentWidth;
	const ratio =
		raw == null || !Number.isFinite(raw) ? 1 : Math.min(1, Math.max(0, raw));
	const ratioMd = input.enabled && !mdLeft && !mdRight ? ratio : 1;
	const ratioXl = input.enabled && !leftIn && !rightIn ? ratio : 1;

	return {
		"--cols-md": trackSegments(mdLeft, mdRight),
		"--cols-xl": trackSegments(leftIn, rightIn),
		"--left-display-md": mdLeft ? "contents" : "none",
		"--left-display-xl": leftIn ? "contents" : "none",
		"--right-display-md": mdRight ? "contents" : "none",
		"--right-display-xl": rightIn ? "contents" : "none",
		"--grid-sidebar-width": SIDEBAR_WIDTH,
		"--content-ratio-md": ratioMd,
		"--content-ratio-xl": ratioXl,
	};
}

/** 序列化为 inline style 属性值（自定义属性值含空格，不能用对象形式） */
export function gridColumnVarsToStyle(vars: GridColumnVars): string {
	return Object.entries(vars)
		.map(([key, value]) => `${key}:${value}`)
		.join(";");
}
