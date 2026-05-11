<script lang="ts">
import {
	WALLPAPER_BANNER,
	WALLPAPER_FULLSCREEN,
	WALLPAPER_NONE,
	WALLPAPER_OVERLAY,
} from "@constants/constants";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import {
	getDefaultBannerCarouselEnabled,
	getDefaultBannerTitleEnabled,
	getDefaultGradientEnabled,
	getDefaultHue,
	getDefaultOverlayBlur,
	getDefaultOverlayCardOpacity,
	getDefaultOverlayOpacity,
	getDefaultSakuraEnabled,
	getDefaultWavesEnabled,
	getHue,
	getStoredBannerCarouselEnabled,
	getStoredBannerTitleEnabled,
	getStoredGradientEnabled,
	getStoredOverlayBlur,
	getStoredOverlayCardOpacity,
	getStoredOverlayOpacity,
	getStoredSakuraEnabled,
	getStoredWallpaperMode,
	getStoredWavesEnabled,
	setBannerCarouselEnabled,
	setBannerTitleEnabled,
	setGradientEnabled,
	setHue,
	setOverlayBlur,
	setOverlayCardOpacity,
	setOverlayOpacity,
	setSakuraEnabled,
	setWallpaperMode,
	setWavesEnabled,
} from "@utils/setting-utils";
import { onMount } from "svelte";
import Icon from "@/components/common/Icon.svelte";
import { backgroundWallpaper, sakuraConfig, siteConfig } from "@/config";
import type { WALLPAPER_MODE } from "@/types/config";

type OverlaySliderItem = {
	key: "opacity" | "blur" | "cardOpacity";
	enabled: boolean;
	label: string;
	displayValue: string;
	ariaLabel: string;
	min: number;
	max: number;
	step: number;
	value: number;
	onValueChange: (value: number) => void;
};

let hue = $state(getHue());
const defaultHue = getDefaultHue();
let wallpaperMode: WALLPAPER_MODE = $state(backgroundWallpaper.mode);
const defaultWallpaperMode = backgroundWallpaper.mode;
let currentLayout: "list" | "grid" = $state("list");
const defaultLayout = siteConfig.postListLayout.defaultMode;
const mobileDefaultLayout =
	siteConfig.postListLayout.mobileDefaultMode || defaultLayout;
let mounted = $state(false);
let isSmallScreen = $state(
	typeof window !== "undefined" ? window.innerWidth < 1200 : false,
);
let isMobileWidth = $state(
	typeof window !== "undefined" ? window.innerWidth < 780 : false,
);
let isSwitching = $state(false);
let wavesEnabled = $state(true);
const defaultWavesEnabled = getDefaultWavesEnabled();
let gradientEnabled = $state(true);
const defaultGradientEnabled = getDefaultGradientEnabled();
let bannerTitleEnabled = $state(true);
const defaultBannerTitleEnabled = getDefaultBannerTitleEnabled();
let bannerCarouselEnabled = $state(true);
const defaultBannerCarouselEnabled = getDefaultBannerCarouselEnabled();
let sakuraEnabled = $state(true);
const defaultSakuraEnabled = getDefaultSakuraEnabled();
let overlayOpacity = $state(getDefaultOverlayOpacity());
const defaultOverlayOpacity = getDefaultOverlayOpacity();
let overlayBlur = $state(getDefaultOverlayBlur());
const defaultOverlayBlur = getDefaultOverlayBlur();
let overlayCardOpacity = $state(getDefaultOverlayCardOpacity());
const defaultOverlayCardOpacity = getDefaultOverlayCardOpacity();

const isWallpaperSwitchable = backgroundWallpaper.switchable ?? true;
const allowLayoutSwitch = siteConfig.postListLayout.allowSwitch;
let effectiveDefaultLayout = $derived(
	isMobileWidth ? mobileDefaultLayout : defaultLayout,
);
const showThemeColor = !siteConfig.themeColor.fixed;
// 是否允许用户切换水波纹动画（只看 switchable 配置）
const isWavesSwitchable =
	backgroundWallpaper.common?.waves?.switchable ?? false;
// 是否允许用户切换渐变过渡（只看 switchable 配置）
const isGradientSwitchable =
	backgroundWallpaper.common?.gradient?.switchable ?? false;
// 检查是否启用横幅标题配置
const isBannerTitleEnabled =
	backgroundWallpaper.common?.homeText?.enable ?? false;
// 是否允许用户切换横幅标题
const isBannerTitleSwitchable =
	isBannerTitleEnabled &&
	(backgroundWallpaper.common?.homeText?.switchable ?? false);
// 是否允许用户切换横幅轮播
const isBannerCarouselSwitchable =
	backgroundWallpaper.banner?.carousel?.switchable ?? false;
// 是否允许用户切换樱花特效
const isSakuraSwitchable = sakuraConfig?.switchable ?? false;
// 是否有任何横幅设置可显示（后续添加新设置时在此处添加条件）
const hasBannerSettings =
	isWavesSwitchable ||
	isGradientSwitchable ||
	isBannerTitleSwitchable ||
	isBannerCarouselSwitchable;
const overlaySwitchableConfig =
	backgroundWallpaper.overlay?.switchable ?? false;
const isOverlaySettingsSwitchable =
	typeof overlaySwitchableConfig === "boolean" ? overlaySwitchableConfig : true;
const isOverlayOpacitySwitchable =
	typeof overlaySwitchableConfig === "boolean"
		? overlaySwitchableConfig
		: (overlaySwitchableConfig.opacity ?? false);
const isOverlayBlurSwitchable =
	typeof overlaySwitchableConfig === "boolean"
		? overlaySwitchableConfig
		: (overlaySwitchableConfig.blur ?? false);
const isOverlayCardOpacitySwitchable =
	typeof overlaySwitchableConfig === "boolean"
		? overlaySwitchableConfig
		: (overlaySwitchableConfig.cardOpacity ?? false);
const hasOverlaySettings =
	isOverlaySettingsSwitchable &&
	(isOverlayOpacitySwitchable ||
		isOverlayBlurSwitchable ||
		isOverlayCardOpacitySwitchable);
let overlaySettingsIsDefault = $derived(
	(!isOverlayOpacitySwitchable || overlayOpacity === defaultOverlayOpacity) &&
		(!isOverlayBlurSwitchable || overlayBlur === defaultOverlayBlur) &&
		(!isOverlayCardOpacitySwitchable ||
			overlayCardOpacity === defaultOverlayCardOpacity),
);
// 横幅设置是否全部为默认值（用于控制恢复默认按钮的显隐）
let bannerSettingsIsDefault = $derived(
	(!isBannerTitleSwitchable ||
		bannerTitleEnabled === defaultBannerTitleEnabled) &&
		(!isWavesSwitchable || wavesEnabled === defaultWavesEnabled) &&
		(!isGradientSwitchable || gradientEnabled === defaultGradientEnabled) &&
		(!isBannerCarouselSwitchable ||
			bannerCarouselEnabled === defaultBannerCarouselEnabled),
);
const hasAnyContent =
	showThemeColor ||
	isWallpaperSwitchable ||
	allowLayoutSwitch ||
	hasBannerSettings ||
	hasOverlaySettings ||
	isSakuraSwitchable;

let overlaySliderItems = $derived<OverlaySliderItem[]>([
	{
		key: "opacity",
		enabled: isOverlayOpacitySwitchable,
		label: i18n(I18nKey.overlayOpacity),
		displayValue: `${Math.round(overlayOpacity * 100)}%`,
		ariaLabel: i18n(I18nKey.overlayOpacity),
		min: 20,
		max: 100,
		step: 1,
		value: Math.round(overlayOpacity * 100),
		onValueChange: (value) => {
			overlayOpacity = value / 100;
		},
	},
	{
		key: "blur",
		enabled: isOverlayBlurSwitchable,
		label: i18n(I18nKey.overlayBlur),
		displayValue: `${overlayBlur.toFixed(1)}px`,
		ariaLabel: i18n(I18nKey.overlayBlur),
		min: 0,
		max: 20,
		step: 0.5,
		value: overlayBlur,
		onValueChange: (value) => {
			overlayBlur = value;
		},
	},
	{
		key: "cardOpacity",
		enabled: isOverlayCardOpacitySwitchable,
		label: i18n(I18nKey.overlayCardOpacity),
		displayValue: `${Math.round(overlayCardOpacity * 100)}%`,
		ariaLabel: i18n(I18nKey.overlayCardOpacity),
		min: 20,
		max: 100,
		step: 1,
		value: Math.round(overlayCardOpacity * 100),
		onValueChange: (value) => {
			overlayCardOpacity = value / 100;
		},
	},
]);

function resetHue() {
	hue = getDefaultHue();
	requestAnimationFrame(refreshAllRangeProgress);
}

function resetWallpaperMode() {
	wallpaperMode = defaultWallpaperMode;
	setWallpaperMode(defaultWallpaperMode);
}

function resetLayout() {
	currentLayout = effectiveDefaultLayout;
	localStorage.removeItem("postListLayout");

	// 触发自定义事件，通知页面布局已改变
	const event = new CustomEvent("layoutChange", {
		detail: { layout: effectiveDefaultLayout },
	});
	window.dispatchEvent(event);
}

function resetWavesEnabled() {
	wavesEnabled = defaultWavesEnabled;
	setWavesEnabled(defaultWavesEnabled);
}

function resetGradientEnabled() {
	gradientEnabled = defaultGradientEnabled;
	setGradientEnabled(defaultGradientEnabled);
}

function resetBannerSettings() {
	if (
		isBannerTitleSwitchable &&
		bannerTitleEnabled !== defaultBannerTitleEnabled
	) {
		bannerTitleEnabled = defaultBannerTitleEnabled;
		setBannerTitleEnabled(defaultBannerTitleEnabled);
	}
	if (isWavesSwitchable && wavesEnabled !== defaultWavesEnabled) {
		wavesEnabled = defaultWavesEnabled;
		setWavesEnabled(defaultWavesEnabled);
	}
	if (isGradientSwitchable && gradientEnabled !== defaultGradientEnabled) {
		gradientEnabled = defaultGradientEnabled;
		setGradientEnabled(defaultGradientEnabled);
	}
	if (
		isBannerCarouselSwitchable &&
		bannerCarouselEnabled !== defaultBannerCarouselEnabled
	) {
		bannerCarouselEnabled = defaultBannerCarouselEnabled;
		setBannerCarouselEnabled(defaultBannerCarouselEnabled);
	}
}

function resetOverlaySettings() {
	if (isOverlayOpacitySwitchable && overlayOpacity !== defaultOverlayOpacity) {
		overlayOpacity = defaultOverlayOpacity;
		setOverlayOpacity(defaultOverlayOpacity);
	}
	if (isOverlayBlurSwitchable && overlayBlur !== defaultOverlayBlur) {
		overlayBlur = defaultOverlayBlur;
		setOverlayBlur(defaultOverlayBlur);
	}
	if (
		isOverlayCardOpacitySwitchable &&
		overlayCardOpacity !== defaultOverlayCardOpacity
	) {
		overlayCardOpacity = defaultOverlayCardOpacity;
		setOverlayCardOpacity(defaultOverlayCardOpacity);
	}

	requestAnimationFrame(refreshAllRangeProgress);
}

function toggleWavesEnabled() {
	wavesEnabled = !wavesEnabled;
	setWavesEnabled(wavesEnabled);
}

function toggleGradientEnabled() {
	gradientEnabled = !gradientEnabled;
	setGradientEnabled(gradientEnabled);
}

function toggleBannerTitleEnabled() {
	bannerTitleEnabled = !bannerTitleEnabled;
	setBannerTitleEnabled(bannerTitleEnabled);
}

function toggleBannerCarouselEnabled() {
	bannerCarouselEnabled = !bannerCarouselEnabled;
	setBannerCarouselEnabled(bannerCarouselEnabled);
}

function toggleSakuraEnabled() {
	sakuraEnabled = !sakuraEnabled;
	setSakuraEnabled(sakuraEnabled);
}

function switchWallpaperMode(newMode: WALLPAPER_MODE) {
	wallpaperMode = newMode;
	setWallpaperMode(newMode);
	window.scrollTo({ top: 0 });

	if (newMode === WALLPAPER_OVERLAY) {
		requestAnimationFrame(refreshAllRangeProgress);
	}
}

function checkScreenSize() {
	isSmallScreen = window.innerWidth < 1200;
	isMobileWidth = window.innerWidth < 780;
	// 低于380px强制网格模式
	if (window.innerWidth < 380 && currentLayout === "list") {
		currentLayout = "grid";
		const event = new CustomEvent("layoutChange", {
			detail: { layout: "grid" },
		});
		window.dispatchEvent(event);
	}
}

function updateRangeProgress(input: HTMLInputElement) {
	const min = Number(input.min || 0);
	const max = Number(input.max || 100);
	const value = Number(input.value || 0);
	const progress = ((value - min) * 100) / (max - min || 1);
	input.style.setProperty(
		"--range-progress",
		`${Math.min(100, Math.max(0, progress))}%`,
	);
}

function refreshAllRangeProgress() {
	const panel = document.getElementById("display-setting");
	if (!panel) return;

	const rangeInputs = Array.from(
		panel.querySelectorAll('input[type="range"]'),
	) as HTMLInputElement[];

	rangeInputs.forEach((input) => {
		updateRangeProgress(input);
	});
}

function switchLayout() {
	if (!mounted || isSwitching) return;

	isSwitching = true;
	currentLayout = currentLayout === "list" ? "grid" : "list";
	localStorage.setItem("postListLayout", currentLayout);

	// 触发自定义事件，通知页面布局已改变
	const event = new CustomEvent("layoutChange", {
		detail: { layout: currentLayout },
	});
	window.dispatchEvent(event);

	// 动画完成后重置状态
	setTimeout(() => {
		isSwitching = false;
	}, 500);
}

onMount(() => {
	mounted = true;
	checkScreenSize();

	// 从localStorage读取保存的壁纸模式
	wallpaperMode = getStoredWallpaperMode();

	// 从localStorage读取水波纹动画状态
	wavesEnabled = getStoredWavesEnabled();

	// 从localStorage读取渐变过渡状态
	gradientEnabled = getStoredGradientEnabled();

	// 从localStorage读取横幅标题状态
	bannerTitleEnabled = getStoredBannerTitleEnabled();

	// 从localStorage读取横幅轮播状态
	bannerCarouselEnabled = getStoredBannerCarouselEnabled();

	// 从localStorage读取樱花特效状态
	sakuraEnabled = getStoredSakuraEnabled();

	// 从localStorage读取全屏透明设置状态
	overlayOpacity = getStoredOverlayOpacity();
	overlayBlur = getStoredOverlayBlur();
	overlayCardOpacity = getStoredOverlayCardOpacity();

	// 从localStorage读取用户偏好布局
	const savedLayout = localStorage.getItem("postListLayout");
	if (savedLayout && (savedLayout === "list" || savedLayout === "grid")) {
		currentLayout = savedLayout;
	} else {
		currentLayout =
			window.innerWidth < 780 ? mobileDefaultLayout : defaultLayout;
	}

	// 监听窗口大小变化
	window.addEventListener("resize", checkScreenSize);

	return () => {
		window.removeEventListener("resize", checkScreenSize);
	};
});

// 监听布局变化事件
onMount(() => {
	const handleCustomEvent = (event: Event) => {
		const customEvent = event as CustomEvent<{ layout: "list" | "grid" }>;
		currentLayout = customEvent.detail.layout;
	};

	window.addEventListener("layoutChange", handleCustomEvent);

	return () => {
		window.removeEventListener("layoutChange", handleCustomEvent);
	};
});

onMount(() => {
	const panel = document.getElementById("display-setting");
	if (!panel) return;

	const handleRangeInput = (event: Event) => {
		const target = event.target;
		if (target instanceof HTMLInputElement && target.type === "range") {
			updateRangeProgress(target);
		}
	};

	refreshAllRangeProgress();
	panel.addEventListener("input", handleRangeInput);

	return () => {
		panel.removeEventListener("input", handleRangeInput);
	};
});

onMount(() => {
	const handleWallpaperModeChange = (event: Event) => {
		const customEvent = event as CustomEvent<{ mode: WALLPAPER_MODE }>;
		wallpaperMode = customEvent.detail.mode;
	};

	window.addEventListener("wallpaperModeChange", handleWallpaperModeChange);

	return () => {
		window.removeEventListener(
			"wallpaperModeChange",
			handleWallpaperModeChange,
		);
	};
});

$effect(() => {
	if (hue || hue === 0) {
		setHue(hue);
	}
});

$effect(() => {
	if (wallpaperMode === WALLPAPER_OVERLAY) {
		if (isOverlayOpacitySwitchable) {
			setOverlayOpacity(overlayOpacity);
		}
		if (isOverlayBlurSwitchable) {
			setOverlayBlur(overlayBlur);
		}
		if (isOverlayCardOpacitySwitchable) {
			setOverlayCardOpacity(overlayCardOpacity);
		}
	}
});
</script>

{#if hasAnyContent}
<div id="display-setting" class="float-panel float-panel-closed absolute transition-all w-80 right-4 px-4 py-2">
    <!-- Theme Color Section -->
    {#if showThemeColor}
    <div class="mt-2 mb-2">
        <div class="flex flex-row gap-2 mb-2 items-center justify-between">
            <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
                before:w-1 before:h-4 before:rounded-md before:bg-(--primary)
                before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2"
            >
                {i18n(I18nKey.themeColor)}
                <button aria-label="Reset to Default" class="btn-regular w-7 h-7 rounded-md  active:scale-90"
                        class:opacity-0={hue === defaultHue} class:pointer-events-none={hue === defaultHue} onclick={resetHue}>
                    <div class="text-(--btn-content)">
                        <Icon icon="fa7-solid:arrow-rotate-left" class="text-[0.875rem]"></Icon>
                    </div>
                </button>
            </div>
            <div class="flex gap-1">
                <div id="hueValue" class="transition bg-(--btn-regular-bg) w-10 h-7 rounded-md flex justify-center
                font-bold text-sm items-center text-(--btn-content)">
                    {hue}
                </div>
            </div>
        </div>
        <div class="w-full h-6 px-1 bg-[oklch(0.80_0.10_0)] dark:bg-[oklch(0.70_0.10_0)] rounded select-none">
            <input aria-label={i18n(I18nKey.themeColor)} type="range" min="0" max="360" bind:value={hue}
                   class="slider" id="colorSlider" step="5" style="width: 100%">
        </div>
    </div>
    {/if}

    <!-- Wallpaper Mode Section -->
    {#if isWallpaperSwitchable}
        <div class="mt-2 mb-2">
            <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3 mb-2
                before:w-1 before:h-4 before:rounded-md before:bg-(--primary)
                before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2"
            >
                {i18n(I18nKey.wallpaperMode)}
                <button aria-label="Reset to Default" class="btn-regular w-7 h-7 rounded-md  active:scale-90"
                        class:opacity-0={wallpaperMode === defaultWallpaperMode} class:pointer-events-none={wallpaperMode === defaultWallpaperMode} onclick={resetWallpaperMode}>
                    <div class="text-(--btn-content)">
                        <Icon icon="fa7-solid:arrow-rotate-left" class="text-[0.875rem]"></Icon>
                    </div>
                </button>
            </div>
            <div class="flex gap-2">
                <button
                    class="flex-1 btn-regular rounded-md py-2 px-3 flex items-center justify-center gap-2 active:scale-95 transition-all relative overflow-hidden"
                    class:opacity-60={wallpaperMode !== WALLPAPER_BANNER}
                    class:bg-(--btn-regular-bg-hover)={wallpaperMode === WALLPAPER_BANNER}
                    onclick={() => switchWallpaperMode(WALLPAPER_BANNER)}
                >
                    <Icon icon="material-symbols:image-outline" class="text-[1.25rem] shrink-0"></Icon>
                    <span class="text-xs font-medium">{i18n(I18nKey.wallpaperBannerMode)}</span>
                </button>
                <button
                    class="flex-1 btn-regular rounded-md py-2 px-3 flex items-center justify-center gap-2 active:scale-95 transition-all relative overflow-hidden"
                    class:opacity-60={wallpaperMode !== WALLPAPER_FULLSCREEN}
                    class:bg-(--btn-regular-bg-hover)={wallpaperMode === WALLPAPER_FULLSCREEN}
                    onclick={() => switchWallpaperMode(WALLPAPER_FULLSCREEN)}
                >
                    <Icon icon="material-symbols:wallpaper" class="text-[1.25rem] shrink-0"></Icon>
                    <span class="text-xs font-medium">{i18n(I18nKey.wallpaperFullscreenMode)}</span>
                </button>
            </div>
            <div class="flex gap-2 mt-2">
                <button
                    class="flex-1 btn-regular rounded-md py-2 px-3 flex items-center justify-center gap-2 active:scale-95 transition-all relative overflow-hidden"
                    class:opacity-60={wallpaperMode !== WALLPAPER_OVERLAY}
                    class:bg-(--btn-regular-bg-hover)={wallpaperMode === WALLPAPER_OVERLAY}
                    onclick={() => switchWallpaperMode(WALLPAPER_OVERLAY)}
                >
                    <Icon icon="material-symbols:full-coverage-outline-rounded" class="text-[1.25rem] shrink-0"></Icon>
                    <span class="text-xs font-medium">{i18n(I18nKey.wallpaperOverlayMode)}</span>
                </button>
                <button
                    class="flex-1 btn-regular rounded-md py-2 px-3 flex items-center justify-center gap-2 active:scale-95 transition-all relative overflow-hidden"
                    class:opacity-60={wallpaperMode !== WALLPAPER_NONE}
                    class:bg-(--btn-regular-bg-hover)={wallpaperMode === WALLPAPER_NONE}
                    onclick={() => switchWallpaperMode(WALLPAPER_NONE)}
                >
                    <Icon icon="material-symbols:hide-image-outline" class="text-[1.25rem] shrink-0"></Icon>
                    <span class="text-xs font-medium">{i18n(I18nKey.wallpaperNoneMode)}</span>
                </button>
            </div>
        </div>
    {/if}

    <!-- Overlay Settings Section -->
    {#if wallpaperMode === WALLPAPER_OVERLAY && hasOverlaySettings}
        <div class="mt-2 mb-2">
            <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3 mb-2
                before:w-1 before:h-4 before:rounded-md before:bg-(--primary)
                before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2"
            >
                {i18n(I18nKey.overlaySettings)}
                <button aria-label="Reset to Default" class="btn-regular w-7 h-7 rounded-md active:scale-90"
                        class:opacity-0={overlaySettingsIsDefault} class:pointer-events-none={overlaySettingsIsDefault} onclick={resetOverlaySettings}>
                    <div class="text-(--btn-content)">
                        <Icon icon="fa7-solid:arrow-rotate-left" class="text-[0.875rem]"></Icon>
                    </div>
                </button>
            </div>
            <div class="space-y-2">
                {#each overlaySliderItems as item (item.key)}
                    {#if item.enabled}
                        <div class="rounded-md bg-(--btn-regular-bg) p-2">
                            <div class="flex items-center justify-between mb-1">
                                <span class="text-sm font-medium text-(--btn-content) opacity-80">{item.label}</span>
                                <span class="text-xs text-(--btn-content)">{item.displayValue}</span>
                            </div>
                            <input
                                aria-label={item.ariaLabel}
                                type="range"
                                min={item.min}
                                max={item.max}
                                step={item.step}
                                value={item.value}
                                oninput={(e) => item.onValueChange(Number((e.currentTarget as HTMLInputElement).value))}
                                class="slider w-full overlay-slider"
                            />
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    {/if}

    <!-- Banner Settings Section -->
    {#if (wallpaperMode === WALLPAPER_BANNER || wallpaperMode === WALLPAPER_FULLSCREEN) && hasBannerSettings}
        <div class="mt-2 mb-2">
            <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3 mb-2
                before:w-1 before:h-4 before:rounded-md before:bg-(--primary)
                before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2"
            >
                {i18n(I18nKey.wallpaperSettings)}
                <button aria-label="Reset to Default" class="btn-regular w-7 h-7 rounded-md  active:scale-90"
                        class:opacity-0={bannerSettingsIsDefault} class:pointer-events-none={bannerSettingsIsDefault} onclick={resetBannerSettings}>
                    <div class="text-(--btn-content)">
                        <Icon icon="fa7-solid:arrow-rotate-left" class="text-[0.875rem]"></Icon>
                    </div>
                </button>
            </div>
            <div class="space-y-1">
                <!-- Banner Title Switch -->
                {#if isBannerTitleSwitchable}
                <button
                    class="w-full btn-regular rounded-md py-2 px-3 flex items-center gap-3 text-left active:scale-95 transition-all relative overflow-hidden"
                    class:bg-(--btn-regular-bg-hover)={bannerTitleEnabled}
                    onclick={toggleBannerTitleEnabled}
                >
                    <Icon icon="material-symbols:titlecase-rounded" class="text-[1.25rem] shrink-0"></Icon>
                    <span class="text-sm flex-1">{i18n(I18nKey.wallpaperTitle)}</span>
                    <div class="w-10 h-5 rounded-full transition-all duration-200 relative"
                         class:bg-(--primary)={bannerTitleEnabled}
                         class:bg-(--btn-regular-bg-active)={!bannerTitleEnabled}>
                        <div class="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
                             class:left-0.5={!bannerTitleEnabled}
                             class:left-5={bannerTitleEnabled}></div>
                    </div>
                </button>
                {/if}
                <!-- Banner Carousel Switch -->
                {#if isBannerCarouselSwitchable}
                <button
                    class="w-full btn-regular rounded-md py-2 px-3 flex items-center gap-3 text-left active:scale-95 transition-all relative overflow-hidden"
                    class:bg-(--btn-regular-bg-hover)={bannerCarouselEnabled}
                    onclick={toggleBannerCarouselEnabled}
                >
                    <Icon icon="material-symbols:view-carousel-outline" class="text-[1.25rem] shrink-0"></Icon>
                    <span class="text-sm flex-1">{i18n(I18nKey.wallpaperCarousel)}</span>
                    <div class="w-10 h-5 rounded-full transition-all duration-200 relative"
                         class:bg-(--primary)={bannerCarouselEnabled}
                         class:bg-(--btn-regular-bg-active)={!bannerCarouselEnabled}>
                        <div class="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
                             class:left-0.5={!bannerCarouselEnabled}
                             class:left-5={bannerCarouselEnabled}></div>
                    </div>
                </button>
                {/if}
                <!-- Waves Animation Switch -->
                {#if isWavesSwitchable}
                <button
                    class="w-full btn-regular rounded-md py-2 px-3 flex items-center gap-3 text-left active:scale-95 transition-all relative overflow-hidden"
                    class:bg-(--btn-regular-bg-hover)={wavesEnabled}
                    onclick={toggleWavesEnabled}
                >
                    <Icon icon="material-symbols:airwave-rounded" class="text-[1.25rem] shrink-0"></Icon>
                    <span class="text-sm flex-1">{i18n(I18nKey.wavesAnimation)}</span>
                    <div class="w-10 h-5 rounded-full transition-all duration-200 relative"
                         class:bg-(--primary)={wavesEnabled}
                         class:bg-(--btn-regular-bg-active)={!wavesEnabled}>
                        <div class="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
                             class:left-0.5={!wavesEnabled}
                             class:left-5={wavesEnabled}></div>
                    </div>
                </button>
                {/if}
                <!-- Gradient Transition Switch -->
                {#if isGradientSwitchable}
                <button
                    class="w-full btn-regular rounded-md py-2 px-3 flex items-center gap-3 text-left active:scale-95 transition-all relative overflow-hidden"
                    class:bg-(--btn-regular-bg-hover)={gradientEnabled}
                    onclick={toggleGradientEnabled}
                >
                    <Icon icon="material-symbols:gradient" class="text-[1.25rem] shrink-0"></Icon>
                    <span class="text-sm flex-1">{i18n(I18nKey.gradientTransition)}</span>
                    <div class="w-10 h-5 rounded-full transition-all duration-200 relative"
                         class:bg-(--primary)={gradientEnabled}
                         class:bg-(--btn-regular-bg-active)={!gradientEnabled}>
                        <div class="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
                             class:left-0.5={!gradientEnabled}
                             class:left-5={gradientEnabled}></div>
                    </div>
                </button>
                {/if}
            </div>
        </div>
    {/if}

    <!-- Effects Settings Section -->
    {#if isSakuraSwitchable}
        <div class="mt-2 mb-2">
            <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3 mb-2
                before:w-1 before:h-4 before:rounded-md before:bg-(--primary)
                before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2"
            >
                {i18n(I18nKey.effectsSettings)}
                <button aria-label="Reset to Default" class="btn-regular w-7 h-7 rounded-md  active:scale-90"
                        class:opacity-0={sakuraEnabled === defaultSakuraEnabled} class:pointer-events-none={sakuraEnabled === defaultSakuraEnabled} onclick={() => { sakuraEnabled = defaultSakuraEnabled; setSakuraEnabled(defaultSakuraEnabled); }}>
                    <div class="text-(--btn-content)">
                        <Icon icon="fa7-solid:arrow-rotate-left" class="text-[0.875rem]"></Icon>
                    </div>
                </button>
            </div>
            <div class="space-y-1">
                <button
                    class="w-full btn-regular rounded-md py-2 px-3 flex items-center gap-3 text-left active:scale-95 transition-all relative overflow-hidden"
                    class:bg-(--btn-regular-bg-hover)={sakuraEnabled}
                    onclick={toggleSakuraEnabled}
                >
                    <Icon icon="mdi:flower-poppy" class="text-[1.25rem] shrink-0"></Icon>
                    <span class="text-sm flex-1">{i18n(I18nKey.sakuraEffect)}</span>
                    <div class="w-10 h-5 rounded-full transition-all duration-200 relative"
                         class:bg-(--primary)={sakuraEnabled}
                         class:bg-(--btn-regular-bg-active)={!sakuraEnabled}>
                        <div class="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
                             class:left-0.5={!sakuraEnabled}
                             class:left-5={sakuraEnabled}></div>
                    </div>
                </button>
            </div>
        </div>
    {/if}

    <!-- Layout Switch Section -->
    {#if allowLayoutSwitch}
        <div class="mt-2 mb-2">
            <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3 mb-2
                before:w-1 before:h-4 before:rounded-md before:bg-(--primary)
                before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2"
            >
                {i18n(I18nKey.postListLayout)}
                <button aria-label="Reset to Default" class="btn-regular w-7 h-7 rounded-md  active:scale-90"
                        class:opacity-0={currentLayout === effectiveDefaultLayout} class:pointer-events-none={currentLayout === effectiveDefaultLayout} onclick={resetLayout}>
                    <div class="text-(--btn-content)">
                        <Icon icon="fa7-solid:arrow-rotate-left" class="text-[0.875rem]"></Icon>
                    </div>
                </button>
            </div>
            <div class="flex gap-2">
                <button
                    aria-label={i18n(I18nKey.postListLayoutList)}
                    class="flex-1 btn-regular rounded-md py-2 px-3 flex items-center justify-center gap-2 active:scale-95 transition-all relative overflow-hidden"
                    class:opacity-60={currentLayout !== 'list'}
                    class:bg-(--btn-regular-bg-hover)={currentLayout === 'list'}
                    disabled={isSwitching}
                    onclick={switchLayout}
                    title={i18n(I18nKey.postListLayoutList)}
                >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
                    </svg>
                    <span class="text-xs font-medium">{i18n(I18nKey.postListLayoutList)}</span>
                </button>
                <button
                    aria-label={i18n(I18nKey.postListLayoutGrid)}
                    class="flex-1 btn-regular rounded-md py-2 px-3 flex items-center justify-center gap-2 active:scale-95 transition-all relative overflow-hidden"
                    class:opacity-60={currentLayout !== 'grid'}
                    class:bg-(--btn-regular-bg-hover)={currentLayout === 'grid'}
                    disabled={isSwitching}
                    onclick={switchLayout}
                    title={i18n(I18nKey.postListLayoutGrid)}
                >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
                    </svg>
                    <span class="text-xs font-medium">{i18n(I18nKey.postListLayoutGrid)}</span>
                </button>
            </div>
        </div>
    {/if}
</div>
{/if}


<style lang="stylus">
    #display-setting
        input[type="range"]
            -webkit-appearance none
            height 1.5rem
            border-radius 999px
            background-image unquote("linear-gradient(90deg, var(--primary) 0 var(--range-progress, 50%), hsla(var(--hue), 22%, 28%, 0.18) var(--range-progress, 50%) 100%)")
            transition background-image 0.15s ease-in-out

        input[type="range"].overlay-slider
            height 0.85rem

            /* Input Thumb */
            &::-webkit-slider-thumb
                -webkit-appearance none
                height 0
                width 0
                border 0
                border-radius 0
                background transparent
                box-shadow none

            &::-moz-range-thumb
                height 0
                width 0
                border 0
                border-radius 0
                background transparent
                box-shadow none

            &::-ms-thumb
                -webkit-appearance none
                height 0
                width 0
                border 0
                border-radius 0
                background transparent
                box-shadow none

        #colorSlider
            background-image var(--color-selection-bar)
            transition background-image 0.15s ease-in-out

            &::-webkit-slider-thumb
                -webkit-appearance none
                height 1rem
                width 0.5rem
                border-radius 0.125rem
                background rgba(255, 255, 255, 0.7)
                box-shadow none

                &:hover
                    background rgba(255, 255, 255, 0.8)

                &:active
                    background rgba(255, 255, 255, 0.6)

            &::-moz-range-thumb
                -webkit-appearance none
                height 1rem
                width 0.5rem
                border-radius 0.125rem
                border-width 0
                background rgba(255, 255, 255, 0.7)
                box-shadow none

                &:hover
                    background rgba(255, 255, 255, 0.8)

                &:active
                    background rgba(255, 255, 255, 0.6)

            &::-ms-thumb
                -webkit-appearance none
                height 1rem
                width 0.5rem
                border-radius 0.125rem
                background rgba(255, 255, 255, 0.7)
                box-shadow none

                &:hover
                    background rgba(255, 255, 255, 0.8)

                &:active
                    background rgba(255, 255, 255, 0.6)

</style>
