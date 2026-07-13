import { visit } from "unist-util-visit";

/**
 * 为文章内容中的图片添加 referrerpolicy="no-referrer"
 * 仅处理 src 主机名匹配 noReferrerDomains（支持 * 通配符）的图片。
 *
 * 站内通过 ImageWrapper.astro 渲染的图片已在构建期加了 referrerpolicy，
 * 但 Markdown 正文里的裸 <img> 不经过 ImageWrapper，故在此构建期补上，
 * 取代 Layout.astro 客户端脚本对全文档图片的首次遍历。
 *
 * @param {Object} options
 * @param {string[]} [options.domains] - 需要加 no-referrer 的域名模式列表
 * @returns {Function} rehype transformer
 */
export default function rehypeImageReferrerPolicy(options = {}) {
	const domains = options.domains || [];
	if (domains.length === 0) {
		// 无配置时返回空 transformer
		return () => {};
	}

	function matchesDomain(urlStr) {
		if (typeof urlStr !== "string" || !urlStr.startsWith("http")) return false;
		try {
			const hostname = new URL(urlStr).hostname;
			return domains.some((pattern) => {
				// 先完整转义正则元字符，再把用户写的 * 通配符还原为 .*
				const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
				const regexPattern = escaped.replace(/\\\*/g, ".*");
				return new RegExp(`^${regexPattern}$`).test(hostname);
			});
		} catch {
			return false;
		}
	}

	return (tree) => {
		visit(tree, "element", (node) => {
			if (node.tagName !== "img") return;
			if (node.properties?.referrerPolicy || node.properties?.referrerpolicy)
				return;

			const src = node.properties?.src;
			if (matchesDomain(src)) {
				node.properties.referrerPolicy = "no-referrer";
			}
		});
	};
}
