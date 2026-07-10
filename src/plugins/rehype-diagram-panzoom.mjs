import { h } from "hastscript";
import clientScript from "./diagram-panzoom-script.js?raw";

/** 已注入脚本的 tree 集合，避免同一 tree 多次注入 */
const injectedTrees = new WeakSet();

/**
 * 共享图表交互 rehype 插件
 *
 * 为 .diagram-container 注入 pan-zoom、全屏控制等客户端交互脚本。
 * 共享 CSS 位于 markdown-extend.styl（.diagram-controls / .diagram-ctrl-btn / .diagram-fs-* 等）。
 *
 * Mermaid 和 PlantUML 的 rehype 插件各自负责渲染内容，
 * 本插件只负责为它们统一添加交互能力。
 */
export function rehypeDiagramPanZoom() {
	return (tree) => {
		if (injectedTrees.has(tree)) return;
		injectedTrees.add(tree);

		const script = h("script", { type: "text/javascript" }, clientScript);
		tree.children = [...(tree.children || []), script];
	};
}
