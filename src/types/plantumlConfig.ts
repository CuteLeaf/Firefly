/**
 * PlantUML 图表渲染配置
 *
 * 控制 markdown 文章中 ` ```plantuml ` 代码块到 PlantUML 服务器 SVG 图片的
 * 构建时编码与客户端渲染行为。
 */
export type PlantUMLConfig = {
	/** 是否启用 PlantUML 渲染能力；关闭时 plantuml 代码块退化为普通代码高亮 */
	enable: boolean;
	/** PlantUML 服务器地址，尾部斜杠会自动归一化；默认使用官方公共服务器 */
	server: string;
	/** 亮色模式下注入的 PlantUML 主题名；空字符串表示不注入 */
	lightTheme: string;
	/** 暗色模式下注入的 PlantUML 主题名；空字符串表示不注入 */
	darkTheme: string;
};
