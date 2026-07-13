import type { MermaidConfig } from "../types/mermaidConfig";

/**
 * Mermaid 图表渲染配置
 *
 * 使用 beautiful-mermaid 在构建时将 mermaid 代码块渲染为静态 SVG，
 * 支持浅色/深色双主题，通过 CSS 自动切换。
 *
 * @see https://github.com/lukilabs/beautiful-mermaid
 */
export const mermaidConfig: MermaidConfig = {
	/**
	 * 亮色模式主题。
	 * 推荐：github-light（GitHub 风格）、solarized-light（护眼）、
	 * catppuccin-latte（柔和）、nord-light（冷色调）
	 * 更多主题请查看https://github.com/lukilabs/beautiful-mermaid#built-in-themes
	 */
	lightTheme: "github-light",

	/**
	 * 暗色模式主题。
	 * 推荐：github-dark（GitHub 风格）、one-dark（Atom 经典）、
	 * catppuccin-mocha（柔和）、tokyo-night（赛博朋克）
	 * 更多主题请查看https://github.com/lukilabs/beautiful-mermaid#built-in-themes
	 */
	darkTheme: "github-dark",
};
