<script lang="ts">
import { onMount } from 'svelte';
import Icon from "@iconify/svelte";
import { WALLPAPER_BANNER, WALLPAPER_OVERLAY, WALLPAPER_NONE } from "@constants/constants";
import {
	getStoredWallpaperMode,
	setWallpaperMode,
} from "@utils/setting-utils";
import type { WALLPAPER_MODE } from "@/types/config";
import { siteConfig } from "@/config";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";

let mode: WALLPAPER_MODE = $state(siteConfig.backgroundWallpaper.mode);

// 在组件挂载时从localStorage读取保存的模式
onMount(() => {
	mode = getStoredWallpaperMode();
});

function switchWallpaperMode(newMode: WALLPAPER_MODE) {
	mode = newMode;
	setWallpaperMode(newMode);
}
</script>

<!-- z-50 make the panel higher than other float panels -->
<div class="relative z-50" role="menu" tabindex="-1">
	<button aria-label="Wallpaper Mode" role="menuitem" class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90" id="wallpaper-mode-switch">
		<div class="absolute" class:opacity-0={mode !== WALLPAPER_BANNER}>
			<Icon icon="material-symbols:image-outline" class="text-[1.25rem]"></Icon>
		</div>
		<div class="absolute" class:opacity-0={mode !== WALLPAPER_OVERLAY}>
			<Icon icon="material-symbols:wallpaper" class="text-[1.25rem]"></Icon>
		</div>
		<div class="absolute" class:opacity-0={mode !== WALLPAPER_NONE}>
			<Icon icon="material-symbols:hide-image-outline" class="text-[1.25rem]"></Icon>
		</div>
	</button>
	<div id="wallpaper-mode-panel" class="absolute transition float-panel-closed top-11 -right-2 pt-5 z-50">
		<div class="card-base float-panel p-2">
			<button class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5"
					class:current-theme-btn={mode === WALLPAPER_BANNER}
					onclick={() => switchWallpaperMode(WALLPAPER_BANNER)}
			>
				<Icon icon="material-symbols:image-outline" class="text-[1.25rem] mr-3"></Icon>
				{i18n(I18nKey.wallpaperBannerMode)}
			</button>
			<button class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5"
					class:current-theme-btn={mode === WALLPAPER_OVERLAY}
					onclick={() => switchWallpaperMode(WALLPAPER_OVERLAY)}
			>
				<Icon icon="material-symbols:wallpaper" class="text-[1.25rem] mr-3"></Icon>
				{i18n(I18nKey.wallpaperOverlayMode)}
			</button>
			<button class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95"
					class:current-theme-btn={mode === WALLPAPER_NONE}
					onclick={() => switchWallpaperMode(WALLPAPER_NONE)}
			>
				<Icon icon="material-symbols:hide-image-outline" class="text-[1.25rem] mr-3"></Icon>
				{i18n(I18nKey.wallpaperNoneMode)}
			</button>
		</div>
	</div>
</div>
