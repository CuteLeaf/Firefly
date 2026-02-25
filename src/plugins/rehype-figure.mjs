import { h } from "hastscript";
import { visit } from "unist-util-visit";
import { siteConfig } from "../config/index.js";

// 来自霞葉： https://kasuha.com/posts/fuwari-enhance-ep1/

/**
 * 检查是否需要为图片添加 referrerpolicy
 */
function shouldAddNoReferrer(urlStr) {
	const domains = siteConfig.imageOptimization?.noReferrerDomains || [];
	if (domains.length === 0) return false;

	try {
		const urlObj = new URL(urlStr);
		const hostname = urlObj.hostname;

		return domains.some((pattern) => {
			const regexPattern = pattern.replace(/\./g, "\\.").replace(/\*/g, ".*");
			const regex = new RegExp("^" + regexPattern + "$");
			return regex.test(hostname);
		});
	} catch {
		return false;
	}
}

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

			const imgProps = { ...node.properties };

			// 添加 referrerpolicy（如果需要）解决 403 问题
			// 无论是否有 alt，都要检查并添加 referrerpolicy
			if (imgProps.src && shouldAddNoReferrer(imgProps.src)) {
				imgProps.referrerpolicy = "no-referrer";
				imgProps.alt = "";
			}

			// 获取 alt 属性
			const alt = imgProps.alt;

			// 如果没有 alt 属性或 alt 为空字符串，则只更新属性并保持原样
			if (!alt || alt.trim() === "") {
				node.properties = imgProps;
				return;
			}

			// 创建 figure 元素，包含处理后的 img 和居中的 figcaption
			const figure = h("figure", [
				// 使用处理后的 img 节点，但移除 alt 属性避免重复显示
				h("img", {
					...imgProps,
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
