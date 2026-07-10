import type { THEMES } from "beautiful-mermaid";

/**
 * beautiful-mermaid 内置主题名联合类型
 * 从 THEMES 对象自动派生，升级依赖时无需手动同步
 */
export type MermaidThemeName = keyof typeof THEMES;

/**
 * Mermaid 图表渲染配置
 *
 * 控制 markdown 文章中 ` ```mermaid ` 代码块在构建时的服务端 SVG 渲染行为。
 */
export type MermaidConfig = {
	/** 亮色模式下使用的 beautiful-mermaid 主题名 */
	lightTheme: MermaidThemeName;
	/** 暗色模式下使用的 beautiful-mermaid 主题名 */
	darkTheme: MermaidThemeName;
};
