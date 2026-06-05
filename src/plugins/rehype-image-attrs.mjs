/**
 * 图片属性增强插件
 * 为 Markdown 输出中的 <img> 标签添加合理的默认属性：
 * - loading="lazy" 懒加载
 * - decoding="async" 异步解码，避免主线程阻塞
 *
 * 仅在属性未设置时才添加，安全且低风险
 */
import { visit } from "unist-util-visit";

export default function rehypeImageAttrs() {
	return (tree) => {
		visit(tree, "element", (node) => {
			if (node.tagName !== "img") return;
			node.properties = node.properties || {};
			if (!("loading" in node.properties)) {
				node.properties.loading = "lazy";
			}
			if (!("decoding" in node.properties)) {
				node.properties.decoding = "async";
			}
			if (!("alt" in node.properties)) {
				node.properties.alt = "";
			}
			// 不设置 fetchpriority，避免影响 LCP 图片
		});
	};
}
