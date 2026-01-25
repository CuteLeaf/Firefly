<script lang="ts">
/**
 * 公共下拉面板选项组件 (Svelte 5 版本)
 * 用于下拉面板中的选项项
 */
import type { Snippet } from "svelte";

interface Props {
	isActive?: boolean;
	isLast?: boolean;
	class?: string;
	onclick?: (event: MouseEvent) => void;
	children?: Snippet;
}

let {
	isActive = false,
	isLast = false,
	class: className = "",
	onclick,
	children,
	...restProps
}: Props = $props();

const baseClasses =
	"flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95";

// 使用 $derived 使类名响应式
const allClasses = $derived.by(() => {
	const spacingClass = isLast ? "" : "mb-0.5";
	const activeClass = isActive ? "current-theme-btn" : "";
	return `${baseClasses} ${spacingClass} ${activeClass} ${className}`.trim();
});
</script>

<button 
	class={allClasses}
	{onclick}
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}
</button>
