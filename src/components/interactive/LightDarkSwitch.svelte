<script lang="ts">
import { DARK_MODE, LIGHT_MODE, SYSTEM_MODE } from "@/constants/constants";
import Icon from "@iconify/svelte";
import {
	getStoredTheme,
	setTheme,
	applyThemeToDocument,
} from "@/utils/setting-utils";
import type { LIGHT_DARK_MODE } from "@/types/config.ts";
import { onMount } from 'svelte';
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";

let mode: LIGHT_DARK_MODE = $state(LIGHT_MODE);
let displayedMode: LIGHT_DARK_MODE = $state(LIGHT_MODE); // 显示的实际主题（在system模式下会随系统变化）

function switchScheme(newMode: LIGHT_DARK_MODE) {
	mode = newMode;
	setTheme(newMode);
}

// 更新显示的主题（用于显示当前实际主题）
function updateDisplayedMode() {
	if (mode === SYSTEM_MODE) {
		// 如果是system模式，显示实际的系统主题
		const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		displayedMode = isSystemDark ? DARK_MODE : LIGHT_MODE;
	} else {
		displayedMode = mode;
	}
}

// 使用onMount确保在组件挂载后正确初始化
onMount(() => {
	// 立即获取并设置正确的主题
	const storedTheme = getStoredTheme();
	mode = storedTheme;
	updateDisplayedMode();
	
	// 确保DOM状态与存储的主题一致（只对非system模式检查）
	if (storedTheme !== SYSTEM_MODE) {
		const currentTheme = document.documentElement.classList.contains('dark') ? DARK_MODE : LIGHT_MODE;
		if (storedTheme !== currentTheme) {
			applyThemeToDocument(storedTheme);
		}
	}
	
	// 如果是system模式，监听系统主题变化
	if (storedTheme === SYSTEM_MODE) {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleSystemChange = () => {
			updateDisplayedMode();
		};
		mediaQuery.addEventListener('change', handleSystemChange);
	}
	
	// 添加Swup监听
	const handleContentReplace = () => {
		const newTheme = getStoredTheme();
		mode = newTheme;
		updateDisplayedMode();
	};
	
	// 检查Swup是否已经加载
	if ((window as any).swup && (window as any).swup.hooks) {
		(window as any).swup.hooks.on('content:replace', handleContentReplace);
	} else {
		document.addEventListener('swup:enable', () => {
			if ((window as any).swup && (window as any).swup.hooks) {
				(window as any).swup.hooks.on('content:replace', handleContentReplace);
			}
		});
	}
	
	// 监听主题变化事件
	const handleThemeChange = () => {
		// 只有当mode不是system模式时才更新mode
		// system模式下，mode应该保持为SYSTEM_MODE，displayedMode会自动更新
		if (mode !== SYSTEM_MODE) {
			const newTheme = getStoredTheme();
			mode = newTheme;
			updateDisplayedMode();
		} else {
			// system模式下只需要更新displayedMode
			updateDisplayedMode();
		}
	};
	
	window.addEventListener('theme-change', handleThemeChange);
	
	// 清理函数
	return () => {
		window.removeEventListener('theme-change', handleThemeChange);
	};
});
</script>

<div class="relative z-50" role="menu" tabindex="-1">
    <button aria-label="Light/Dark Mode" role="menuitem" class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90" id="scheme-switch">
        <div class="absolute" class:opacity-0={displayedMode !== LIGHT_MODE}>
            <Icon icon="material-symbols:wb-sunny-outline-rounded" class="text-[1.25rem]"></Icon>
        </div>
        <div class="absolute" class:opacity-0={displayedMode !== DARK_MODE}>
            <Icon icon="material-symbols:dark-mode-outline-rounded" class="text-[1.25rem]"></Icon>
        </div>
    </button>
    <div id="theme-mode-panel" class="absolute transition float-panel-closed top-11 -right-2 pt-5 z-50">
        <div class="card-base float-panel p-2">
            <button class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5"
                    class:current-theme-btn={mode === LIGHT_MODE}
                    onclick={() => switchScheme(LIGHT_MODE)}
            >
                <Icon icon="material-symbols:wb-sunny-outline-rounded" class="text-[1.25rem] mr-3"></Icon>
                {i18n(I18nKey.lightMode)}
            </button>
            <button class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5"
                    class:current-theme-btn={mode === DARK_MODE}
                    onclick={() => switchScheme(DARK_MODE)}
            >
                <Icon icon="material-symbols:dark-mode-outline-rounded" class="text-[1.25rem] mr-3"></Icon>
                {i18n(I18nKey.darkMode)}
            </button>
            <button class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95"
                    class:current-theme-btn={mode === SYSTEM_MODE}
                    onclick={() => switchScheme(SYSTEM_MODE)}
            >
                <Icon icon="material-symbols:brightness-auto-outline-rounded" class="text-[1.25rem] mr-3"></Icon>
                {i18n(I18nKey.systemMode)}
            </button>
        </div>
    </div>
</div>