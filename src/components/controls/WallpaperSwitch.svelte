<script lang="ts">
import {
	WALLPAPER_BANNER,
	WALLPAPER_NONE,
	WALLPAPER_OVERLAY,
} from "@constants/constants";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getStoredWallpaperMode, setWallpaperMode } from "@utils/setting-utils";
import { onMount } from "svelte";
import DropdownItem from "@/components/common/DropdownItem.svelte";
import DropdownPanel from "@/components/common/DropdownPanel.svelte";
import Icon from "@/components/common/Icon.svelte";
import { backgroundWallpaper } from "@/config";
import type { WALLPAPER_MODE } from "@/types/config";

/**
 * 壁纸模式切换按钮
 * 目前已弃用，已集成至DisplaySettingsIntegrated.svelte，当前文件保留以备将来可能的单独使用
 */

let mode: WALLPAPER_MODE = $state(backgroundWallpaper.mode);

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
<div class="relative z-50">
	<button aria-label="Wallpaper Mode" aria-haspopup="menu" class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90" id="wallpaper-mode-switch">
		<div class="absolute inset-0 flex items-center justify-center" class:opacity-0={mode !== WALLPAPER_BANNER}>
			<Icon icon="material-symbols:image-outline" class="text-[1.25rem]"></Icon>
		</div>
		<div class="absolute inset-0 flex items-center justify-center" class:opacity-0={mode !== WALLPAPER_OVERLAY}>
			<Icon icon="material-symbols:wallpaper" class="text-[1.25rem]"></Icon>
		</div>
		<div class="absolute inset-0 flex items-center justify-center" class:opacity-0={mode !== WALLPAPER_NONE}>
			<Icon icon="material-symbols:hide-image-outline" class="text-[1.25rem]"></Icon>
		</div>
	</button>
	<div id="wallpaper-mode-panel" class="absolute transition float-panel-closed top-11 -right-2 pt-5 z-50" role="menu" aria-labelledby="wallpaper-mode-switch">
		<DropdownPanel>
			<DropdownItem
				role="menuitem"
				isActive={mode === WALLPAPER_BANNER}
				isLast={false}
				onclick={() => switchWallpaperMode(WALLPAPER_BANNER)}
			>
				<Icon icon="material-symbols:image-outline" class="text-[1.25rem] mr-3"></Icon>
				{i18n(I18nKey.wallpaperBannerMode)}
			</DropdownItem>
			<DropdownItem
				role="menuitem"
				isActive={mode === WALLPAPER_OVERLAY}
				isLast={false}
				onclick={() => switchWallpaperMode(WALLPAPER_OVERLAY)}
			>
				<Icon icon="material-symbols:wallpaper" class="text-[1.25rem] mr-3"></Icon>
				{i18n(I18nKey.wallpaperOverlayMode)}
			</DropdownItem>
			<DropdownItem
				role="menuitem"
				isActive={mode === WALLPAPER_NONE}
				isLast={true}
				onclick={() => switchWallpaperMode(WALLPAPER_NONE)}
			>
				<Icon icon="material-symbols:hide-image-outline" class="text-[1.25rem] mr-3"></Icon>
				{i18n(I18nKey.wallpaperNoneMode)}
			</DropdownItem>
		</DropdownPanel>
	</div>
</div>
