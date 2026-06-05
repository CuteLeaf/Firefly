<script lang="ts">
interface Tab {
	id: string;
	name: string;
	count?: number;
}

interface Props {
	tabs: Tab[];
	activeTab: string;
	onTabChange: (tabId: string) => void;
}

const { tabs, activeTab, onTabChange }: Props = $props();

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
	const nextHash = `#${encodeURIComponent(tabId)}`;
	if (window.location.hash !== nextHash) {
		window.history.replaceState(null, "", nextHash);
	}
}
</script>

<div class="border-b border-(--line-divider) mb-3">
  <div class="overflow-x-auto" data-tab-scroll-container>
    <nav class="flex min-w-max space-x-8" aria-label="Tabs">
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
