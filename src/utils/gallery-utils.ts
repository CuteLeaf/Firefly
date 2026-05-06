import type { GalleryAlbum } from "@/types/config";
import { url } from "@/utils/url-utils";

function withBase(assetPath: string): string {
	if (!assetPath) return "";
	if (/^(https?:)?\/\//i.test(assetPath) || /^(data|blob):/i.test(assetPath)) {
		return assetPath;
	}
	const normalizedPath = assetPath.startsWith("/")
		? assetPath
		: `/${assetPath}`;
	const base = import.meta.env.BASE_URL || "/";
	if (base !== "/" && normalizedPath.startsWith(base)) {
		return normalizedPath;
	}
	return url(normalizedPath);
}

// Eagerly import all gallery images at build time
const galleryModules = import.meta.glob<{ default: string }>(
	"../../public/gallery/**/*.{jpg,jpeg,png,webp,avif,gif}",
	{ eager: true, query: "?url", import: "default" },
);

/**
 * Get all photo paths for an album from the pre-built glob map.
 */
export function scanAlbumPhotos(albumId: string): string[] {
	const files = Object.keys(galleryModules)
		.filter((p) => p.includes(`/${albumId}/`))
		.map((p) => {
			// Extract just the filename from the full path
			const parts = p.split("/");
			return parts[parts.length - 1];
		})
		.sort();

	// Move cover.* to the front
	const coverIdx = files.findIndex((f) => /^cover\./i.test(f));
	if (coverIdx > 0) {
		const [coverFile] = files.splice(coverIdx, 1);
		files.unshift(coverFile);
	}

	return files.map((f) => withBase(`/gallery/${albumId}/${f}`));
}

/**
 * 获取相册封面图
 * 优先级：手动指定 > cover.* 文件 > 第一张图片
 */
export function getAlbumCover(album: GalleryAlbum, photos: string[]): string {
	if (album.cover) return withBase(album.cover);
	const coverFile = photos.find((p) => /\/cover\./i.test(p));
	return coverFile || photos[0] || "";
}
