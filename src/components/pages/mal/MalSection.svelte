<script lang="ts">
import ClientPagination from "@/components/common/ClientPagination.svelte";
import FilterControls from "@/components/common/FilterControls.svelte";
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import type { MalListItem } from "@/types/mal";
import type { NsfwMode } from "@/types/nsfw";
import {
	getMalStatusOrder,
	getMalStatusText,
	type MalListKind,
} from "@/utils/mal-utils";
import { filterNsfw, isMalNsfw } from "@/utils/nsfw-utils";
import Card from "./Card.svelte";

interface Props {
	sectionId: string;
	items: MalListItem[];
	isActive: boolean;
	itemsPerPage?: number;
	kind?: MalListKind;
	baseUrl?: string;
	nsfw?: NsfwMode; // NSFW 处理："off" | "blur" | "hide"
}

const {
	sectionId,
	items,
	isActive,
	itemsPerPage = 24,
	kind = "anime",
	baseUrl = "https://myanimelist.net/anime/",
	nsfw = "off",
}: Props = $props();

// NSFW 拦截：mode === "hide" 时过滤掉命中条目
const safeItems = $derived(filterNsfw(items, nsfw, isMalNsfw));

// 状态胶囊：全部 + 各观看/阅读状态（只显示有条目的）
const filters = $derived.by(() => {
	const counts: Record<string, number> = {};
	for (const item of safeItems) {
		const status = item.list_status?.status || "unknown";
		counts[status] = (counts[status] || 0) + 1;
	}
	return [
		{
			value: "all",
			label: i18n(I18nKey.malFilterAll),
			count: safeItems.length,
		},
		...getMalStatusOrder(kind)
			.filter((status) => counts[status])
			.map((status) => ({
				value: status,
				label: getMalStatusText(status),
				count: counts[status],
			})),
	];
});

let activeFilter = $state("all");
let currentPage = $state(1);

const filteredItems = $derived.by(() => {
	if (activeFilter === "all") return safeItems;
	return safeItems.filter(
		(item) => (item.list_status?.status || "unknown") === activeFilter,
	);
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
      {#each pagedItems as item (item.node.id)}
        <div
          class="media-item"
          data-item-section={sectionId}
          data-item-status={item.list_status?.status || "unknown"}
        >
          <Card item={item} loadImage={isActive} {kind} {baseUrl} {nsfw}/>
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
      <h3 class="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">{i18n(I18nKey.malNoData)}</h3>
      <p class="text-gray-500 dark:text-gray-500">{i18n(I18nKey.malNoDataDescription)}</p>
    </div>
  {/if}
</div>
