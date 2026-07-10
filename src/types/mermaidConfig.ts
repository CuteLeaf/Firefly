/**
 * Mermaid 图表渲染配置
 *
 * 控制 markdown 文章中 ` ```mermaid ` 代码块在构建时的服务端 SVG 渲染行为。
 * 使用 beautiful-mermaid 在 Astro 构建阶段生成静态 SVG，无需客户端 JavaScript。
 */
export type MermaidConfig = {
	/**
	 * 亮色模式下使用的 beautiful-mermaid 主题名。
	 * 可选值：zinc-light, tokyo-night-light, catppuccin-latte, nord-light,
	 * github-light, solarized-light
	 */
	lightTheme:
		| "zinc-light"
		| "tokyo-night-light"
		| "catppuccin-latte"
		| "nord-light"
		| "github-light"
		| "solarized-light";

	/**
	 * 暗色模式下使用的 beautiful-mermaid 主题名。
	 * 可选值：zinc-dark, tokyo-night, tokyo-night-storm, catppuccin-mocha,
	 * nord, dracula, github-dark, solarized-dark, one-dark
	 */
	darkTheme:
		| "zinc-dark"
		| "tokyo-night"
		| "tokyo-night-storm"
		| "catppuccin-mocha"
		| "nord"
		| "dracula"
		| "github-dark"
		| "solarized-dark"
		| "one-dark";
};
