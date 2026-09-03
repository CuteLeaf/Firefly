import type { HostThemePresetName } from "@mermanjs/web";

/**
 * merman 内置宿主主题预设名
 */
export type MermaidThemeName = HostThemePresetName;

/**
 * Mermaid 图表渲染配置
 *
 * 控制 markdown 文章中 ` ```mermaid ` 代码块在构建时的服务端 SVG 渲染行为。
 */
export type MermaidConfig = {
	/** 亮色模式下使用的 merman 宿主主题预设名 */
	lightTheme: MermaidThemeName;
	/** 暗色模式下使用的 merman 宿主主题预设名 */
	darkTheme: MermaidThemeName;
};
