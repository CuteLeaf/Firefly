<script lang="ts">
import { onMount } from "svelte";
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import type { UserSubjectCollection } from "@/types/bangumi";
import BangumiSection from "./BangumiSection.svelte";
import TabNav from "./TabNav.svelte";

interface Props {
	// 静态模式：直接传入数据
	tabs?: Array<{ id: string; name: string; count: number }>;
	initialActiveTab?: string;
	bangumiData?: Record<string, UserSubjectCollection[]>;
	subjectBaseUrl?: string;
	// 动态模式：传入获取配置
	fetchConfig?: {
		username: string;
		apiUrl: string;
		categories: Record<string, boolean>;
		categoryOrder: string[];
		pagination: { limit: number; delay: number; maxTotal: number };
	};
}

const {
	tabs: staticTabs,
	initialActiveTab,
	bangumiData: staticData,
	subjectBaseUrl,
	fetchConfig,
}: Props = $props();

const isDynamic = $derived(!!fetchConfig);

// 状态
let activeTab = $state("");
let fetchLoading = $state(false);
const loading = $derived(isDynamic && fetchLoading);
let error = $state(false);

// 初始化 activeTab / 当 fetchConfig 变化时重置状态
$effect(() => {
	if (initialActiveTab) {
		activeTab = initialActiveTab;
	}
	if (fetchConfig) {
		fetchLoading = true;
		error = false;
	}
});
let errorTitle = $state("");
let errorDesc = $state("");
let updateTimestamp = $state("");

// 动态模式的数据
let dynamicTabs = $state<Array<{ id: string; name: string; count: number }>>(
	[],
);
let dynamicData = $state<Record<string, UserSubjectCollection[]>>({});

// 合并后的数据
const tabs = $derived(staticTabs || dynamicTabs);
const bangumiData = $derived(staticData || dynamicData);

const categoryMap: Record<string, { name: string; subjectType: number }> = {
	book: { name: i18n(I18nKey.bangumiCategoryBook), subjectType: 1 },
	anime: { name: i18n(I18nKey.bangumiCategoryAnime), subjectType: 2 },
	music: { name: i18n(I18nKey.bangumiCategoryMusic), subjectType: 3 },
	game: { name: i18n(I18nKey.bangumiCategoryGame), subjectType: 4 },
	real: { name: i18n(I18nKey.bangumiCategoryReal), subjectType: 6 },
};

function handleTabChange(tabId: string) {
	activeTab = tabId;
}

async function fetchCategory(
	apiUrl: string,
	username: string,
	subjectType: number,
	pagination: { limit: number; delay: number; maxTotal: number },
): Promise<UserSubjectCollection[]> {
	const { limit, delay, maxTotal } = pagination;
	let offset = 0;
	const allItems: UserSubjectCollection[] = [];

	while (true) {
		if (maxTotal > 0 && allItems.length >= maxTotal) break;
		const url = `${apiUrl}/v0/users/${username}/collections?subject_type=${subjectType}&limit=${limit}&offset=${offset}`;
		const resp = await fetch(url, { headers: { Accept: "application/json" } });
		if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
		const data = await resp.json();
		const batch: UserSubjectCollection[] = data.data || [];
		if (batch.length > 0) {
			allItems.push(...batch);
			offset += limit;
			if (batch.length < limit) break;
			await new Promise((r) => setTimeout(r, delay));
		} else {
			break;
		}
	}
	return allItems;
}

async function loadDynamicData() {
	if (!fetchConfig) return;
	const { username, apiUrl, categories, categoryOrder, pagination } =
		fetchConfig;

	const enabled: string[] = [];
	for (const [k, v] of Object.entries(categories)) {
		if (v) enabled.push(k);
	}
	if (categoryOrder.length > 0) {
		enabled.sort((a, b) => {
			const ai = categoryOrder.indexOf(a);
			const bi = categoryOrder.indexOf(b);
			if (ai === -1 && bi === -1) return 0;
			if (ai === -1) return 1;
			if (bi === -1) return -1;
			return ai - bi;
		});
	}

	const newTabs: Array<{ id: string; name: string; count: number }> = [];
	const newData: Record<string, UserSubjectCollection[]> = {};

	for (const catKey of enabled) {
		const info = categoryMap[catKey];
		if (!info) continue;
		try {
			const data = await fetchCategory(
				apiUrl,
				username,
				info.subjectType,
				pagination,
			);
			newData[catKey] = data;
			newTabs.push({ id: catKey, name: info.name, count: data.length });
		} catch (e) {
			console.error(`[Bangumi] 获取 ${catKey} 数据失败:`, e);
			fetchLoading = false;
			error = true;
			errorTitle = i18n(I18nKey.bangumiFetchError);
			errorDesc = i18n(I18nKey.bangumiFetchErrorDesc);
			return;
		}
	}

	if (newTabs.length === 0 || newTabs.every((t) => t.count === 0)) {
		fetchLoading = false;
		error = true;
		errorTitle = i18n(I18nKey.bangumiNoData);
		errorDesc = i18n(I18nKey.bangumiNoDataDescription);
		return;
	}

	dynamicTabs = newTabs;
	dynamicData = newData;
	activeTab = newTabs[0].id;
	fetchLoading = false;

	const now = new Date();
	const pad = (n: number) => (n < 10 ? `0${n}` : String(n));
	updateTimestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

// 从 URL hash 恢复 tab
function restoreTabFromHash() {
	if (!isDynamic) {
		const hash = window.location.hash.replace(/^#/, "");
		if (hash) {
			try {
				const decoded = decodeURIComponent(hash);
				if (tabs.some((t) => t.id === decoded)) {
					activeTab = decoded;
				}
			} catch {}
		}
	}
}

onMount(async () => {
	restoreTabFromHash();
	if (isDynamic) {
		await loadDynamicData();
	}
});
</script>

{#if isDynamic && loading}
  <!-- Tab 骨架 -->
  <div class="border-b border-(--line-divider) mb-3">
    <div class="flex min-w-max space-x-8">
      {#each [1, 2, 3, 4] as _}
        <div class="h-10 w-20 bg-(--btn-regular-bg) rounded animate-pulse"></div>
      {/each}
    </div>
  </div>
  <!-- 筛选骨架 -->
  <div class="flex flex-wrap gap-1.5 mb-4">
    {#each [1, 2, 3, 4] as _}
      <div class="h-7 w-16 bg-(--btn-regular-bg) rounded-full animate-pulse"></div>
    {/each}
  </div>
  <!-- 卡片网格骨架 -->
  <div class="bangumi-masonry grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
    {#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as _}
      <div class="rounded-xl overflow-hidden">
        <div class="aspect-2/3 bg-(--btn-regular-bg) animate-pulse"></div>
      </div>
    {/each}
  </div>
  <!-- 分页骨架 -->
  <div class="mt-6 flex items-center justify-center gap-3">
    <div class="w-11 h-11 bg-(--btn-regular-bg) rounded-lg animate-pulse"></div>
    <div class="w-16 h-8 bg-(--btn-regular-bg) rounded animate-pulse"></div>
    <div class="w-11 h-11 bg-(--btn-regular-bg) rounded-lg animate-pulse"></div>
  </div>
{:else if isDynamic && error}
  <div class="text-center py-16">
    <div class="inline-flex items-center justify-center w-16 h-16 bg-(--btn-regular-bg) rounded-full mb-6 border border-(--line-divider)">
      <span class="text-[2rem] text-red-500">⚠</span>
    </div>
    <h2 class="text-xl font-semibold text-black/80 dark:text-white/80 mb-3">{errorTitle}</h2>
    <p class="text-black/60 dark:text-white/60 mb-4 max-w-md mx-auto">{errorDesc}</p>
  </div>
{:else if tabs.length > 0}
  <TabNav {tabs} {activeTab} onTabChange={handleTabChange} />

  {#each tabs as tab (tab.id)}
    <BangumiSection
      sectionId={tab.id}
      items={bangumiData[tab.id] || []}
      isActive={tab.id === activeTab}
      itemsPerPage={24}
      {subjectBaseUrl}
    />
  {/each}
{/if}
