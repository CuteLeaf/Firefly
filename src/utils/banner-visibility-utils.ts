import { backgroundWallpaper, displaySettingsConfig } from "@/config";
import { getImageQuality } from "@/utils/image-utils";
import { getBackgroundImages } from "@/utils/layout-utils";

/** 文章横幅元信息（从 MainGridLayout 的 Props 提取，供组件复用） */
export interface BannerPostMeta {
	title: string;
	description?: string;
	published: Date;
	updated?: Date;
	words?: number;
	minutes?: number;
}

export interface BannerVisibilityContext {
	isHomePage: boolean;
	isPostPage: boolean;
	title?: string;
	bannerPostMeta?: BannerPostMeta;
}

export interface BannerVisibilityState {
	isBannerMode: boolean;
	isFullscreenMode: boolean;
	isOverlayMode: boolean;
	isWallpaperSwitchable: boolean;
	isBackgroundEnabled: boolean;
	hasWallpaper: boolean;
	wavesEnabledOnDesktop: boolean | undefined;
	wavesEnabledOnMobile: boolean | undefined;
	shouldRenderWaves: boolean;
	gradientEnabledOnDesktop: boolean;
	gradientEnabledOnMobile: boolean;
	shouldRenderGradient: boolean;
	gradientHeight: string;
	homeTextEnable: boolean;
	showHomeText: boolean;
	homeTextLinksEnable: boolean;
	initialRandomSubtitle: string | undefined;
	showBannerPostMeta: boolean;
	bannerPostInfoMode: "description" | "meta";
	bannerDescriptionWidth: string | undefined;
	showBannerDim: boolean;
	dimOpacity: number;
	showBannerPageTitle: boolean;
	bannerCarouselEnabledDefault: boolean;
	bannerCarouselSwitchable: boolean;
	bannerCarouselInterval: number;
	bannerCarouselEffect: string;
	hasMultipleImages: boolean;
	configQuality: number;
	mobileQuality: number;
}

/** 随机选择副标题（当打字机关闭且为数组时）；运行时内联脚本会再选一次，此处为 SSR 初始值 */
function getRandomSubtitle(): string | undefined {
	const subtitle = backgroundWallpaper.common?.homeText?.subtitle;
	if (Array.isArray(subtitle)) {
		const randomIndex = Math.floor(Math.random() * subtitle.length);
		return subtitle[randomIndex];
	}
	return subtitle;
}

/** 按字符宽度估算描述所需行数，返回合适的 em 宽度（纯文本测量，从 MainGridLayout 迁出） */
export function getBannerDescriptionWidth(
	description?: string,
): string | undefined {
	if (!description) return undefined;

	const textUnits = Array.from(description).reduce((total, character) => {
		if (/\s/u.test(character)) return total + 0.35;
		const codePoint = character.codePointAt(0) ?? 0;
		return total + (codePoint <= 0xff ? 0.55 : 1);
	}, 0);
	const maxLineUnits = 52;
	const lineCount = Math.max(1, Math.ceil(textUnits / maxLineUnits));

	if (lineCount === 1) return undefined;

	const targetLineUnits = Math.min(maxLineUnits, textUnits / (lineCount - 0.5));
	return `${Math.max(28, targetLineUnits).toFixed(1)}em`;
}

/**
 * 计算横幅 / 渐变 / 水波纹的启用状态与各类 show-* 标志（SSR，纯配置读）。
 * 从 MainGridLayout.astro 的 frontmatter 迁出，逐字保留原逻辑。
 */
export function getBannerVisibilityState(
	ctx: BannerVisibilityContext,
): BannerVisibilityState {
	const {
		isHomePage: isHomePageCheck,
		isPostPage,
		title,
		bannerPostMeta,
	} = ctx;

	const isBannerMode = backgroundWallpaper.mode === "banner";
	const isFullscreenMode = backgroundWallpaper.mode === "fullscreen";
	const isClassicFullscreenMode =
		isFullscreenMode && backgroundWallpaper.fullscreen?.layout !== "hero";
	const isOverlayMode = backgroundWallpaper.mode === "overlay";
	const isWallpaperSwitchable = displaySettingsConfig.wallpaperModeSwitchable;
	const isBackgroundEnabled =
		backgroundWallpaper.mode !== "none" || isWallpaperSwitchable;

	const wavesConfig = backgroundWallpaper.common?.waves?.enable;
	const wavesSwitchable = displaySettingsConfig.wavesSwitchable;
	const wavesEnabledOnDesktop =
		typeof wavesConfig === "object" ? wavesConfig.desktop : wavesConfig;
	const wavesEnabledOnMobile =
		typeof wavesConfig === "object" ? wavesConfig.mobile : wavesConfig;
	const shouldRenderWaves =
		wavesEnabledOnDesktop || wavesEnabledOnMobile || wavesSwitchable;

	const gradientConfig = backgroundWallpaper.common?.gradient?.enable;
	const gradientSwitchable = displaySettingsConfig.gradientSwitchable;
	const gradientEnabledOnDesktop =
		typeof gradientConfig === "object"
			? gradientConfig.desktop
			: (gradientConfig ?? true);
	const gradientEnabledOnMobile =
		typeof gradientConfig === "object"
			? gradientConfig.mobile
			: (gradientConfig ?? true);
	const gradientHeight = backgroundWallpaper.common?.gradient?.height ?? "30vh";
	const shouldRenderGradient =
		gradientEnabledOnDesktop || gradientEnabledOnMobile || gradientSwitchable;

	const homeTextEnable = backgroundWallpaper.common?.homeText?.enable ?? false;
	const showHomeText =
		(isBannerMode || isFullscreenMode) && !!homeTextEnable && isHomePageCheck;
	const homeTextLinksEnable =
		backgroundWallpaper.common?.homeText?.linksEnable !== false;

	const showBannerPostMeta =
		(isBannerMode || isWallpaperSwitchable || isClassicFullscreenMode) &&
		isBackgroundEnabled &&
		!isHomePageCheck &&
		isPostPage &&
		!!bannerPostMeta;

	const bannerPostInfoMode =
		backgroundWallpaper.banner?.postInfo?.mode ?? "description";

	const bannerDescriptionWidth = getBannerDescriptionWidth(
		bannerPostMeta?.description,
	);

	const showBannerDim =
		(isBannerMode || isFullscreenMode || isWallpaperSwitchable) &&
		isBackgroundEnabled;
	const dimOpacity = backgroundWallpaper.common?.dimOpacity ?? 0.15;

	const showBannerPageTitle =
		(isBannerMode || isWallpaperSwitchable || isClassicFullscreenMode) &&
		isBackgroundEnabled &&
		!isHomePageCheck &&
		!isPostPage &&
		!!title;

	const backgroundImages = getBackgroundImages();
	const configQuality = getImageQuality();
	const mobileQuality = Math.round(configQuality * 0.9);
	const bannerCarouselEnabledDefault =
		backgroundWallpaper.common?.carousel?.enable ?? false;
	const bannerCarouselSwitchable =
		displaySettingsConfig.bannerCarouselSwitchable;
	const bannerCarouselInterval = Math.max(
		backgroundWallpaper.common?.carousel?.interval ?? 5000,
		3000,
	);
	const bannerCarouselEffect =
		backgroundWallpaper.common?.carousel?.transitionEffect ?? "fade";
	const hasMultipleImages =
		backgroundImages.desktop.length > 1 || backgroundImages.mobile.length > 1;

	return {
		isBannerMode,
		isFullscreenMode,
		isOverlayMode,
		isWallpaperSwitchable,
		isBackgroundEnabled,
		hasWallpaper:
			isWallpaperSwitchable ||
			isBannerMode ||
			isFullscreenMode ||
			isOverlayMode,
		wavesEnabledOnDesktop,
		wavesEnabledOnMobile,
		shouldRenderWaves,
		gradientEnabledOnDesktop,
		gradientEnabledOnMobile,
		shouldRenderGradient,
		gradientHeight,
		homeTextEnable,
		showHomeText,
		homeTextLinksEnable,
		initialRandomSubtitle: getRandomSubtitle(),
		showBannerPostMeta,
		bannerPostInfoMode,
		bannerDescriptionWidth,
		showBannerDim,
		dimOpacity,
		showBannerPageTitle,
		bannerCarouselEnabledDefault,
		bannerCarouselSwitchable,
		bannerCarouselInterval,
		bannerCarouselEffect,
		hasMultipleImages,
		configQuality,
		mobileQuality,
	};
}
