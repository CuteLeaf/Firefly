import { h } from "hastscript";
import { visit } from "unist-util-visit";
import clientScript from "./diagram-panzoom-script.js?raw";
import { DIAGRAM_CONTAINER } from "./utils/diagramConstants.js";

/** 已注入脚本的 tree 集合，避免同一 tree 多次注入 */
const injectedTrees = new WeakSet();

/** 判断 tree 中是否包含图表容器（Mermaid/PlantUML 渲染后的 .diagram-container） */
function hasDiagramContainer(tree) {
	let found = false;
	visit(tree, "element", (node) => {
		if (found) return;
		const value = node.properties?.className ?? node.properties?.class;
		const classList = Array.isArray(value)
			? value
			: typeof value === "string"
				? value.split(/\s+/)
				: [];
		if (classList.includes(DIAGRAM_CONTAINER)) {
			found = true;
		}
	});
	return found;
}

/**
 * 共享图表交互 rehype 插件
 *
 * 为 .diagram-container 注入 pan-zoom、全屏控制等客户端交互脚本。
 * 共享 CSS 位于 markdown-extend.styl（.diagram-controls / .diagram-ctrl-btn / .diagram-fs-* 等）。
 *
 * Mermaid 和 PlantUML 的 rehype 插件各自负责渲染内容，
 * 本插件只负责为它们统一添加交互能力。
 *
 * 只在树里真正含图表容器时注入（本插件位于 rehypeMermaid/rehypePlantuml 之后，
 * 此时图表容器已生成），避免无图表的文章背负 ~10KB 内联脚本。
 */
export function rehypeDiagramPanZoom() {
	return (tree) => {
		if (injectedTrees.has(tree)) return;
		injectedTrees.add(tree);

		if (!hasDiagramContainer(tree)) return;

		const script = h("script", { type: "text/javascript" }, clientScript);
		tree.children = [...(tree.children || []), script];
	};
}
