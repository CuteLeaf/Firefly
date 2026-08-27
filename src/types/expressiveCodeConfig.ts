export type ExpressiveCodeConfig = {
	/** @deprecated 使用 darkTheme 和 lightTheme 代替 */
	theme?: string;
	/** 暗色主题名称（用于暗色模式） */
	darkTheme: string;
	/** 亮色主题名称（用于亮色模式） */
	lightTheme: string;
	/** 代码块折叠插件配置 */
	pluginCollapsible?: PluginCollapsibleConfig;
	/** 语言徽章插件配置 */
	pluginLanguageBadge?: PluginLanguageBadgeConfig;
	/** 语言Logo插件配置 */
	pluginLanguageLogo?: PluginLanguageLogoConfig;
};

export type PluginLanguageBadgeConfig = {
	/** 是否启用语言徽章 */
	enable: boolean;
};

/**
 * 语言Logo颜色模式
 * - "mono": 单色模式，自动适配亮暗色主题（默认）
 * - "original": 使用各语言图标的原始品牌色
 * - "theme": 使用代码块前景色
 * - `#${string}`: 自定义十六进制颜色值
 */
export type LanguageLogoColor = "mono" | "original" | "theme" | `#${string}`;

export type PluginLanguageLogoConfig = {
	/** 是否启用语言Logo插件 */
	enable: boolean;
	/**
	 * Logo颜色模式
	 * - "mono": 单色模式，自动适配亮暗色主题（默认）
	 * - "original": 使用各语言图标的原始品牌色
	 * - "theme": 使用代码块前景色
	 * - `#${string}`: 自定义十六进制颜色值（如 "#ff6600"）
	 */
	color?: LanguageLogoColor;
	/** 需要排除的语言列表，这些语言不会显示Logo */
	excludedLangs?: string[];
};

export type PluginCollapsibleConfig = {
	enable: boolean; // 是否启用代码块折叠功能
	lineThreshold: number; // 触发折叠的行数阈值
	previewLines: number; // 折叠时显示的预览行数
	defaultCollapsed: boolean; // 默认是否折叠
};
