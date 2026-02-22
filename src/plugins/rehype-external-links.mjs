import { visit } from "unist-util-visit";

/**
 * 为文章中的外部链接添加 target="_blank" 和 rel="noopener noreferrer"
 * 仅处理以 http:// 或 https:// 开头且不属于本站的链接
 *
 * @param {Object} options
 * @param {string} [options.siteUrl] - 站点URL，用于判断是否为内部链接
 * @returns {Function} rehype transformer
 */
export default function rehypeExternalLinks(options = {}) {
	const siteUrl = options.siteUrl || "";
	let siteHost = "";
	try {
		siteHost = new URL(siteUrl).host;
	} catch (_e) {
		/* ignore */
	}

	return (tree) => {
		visit(tree, "element", (node) => {
			if (node.tagName !== "a") return;

			const href = node.properties?.href;
			if (typeof href !== "string") return;

			// 只处理 http/https 绝对链接
			if (!href.startsWith("http://") && !href.startsWith("https://")) return;

			// 跳过本站链接
			if (siteHost) {
				try {
					if (new URL(href).host === siteHost) return;
				} catch (_e) {
					/* ignore */
				}
			}

			node.properties.target = "_blank";
			node.properties.rel = "noopener noreferrer";
		});
	};
}
