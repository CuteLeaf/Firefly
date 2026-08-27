<script lang="ts">
/**
 * 公共下拉面板组件 (Svelte 5 版本)
 * 用于壁纸切换、亮暗色切换等下拉面板
 */
import type { Snippet } from "svelte";

interface Props {
	class?: string;
	children?: Snippet;
}

let { class: className = "", children, ...restProps }: Props = $props();
</script>

<div class={`float-panel p-2 ${className}`.trim()} role="none" {...restProps}>
	{#if children}
		{@render children()}
	{/if}
</div>
