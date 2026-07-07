// LQIP 方案来源: https://blog.cosine.ren/post/astro-lqip-implementation

import lqipData from "@constants/lqips.json";

const lqips: Record<string, string> = lqipData as Record<string, string>;

const DEFAULT_GRADIENT =
	"linear-gradient(135deg, #d6d3d1 0%, #a8a29e 50%, #d6d3d1 100%)";

function normalizePath(p: string): string {
	return p.replace(/\/\.\//g, "/").replace(/\/+/g, "/");
}

/**
 * 将 LQIP 紧凑格式（18 字符 hex）解码为 CSS 线性渐变
 * 格式：6e3b38ae7472af7574 → linear-gradient(135deg, #6e3b38 0%, #ae7472 50%, #af7574 100%)
 */
export function getLqipGradient(
	src: string,
	basePath?: string,
	isPublic?: boolean,
): string | undefined {
	if (isPublic) {
		const relativePath = src.replace(/^\//, "");
		const compact = lqips[`public:${relativePath}`] || lqips[relativePath];
		if (compact?.length !== 18) return undefined;
		const c1 = `#${compact.slice(0, 6)}`;
		const c2 = `#${compact.slice(6, 12)}`;
		const c3 = `#${compact.slice(12, 18)}`;
		return `linear-gradient(135deg, ${c1} 0%, ${c2} 50%, ${c3} 100%)`;
	}

	const fullPath = basePath ? normalizePath(`${basePath}/${src}`) : src;
	const compact =
		lqips[`src:${fullPath}`] ||
		lqips[`src:${src}`] ||
		lqips[fullPath] ||
		lqips[src];
	if (compact?.length !== 18) return undefined;

	const c1 = `#${compact.slice(0, 6)}`;
	const c2 = `#${compact.slice(6, 12)}`;
	const c3 = `#${compact.slice(12, 18)}`;
	return `linear-gradient(135deg, ${c1} 0%, ${c2} 50%, ${c3} 100%)`;
}

/** 判断是否为外部图片 */
export function isExternalImage(src: string): boolean {
	return (
		src.startsWith("http://") ||
		src.startsWith("https://") ||
		src.startsWith("data:")
	);
}

/** 获取 LQIP 内联样式 */
export function getLqipStyle(
	src: string,
	basePath?: string,
	isPublic?: boolean,
): string | undefined {
	if (isExternalImage(src)) return undefined;

	let compact: string | undefined;
	if (isPublic) {
		const relativePath = src.replace(/^\//, "");
		compact = lqips[`public:${relativePath}`] || lqips[relativePath];
	} else {
		const fullPath = basePath ? normalizePath(`${basePath}/${src}`) : src;
		compact =
			lqips[`src:${fullPath}`] ||
			lqips[`src:${src}`] ||
			lqips[fullPath] ||
			lqips[src];
	}

	if (!compact) return undefined;

	// Check if it's the new base64 image LQIP format
	if (compact.startsWith("data:image/")) {
		return `background-image: url(${compact})`;
	}

	// Fallback to old 18-char hex gradient format
	if (compact.length === 18) {
		const gradient = getLqipGradient(src, basePath, isPublic);
		return gradient ? `background: ${gradient}` : undefined;
	}

	return undefined;
}

/** 获取 LQIP props（用于 Astro 组件），外部图片自动降级 */
export function getLqipProps(
	src: string,
	basePath?: string,
	isPublic?: boolean,
): { style: string } {
	if (isExternalImage(src)) return { style: "background: var(--muted)" };
	const style = getLqipStyle(src, basePath, isPublic);
	return { style: style || `background: ${DEFAULT_GRADIENT}` };
}
