import { h } from "hastscript";
import { visit } from "unist-util-visit";
import plantumlRenderScript from "./plantuml-render-script.js?raw";

/**
 * 从 HAST 节点递归提取所有文本内容，作为 `<img>` 的 alt 回退文案。
 *
 * @param {import('hast').Node} node 节点
 * @returns {string} 拼接后的文本
 */
function extractText(node) {
	if (node.type === "text") return node.value || "";
	if (node.children) return node.children.map(extractText).join("");
	return "";
}

/**
 * 生成当前 HAST 节点的随机 id，避免同一页多个图表冲突。
 *
 * @returns {string}
 */
function generateId() {
	const rand = Math.random().toString(36).slice(2, 8);
	return `plantuml-${rand}`;
}

/** 已注入客户端脚本的 tree 集合，用于避免同一 tree 多次注入 */
const scriptInjectedTrees = new WeakSet();

/**
 * rehype 插件：把 `div.plantuml-container`（由 remark-plantuml 标记）改写为
 * 可交互的 `.plantuml-diagram-container`，并在每棵 tree 末尾注入一次客户端
 * 渲染脚本，负责主题切换、加载失败降级与缩放/全屏控制。
 *
 * @returns {(tree: import('hast').Root) => void} rehype transformer
 */
export function rehypePlantuml() {
	return (tree) => {
		let foundAny = false;

		visit(tree, "element", (node) => {
			if (node.tagName !== "div" || !node.properties) {
				return;
			}
			const classProp = node.properties.className;
			const hasMarker = Array.isArray(classProp)
				? classProp.includes("plantuml-container")
				: typeof classProp === "string"
					? classProp.split(/\s+/).includes("plantuml-container")
					: false;
			if (!hasMarker) {
				return;
			}

			const lightSrc =
				node.properties["data-plantuml-light"] ||
				node.properties.dataPlantumlLight ||
				"";
			const darkSrc =
				node.properties["data-plantuml-dark"] ||
				node.properties.dataPlantumlDark ||
				lightSrc;
			let altText =
				node.properties["data-plantuml-alt"] ||
				node.properties.dataPlantumlAlt ||
				"";
			if (!altText) {
				altText = extractText(node).trim().slice(0, 200);
			}

			if (!lightSrc) {
				return;
			}

			const diagramId = generateId();

			const img = h("img", {
				class: "plantuml-image",
				alt: altText || "PlantUML diagram",
				src: lightSrc,
				"data-light-src": lightSrc,
				"data-dark-src": darkSrc,
				loading: "lazy",
				decoding: "async",
			});

			const wrapper = h(
				"div",
				{
					class: "plantuml-wrapper",
					id: diagramId,
				},
				[img],
			);

			node.tagName = "div";
			node.properties = { class: "plantuml-diagram-container" };
			node.children = [wrapper];

			foundAny = true;
		});

		if (foundAny && !scriptInjectedTrees.has(tree)) {
			scriptInjectedTrees.add(tree);
			const script = h(
				"script",
				{ type: "text/javascript" },
				plantumlRenderScript,
			);
			tree.children = [...(tree.children || []), script];
		}
	};
}
