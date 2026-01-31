<script lang="ts">
import { onMount } from "svelte";
import { siteConfig } from "@/config";

export let currentLayout: "list" | "grid" = "list";

/**
 * 文章列表布局切换按钮
 * 目前已弃用，已集成至DisplaySettingsIntegrated.svelte，当前文件保留以备将来可能的单独使用
 */

let mounted = false;
let isSmallScreen = false;
let isSwitching = false;

function checkScreenSize() {
	isSmallScreen = window.innerWidth < 1200;
	if (isSmallScreen) {
		currentLayout = "list";
	}
}

onMount(() => {
	mounted = true;
	checkScreenSize();

	// 从localStorage读取用户偏好，如果没有则使用传入的默认值
	const savedLayout = localStorage.getItem("postListLayout");
	if (savedLayout && (savedLayout === "list" || savedLayout === "grid")) {
		currentLayout = savedLayout;
	} else {
		// 如果没有保存的偏好，使用传入的默认布局（从props）
		// currentLayout已经在声明时设置了默认值
	}

	// 监听窗口大小变化
	window.addEventListener("resize", checkScreenSize);

	return () => {
		window.removeEventListener("resize", checkScreenSize);
	};
});

function switchLayout() {
	if (!mounted || isSmallScreen || isSwitching) return;

	isSwitching = true;
	currentLayout = currentLayout === "list" ? "grid" : "list";
	localStorage.setItem("postListLayout", currentLayout);

	// 触发自定义事件，通知父组件布局已改变
	const event = new CustomEvent("layoutChange", {
		detail: { layout: currentLayout },
	});
	window.dispatchEvent(event);

	// 动画完成后重置状态
	setTimeout(() => {
		isSwitching = false;
	}, 500);
}

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

// 监听PostPage的布局初始化事件
onMount(() => {
	const handleLayoutInit = () => {
		// 从PostPage获取当前布局状态
		const postListContainer = document.getElementById("post-list-container");
		if (postListContainer) {
			const isGridMode = postListContainer.classList.contains("grid-mode");
			currentLayout = isGridMode ? "grid" : "list";
		}
	};

	// 延迟执行，确保PostPage已经初始化
	setTimeout(handleLayoutInit, 100);

	return () => {
		// 清理函数
	};
});
</script>

{#if mounted && siteConfig.postListLayout.allowSwitch && !isSmallScreen}
  <button 
    aria-label="切换文章列表布局" 
    class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90 flex items-center justify-center theme-switch-btn {isSwitching ? 'switching' : ''}" 
    on:click={switchLayout}
    disabled={isSwitching}
    title={currentLayout === 'list' ? '切换到网格模式' : '切换到列表模式'}
  >
      {#if currentLayout === 'list'}
        <!-- 列表图标 -->
        <svg class="w-5 h-5 icon-transition" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
        </svg>
    {:else}
      <!-- 网格图标 -->
      <svg class="w-5 h-5 icon-transition" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
      </svg>
    {/if}
  </button>
{/if}

<style>
    /* 确保主题切换按钮的背景色即时更新 */
    .theme-switch-btn::before {
        transition: transform 75ms ease-out, background-color 0ms !important;
    }

    /* 图标过渡动画 */
    .icon-transition {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
    }

    /* 切换中的按钮动画 */
    .switching {
        pointer-events: none;
    }

    .switching .icon-transition {
        animation: iconRotate 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes iconRotate {
        0% {
            transform: rotate(0deg) scale(1);
            opacity: 1;
        }
        50% {
            transform: rotate(180deg) scale(0.8);
            opacity: 0.5;
        }
        100% {
            transform: rotate(360deg) scale(1);
            opacity: 1;
        }
    }

    /* 悬停效果增强 */
    .theme-switch-btn:not(.switching):hover .icon-transition {
        transform: scale(1.1);
    }

    /* 按钮禁用状态 */
    .theme-switch-btn:disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }
</style>
