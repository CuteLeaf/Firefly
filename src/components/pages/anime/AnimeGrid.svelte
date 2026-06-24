<script lang="ts">
import ClientPagination from "@components/common/ClientPagination.svelte";
import { untrack } from "svelte";
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import type { StandardizedAnime } from "@/types/anime";
import TabNav from "../bangumi/TabNav.svelte";
import AnimeCard from "./AnimeCard.svelte";
import AnimeDetailModal from "./AnimeDetailModal.svelte";

interface Props {
	items: StandardizedAnime[];
	bilibiliAverageRating?: string;
	itemsPerPage?: number;
}

let { items, bilibiliAverageRating, itemsPerPage = 24 }: Props = $props();

// 状态
let searchQuery = $state("");
let activeFilter = $state(
	untrack(() =>
		String(
			[...new Set(items.map((i) => i.season_type || 1))].sort(
				(a, b) => a - b,
			)[0] || "",
		),
	),
);
let sortBy = $state<"rating-desc" | "rating-asc" | "date-desc" | "date-asc">(
	"rating-desc",
);
let currentPage = $state(1);
let selectedAnime = $state<StandardizedAnime | null>(null);

// season_type 到 i18n key 的映射
const SEASON_TYPE_I18N: Record<number, I18nKey> = {
	1: I18nKey.animeTypeAnime,
	2: I18nKey.animeTypeMovie,
	3: I18nKey.animeTypeDocumentary,
	4: I18nKey.animeTypeChinese,
	5: I18nKey.animeTypeDrama,
	7: I18nKey.animeTypeConcert,
};

// 动态生成筛选项：从数据中提取实际存在的 season_type
let filterOptions = $derived(() => {
	const typeMap = new Map<number, number>();
	for (const item of items) {
		const st = item.season_type || 1;
		typeMap.set(st, (typeMap.get(st) || 0) + 1);
	}
	// 按 season_type 排序
	return Array.from(typeMap.entries())
		.sort(([a], [b]) => a - b)
		.map(([type, count]) => ({
			value: String(type),
			label: i18n(SEASON_TYPE_I18N[type] || I18nKey.animeTypeAnime),
			count,
		}));
});

// 筛选和排序后的数据
let filteredItems = $derived(() => {
	let result = [...items];

	// 搜索过滤
	if (searchQuery.trim()) {
		const query = searchQuery.toLowerCase().trim();
		result = result.filter(
			(item) =>
				item.title.toLowerCase().includes(query) ||
				item.originalTitle.toLowerCase().includes(query),
		);
	}

	// 类型过滤
	if (activeFilter) {
		const filterType = Number(activeFilter);
		result = result.filter((item) => (item.season_type || 1) === filterType);
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
let pagedItems = $derived(() => {
	const start = (currentPage - 1) * itemsPerPage;
	return filteredItems().slice(start, start + itemsPerPage);
});

// 筛选/搜索变化时重置到第一页
function resetPage() {
	currentPage = 1;
}

function handleSearch(e: Event) {
	searchQuery = (e.target as HTMLInputElement).value;
	resetPage();
}

function setFilter(filter: string) {
	activeFilter = activeFilter === filter ? "" : filter;
	resetPage();
}

function setSort(sort: typeof sortBy) {
	sortBy = sort;
	resetPage();
}

function goToPage(page: number) {
	currentPage = page;
}

function openDetail(anime: StandardizedAnime) {
	selectedAnime = anime;
}

function closeDetail() {
	selectedAnime = null;
}
</script>

<div class="anime-grid">
	<!-- 工具栏 -->
	<div class="mb-6 flex flex-col gap-3">
		<!-- 搜索和排序 -->
		<div class="flex gap-2">
			<div class="relative flex-1">
				<svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
				<input
					type="text"
					placeholder={i18n(I18nKey.animeSearch)}
					value={searchQuery}
					oninput={handleSearch}
					class="w-full rounded-xl border border-(--line-divider) bg-(--card-bg) py-2.5 pl-10 pr-4 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 outline-none transition-colors focus:border-(--primary)"
				/>
			</div>
			<select
				value={sortBy}
				onchange={(e) => setSort((e.target as HTMLSelectElement).value as typeof sortBy)}
				class="rounded-xl border border-(--line-divider) bg-(--card-bg) px-3 text-sm text-neutral-600 dark:text-neutral-400 outline-none cursor-pointer shrink-0"
			>
				<option value="rating-desc">{i18n(I18nKey.animeRatingDesc)}</option>
				<option value="rating-asc">{i18n(I18nKey.animeRatingAsc)}</option>
				<option value="date-desc">{i18n(I18nKey.animeDateDesc)}</option>
				<option value="date-asc">{i18n(I18nKey.animeDateAsc)}</option>
			</select>
		</div>

		<!-- 类型筛选 -->
		<TabNav
			tabs={filterOptions().map(opt => ({ id: opt.value, name: opt.label, count: opt.count }))}
			activeTab={activeFilter}
			onTabChange={setFilter}
		/>
	</div>

	<!-- 卡片网格 -->
	{#if pagedItems().length > 0}
		<div class="anime-card-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
			{#each pagedItems() as anime (anime.id)}
				<AnimeCard {anime} onclick={openDetail} />
			{/each}
		</div>
	{:else}
		<div class="py-16 text-center">
			<svg class="mx-auto h-12 w-12 text-neutral-300 dark:text-neutral-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
			</svg>
			<p class="text-neutral-500 dark:text-neutral-400">{i18n(I18nKey.animeNoResults)}</p>
		</div>
	{/if}

	<!-- 分页 -->
	<ClientPagination
		totalItems={filteredItems().length}
		{itemsPerPage}
		{currentPage}
		onPageChange={goToPage}
	/>
</div>

<!-- 详情弹窗 -->
<AnimeDetailModal anime={selectedAnime} onclose={closeDetail} />

