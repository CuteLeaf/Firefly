import { siteConfig } from "../config";

// 背景图片处理工具函数
export const getBackgroundImages = () => {
	const bgSrc = siteConfig.backgroundWallpaper.src;

	if (
		typeof bgSrc === "object" &&
		bgSrc !== null &&
		!Array.isArray(bgSrc) &&
		("desktop" in bgSrc || "mobile" in bgSrc)
	) {
		const srcObj = bgSrc as {
			desktop?: string | string[];
			mobile?: string | string[];
		};
		return {
			desktop: srcObj.desktop || srcObj.mobile || "",
			mobile: srcObj.mobile || srcObj.desktop || "",
		};
	}
	// 如果是字符串，同时用于桌面端和移动端
	return {
		desktop: bgSrc,
		mobile: bgSrc,
	};
};

// 类型守卫函数
export const isBannerSrcObject = (
	src:
		| string
		| string[]
		| { desktop?: string | string[]; mobile?: string | string[] },
): src is { desktop?: string | string[]; mobile?: string | string[] } => {
	return (
		typeof src === "object" &&
		src !== null &&
		!Array.isArray(src) &&
		("desktop" in src || "mobile" in src)
	);
};

// 获取默认背景图片
export const getDefaultBackground = (): string => {
	const src = siteConfig.backgroundWallpaper.src;
	if (typeof src === "string") {
		return src;
	}
	if (src && typeof src === "object" && !Array.isArray(src)) {
		// 优先使用desktop，如果没有则使用mobile
		const desktopSrc = src.desktop;
		const mobileSrc = src.mobile;
		if (typeof desktopSrc === "string") {
			return desktopSrc;
		}
		if (typeof mobileSrc === "string") {
			return mobileSrc;
		}
	}
	return "";
};

// 检查是否为首页
export const isHomePage = (pathname: string): boolean => {
	// 获取 base URL
	const baseUrl = import.meta.env.BASE_URL || "/";

	// 标准化路径：移除 base URL 前缀
	const normalizedPath = pathname.replace(baseUrl, "/");

	// 检查是否为根路径
	return normalizedPath === "/" || normalizedPath === "";
};

// 获取横幅偏移量
export const getBannerOffset = (position = "center") => {
	const bannerOffsetByPosition = {
		top: "100vh",
		center: "50vh",
		bottom: "0",
	};
	return (
		bannerOffsetByPosition[position as keyof typeof bannerOffsetByPosition] ||
		"50vh"
	);
};
