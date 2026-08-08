<script lang="ts">
/**
 * 统一的图标组件 - 使用 @iconify/svelte 离线模式
 * 用于 Svelte 组件
 *
 * 从本地精简图标数据加载，仅包含项目实际使用的图标
 * 无需网络请求，无闪烁，体积小
 */

import Iconify, { addCollection } from "@iconify/svelte/offline";

import iconsData from "@/constants/icons-data.json";

// 注册图标集合（模块加载时执行一次）
let collectionsAdded = false;
if (!collectionsAdded) {
	for (const [, data] of Object.entries(iconsData)) {
		addCollection(data as Parameters<typeof addCollection>[0]);
	}
	collectionsAdded = true;
}

interface Props {
	icon: string;
	class?: string;
	style?: string;
}

let { icon, class: className = "", style = "" }: Props = $props();

// 检测图标是否存在
const iconExists = $derived(() => {
	const [prefix, name] = icon.split(":");
	if (!prefix || !name) return false;
	const collection = (iconsData as Record<string, unknown>)[prefix] as
		| { icons?: Record<string, unknown> }
		| undefined;
	return collection?.icons?.[name] !== undefined;
});
</script>

{#if iconExists()}
	<Iconify
		{icon}
		class="inline-icon inline-flex items-center justify-center {className}"
		style={style}
	/>
{:else}
	<span
		class="inline-icon inline-flex items-center justify-center {className}"
		style={style}
		aria-hidden="true"
		title="Icon not found: {icon}"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
			<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/>
		</svg>
	</span>
{/if}
