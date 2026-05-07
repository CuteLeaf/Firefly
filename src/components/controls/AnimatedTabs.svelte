<script lang="ts">
/**
 * Aceternity UI 风格的 Animated Tabs 组件
 * 用于切换列表/网格布局，只显示图标，带滑动动画效果
 */
import { onMount } from "svelte";

interface Props {
	activeTab: "list" | "grid";
	class?: string;
}

let { activeTab = $bindable("list"), class: className = "" }: Props = $props();

let tabRef = $state<HTMLDivElement | null>(null);
let listBtnRef = $state<HTMLButtonElement | null>(null);
let gridBtnRef = $state<HTMLButtonElement | null>(null);
let hoverStyle = $state({ left: 0, width: 0, opacity: 0 });

function updateHoverPosition(tab: "list" | "grid") {
	const btnRef = tab === "list" ? listBtnRef : gridBtnRef;
	if (!btnRef || !tabRef) return;

	const parentRect = tabRef.getBoundingClientRect();
	const btnRect = btnRef.getBoundingClientRect();

	hoverStyle = {
		left: btnRect.left - parentRect.left,
		width: btnRect.width,
		opacity: 1,
	};
}

function handleTabChange(tab: "list" | "grid") {
	activeTab = tab;
	localStorage.setItem("postListLayout", tab);
	window.dispatchEvent(
		new CustomEvent("layoutChange", { detail: { layout: tab } }),
	);
	updateHoverPosition(tab);
}

function handleMouseEnter(tab: "list" | "grid") {
	updateHoverPosition(tab);
}

function handleMouseLeave() {
	updateHoverPosition(activeTab);
}

onMount(() => {
	// 同步localStorage中的实际布局（anti-flash脚本可能已更改）
	const saved = localStorage.getItem("postListLayout");
	if (saved === "list" || saved === "grid") {
		activeTab = saved;
	}
	updateHoverPosition(activeTab);
});
</script>

<div
  class="animated-tabs {className}"
  bind:this={tabRef}
  onmouseleave={handleMouseLeave}
>
  <!-- 滑动背景指示器 -->
  <div
    class="tab-indicator"
    style="left: {hoverStyle.left}px; width: {hoverStyle.width}px; opacity: {hoverStyle.opacity};"
  ></div>

  <!-- List 按钮 -->
  <button
    bind:this={listBtnRef}
    class="tab-button {activeTab === 'list' ? 'active' : ''}"
    onclick={() => handleTabChange("list")}
    onmouseenter={() => handleMouseEnter("list")}
    aria-label="List View"
  >
    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
    </svg>
  </button>

  <!-- Grid 按钮 -->
  <button
    bind:this={gridBtnRef}
    class="tab-button {activeTab === 'grid' ? 'active' : ''}"
    onclick={() => handleTabChange("grid")}
    onmouseenter={() => handleMouseEnter("grid")}
    aria-label="Grid View"
  >
    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
    </svg>
  </button>
</div>

<style>
  .animated-tabs {
    position: relative;
    display: inline-flex;
    align-items: center;
    background: var(--card-bg, rgba(255, 255, 255, 0.1));
    border-radius: 0.75rem;
    padding: 0.25rem;
    border: 1px solid var(--line-divider, rgba(0, 0, 0, 0.1));
    box-shadow: 0 1px 3px oklch(0.5 0 0 / 0.08);
  }

  :root.dark .animated-tabs {
    box-shadow: 0 1px 3px oklch(0 0 0 / 0.2);
  }

  .tab-indicator {
    position: absolute;
    top: 0.25rem;
    bottom: 0.25rem;
    background: var(--primary, #3b82f6);
    border-radius: 0.5rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px oklch(0.5 0 0 / 0.15);
    z-index: 0;
  }

  :root.dark .tab-indicator {
    box-shadow: 0 1px 3px oklch(0 0 0 / 0.3);
  }

  .tab-button {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 0.5rem;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--btn-content, #666);
  }

  .tab-button:hover {
    color: var(--primary, #3b82f6);
  }

  .tab-button.active {
    color: white;
  }

  .tab-button:active {
    transform: scale(0.95);
  }
</style>
