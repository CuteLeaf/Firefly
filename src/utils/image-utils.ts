import { coverImageConfig } from "@/config/coverImageConfig";
import { siteConfig } from "@/config/siteConfig";
import type { ImageFormat } from "@/types/config";

const { randomCoverImage } = coverImageConfig;

/**
 * 处理文章封面图
 * 当image字段为"api"时，返回带有唯一标识的API URL
 * @param image - 文章frontmatter中的image字段值
 * @param seed - 用于生成唯一URL的种子（文章id或slug）
 */
export function processCoverImageSync(
	image: string | undefined,
	seed?: string,
): string {
	if (!image || image === "") {
		return "";
	}

	if (image !== "api") {
		return image;
	}

	if (
		!randomCoverImage.enable ||
		!randomCoverImage.apis ||
		randomCoverImage.apis.length === 0
	) {
		return "";
	}

	// 根据seed生成hash，确保同一篇文章始终使用相同的API和参数
	const hash = seed
		? seed.split("").reduce((acc, char) => {
				return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
			}, 0)
		: 0;

	// 用hash确定性地选择API（同一篇文章始终选同一个API）
	const apiIndex = Math.abs(hash) % randomCoverImage.apis.length;
	let apiUrl = randomCoverImage.apis[apiIndex];

	// 添加hash参数确保每篇文章获取不同图片
	if (seed) {
		const separator = apiUrl.includes("?") ? "&" : "?";
		apiUrl = `${apiUrl}${separator}v=${Math.abs(hash)}`;
	}

	return apiUrl;
}

/**
 * 获取图片优化格式配置
 */
export function getImageFormats(): ImageFormat[] {
	const formatConfig = siteConfig.imageOptimization?.formats ?? "both";
	switch (formatConfig) {
		case "avif":
			return ["avif"];
		case "webp":
			return ["webp"];
		default:
			return ["avif", "webp"];
	}
}

/**
 * 获取图片优化质量配置
 */
export function getImageQuality(): number {
	return siteConfig.imageOptimization?.quality ?? 80;
}

/**
 * 获取图片回退格式
 */
export function getFallbackFormat(): "avif" | "webp" {
	const formatConfig = siteConfig.imageOptimization?.formats ?? "both";
	return formatConfig === "avif" ? "avif" : "webp";
}
