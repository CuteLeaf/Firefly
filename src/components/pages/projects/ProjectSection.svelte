<script lang="ts">
import type { ProjectItem } from "@/types/projectsConfig";
import ProjectCard from "./ProjectCard.svelte";

interface Props {
	sectionId: string;
	sectionTitle?: string;
	items: ProjectItem[];
	isActive: boolean;
}

const { sectionId, sectionTitle, items, isActive }: Props = $props();
</script>

<div id="projects-section-{sectionId}" class="{isActive ? 'block' : 'hidden'}">
  {#if sectionTitle}
    <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
      <span class="w-1 h-5 rounded-full bg-(--primary)"></span>
      {sectionTitle}
      <span class="text-sm font-normal text-neutral-500 dark:text-neutral-400">({items.length})</span>
    </h3>
  {/if}
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {#each items as item (item.id)}
      <ProjectCard {item} />
    {/each}
  </div>
</div>
