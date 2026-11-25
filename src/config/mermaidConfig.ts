import type { MermaidConfig } from "../types/mermaidConfig";

/**
 * Mermaid 图表渲染配置
 *
 * 使用 merman 在构建时将 mermaid 代码块渲染为静态 SVG，
 * 支持浅色/深色双主题，通过 CSS 自动切换。
 *
 * @see https://github.com/Latias94/merman
 */
export const mermaidConfig: MermaidConfig = {
	/**
	 * 亮色模式主题（以 light appearance 渲染）。
	 * 可选：editor、gruvbox、ayu、brutalist、spotless、ghibli、paper-cut、carbon-copy、pop-art。
	 */
	lightTheme: "editor",

	/**
	 * 暗色模式主题（以 dark appearance 渲染）。
	 * 可选：editor、gruvbox、ayu、one-dark、cyberpunk。
	 */
	darkTheme: "editor",
};
