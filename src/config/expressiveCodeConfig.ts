import type { ExpressiveCodeConfig } from "../types/expressiveCodeConfig";

/**
 * expressive-code配置
 * @see https://expressive-code.com/
 * 修改本配置后需要重启Astro开发服务器才能生效
 */

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// 暗色主题（用于暗色模式）
	darkTheme: "one-dark-pro",

	// 亮色主题（用于亮色模式）
	lightTheme: "one-light",

	// 更多样式请看expressive-code的官方文档
	// https://expressive-code.com/guides/themes/

	// 代码块折叠插件配置
	pluginCollapsible: {
		enable: true, // 启用折叠功能
		lineThreshold: 15, // 当代码行数超过15行时显示折叠按钮
		previewLines: 8, // 折叠时显示前8行
		defaultCollapsed: true, // 默认折叠长代码块
	},

	// 语言徽章插件配置（在代码块右上角显示语言名称文本）
	pluginLanguageBadge: {
		// 是否启用语言徽章插件
		enable: false,
	},

	// 语言Logo插件配置（在代码块右下角显示语言图标）
	pluginLanguageLogo: {
		// 是否启用语言Logo插件
		enable: false,
		// Logo颜色模式:
		//   "mono"     - 单色模式，自动适配亮暗色主题（默认）
		//   "original" - 使用各语言图标的原始品牌色（如JS黄色、TS蓝色等）
		//   "theme"    - 使用代码块前景色
		//   "#ff6600"  - 自定义十六进制颜色值
		color: "mono",
		// 需要排除的语言列表（这些语言不会显示Logo）
		excludedLangs: [],
	},
};
