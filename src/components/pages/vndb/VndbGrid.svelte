<script lang="ts">
import { onMount } from "svelte";
import GridSkeleton from "@/components/common/GridSkeleton.svelte";
import TabNav from "@/components/common/TabNav.svelte";
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import type { NsfwMode } from "@/types/nsfw";
import type { VndbUlistEntry } from "@/types/vndb";
import { isVndbNsfw } from "@/utils/nsfw-utils";
import {
	buildVndbTabs,
	fetchVndbUlist,
	getVndbItemsForTab,
	type VndbTab,
} from "@/utils/vndb-utils";
import VndbSection from "./VndbSection.svelte";

interface Props {
	tabs?: VndbTab[];
	initialActiveTab?: string;
	vndbData?: Record<string, VndbUlistEntry[]>;
	vnBaseUrl?: string;
	nsfw?: NsfwMode; // NSFW 处理："off" | "blur" | "hide"
	fetchConfig?: {
		userId: string;
		apiUrl: string;
		apiToken?: string;
		vnBaseUrl: string;
		pagination: { limit: number; delay: number; maxTotal: number };
		nsfw?: NsfwMode;
	};
}

const {
	tabs: staticTabs,
	initialActiveTab,
	vndbData: staticData,
	vnBaseUrl,
	fetchConfig,
	nsfw,
}: Props = $props();

const nsfwMode = $derived(nsfw ?? fetchConfig?.nsfw ?? "off");

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
	let allItems: VndbUlistEntry[] = [];
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

		// NSFW 拦截：hide 模式下过滤掉 NSFW 条目，保持标签页计数一致
		if (nsfwMode === "hide") {
			allItems = allItems.filter((item) => !isVndbNsfw(item));
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
		console.error("[VNDB] Failed to fetch data:", e);
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
  <GridSkeleton />
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
	  nsfw={nsfwMode}
    />
  {/each}
{/if}
