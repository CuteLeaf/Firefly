<script lang="ts">
import ClientPagination from "@/components/common/ClientPagination.svelte";
import FilterControls from "@/components/common/FilterControls.svelte";
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import type { NsfwMode } from "@/types/nsfw";
import type { VndbUlistEntry } from "@/types/vndb";
import { filterNsfw, isVndbNsfw } from "@/utils/nsfw-utils";
import Card from "./Card.svelte";

interface Props {
	sectionId: string;
	items: VndbUlistEntry[];
	isActive: boolean;
	itemsPerPage?: number;
	vnBaseUrl?: string;
	nsfw?: NsfwMode; // NSFW 处理："off" | "blur" | "hide"
}

const {
	sectionId,
	items,
	isActive,
	itemsPerPage = 24,
	vnBaseUrl,
	nsfw = "off",
}: Props = $props();

// NSFW 拦截：mode === "hide" 时过滤掉命中条目
const safeItems = $derived(filterNsfw(items, nsfw, isVndbNsfw));

const filterCounts = $derived.by(() => {
	let voted = 0;
	let unvoted = 0;
	let notes = 0;
	for (const item of safeItems) {
		if (item.vote != null) voted += 1;
		else unvoted += 1;
		if (item.notes) notes += 1;
	}
	return { voted, unvoted, notes };
});

const filters = $derived.by(() => {
	const counts = filterCounts;
	return [
		{
			value: "all",
			label: i18n(I18nKey.vndbFilterAll),
			count: safeItems.length,
		},
		{
			value: "voted",
			label: i18n(I18nKey.vndbFilterVoted),
			count: counts.voted,
		},
		{
			value: "unvoted",
			label: i18n(I18nKey.vndbFilterUnvoted),
			count: counts.unvoted,
		},
		{
			value: "notes",
			label: i18n(I18nKey.vndbFilterNotes),
			count: counts.notes,
		},
	].filter((filter) => filter.value === "all" || filter.count > 0);
});

let activeFilter = $state("all");
let currentPage = $state(1);

const filteredItems = $derived.by(() => {
	if (activeFilter === "all") return safeItems;
	if (activeFilter === "voted")
		return safeItems.filter((item) => item.vote != null);
	if (activeFilter === "unvoted")
		return safeItems.filter((item) => item.vote == null);
	if (activeFilter === "notes") return safeItems.filter((item) => item.notes);
	return safeItems;
});

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

<div class="media-section" class:hidden={!isActive} data-section={sectionId}>
  {#if safeItems.length > 0}
    <FilterControls
      filters={filters}
      activeFilter={activeFilter}
      onFilterChange={handleFilterChange}
    />

    <div class="media-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {#each pagedItems as item (item.id)}
        <div
          class="media-item"
          data-item-section={sectionId}
          data-item-id={item.id}
        >
          <Card item={item} loadImage={isActive} {vnBaseUrl} nsfw={nsfw}/>
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
      <h3 class="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">{i18n(I18nKey.vndbNoData)}</h3>
      <p class="text-gray-500 dark:text-gray-500">{i18n(I18nKey.vndbNoDataDescription)}</p>
    </div>
  {/if}
</div>
