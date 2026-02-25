import { h } from "hastscript";
import { visit } from "unist-util-visit";

// 来自霞葉： https://kasuha.com/posts/fuwari-enhance-ep1/

/**
 * 将带有 alt 文本的图片转换为包含 figcaption 的 figure 元素的 rehype 插件
 *
 * @returns {Function} A transformer function for the rehype plugin
 */
export default function rehypeFigure() {
	return (tree) => {
		visit(tree, "element", (node, index, parent) => {
			// 只处理 img 元素
			if (node.tagName !== "img") {
				return;
			}

			// 获取 alt 属性
			const alt = node.properties?.alt;

			// 如果没有 alt 属性或 alt 为空字符串，则保持原样
			if (!alt || alt.trim() === "") {
				return;
			}

			// 创建 figure 元素，包含原始的 img 和居中的 figcaption
			const figure = h("figure", [
				// 复制原始的 img 节点，但移除 alt 属性避免重复显示
				h("img", {
					...node.properties,
					alt: "", // 清空 alt 属性，因为现在有 figcaption 了
				}),
				h("figcaption", alt),
			]);

			// 居中显示
			const centerFigure = h("center", figure);

			// 替换当前的 img 节点为 figure 节点
			if (parent && typeof index === "number") {
				parent.children[index] = centerFigure;
			}
		});
	};
}
