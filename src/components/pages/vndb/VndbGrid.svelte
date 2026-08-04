<script lang="ts">
import { onMount } from "svelte";
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import type { VndbUlistEntry } from "@/types/vndb";
import {
	buildVndbTabs,
	fetchVndbUlist,
	getVndbItemsForTab,
	type VndbTab,
} from "@/utils/vndb-utils";
import TabNav from "./TabNav.svelte";
import VndbSection from "./VndbSection.svelte";

interface Props {
	tabs?: VndbTab[];
	initialActiveTab?: string;
	vndbData?: Record<string, VndbUlistEntry[]>;
	vnBaseUrl?: string;
	blurNsfw?: boolean;
	fetchConfig?: {
		userId: string;
		apiUrl: string;
		apiToken?: string;
		vnBaseUrl: string;
		pagination: { limit: number; delay: number; maxTotal: number };
		blurNsfw: boolean;
	};
}

const {
	tabs: staticTabs,
	initialActiveTab,
	vndbData: staticData,
	vnBaseUrl,
	fetchConfig,
	blurNsfw
}: Props = $props();

const isDynamic = $derived(!!fetchConfig);

let activeTab = $state("");
let fetchLoading = $state(false);
let error = $state(false);
let errorTitle = $state("");
let errorDesc = $state("");
let dynamicTabs = $state<VndbTab[]>([]);
let dynamicData = $state<Record<string, VndbUlistEntry[]>>({});

const tabs = $derived(staticTabs || dynamicTabs);
const vndbData = $derived(staticData || dynamicData);

$effect(() => {
	if (initialActiveTab) {
		activeTab = initialActiveTab;
	}
	if (fetchConfig) {
		fetchLoading = true;
		error = false;
	}
});

function handleTabChange(tabId: string) {
	activeTab = tabId;
}

async function loadDynamicData() {
	if (!fetchConfig) return;
	const { userId, apiUrl, apiToken, pagination } = fetchConfig;
	const { limit, delay, maxTotal } = pagination;
	const allItems: VndbUlistEntry[] = [];
	let page = 1;

	try {
		while (true) {
			if (maxTotal > 0 && allItems.length >= maxTotal) break;
			const data = await fetchVndbUlist({
				apiUrl,
				userId,
				apiToken,
				results: limit,
				page,
			});
			const batch = data.results || [];
			allItems.push(...batch);
			if (!data.more || batch.length === 0) break;
			page += 1;
			await new Promise((resolve) => setTimeout(resolve, delay));
		}

		if (allItems.length === 0) {
			fetchLoading = false;
			error = true;
			errorTitle = i18n(I18nKey.vndbNoData);
			errorDesc = i18n(I18nKey.vndbNoDataDescription);
			return;
		}

		const newTabs = buildVndbTabs(allItems);
		const newData: Record<string, VndbUlistEntry[]> = { all: allItems };
		dynamicTabs = newTabs;
		dynamicData = newData;
		activeTab = newTabs[0]?.id || "all";
		fetchLoading = false;
	} catch (e) {
		console.error("[VNDB] 获取数据失败:", e);
		fetchLoading = false;
		error = true;
		errorTitle = i18n(I18nKey.vndbFetchError);
		errorDesc = i18n(I18nKey.vndbFetchErrorDesc);
	}
}

onMount(async () => {
	if (isDynamic) {
		await loadDynamicData();
	}
});
</script>

{#if isDynamic && fetchLoading}
  <div class="border-b border-(--line-divider) mb-3">
    <div class="flex min-w-max space-x-8">
      {#each [1, 2, 3, 4] as _}
        <div class="h-10 w-20 bg-(--btn-regular-bg) rounded animate-pulse"></div>
      {/each}
    </div>
  </div>
  <div class="flex flex-wrap gap-1.5 mb-4">
    {#each [1, 2, 3, 4] as _}
      <div class="h-7 w-16 bg-(--btn-regular-bg) rounded-full animate-pulse"></div>
    {/each}
  </div>
  <div class="bangumi-masonry grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
    {#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as _}
      <div class="rounded-xl overflow-hidden">
        <div class="aspect-2/3 bg-(--btn-regular-bg) animate-pulse"></div>
      </div>
    {/each}
  </div>
  <div class="mt-6 flex items-center justify-center gap-3">
    <div class="w-11 h-11 bg-(--btn-regular-bg) rounded-lg animate-pulse"></div>
    <div class="w-16 h-8 bg-(--btn-regular-bg) rounded animate-pulse"></div>
    <div class="w-11 h-11 bg-(--btn-regular-bg) rounded-lg animate-pulse"></div>
  </div>
{:else if isDynamic && error}
  <div class="text-center py-16">
    <div class="inline-flex items-center justify-center w-16 h-16 bg-(--btn-regular-bg) rounded-full mb-6 border border-(--line-divider)">
      <span class="text-[2rem] text-red-500">&#9888;</span>
    </div>
    <h2 class="text-xl font-semibold text-black/80 dark:text-white/80 mb-3">{errorTitle}</h2>
    <p class="text-black/60 dark:text-white/60 mb-4 max-w-md mx-auto">{errorDesc}</p>
  </div>
{:else if tabs.length > 0}
  <TabNav {tabs} {activeTab} onTabChange={handleTabChange} />

  {#each tabs as tab (tab.id)}
    <VndbSection
      sectionId={tab.id}
      items={getVndbItemsForTab(vndbData.all || [], tab.id)}
      isActive={tab.id === activeTab}
      itemsPerPage={24}
      {vnBaseUrl}
	  blurNsfw={blurNsfw ?? fetchConfig?.blurNsfw ?? true}
    />
  {/each}
{/if}
