<script lang="ts">
import ClientPagination from "@/components/common/ClientPagination.svelte";
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import type { UserSubjectCollection } from "@/types/bangumi";
import Card from "./Card.svelte";
import FilterControls from "./FilterControls.svelte";

interface Props {
	sectionId: string;
	items: UserSubjectCollection[];
	isActive: boolean;
	itemsPerPage?: number;
	subjectBaseUrl?: string;
}

const {
	sectionId,
	items,
	isActive,
	itemsPerPage = 12,
	subjectBaseUrl,
}: Props = $props();

const STATUS_MAP: Record<number, string> = {
	1: "wish",
	2: "collect",
	3: "doing",
	4: "on_hold",
	5: "dropped",
};

const isGame = $derived(sectionId === "game");
const isBook = $derived(sectionId === "book");
const isMusic = $derived(sectionId === "music");

function getFilterLabel(type: "collect" | "doing" | "wish"): string {
	if (isGame) {
		switch (type) {
			case "collect":
				return i18n(I18nKey.bangumiFilterGamePlayed);
			case "doing":
				return i18n(I18nKey.bangumiFilterGamePlaying);
			case "wish":
				return i18n(I18nKey.bangumiFilterGameWish);
		}
	}
	if (isBook) {
		switch (type) {
			case "collect":
				return i18n(I18nKey.bangumiFilterBookRead);
			case "doing":
				return i18n(I18nKey.bangumiFilterBookReading);
			case "wish":
				return i18n(I18nKey.bangumiFilterBookWish);
		}
	}
	if (isMusic) {
		switch (type) {
			case "collect":
				return i18n(I18nKey.bangumiFilterMusicListened);
			case "doing":
				return i18n(I18nKey.bangumiFilterMusicListening);
			case "wish":
				return i18n(I18nKey.bangumiFilterMusicWish);
		}
	}
	switch (type) {
		case "collect":
			return i18n(I18nKey.bangumiFilterWatched);
		case "doing":
			return i18n(I18nKey.bangumiFilterWatching);
		case "wish":
			return i18n(I18nKey.bangumiFilterWish);
	}
}

const statusCounts = $derived(() => {
	const counts: Record<string, number> = {};
	for (const item of items) {
		const status =
			STATUS_MAP[item.type as keyof typeof STATUS_MAP] || "unknown";
		counts[status] = (counts[status] || 0) + 1;
	}
	return counts;
});

const filters = $derived(() => {
	const counts = statusCounts();
	return [
		{
			value: "all",
			label: i18n(I18nKey.bangumiFilterAll),
			count: items.length,
		},
		{
			value: "collect",
			label: getFilterLabel("collect"),
			count: counts.collect || 0,
		},
		{
			value: "doing",
			label: getFilterLabel("doing"),
			count: counts.doing || 0,
		},
		{ value: "wish", label: getFilterLabel("wish"), count: counts.wish || 0 },
		{
			value: "on_hold",
			label: i18n(I18nKey.bangumiFilterOnHold),
			count: counts.on_hold || 0,
		},
		{
			value: "dropped",
			label: i18n(I18nKey.bangumiFilterDropped),
			count: counts.dropped || 0,
		},
	].filter((f) => f.value === "all" || f.count > 0);
});

let activeFilter = $state("all");
let currentPage = $state(1);

const filteredItems = $derived(
	activeFilter === "all"
		? items
		: items.filter(
				(item) =>
					(STATUS_MAP[item.type as keyof typeof STATUS_MAP] || "unknown") ===
					activeFilter,
			),
);

const totalPages = $derived(
	Math.max(1, Math.ceil(filteredItems.length / itemsPerPage)),
);

const pagedItems = $derived(
	filteredItems.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	),
);

function handleFilterChange(filter: string) {
	activeFilter = filter;
	currentPage = 1;
}

function goToPage(page: number) {
	if (page >= 1 && page <= totalPages) {
		currentPage = page;
	}
}
</script>

<div class="bangumi-section" class:hidden={!isActive} data-section={sectionId}>
  {#if items.length > 0}
    <FilterControls
      filters={filters()}
      activeFilter={activeFilter}
      onFilterChange={handleFilterChange}
    />

    <div class="bangumi-masonry" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem;">
      {#each pagedItems as item (item.subject_id)}
        <div
          class="bangumi-item"
          data-item-section={sectionId}
          data-item-status={STATUS_MAP[item.type as keyof typeof STATUS_MAP] || "unknown"}
        >
          <Card item={item} loadImage={isActive} {subjectBaseUrl} />
        </div>
      {/each}
    </div>

    <ClientPagination
      totalItems={filteredItems.length}
      itemsPerPage={itemsPerPage}
      currentPage={currentPage}
      onPageChange={goToPage}
    />
  {:else}
    <div class="text-center py-12">
      <h3 class="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">{i18n(I18nKey.bangumiNoData)}</h3>
      <p class="text-gray-500 dark:text-gray-500">{i18n(I18nKey.bangumiNoDataDescription)}</p>
    </div>
  {/if}
</div>

<style>
  @media (min-width: 640px) {
    :global(.bangumi-masonry) {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)) !important;
    }
  }
</style>
