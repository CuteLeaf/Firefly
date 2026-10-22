/**
 * 生成网站截图URL (使用 WordPress mshots API，客户端直接加载)
 * @param url 目标网站URL
 * @param width 截图宽度，默认640
 * @param height 截图高度，默认400
 * @returns 截图URL
 */
export function generateScreenshotUrl(
	url: string,
	width = 640,
	height = 400,
): string {
	if (!url) return "";

	try {
		const encodedUrl = encodeURIComponent(url);
		return `https://s.wordpress.com/mshots/v1/${encodedUrl}?w=${width}&h=${height}`;
	} catch {
		return "";
	}
}

/**
 * 生成多种尺寸的截图URL (用于响应式图片)
 * @param url 目标网站URL
 * @returns 包含不同尺寸截图URL的对象
 */
export function generateResponsiveScreenshotUrls(url: string): {
	thumbnail: string;
	medium: string;
	large: string;
} {
	return {
		thumbnail: generateScreenshotUrl(url, 200, 150),
		medium: generateScreenshotUrl(url, 400, 300),
		large: generateScreenshotUrl(url, 640, 400),
	};
}