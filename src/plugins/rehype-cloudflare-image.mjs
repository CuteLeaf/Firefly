import { visit } from "unist-util-visit";

/**
 * Cloudflare Images 响应式图片优化插件
 *
 * 将指定域名（默认 img.mckero.com）的图片改写为 Cloudflare Image Transformations
 * 的 /cdn-cgi/image/ 形式，并自动生成多档 srcset，按浏览器宽度自适应。
 *
 * 非该域名的图片仅补充 lazy / async 属性，不做改写。
 */

// 需要走 Cloudflare 图片转换的域名
const CF_IMAGE_HOST = "img.mckero.com";

// 生成的响应式宽度档位（单位 px）
const WIDTHS = [500, 800, 1200, 1600];

// 默认展示宽度对应的 src 档位
const DEFAULT_WIDTH = 800;

export function rehypeCloudflareImage() {
	return (tree) => {
		visit(tree, "element", (node) => {
			// 只处理有属性的 img
			if (node.tagName !== "img" || !node.properties) return;

			const src = node.properties.src;
			if (typeof src !== "string" || src.length === 0) return;

			// 解析 URL，解析失败则按普通图片处理
			let urlObj;
			try {
				urlObj = new URL(src);
			} catch {
				node.properties.loading = "lazy";
				node.properties.decoding = "async";
				return;
			}

			// 非目标域名：仅补充 loading/decoding
			if (urlObj.hostname !== CF_IMAGE_HOST) {
				node.properties.loading = "lazy";
				node.properties.decoding = "async";
				return;
			}

			const generateCdnUrl = (targetWidth) => {
				const options = `width=${targetWidth},format=auto,quality=80`;
				return `https://${CF_IMAGE_HOST}/cdn-cgi/image/${options}${urlObj.pathname}`;
			};

			node.properties.src = generateCdnUrl(DEFAULT_WIDTH);
			node.properties.srcset = WIDTHS.map(
				(w) => `${generateCdnUrl(w)} ${w}w`,
			).join(", ");
			node.properties.sizes = "(max-width: 600px) 100vw, 800px";
			node.properties.loading = "lazy";
			node.properties.decoding = "async";
		});
	};
}
