<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { onMount } from "svelte";
import Icon from "@/components/common/Icon.svelte";
import type { SearchResult } from "@/global";
import { url as formatUrl } from "@/utils/url-utils";

// --- Props ---
export let title = i18n(I18nKey.search);
export let description = "";

// --- State ---
let keyword = "";
let results: SearchResult[] = [];
let isSearching = false;
let initialized = false;

// 在客户端获取 URL 参数
const getInitialKeyword = (): string => {
	if (typeof window !== "undefined") {
		const searchParams = new URLSearchParams(window.location.search);
		return searchParams.get("q") || "";
	}
	return "";
};

// --- Mocks for Dev Mode ---
const fakeResult: SearchResult[] = [
	{
		url: formatUrl("/"),
		meta: { title: "Dev Mode Search Result 1" },
		excerpt: "This is a <mark>mock</mark> result for development.",
	},
	{
		url: formatUrl("/"),
		meta: { title: "Dev Mode Search Result 2" },
		excerpt: "Pagefind only works in <mark>production</mark> build.",
	},
];

// --- Core Search Logic ---
const search = async () => {
	if (!initialized || !keyword.trim()) {
		results = [];
		return;
	}
	isSearching = true;

	try {
		if (import.meta.env.PROD && window.pagefind) {
			const response = await window.pagefind.search(keyword);
			const rawResults = await Promise.all(
				response.results.map((item) => item.data()),
			);
			results = rawResults;
		} else if (import.meta.env.DEV) {
			// 开发模式下的模拟结果
			results = fakeResult.filter(
				(item) =>
					item.excerpt.toLowerCase().includes(keyword.toLowerCase()) ||
					item.meta.title.toLowerCase().includes(keyword.toLowerCase()),
			);
		}
	} catch (error) {
		console.error("Search error:", error);
		results = [];
	} finally {
		isSearching = false;
	}
};

// --- Initialization onMount ---
onMount(() => {
	const initialize = async () => {
		initialized = true;

		// 从 URL 获取初始关键词
		const initialKeyword = getInitialKeyword();
		if (initialKeyword) {
			keyword = initialKeyword;
		}

		// 如果有关键词，自动执行搜索
		if (keyword.trim()) {
			await search();
		}
	};

	// 开发环境直接初始化
	if (import.meta.env.DEV) {
		initialize();
	} else {
		// 生产环境等待 Pagefind 加载
		if (window.pagefind) {
			initialize();
		} else {
			document.addEventListener("pagefindready", initialize, {
				once: true,
			});
		}
	}
});

let debounceTimer: NodeJS.Timeout;
const handleInput = () => {
	clearTimeout(debounceTimer);
	debounceTimer = setTimeout(() => {
		search();
	}, 300);
};
</script>

<div class="card-base px-6 py-6 md:px-9 md:py-6 mb-4 rounded-(--radius-large)">
    <!-- Title Section -->
    <div class="mb-4">
        <div class="flex items-center gap-3 mb-3">
            <div class="h-8 w-8 rounded-lg bg-(--primary) flex items-center justify-center text-white dark:text-black/70">
                <Icon icon="material-symbols:search" class="text-[1.5rem]"></Icon>
            </div>
            <h1 class="text-3xl font-bold text-90">
                {title}
            </h1>
        </div>
        {#if description}
            <p class="text-base text-50 leading-relaxed">
                {description}
            </p>
        {/if}
    </div>

    <!-- Search Bar -->
    <div class="relative flex">
        <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Icon icon="material-symbols:search" class="text-2xl text-50" />
            </div>
            <input
                type="text"
                class="block w-full p-4 pl-10 text-sm bg-transparent border border-black/10 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-(--primary) focus:border-(--primary) hover:border-black/20 dark:hover:border-white/20 text-75 placeholder:opacity-50 transition-colors outline-hidden"
                placeholder={i18n(I18nKey.search)}
                bind:value={keyword}
                on:input={handleInput}
            >
        </div>
    </div>
</div>

<div class="grid grid-cols-1 gap-4">
    <!-- Results Area -->
    <div>
        {#if isSearching}
            <div class="flex justify-center py-10">
                <Icon icon="svg-spinners:ring-resize" class="text-4xl text-(--primary)" />
            </div>
        {:else if results.length > 0}
            <div class="space-y-4">
                {#each results as result}
                    <div class="card-base p-6 block rounded-(--radius-large)">
                        <a href={result.url} class="block group">
                            <h5 class="mb-2 text-2xl font-bold tracking-tight text-90 group-hover:text-(--primary) transition-colors">
                                {@html result.meta.title}
                            </h5>
                            <p class="font-normal text-75">
                                {@html result.excerpt}
                            </p>
                        </a>
                    </div>
                {/each}
            </div>
        {:else if keyword}
            <div class="card-base p-10 text-center text-50 rounded-(--radius-large)">
                {i18n(I18nKey.searchNoResults)}
            </div>
        {:else}
             <div class="card-base p-10 text-center text-50 rounded-(--radius-large)">
                {i18n(I18nKey.searchTypeSomething)}
            </div>
        {/if}
    </div>
</div>

<style>
    /* 关键字高亮效果 - 主题色 */
    :global(mark) {
        background: transparent;
        color: var(--primary);
        font-weight: 600;
        padding: 0 0.1em;
    }
</style>