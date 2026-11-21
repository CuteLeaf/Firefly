/**
 * merman 0.10 主题预设（设计组）ID。
 * 完整目录运行时可通过 `engine.metadataJson("theme-catalog")` 获取。
 */
export type MermaidThemeName =
	| "brutalist"
	| "ayu"
	| "carbon-copy"
	| "cyberpunk"
	| "editor"
	| "ghibli"
	| "gruvbox"
	| "one-dark"
	| "paper-cut"
	| "pop-art"
	| "spotless";

/** 支持 light appearance 渲染的预设子集 */
export type MermaidLightThemeName =
	| "editor"
	| "gruvbox"
	| "ayu"
	| "brutalist"
	| "spotless"
	| "ghibli"
	| "paper-cut"
	| "carbon-copy"
	| "pop-art";

/** 支持 dark appearance 渲染的预设子集 */
export type MermaidDarkThemeName =
	| "editor"
	| "gruvbox"
	| "ayu"
	| "one-dark"
	| "cyberpunk";

/**
 * Mermaid 图表渲染配置
 *
 * 控制 markdown 文章中 ` ```mermaid ` 代码块在构建时的服务端 SVG 渲染行为。
 *
 * merman 0.10 起主题模型为「预设（设计组）× appearance（light/dark）」：
 * lightTheme 以 light appearance 渲染，darkTheme 以 dark appearance 渲染，
 * 同一预设的两个外观即为原来的 editor-light / editor-dark 等组合。
 */
export type MermaidConfig = {
	/** 亮色模式下使用的 merman 预设（以 light appearance 渲染） */
	lightTheme: MermaidLightThemeName;
	/** 暗色模式下使用的 merman 预设（以 dark appearance 渲染） */
	darkTheme: MermaidDarkThemeName;
};
