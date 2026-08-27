import * as path from "node:path";
import type { ImageMetadata } from "astro";
import { profileConfig } from "@/config/profileConfig";
import { siteConfig } from "@/config/siteConfig";
import { defaultFavicons } from "@/constants/icon";
import { url } from "./url-utils";

// 构建期一次性收集 src 下的图片资源，用于把 src 相对路径解析成 Astro 构建后的真实 URL。
// 本模块只被服务端 .astro 组件导入（构建期），不要被客户端 .svelte 引用，
// 否则会把 import.meta.glob（Vite 构建期特性）连带进客户端 bundle。
const projectImages = import.meta.glob<ImageMetadata>(
	"/src/**/*.{png,jpg,jpeg,webp,avif,gif,svg}",
	{ import: "default" },
);

// 查找 src 内相对路径对应的 ImageMetadata；找不到返回 null。
async function loadLocalImage(
	src: string,
	basePath: string,
): Promise<ImageMetadata | null> {
	const rel = src.replace(/^\.\//, "");
	const full = path
		.normalize(path.join(basePath || "", rel))
		.replace(/\\/g, "/");
	const key = `/src/${full}`;
	const loader = projectImages[key];
	if (!loader) {
		console.error(
			`[schema-image] 图片资源未找到: ${key}（src="${src}", basePath="${basePath}"）`,
		);
		return null;
	}
	return loader();
}

/**
 * 把文章封面 / 头像等图片源解析为绝对 URL + 宽高（用于 Article image / Person.image 的 ImageObject）。
 * - public(/...)、远程、data: 直接返回（无宽高信息）；
 * - src 内相对路径：用源图 img.src（Astro 已复制的源资产真实 URL），不再额外 getImage 生成优化图，
 *   避免多产出未使用的源副产物/优化变体。
 */
export async function toAbsoluteImageInfo(
	src: string | undefined | null,
	basePath: string,
	base: URL | string,
): Promise<{ url: string; width?: number; height?: number } | null> {
	if (!src) return null;
	if (
		src.startsWith("http://") ||
		src.startsWith("https://") ||
		src.startsWith("//") ||
		src.startsWith("data:")
	) {
		return { url: src };
	}
	if (src.startsWith("/")) {
		return { url: new URL(url(src), base).toString() };
	}
	return getLocalImageInfo(src, basePath, base);
}

/**
 * 把文章封面 / 头像等图片源解析为绝对 URL。
 * - public(/...)、远程、data: 直接按原样解析（与主题渲染一致，无需优化）；
 * - src 内相对路径：用源图 img.src 的真实 URL。
 */
export async function toAbsoluteImageUrl(
	src: string | undefined | null,
	basePath: string,
	base: URL | string,
): Promise<string | null> {
	return (await toAbsoluteImageInfo(src, basePath, base))?.url ?? null;
}

// 返回本地图片 src 的绝对 URL + 元数据宽高（源图 img.src 指向 Astro 复制的真实源资产）
async function getLocalImageInfo(
	src: string,
	basePath: string,
	base: URL | string,
): Promise<{ url: string; width: number; height: number } | null> {
	const img = await loadLocalImage(src, basePath);
	if (!img) return null;
	return {
		url: new URL(url(img.src), base).toString(),
		width: img.width,
		height: img.height,
	};
}

/**
 * 作者头像绝对 URL（Person.image / ProfilePage 用）。
 * 固定用 profileConfig.avatar + basePath=""（相对 src/）。
 */
export async function getAuthorAvatarUrl(): Promise<string | null> {
	return toAbsoluteImageUrl(profileConfig.avatar, "", siteConfig.site_url);
}

// 解析 favicon 的 sizes（如 "192x192"）为宽高
function parseSizes(sizes?: string): { width: number; height: number } | null {
	if (!sizes) return null;
	const m = sizes.match(/^(\d+)x(\d+)$/);
	return m ? { width: Number(m[1]), height: Number(m[2]) } : null;
}

// 用站点 favicon 作为 publisher logo 兜底（Google org logo 偏好 raster：png/jpg/gif）
async function getFaviconAsLogo(): Promise<{
	url: string;
	width?: number;
	height?: number;
} | null> {
	const candidates = [...(siteConfig.favicon || []), ...defaultFavicons];
	if (candidates.length === 0) return null;

	// 解析每个 favicon 的尺寸并挑最大的 raster（png/jpg/gif）作为 publisher logo
	const areas = candidates.map((f) => {
		const d = parseSizes(f.sizes);
		return {
			f,
			w: d?.width ?? 0,
			h: d?.height ?? 0,
			raster: /\.(png|jpe?g|gif)$/i.test(f.src),
		};
	});
	const rasters = areas.filter((c) => c.raster);
	rasters.sort((a, b) => b.w * b.h - a.w * a.h);
	// 优先取最大 raster；若无 raster（纯 .ico/.svg），则取面积最大的那个
	const favicon =
		rasters[0]?.f ||
		[...areas].sort((a, b) => b.w * b.h - a.w * a.h)[0]?.f ||
		candidates[0];
	if (!favicon) return null;

	let logoUrl: string | null;
	if (/^https?:|^\/\//.test(favicon.src) || favicon.src.startsWith("data:")) {
		logoUrl = favicon.src;
	} else if (favicon.src.startsWith("/")) {
		logoUrl = new URL(url(favicon.src), siteConfig.site_url).toString();
	} else {
		logoUrl = await toAbsoluteImageUrl(favicon.src, "", siteConfig.site_url);
	}
	if (!logoUrl) return null;

	const dims = parseSizes(favicon.sizes);
	return {
		url: logoUrl,
		...(dims ? { width: dims.width, height: dims.height } : {}),
	};
}

// 缓存站点 publisher logo 解析结果（构建期静态，只解析一次）
let _siteLogoPromise:
	| Promise<{
			url: string;
			width?: number;
			height?: number;
	  } | null>
	| undefined;

/**
 * 站点 publisher 的 logo（Organization.logo）。
 * 优先用 siteConfig.navbar.logo（主题真实 logo，image / url 类型）；
 * 若 navbar 用图标库 icon（无图片 URL）或未配置，则回退到站点 favicon。
 */
export function getSiteLogo(): Promise<{
	url: string;
	width?: number;
	height?: number;
} | null> {
	if (!_siteLogoPromise) {
		_siteLogoPromise = computeSiteLogo();
	}
	return _siteLogoPromise;
}

async function computeSiteLogo(): Promise<{
	url: string;
	width?: number;
	height?: number;
} | null> {
	const logo = siteConfig.navbar?.logo;
	if (logo) {
		if (logo.type === "url") return { url: logo.value };
		if (logo.type === "image") {
			const info = await getLocalImageInfo(logo.value, "", siteConfig.site_url);
			return info
				? { url: info.url, width: info.width, height: info.height }
				: null;
		}
		// icon 类型无图片 URL → 落到 favicon 兜底
	}
	return getFaviconAsLogo();
}
