<script lang="ts">
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";

interface Props {
	/**
	 * "ellipsis"：桌面端页码行里的 `⋯`，点开后原地变成和相邻页码同尺寸的输入框
	 * "current"：移动端 `3 / 20` 卡片里的当前页数字，点开后原地变成透明底输入框
	 */
	variant: "ellipsis" | "current";
	currentPage: number;
	lastPage: number;
	/** 前端分页（Svelte 调用方）走这个回调，不改 URL */
	onJump?: (page: number) => void;
	/**
	 * 整页跳转（Astro island）走这两个。函数没法跨 island 边界传，只能传字符串模板：
	 * hrefTemplate 里的 {page} 会被替换成页码，第 1 页用 hrefFirst（是 `/` 而不是 `/1/`）
	 */
	hrefTemplate?: string;
	hrefFirst?: string;
}

const {
	variant,
	currentPage,
	lastPage,
	onJump,
	hrefTemplate,
	hrefFirst,
}: Props = $props();

let isOpen = $state(false);
let value = $state("");
let inputEl: HTMLInputElement | undefined = $state();

// 输入框宽度按最大页码的位数写死，避免展开/收起时卡片宽度跳动
const digits = $derived(String(lastPage).length);

const label = i18n(I18nKey.paginationJump);

$effect(() => {
	if (isOpen) {
		inputEl?.focus();
		inputEl?.select();
	}
});

function open() {
	value = "";
	isOpen = true;
}

function close() {
	isOpen = false;
	value = "";
}

function jump(page: number) {
	if (onJump) {
		onJump(page);
		return;
	}
	if (!hrefTemplate) return;

	const href =
		page === 1 && hrefFirst
			? hrefFirst
			: hrefTemplate.replace("{page}", String(page));

	// 有 Swup 就走 SPA 过渡，没有再退回整页跳转
	if (window.swup) {
		window.swup.navigate(href);
	} else {
		window.location.href = href;
	}
}

function submit() {
	const parsed = Number.parseInt(value, 10);
	close();
	if (Number.isNaN(parsed)) return;

	// 超出范围就夹到两端，而不是静默丢弃
	const target = Math.min(Math.max(parsed, 1), lastPage);
	if (target !== currentPage) jump(target);
}

// 不用 bind:value：清洗后的值可能和上一次相同，Svelte 不会重渲染，
// 非法字符就会留在 DOM 里，所以这里直接把 input.value 一起改掉
function onInput(event: Event) {
	const el = event.currentTarget as HTMLInputElement;
	const cleaned = el.value.replace(/\D/g, "").slice(0, digits);
	el.value = cleaned;
	value = cleaned;
}

function onKeydown(event: KeyboardEvent) {
	if (event.key === "Enter") {
		event.preventDefault();
		submit();
	} else if (event.key === "Escape") {
		event.preventDefault();
		close();
	}
}
</script>

{#if variant === "ellipsis"}
  {#if isOpen}
    <div class="btn-card w-11 h-11 rounded-(--radius-large)">
      <input
        bind:this={inputEl}
        value={value}
        type="text"
        inputmode="numeric"
        maxlength={digits}
        aria-label={label}
        class="focus-ring-inset w-full h-full rounded-(--radius-large) bg-transparent text-center font-bold text-(--primary)"
        oninput={onInput}
        onkeydown={onKeydown}
        onblur={close}
      />
    </div>
  {:else}
    <button
      type="button"
      aria-label={label}
      title={label}
      class="w-11 h-11 flex items-center justify-center cursor-pointer transition-colors duration-150
             text-neutral-700 dark:text-neutral-300 hover:text-(--primary)"
      onclick={open}
    >
      <svg class="w-11 h-11" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
    </button>
  {/if}
{:else if isOpen}
  <input
    bind:this={inputEl}
    value={value}
    type="text"
    inputmode="numeric"
    maxlength={digits}
    aria-label={label}
    class="outline-hidden h-7 p-0 border-b-2 border-(--primary) bg-transparent text-center text-base font-bold text-(--primary)"
    style={`width: ${digits + 0.5}ch`}
    oninput={onInput}
    onkeydown={onKeydown}
    onblur={close}
  />
{:else}
  <button
    type="button"
    aria-label={label}
    title={label}
    class="h-11 p-0 flex items-center justify-center cursor-pointer text-base font-bold text-(--primary)"
    style={`width: ${digits + 0.5}ch`}
    onclick={open}
  >
    {currentPage}
  </button>
{/if}
