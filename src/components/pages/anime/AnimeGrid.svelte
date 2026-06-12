<script lang="ts">
import ClientPagination from "@/components/common/ClientPagination.svelte";
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import type { StandardizedAnime } from "@/types/anime";
import AnimeCard from "./AnimeCard.svelte";
import AnimeDetailModal from "./AnimeDetailModal.svelte";

interface Props {
	items: StandardizedAnime[];
	itemsPerPage?: number;
	bilibiliAverageRating?: string;
}

const { items, itemsPerPage = 20, bilibiliAverageRating = "0.0" }: Props = $props();

// 状态
let searchTerm = $state("");
let typeFilter = $state<"all" | "tv" | "movie">("all");
let sortBy = $state<"rating-desc" | "rating-asc" | "date-desc" | "date-asc">("rating-desc");
let currentPage = $state(1);
let selectedAnime = $state<StandardizedAnime | null>(null);

// TMDB 平均分
const tmdbAverageRating = $derived(() => {
	const tmdbItems = items.filter((item) => item.source === "tmdb");
	if (!tmdbItems.length) return "0.0";
	const sum = tmdbItems.reduce((acc, item) => acc + (item.rating || 0), 0);
	return (sum / tmdbItems.length).toFixed(1);
});

function handleSelectAnime(item: StandardizedAnime) {
	selectedAnime = item;
}

function handleCloseModal() {
	selectedAnime = null;
}

// 下拉菜单开关状态
let typeMenuOpen = $state(false);
let sortMenuOpen = $state(false);

// 类型计数
const typeCounts = $derived(() => {
	const counts = { all: items.length, tv: 0, movie: 0 };
	for (const item of items) {
		if (item.type === "tv") counts.tv++;
		else if (item.type === "movie") counts.movie++;
	}
	return counts;
});

// 筛选
const filteredItems = $derived(() => {
	const term = searchTerm.toLowerCase();
	return items.filter((item) => {
		const matchesSearch = !term || item.title.toLowerCase().includes(term);
		const matchesType = typeFilter === "all" || item.type === typeFilter;
		return matchesSearch && matchesType;
	});
});

// 排序
const sortedItems = $derived(() => {
	const arr = [...filteredItems()];
	switch (sortBy) {
		case "rating-desc":
			arr.sort((a, b) => b.rating - a.rating);
			break;
		case "rating-asc":
			arr.sort((a, b) => a.rating - b.rating);
			break;
		case "date-desc":
			arr.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
			break;
		case "date-asc":
			arr.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
			break;
	}
	return arr;
});

// 分页
const totalPages = $derived(Math.max(1, Math.ceil(sortedItems().length / itemsPerPage)));

const pagedItems = $derived(() => {
	const s = sortedItems();
	const start = (currentPage - 1) * itemsPerPage;
	return s.slice(start, start + itemsPerPage);
});

// 当筛选条件变化时重置到第一页
$effect(() => {
	// 读取这些值以建立依赖关系
	searchTerm;
	typeFilter;
	sortBy;
	currentPage = 1;
});

// 点击外部关闭下拉菜单
$effect(() => {
	function closeMenus(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest("#anime-type-filter-wrapper")) {
			typeMenuOpen = false;
		}
		if (!target.closest("#anime-sort-filter-wrapper")) {
			sortMenuOpen = false;
		}
	}
	document.addEventListener("click", closeMenus);
	return () => document.removeEventListener("click", closeMenus);
});

function selectTypeFilter(value: "all" | "tv" | "movie") {
	typeFilter = value;
	typeMenuOpen = false;
}

function selectSort(value: "rating-desc" | "rating-asc" | "date-desc" | "date-asc") {
	sortBy = value;
	sortMenuOpen = false;
}

function handlePageChange(page: number) {
	currentPage = page;
}

function getTypeLabel(): string {
	switch (typeFilter) {
		case "all": return i18n(I18nKey.animeAllTypes);
		case "tv": return i18n(I18nKey.animeTV);
		case "movie": return i18n(I18nKey.animeMovie);
	}
}

function getSortLabel(): string {
	switch (sortBy) {
		case "rating-desc": return i18n(I18nKey.animeRatingDesc);
		case "rating-asc": return i18n(I18nKey.animeRatingAsc);
		case "date-desc": return i18n(I18nKey.animeDateDesc);
		case "date-asc": return i18n(I18nKey.animeDateAsc);
	}
}
</script>

<!-- 筛选工具栏 -->
<div class="flex flex-col sm:flex-row gap-3 bg-(--card-bg) p-4 rounded-xl border border-(--line-divider) mb-6">
  <!-- 搜索框 -->
  <div class="flex-1 relative">
    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
      <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 0 24 24"><path fill="currentColor" d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"/></svg>
    </span>
    <input
      type="text"
      placeholder={i18n(I18nKey.animeSearch)}
      bind:value={searchTerm}
      class="w-full pl-10 pr-4 py-2 rounded-lg bg-(--btn-regular-bg) border border-(--line-divider) text-sm text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none focus:border-(--primary) transition-colors"
    />
  </div>

  <div class="flex gap-2 flex-wrap items-center">
    <!-- 类型筛选下拉 -->
    <div class="relative" id="anime-type-filter-wrapper">
      <button
        type="button"
        onclick={(e) => { e.stopPropagation(); typeMenuOpen = !typeMenuOpen; sortMenuOpen = false; }}
        class="flex items-center gap-2 px-3 py-2 rounded-lg bg-(--btn-regular-bg) border border-(--line-divider) text-sm text-neutral-700 dark:text-neutral-300 hover:bg-(--btn-regular-bg-hover) transition-colors cursor-pointer"
      >
        <span>{getTypeLabel()}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z"/></svg>
      </button>
      {#if typeMenuOpen}
        <div class="absolute z-50 mt-1 left-0 min-w-[120px] bg-(--card-bg) rounded-lg shadow-lg border border-(--line-divider) py-1">
          <button type="button" onclick={() => selectTypeFilter("all")}
            class="w-full text-left px-3 py-2 text-sm hover:bg-(--btn-regular-bg-hover) text-neutral-700 dark:text-neutral-300 transition-colors"
            class:text-(--primary)={typeFilter === "all"}>
            {i18n(I18nKey.animeAllTypes)} ({typeCounts().all})
          </button>
          <button type="button" onclick={() => selectTypeFilter("tv")}
            class="w-full text-left px-3 py-2 text-sm hover:bg-(--btn-regular-bg-hover) text-neutral-700 dark:text-neutral-300 transition-colors"
            class:text-(--primary)={typeFilter === "tv"}>
            {i18n(I18nKey.animeTV)} ({typeCounts().tv})
          </button>
          <button type="button" onclick={() => selectTypeFilter("movie")}
            class="w-full text-left px-3 py-2 text-sm hover:bg-(--btn-regular-bg-hover) text-neutral-700 dark:text-neutral-300 transition-colors"
            class:text-(--primary)={typeFilter === "movie"}>
            {i18n(I18nKey.animeMovie)} ({typeCounts().movie})
          </button>
        </div>
      {/if}
    </div>

    <!-- 排序下拉 -->
    <div class="relative" id="anime-sort-filter-wrapper">
      <button
        type="button"
        onclick={(e) => { e.stopPropagation(); sortMenuOpen = !sortMenuOpen; typeMenuOpen = false; }}
        class="flex items-center gap-2 px-3 py-2 rounded-lg bg-(--btn-regular-bg) border border-(--line-divider) text-sm text-neutral-700 dark:text-neutral-300 hover:bg-(--btn-regular-bg-hover) transition-colors cursor-pointer"
      >
        <span>{getSortLabel()}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z"/></svg>
      </button>
      {#if sortMenuOpen}
        <div class="absolute z-50 mt-1 right-0 min-w-[140px] bg-(--card-bg) rounded-lg shadow-lg border border-(--line-divider) py-1">
          <button type="button" onclick={() => selectSort("rating-desc")}
            class="w-full text-left px-3 py-2 text-sm hover:bg-(--btn-regular-bg-hover) text-neutral-700 dark:text-neutral-300 transition-colors"
            class:text-(--primary)={sortBy === "rating-desc"}>
            {i18n(I18nKey.animeRatingDesc)}
          </button>
          <button type="button" onclick={() => selectSort("rating-asc")}
            class="w-full text-left px-3 py-2 text-sm hover:bg-(--btn-regular-bg-hover) text-neutral-700 dark:text-neutral-300 transition-colors"
            class:text-(--primary)={sortBy === "rating-asc"}>
            {i18n(I18nKey.animeRatingAsc)}
          </button>
          <button type="button" onclick={() => selectSort("date-desc")}
            class="w-full text-left px-3 py-2 text-sm hover:bg-(--btn-regular-bg-hover) text-neutral-700 dark:text-neutral-300 transition-colors"
            class:text-(--primary)={sortBy === "date-desc"}>
            {i18n(I18nKey.animeDateDesc)}
          </button>
          <button type="button" onclick={() => selectSort("date-asc")}
            class="w-full text-left px-3 py-2 text-sm hover:bg-(--btn-regular-bg-hover) text-neutral-700 dark:text-neutral-300 transition-colors"
            class:text-(--primary)={sortBy === "date-asc"}>
            {i18n(I18nKey.animeDateAsc)}
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>

<!-- 卡片网格 -->
{#if sortedItems().length > 0}
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    {#each pagedItems() as anime (anime.id)}
      <AnimeCard item={anime} onselect={handleSelectAnime} />
    {/each}
  </div>

  <!-- 分页 -->
  <ClientPagination
    totalItems={sortedItems().length}
    {itemsPerPage}
    {currentPage}
    onPageChange={handlePageChange}
  />
{:else}
  <!-- 无结果提示 -->
  <div class="flex flex-col items-center justify-center py-20 text-neutral-400">
    <svg xmlns="http://www.w3.org/2000/svg" width="4em" height="4em" viewBox="0 0 24 24"><path fill="currentColor" d="M19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm2-2h10V5H5v14z"/></svg>
    <p class="text-lg mt-4">{i18n(I18nKey.animeNoResults)}</p>
  </div>
{/if}

<!-- 详情弹窗 -->
<AnimeDetailModal item={selectedAnime} onclose={handleCloseModal} />
