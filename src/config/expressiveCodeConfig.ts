import type { ExpressiveCodeConfig } from "../types/config";

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
};
