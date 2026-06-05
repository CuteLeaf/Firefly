import { visit } from "unist-util-visit";

/**
 * 双 CDN 图床回退插件
 * 当主力图床图片加载失败时，自动切换到备用图床
 *
 * @param {Object} options
 * @param {boolean} options.enable - 是否启用回退功能
 * @param {string} options.originalDomain - 主力图床域名
 * @param {string} options.fallbackDomain - 备用图床域名
 */
export default function rehypeImageFallback(options = {}) {
	const {
		enable = true,
		originalDomain = "",
		fallbackDomain = "",
	} = options;

	return (tree) => {
		if (!enable || !originalDomain || !fallbackDomain) return;

		visit(tree, "element", (node) => {
			if (node.tagName === "img" && node.properties && node.properties.src) {
				const src = node.properties.src;

				// 检查是否来自指定域名的图片
				if (typeof src === "string" && src.includes(originalDomain)) {
					// 生成备用 URL
					const fallbackSrc = src.replace(originalDomain, fallbackDomain);

					// 添加 onerror 属性，加载失败时自动切换
					node.properties.onerror = `this.onerror=null; this.src='${fallbackSrc}';`;
				}
			}
		});
	};
}
