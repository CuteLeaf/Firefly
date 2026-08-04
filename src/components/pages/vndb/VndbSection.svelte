<script lang="ts">
import ClientPagination from "@/components/common/ClientPagination.svelte";
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import type { VndbUlistEntry } from "@/types/vndb";
import Card from "./Card.svelte";
import FilterControls from "./FilterControls.svelte";

interface Props {
	sectionId: string;
	items: VndbUlistEntry[];
	isActive: boolean;
	itemsPerPage?: number;
	vnBaseUrl?: string;
}

const {
	sectionId,
	items,
	isActive,
	itemsPerPage = 24,
	vnBaseUrl,
}: Props = $props();

const filterCounts = $derived(() => {
	let voted = 0;
	let unvoted = 0;
	let notes = 0;
	for (const item of items) {
		if (item.vote != null) voted += 1;
		else unvoted += 1;
		if (item.notes) notes += 1;
	}
	return { voted, unvoted, notes };
});

const filters = $derived(() => {
	const counts = filterCounts();
	return [
		{
			value: "all",
			label: i18n(I18nKey.vndbFilterAll),
			count: items.length,
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

const filteredItems = $derived(() => {
	if (activeFilter === "all") return items;
	if (activeFilter === "voted")
		return items.filter((item) => item.vote != null);
	if (activeFilter === "unvoted")
		return items.filter((item) => item.vote == null);
	if (activeFilter === "notes") return items.filter((item) => item.notes);
	return items;
});

const totalPages = $derived(() =>
	Math.max(1, Math.ceil(filteredItems().length / itemsPerPage)),
);

const pagedItems = $derived(() =>
	filteredItems().slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	),
);

function handleFilterChange(filter: string) {
	activeFilter = filter;
	currentPage = 1;
}

function goToPage(page: number) {
	if (page >= 1 && page <= totalPages()) {
		currentPage = page;
	}
}
</script>

<div class="vndb-section" class:hidden={!isActive} data-section={sectionId}>
  {#if items.length > 0}
    <FilterControls
      filters={filters()}
      activeFilter={activeFilter}
      onFilterChange={handleFilterChange}
    />

    <div class="bangumi-masonry grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {#each pagedItems() as item (item.id)}
        <div
          class="vndb-item"
          data-item-section={sectionId}
          data-item-id={item.id}
        >
          <Card item={item} loadImage={isActive} {vnBaseUrl} />
        </div>
      {/each}
    </div>

    <ClientPagination
      totalItems={filteredItems().length}
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
