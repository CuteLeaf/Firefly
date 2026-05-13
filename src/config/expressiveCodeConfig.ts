import type { ExpressiveCodeConfig } from "../types/config";

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	darkTheme: "one-dark-pro",
	lightTheme: "one-light",
	// 更多样式请看 expressive-code 官方文档
	// https://expressive-code.com/guides/themes/

	pluginCollapsible: {
		enable: true,
		lineThreshold: 15, // 当代码行数超过15行时显示折叠按钮
		previewLines: 8, // 折叠时显示前8行
		defaultCollapsed: true, // 默认折叠长代码块
	},
	pluginLanguageBadge: {
		enable: false,
	},
};
