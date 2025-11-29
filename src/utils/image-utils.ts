import { coverImageConfig } from "@/config/coverImageConfig";

/**
 * 处理文章封面图
 * 当image字段为"api"时，从配置的随机图API获取图片
 * @param image - 文章frontmatter中的image字段值
 * @param seed - 用于生成随机图的种子（通常使用文章slug或id）
 * @returns 处理后的图片URL
 */
export async function processCoverImage(
	image: string | undefined,
	seed?: string,
): Promise<string> {
	// 如果image不存在或为空，直接返回
	if (!image || image === "") {
		return "";
	}

	// 如果image不是"api"，直接返回原始值
	if (image !== "api") {
		return image;
	}

	// 如果未启用随机图功能，直接返回空字符串（不显示封面，也不显示备用图）
	if (
		!coverImageConfig.enable ||
		!coverImageConfig.apis ||
		coverImageConfig.apis.length === 0
	) {
		return "";
	}

	try {
		// 随机选择一个API
		const randomApi =
			coverImageConfig.apis[
				Math.floor(Math.random() * coverImageConfig.apis.length)
			];

		// 生成seed值：使用文章slug或时间戳
		const seedValue = seed || Date.now().toString();

		// 如果API中包含{seed}占位符，替换它
		let apiUrl = randomApi.replace(/{seed}/g, seedValue);

		// 如果API中没有{seed}占位符，需要添加随机参数确保每篇文章获取不同图片
		if (!randomApi.includes("{seed}")) {
			// 将seed转换为数字hash（确保每个不同的slug产生不同的hash）
			const hash = seedValue.split("").reduce((acc, char) => {
				return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
			}, 0);

			// 添加查询参数来确保每篇文章获取不同的图片
			const separator = apiUrl.includes("?") ? "&" : "?";
			// 使用hash确保每篇文章有不同的URL（稳定且唯一，基于文章slug）
			// 注意：如果API不支持查询参数来获取不同图片，可能需要配置支持seed占位符的API
			apiUrl = `${apiUrl}${separator}v=${Math.abs(hash)}`;
		}

		// 在构建时直接返回API URL（客户端会请求）
		// 注意：如果API返回的是JSON格式，需要特殊处理
		return apiUrl;
	} catch (error) {
		console.warn("Failed to process random image API:", error);
		// 即使出错，如果enable为false也不返回fallback，直接返回空字符串
		if (!coverImageConfig.enable) {
			return "";
		}
		return coverImageConfig.fallback || "";
	}
}

/**
 * 同步版本（用于不需要异步的场景）
 * 当image字段为"api"时，返回第一个API URL，客户端会依次尝试所有API
 */
export function processCoverImageSync(
	image: string | undefined,
	seed?: string,
): string {
	// 如果image不存在或为空，直接返回
	if (!image || image === "") {
		return "";
	}

	// 如果image不是"api"，直接返回原始值
	if (image !== "api") {
		return image;
	}

	// 如果未启用随机图功能，直接返回空字符串（不显示封面，也不显示备用图）
	if (
		!coverImageConfig.enable ||
		!coverImageConfig.apis ||
		coverImageConfig.apis.length === 0
	) {
		return "";
	}

	try {
		// 返回第一个API，客户端脚本会依次尝试所有API
		const firstApi = coverImageConfig.apis[0];

		// 生成seed值：使用文章slug或时间戳
		const seedValue = seed || Date.now().toString();

		// 如果API中包含{seed}占位符，替换它
		let apiUrl = firstApi.replace(/{seed}/g, seedValue);

		// 如果API中没有{seed}占位符，需要添加随机参数确保每篇文章获取不同图片
		if (!firstApi.includes("{seed}")) {
			// 将seed转换为数字hash（确保每个不同的slug产生不同的hash）
			const hash = seedValue.split("").reduce((acc, char) => {
				return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
			}, 0);

			// 添加查询参数来确保每篇文章获取不同的图片
			const separator = apiUrl.includes("?") ? "&" : "?";
			// 使用hash确保每篇文章有不同的URL（稳定且唯一，基于文章slug）
			// 注意：如果API不支持查询参数来获取不同图片，可能需要配置支持seed占位符的API
			apiUrl = `${apiUrl}${separator}v=${Math.abs(hash)}`;
		}

		return apiUrl;
	} catch (error) {
		console.warn("Failed to process random image API:", error);
		// 即使出错，如果enable为false也不返回fallback，直接返回空字符串
		if (!coverImageConfig.enable) {
			return "";
		}
		return coverImageConfig.fallback || "";
	}
}

/**
 * 生成所有API URL列表（用于客户端重试）
 */
export function generateApiUrls(seed?: string): string[] {
	if (
		!coverImageConfig.enable ||
		!coverImageConfig.apis ||
		coverImageConfig.apis.length === 0
	) {
		return [];
	}

	const seedValue = seed || Date.now().toString();
	const hash = seedValue.split("").reduce((acc, char) => {
		return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
	}, 0);

	return coverImageConfig.apis.map((api) => {
		let apiUrl = api.replace(/{seed}/g, seedValue);

		if (!api.includes("{seed}")) {
			const separator = apiUrl.includes("?") ? "&" : "?";
			apiUrl = `${apiUrl}${separator}v=${Math.abs(hash)}`;
		}

		return apiUrl;
	});
}
