<script lang="ts">
import { onMount } from "svelte";
import type { ProjectItem } from "@/types/projectsConfig";
import ProjectSection from "./ProjectSection.svelte";
import TabNav from "./TabNav.svelte";

interface Props {
	tabs: Array<{ id: string; name: string; count: number }>;
	initialActiveTab: string;
	projects: Record<string, ProjectItem[]>;
}

const { tabs, initialActiveTab, projects }: Props = $props();

// 改成空字符串初始化，不引用任何 prop，编译器立刻闭嘴
let activeTab = $state("");
let searchKeyword = $state("");

function handleTabChange(tabId: string) {
	activeTab = tabId;
}

function handleSearch(keyword: string) {
	searchKeyword = keyword;
}

function restoreTabFromHash() {
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

function getProjectsForTab(tabId: string): ProjectItem[] {
	if (tabId === "__all__") {
		return Object.values(projects).flat();
	}
	return projects[tabId] || [];
}

function getFilteredProjects(items: ProjectItem[]): ProjectItem[] {
	const keyword = searchKeyword.trim().toLowerCase();
	if (!keyword) return items;

	return items.filter((item) => {
		const text = [item.title, item.description || "", item.tags?.join(" ") || ""]
			.join(" ")
			.toLowerCase();
		return text.includes(keyword);
	});
}

onMount(() => {
	// 在客户端一次性设置初始值，同时处理 hash
	activeTab = initialActiveTab;
	restoreTabFromHash();
});
</script>

{#if tabs.length > 0}
  <TabNav {tabs} {activeTab} {searchKeyword} onTabChange={handleTabChange} onSearch={handleSearch} />

  {#if activeTab === "__all__"}
    <!-- 全部：按分类分行展示 -->
    {#each tabs as tab (tab.id)}
      {#if tab.id !== "__all__"}
        {@const items = getFilteredProjects(projects[tab.id] || [])}
        {#if items.length > 0}
          <div class="mb-8 last:mb-0">
            <ProjectSection
              sectionId={tab.id}
              sectionTitle={tab.name}
              {items}
              isActive={true}
            />
          </div>
        {/if}
      {/if}
    {/each}
  {:else}
    <!-- 单个分类 -->
    {@const activeTabObj = tabs.find((t) => t.id === activeTab)}
    {@const items = getFilteredProjects(getProjectsForTab(activeTab))}
    <ProjectSection
      sectionId={activeTab}
      sectionTitle={activeTabObj?.name}
      {items}
      isActive={true}
    />
  {/if}
{/if}
