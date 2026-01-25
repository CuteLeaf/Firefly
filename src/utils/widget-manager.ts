import { sidebarLayoutConfig } from "../config";
import type {
	SidebarLayoutConfig,
	WidgetComponentConfig,
	WidgetComponentType,
} from "../types/config";

/**
 * 组件映射表 - 将组件类型映射到实际的组件路径
 */
export const WIDGET_COMPONENT_MAP = {
	profile: "../components/widget/Profile.astro",
	announcement: "../components/widget/Announcement.astro",
	categories: "../components/widget/Categories.astro",
	tags: "../components/widget/Tags.astro",
	sidebarToc: "../components/widget/SidebarTOC.astro",
	advertisement: "../components/widget/Advertisement.astro",
	stats: "../components/widget/SiteStats.astro",
	calendar: "../components/widget/Calendar.astro",
	custom: null, // 自定义组件需要在配置中指定路径
} as const;

/**
 * 组件管理器类
 * 负责管理侧边栏组件的动态加载、排序和渲染
 */
export class WidgetManager {
	private config: SidebarLayoutConfig;

	constructor(config: SidebarLayoutConfig = sidebarLayoutConfig) {
		this.config = config;
	}

	/**
	 * 获取配置
	 */
	getConfig(): SidebarLayoutConfig {
		return this.config;
	}

	/**
	 * 获取启用的组件列表
	 * @param sidebar 侧边栏位置（可选）
	 */
	private getEnabledComponents(
		sidebar?: "left" | "right",
	): WidgetComponentConfig[] {
		let components: WidgetComponentConfig[];

		if (sidebar) {
			// 如果指定了侧边栏，只获取该侧的组件
			const targetComponents =
				sidebar === "left"
					? this.config.leftComponents
					: this.config.rightComponents;
			components = targetComponents.filter((component) => component.enable);
		} else {
			// 如果没有指定，获取所有组件
			const allComponents = [
				...this.config.leftComponents,
				...this.config.rightComponents,
			];
			components = allComponents.filter((component) => component.enable);
		}

		return components.sort((a, b) => a.order - b.order);
	}

	/**
	 * 根据位置获取组件列表
	 * @param position 组件位置：'top' | 'sticky'
	 * @param sidebar 侧边栏位置（可选）：'left' | 'right'
	 */
	getComponentsByPosition(
		position: "top" | "sticky",
		sidebar?: "left" | "right",
	): WidgetComponentConfig[] {
		if (!sidebar) {
			// 如果没有指定侧边栏，返回所有符合位置的组件
			const allComponents = this.getEnabledComponents();
			return allComponents.filter(
				(component) => component.position === position,
			);
		}

		// 获取指定侧边栏的启用组件
		const sidebarComponents = this.getEnabledComponents(sidebar);
		return sidebarComponents.filter(
			(component) => component.position === position,
		);
	}

	/**
	 * 检查指定侧边栏是否有组件
	 * @param sidebar 侧边栏位置：'left' | 'right'
	 */
	hasComponentsInSidebar(sidebar: "left" | "right"): boolean {
		const components =
			sidebar === "left"
				? this.config.leftComponents
				: this.config.rightComponents;

		return components.some((component) => component.enable);
	}

	/**
	 * 检查指定侧边栏在特定设备上是否有可见组件
	 * @param sidebar 侧边栏位置：'left' | 'right'
	 * @param deviceType 设备类型：'mobile' | 'tablet' | 'desktop'
	 * 注：tablet 对应 Tailwind 的 md 到 lg 之间 (768px-1023px)
	 */
	hasVisibleComponentsInSidebar(
		sidebar: "left" | "right",
		deviceType: "mobile" | "tablet" | "desktop",
	): boolean {
		// 双侧边栏模式下，右侧边栏在平板端隐藏
		if (deviceType === "tablet" && sidebar === "right") {
			return false;
		}

		const components =
			sidebar === "left"
				? this.config.leftComponents
				: this.config.rightComponents;

		return components.some((component) => {
			if (!component.enable) {
				return false;
			}

			// 检查组件是否在该设备上隐藏
			const hiddenDevices = component.responsive?.hidden || [];
			return !hiddenDevices.includes(deviceType);
		});
	}

	/**
	 * 获取组件的动画延迟时间
	 * @param component 组件配置
	 * @param index 组件在列表中的索引
	 */
	getAnimationDelay(component: WidgetComponentConfig, index: number): number {
		if (component.animationDelay !== undefined) {
			return component.animationDelay;
		}

		if (this.config.defaultAnimation.enable) {
			return (
				this.config.defaultAnimation.baseDelay +
				index * this.config.defaultAnimation.increment
			);
		}

		return 0;
	}

	/**
	 * 获取组件的CSS类名
	 * @param component 组件配置
	 * @param sidebar 组件所在的侧边栏
	 * @param index 组件在列表中的索引
	 */
	getComponentClass(
		component: WidgetComponentConfig,
		sidebar: "left" | "right",
		_index: number,
	): string {
		const classes: string[] = [];

		// 添加基础类名
		if (component.class) {
			classes.push(component.class);
		}

		// 双侧边栏模式下，右侧边栏的组件在平板端自动隐藏
		// 使用 Tailwind 标准断点：lg(1024px) 以下全部隐藏
		if (sidebar === "right") {
			classes.push("hidden", "lg:block");
		}

		return classes.join(" ");
	}

	/**
	 * 获取组件的内联样式
	 * @param component 组件配置
	 * @param index 组件在列表中的索引
	 */
	getComponentStyle(component: WidgetComponentConfig, index: number): string {
		const styles: string[] = [];

		// 添加自定义样式
		if (component.style) {
			styles.push(component.style);
		}

		// 添加动画延迟样式
		const animationDelay = this.getAnimationDelay(component, index);
		if (animationDelay > 0) {
			styles.push(`animation-delay: ${animationDelay}ms`);
		}

		return styles.join("; ");
	}

	/**
	 * 检查组件是否应该折叠
	 * @param component 组件配置
	 * @param itemCount 组件内容项数量
	 */
	isCollapsed(component: WidgetComponentConfig, itemCount: number): boolean {
		if (!component.responsive?.collapseThreshold) {
			return false;
		}
		return itemCount >= component.responsive.collapseThreshold;
	}

	/**
	 * 获取组件的路径
	 * @param componentType 组件类型
	 */
	getComponentPath(componentType: WidgetComponentType): string | null {
		return WIDGET_COMPONENT_MAP[componentType];
	}

	/**
	 * 检查当前设备是否应该显示侧边栏
	 * @param deviceType 设备类型
	 */
	shouldShowSidebar(deviceType: "mobile" | "tablet" | "desktop"): boolean {
		if (!this.config.enable) {
			return false;
		}

		const layoutMode = this.config.responsive.layout[deviceType];
		return layoutMode === "sidebar";
	}

	/**
	 * 更新组件配置
	 * @param newConfig 新的配置
	 */
	updateConfig(newConfig: Partial<SidebarLayoutConfig>): void {
		this.config = { ...this.config, ...newConfig };
	}

	/**
	 * 添加新组件
	 * @param component 组件配置
	 * @param sidebar 侧边栏位置
	 */
	addComponent(
		component: WidgetComponentConfig,
		sidebar: "left" | "right" = "left",
	): void {
		if (sidebar === "left") {
			this.config.leftComponents.push(component);
		} else {
			this.config.rightComponents.push(component);
		}
	}

	/**
	 * 移除组件
	 * @param componentType 组件类型
	 * @param sidebar 侧边栏位置（可选，如果不指定则从两侧都移除）
	 */
	removeComponent(
		componentType: WidgetComponentType,
		sidebar?: "left" | "right",
	): void {
		if (!sidebar || sidebar === "left") {
			this.config.leftComponents = this.config.leftComponents.filter(
				(component) => component.type !== componentType,
			);
		}
		if (!sidebar || sidebar === "right") {
			this.config.rightComponents = this.config.rightComponents.filter(
				(component) => component.type !== componentType,
			);
		}
	}

	/**
	 * 启用/禁用组件
	 * @param componentType 组件类型
	 * @param enable 是否启用
	 * @param sidebar 侧边栏位置（可选）
	 */
	toggleComponent(
		componentType: WidgetComponentType,
		enable: boolean,
		_sidebar?: "left" | "right",
	): void {
		const allComponents = [
			...this.config.leftComponents,
			...this.config.rightComponents,
		];

		const component = allComponents.find((c) => c.type === componentType);
		if (component) {
			component.enable = enable;
		}
	}

	/**
	 * 重新排序组件
	 * @param componentType 组件类型
	 * @param newOrder 新的排序值
	 */
	reorderComponent(componentType: WidgetComponentType, newOrder: number): void {
		const allComponents = [
			...this.config.leftComponents,
			...this.config.rightComponents,
		];

		const component = allComponents.find((c) => c.type === componentType);
		if (component) {
			component.order = newOrder;
		}
	}

	/**
	 * 检查组件是否应该在侧边栏中渲染
	 * @param componentType 组件类型
	 */
	isSidebarComponent(_componentType: WidgetComponentType): boolean {
		// 过滤组件
		return true;
	}
}

/**
 * 默认组件管理器实例
 */
export const widgetManager = new WidgetManager();

/**
 * 工具函数：根据组件类型获取组件配置
 * @param componentType 组件类型
 * @param sidebar 侧边栏位置（可选）
 */
export function getComponentConfig(
	componentType: WidgetComponentType,
	sidebar?: "left" | "right",
): WidgetComponentConfig | undefined {
	const config = widgetManager.getConfig();
	const allComponents = [...config.leftComponents, ...config.rightComponents];

	if (sidebar) {
		const components =
			sidebar === "left" ? config.leftComponents : config.rightComponents;
		return components.find((c) => c.type === componentType);
	}

	return allComponents.find((c) => c.type === componentType);
}

/**
 * 工具函数：检查组件是否启用
 * @param componentType 组件类型
 */
export function isComponentEnabled(
	componentType: WidgetComponentType,
): boolean {
	const config = getComponentConfig(componentType);
	return config?.enable ?? false;
}

/**
 * 工具函数：获取所有启用的组件类型
 */
export function getEnabledComponentTypes(): WidgetComponentType[] {
	const enabledComponents = widgetManager
		.getComponentsByPosition("top")
		.concat(widgetManager.getComponentsByPosition("sticky"));
	return enabledComponents.map((c) => c.type);
}
