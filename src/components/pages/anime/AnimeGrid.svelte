<script lang="ts">
import type { StandardizedAnime } from "@/types/anime";
import AnimeCard from "./AnimeCard.svelte";
import AnimeDetailModal from "./AnimeDetailModal.svelte";

interface Props {
	items: StandardizedAnime[];
	bilibiliAverageRating?: string;
	itemsPerPage?: number;
}

let { items, bilibiliAverageRating, itemsPerPage = 20 }: Props = $props();

// 状态
let searchQuery = $state("");
let activeFilter = $state<"all" | "tv" | "movie">("all");
let sortBy = $state<"rating-desc" | "rating-asc" | "date-desc" | "date-asc">("rating-desc");
let currentPage = $state(1);
let selectedAnime = $state<StandardizedAnime | null>(null);

// 筛选和排序后的数据
let filteredItems = $derived(() => {
	let result = [...items];

	// 搜索过滤
	if (searchQuery.trim()) {
		const query = searchQuery.toLowerCase().trim();
		result = result.filter(
			(item) =>
				item.title.toLowerCase().includes(query) ||
				item.originalTitle.toLowerCase().includes(query)
		);
	}

	// 类型过滤
	if (activeFilter !== "all") {
		result = result.filter((item) => item.type === activeFilter);
	}

	// 排序
	switch (sortBy) {
		case "rating-desc":
			result.sort((a, b) => b.rating - a.rating);
			break;
		case "rating-asc":
			result.sort((a, b) => a.rating - b.rating);
			break;
		case "date-desc":
			result.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
			break;
		case "date-asc":
			result.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
			break;
	}

	return result;
});

// 分页
let totalPages = $derived(Math.ceil(filteredItems().length / itemsPerPage));
let pagedItems = $derived(() => {
	const start = (currentPage - 1) * itemsPerPage;
	return filteredItems().slice(start, start + itemsPerPage);
});

// 页码按钮（带省略号）
let pageNumbers = $derived(() => {
	const pages: (number | "...")[] = [];
	const total = totalPages;
	const current = currentPage;

	if (total <= 7) {
		for (let i = 1; i <= total; i++) pages.push(i);
	} else {
		pages.push(1);
		if (current > 3) pages.push("...");
		for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
			pages.push(i);
		}
		if (current < total - 2) pages.push("...");
		pages.push(total);
	}
	return pages;
});

// 筛选/搜索变化时重置到第一页
function resetPage() {
	currentPage = 1;
}

function handleSearch(e: Event) {
	searchQuery = (e.target as HTMLInputElement).value;
	resetPage();
}

function setFilter(filter: "all" | "tv" | "movie") {
	activeFilter = filter;
	resetPage();
}

function setSort(sort: typeof sortBy) {
	sortBy = sort;
	resetPage();
}

function goToPage(page: number) {
	if (page >= 1 && page <= totalPages) {
		currentPage = page;
	}
}

function openDetail(anime: StandardizedAnime) {
	selectedAnime = anime;
}

function closeDetail() {
	selectedAnime = null;
}

// 过滤计数
let tvCount = $derived(items.filter((i) => i.type === "tv").length);
let movieCount = $derived(items.filter((i) => i.type === "movie").length);
</script>

<div class="anime-grid">
	<!-- 工具栏 -->
	<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<!-- 搜索框 -->
		<div class="relative flex-1 max-w-md">
			<svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
			</svg>
			<input
				type="text"
				placeholder="搜索番剧..."
				value={searchQuery}
				oninput={handleSearch}
				class="w-full rounded-xl border border-(--line-divider) bg-(--card-bg) py-2.5 pl-10 pr-4 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 outline-none transition-colors focus:border-(--primary)"
			/>
		</div>

		<!-- 筛选和排序 -->
		<div class="flex flex-wrap items-center gap-2">
			<!-- 类型筛选 -->
			<div class="flex rounded-lg border border-(--line-divider) overflow-hidden">
				<button
					class="px-3 py-1.5 text-xs font-medium transition-colors {activeFilter === 'all' ? 'bg-(--primary) text-white' : 'bg-(--card-bg) text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'}"
					onclick={() => setFilter("all")}
				>
					全部 ({items.length})
				</button>
				<button
					class="px-3 py-1.5 text-xs font-medium transition-colors border-l border-(--line-divider) {activeFilter === 'tv' ? 'bg-(--primary) text-white' : 'bg-(--card-bg) text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'}"
					onclick={() => setFilter("tv")}
				>
					TV ({tvCount})
				</button>
				<button
					class="px-3 py-1.5 text-xs font-medium transition-colors border-l border-(--line-divider) {activeFilter === 'movie' ? 'bg-(--primary) text-white' : 'bg-(--card-bg) text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'}"
					onclick={() => setFilter("movie")}
				>
					剧场版 ({movieCount})
				</button>
			</div>

			<!-- 排序 -->
			<select
				value={sortBy}
				onchange={(e) => setSort((e.target as HTMLSelectElement).value as typeof sortBy)}
				class="rounded-lg border border-(--line-divider) bg-(--card-bg) px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 outline-none cursor-pointer"
			>
				<option value="rating-desc">评分从高到低</option>
				<option value="rating-asc">评分从低到高</option>
				<option value="date-desc">日期从新到旧</option>
				<option value="date-asc">日期从旧到新</option>
			</select>
		</div>
	</div>

	<!-- 卡片网格 -->
	{#if pagedItems().length > 0}
		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
			{#each pagedItems() as anime (anime.id)}
				<AnimeCard {anime} onclick={openDetail} />
			{/each}
		</div>
	{:else}
		<div class="py-16 text-center">
			<svg class="mx-auto h-12 w-12 text-neutral-300 dark:text-neutral-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
			</svg>
			<p class="text-neutral-500 dark:text-neutral-400">没有找到匹配的番剧</p>
		</div>
	{/if}

	<!-- 分页 -->
	{#if totalPages > 1}
		<div class="mt-8 flex items-center justify-center gap-1">
			<!-- 上一页 -->
			<button
				class="flex h-9 w-9 items-center justify-center rounded-lg border border-(--line-divider) bg-(--card-bg) text-neutral-600 dark:text-neutral-400 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed"
				disabled={currentPage === 1}
				onclick={() => goToPage(currentPage - 1)}
			>
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
			</button>

			{#each pageNumbers() as page}
				{#if page === "..."}
					<span class="flex h-9 w-9 items-center justify-center text-sm text-neutral-400">...</span>
				{:else}
					<button
						class="flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors {currentPage === page ? 'border-(--primary) bg-(--primary) text-white' : 'border-(--line-divider) bg-(--card-bg) text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'}"
						onclick={() => goToPage(page as number)}
					>
						{page}
					</button>
				{/if}
			{/each}

			<!-- 下一页 -->
			<button
				class="flex h-9 w-9 items-center justify-center rounded-lg border border-(--line-divider) bg-(--card-bg) text-neutral-600 dark:text-neutral-400 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed"
				disabled={currentPage === totalPages}
				onclick={() => goToPage(currentPage + 1)}
			>
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		</div>

		<!-- 页码信息 -->
		<p class="mt-3 text-center text-xs text-neutral-500 dark:text-neutral-400">
			第 {currentPage} 页，共 {totalPages} 页 · 共 {filteredItems().length} 部番剧
		</p>
	{/if}
</div>

<!-- 详情弹窗 -->
<AnimeDetailModal anime={selectedAnime} onclose={closeDetail} />
