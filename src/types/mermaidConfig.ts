import type { BUNDLED_THEME_PRESETS } from "@mermanjs/web";

/**
 * merman 内置主题预设名
 */
export type MermaidThemeName = (typeof BUNDLED_THEME_PRESETS)[number];

/**
 * Mermaid 图表渲染配置
 *
 * 控制 markdown 文章中 ` ```mermaid ` 代码块在构建时的服务端 SVG 渲染行为。
 */
export type MermaidConfig = {
	/** 亮色模式下使用的 merman 内置主题预设名 */
	lightTheme: MermaidThemeName;
	/** 暗色模式下使用的 merman 内置主题预设名 */
	darkTheme: MermaidThemeName;
};
