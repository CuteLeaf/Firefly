/**
 * merman 内置宿主主题预设名
 */
export type MermaidThemeName =
	| "editor-light"
	| "editor-dark"
	| "one-dark"
	| "gruvbox-light"
	| "gruvbox-dark"
	| "ayu-light"
	| "ayu-dark";

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
