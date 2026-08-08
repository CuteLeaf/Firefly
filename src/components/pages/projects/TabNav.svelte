<script lang="ts">
import Icon from "@/components/common/Icon.svelte";
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";

interface Tab {
	id: string;
	name: string;
	count?: number;
}

interface Props {
	tabs: Tab[];
	activeTab: string;
	searchKeyword: string;
	onTabChange: (tabId: string) => void;
	onSearch: (keyword: string) => void;
}

const { tabs, activeTab, searchKeyword, onTabChange, onSearch }: Props = $props();

function handleHashChange() {
	const hash = window.location.hash.replace(/^#/, "");
	if (hash) {
		try {
			const decoded = decodeURIComponent(hash);
			if (tabs.some((t) => t.id === decoded)) {
				onTabChange(decoded);
			}
		} catch {}
	}
}

$effect(() => {
	window.addEventListener("hashchange", handleHashChange);
	return () => window.removeEventListener("hashchange", handleHashChange);
});

function clickTab(tabId: string) {
	onTabChange(tabId);
	if (tabId === "__all__") {
		if (window.location.hash) {
			window.history.replaceState(null, "", window.location.pathname + window.location.search);
		}
		return;
	}
	const nextHash = `#${encodeURIComponent(tabId)}`;
	if (window.location.hash !== nextHash) {
		window.history.replaceState(null, "", nextHash);
	}
}

function handleInput(event: Event) {
	const value = (event.target as HTMLInputElement).value;
	onSearch(value);
}
</script>

<div class="mb-6">
  <!-- 搜索框 -->
  <div class="relative max-w-md mb-4">
    <Icon icon="material-symbols:search" class="absolute left-3 top-1/2 -translate-y-1/2 text-[1.25rem] text-neutral-900 dark:text-neutral-100" />
    <input
      type="text"
      value={searchKeyword}
      placeholder={i18n(I18nKey.search)}
      oninput={handleInput}
      class="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-neutral-800 border border-(--line-divider) text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-(--primary) transition-colors"
    />
  </div>

  <div class="border-b border-(--line-divider)">
    <div class="overflow-x-auto" data-tab-scroll-container>
      <nav class="flex min-w-max space-x-8" aria-label="Project tabs">
        {#each tabs as tab}
          <button
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 {tab.id === activeTab
              ? 'border-(--primary) text-(--primary)'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}"
            onclick={() => clickTab(tab.id)}
            type="button"
          >
            {tab.name}
            {#if tab.count !== undefined}
              <span class="ml-2 bg-(--btn-regular-bg) text-(--btn-content) py-0.5 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            {/if}
          </button>
        {/each}
      </nav>
    </div>
  </div>
</div>
