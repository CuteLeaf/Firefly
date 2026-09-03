import { visit } from "unist-util-visit";
import { buildUrl, encodePlantUML, injectTheme } from "./plantuml-encoder.js";

/**
 * @typedef {Object} RemarkPlantumlOptions
 * @property {boolean} [enable=true] 是否启用 PlantUML 处理，false 时 plantuml 代码块原样交给下游处理
 * @property {string} [server="https://www.plantuml.com/plantuml"] PlantUML 服务器地址
 * @property {string} [lightTheme=""] 亮色模式注入的 PlantUML 主题名，空串不注入
 * @property {string} [darkTheme=""] 暗色模式注入的 PlantUML 主题名，空串不注入
 */

/** @type {RemarkPlantumlOptions} */
const DEFAULT_OPTIONS = {
	enable: true,
	server: "https://www.plantuml.com/plantuml",
	lightTheme: "",
	darkTheme: "",
};

/**
 * 识别 markdown 源中的 ```plantuml``` fenced code block，并在 remark 阶段
 * 将其转换为一个携带双主题 URL 数据属性的自定义节点，供 rehype 阶段渲染。
 *
 * 转换策略：参考 `remark-mermaid.js`，保留 `hChildren`（原始代码作为文本节点）
 * 以兼容 MDX 编译器对 hProperties 的处理。
 *
 * @param {RemarkPlantumlOptions} [options] 插件选项
 * @returns {(tree: import('mdast').Root) => void} remark transformer
 */
export function remarkPlantuml(options = {}) {
	const config = { ...DEFAULT_OPTIONS, ...options };

	return (tree) => {
		if (config.enable === false) {
			return;
		}

		visit(tree, "code", (node) => {
			const lang = typeof node.lang === "string" ? node.lang.toLowerCase() : "";
			if (lang !== "plantuml") {
				return;
			}

			const code = typeof node.value === "string" ? node.value : "";
			if (!code.trim()) {
				return;
			}

			const lightSource = injectTheme(code, config.lightTheme);
			const darkSource = injectTheme(code, config.darkTheme);

			const lightUrl = buildUrl(config.server, encodePlantUML(lightSource));
			const darkUrl =
				darkSource === lightSource
					? lightUrl
					: buildUrl(config.server, encodePlantUML(darkSource));

			node.type = "plantuml";
			node.data = {
				hName: "div",
				hProperties: {
					className: ["plantuml-container"],
					"data-plantuml-light": lightUrl,
					"data-plantuml-dark": darkUrl,
					"data-plantuml-alt": code.slice(0, 200),
				},
				hChildren: [{ type: "text", value: code }],
			};
			node.value = undefined;
		});
	};
}
