import type { PlantUMLConfig } from "../types/config";

/**
 * PlantUML 图表渲染配置
 *
 * 用于控制 markdown 文章中 `plantuml` 代码块到 PlantUML 服务器 SVG 图片的
 * 构建时编码与客户端渲染行为。支持明暗双主题与自建 PlantUML 服务器。
 *
 * @see https://plantuml.com/zh/theme
 * @see https://plantuml.com/zh/server
 */
export const plantumlConfig: PlantUMLConfig = {
	/**
	 * 是否启用 PlantUML 渲染能力。
	 * 关闭时 `plantuml` 代码块退化为普通代码高亮，由 Expressive Code 处理。
	 */
	enable: true,

	/**
	 * PlantUML 服务器地址（不含尾部斜杠也可，会自动归一化）。
	 * 默认使用官方公共服务器；敏感内容请部署自建服务器（例如
	 * `plantuml/plantuml-server` Docker 镜像），并把此字段替换为自建地址。
	 */
	server: "https://www.plantuml.com/plantuml",

	/**
	 * 亮色模式下注入到 PlantUML 源码的主题名（对应 `!theme <name>`）。
	 * 留空字符串表示不注入任何主题，使用 PlantUML 默认外观。
	 */
	lightTheme: "",

	/**
	 * 暗色模式下注入到 PlantUML 源码的主题名（对应 `!theme <name>`）。
	 * 留空字符串表示不注入主题；默认使用内置的 `cyborg` 暗色主题。
	 */
	darkTheme: "cyborg",
};
