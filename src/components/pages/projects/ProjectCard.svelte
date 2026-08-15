<script lang="ts">
import type { ProjectItem } from "@/types/projectsConfig";

interface Props {
	item: ProjectItem;
}

const { item }: Props = $props();

const tags = $derived(item.tags ?? []);
const visibleTags = $derived(tags.slice(0, 4));
const hiddenTagCount = $derived(Math.max(tags.length - visibleTags.length, 0));

const hasDetail = $derived(!!(item.content || (item.features && item.features.length > 0) || (item.screenshots && item.screenshots.length > 0)));
const href = $derived(item.link || (hasDetail ? `/projects/${item.id}/` : undefined));
const isExternal = $derived(item.external && !!item.link);
const clickable = $derived(!!href);

function handleLoad(e: Event) {
	const img = e.currentTarget as HTMLImageElement;
	img.style.opacity = "1";
	const ph = img.parentElement?.querySelector(".lqip-placeholder");
	if (ph) ph.classList.add("loaded");
}
</script>

{#if clickable}
  <a
    {href}
    target={isExternal ? "_blank" : undefined}
    rel={isExternal ? "noopener noreferrer nofollow" : undefined}
    class="group relative flex flex-col overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-(--card-bg) border border-(--line-divider) h-full"
  >
    <!-- 封面 -->
    <div class="aspect-[16/10] relative overflow-hidden bg-(--btn-regular-bg)">
      {#if item.cover}
        <div class="lqip-placeholder absolute inset-0 pointer-events-none" style="background: var(--muted)" aria-hidden="true"></div>
        <img
          src={item.cover}
          alt={item.title}
          class="w-full h-full object-cover opacity-0 transition-all duration-500 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
          onload={handleLoad}
        />
      {:else}
        <div class="w-full h-full flex items-center justify-center text-(--btn-content)">
          <span class="text-4xl">🚀</span>
        </div>
      {/if}
    </div>

    <!-- 内容 -->
    <div class="flex flex-col flex-1 p-4">
      <h3 class="font-bold text-base text-neutral-900 dark:text-neutral-100 line-clamp-1 mb-1 group-hover:text-(--primary) transition-colors">
        {item.title || "Untitled"}
      </h3>
      {#if item.description}
        <p class="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-3 flex-1">
          {item.description}
        </p>
      {:else}
        <div class="flex-1"></div>
      {/if}

      <div class="flex items-center justify-between mt-auto pt-2">
        {#if visibleTags.length > 0}
          <div class="flex flex-wrap gap-1.5">
            {#each visibleTags as tag}
              <span class="text-xs px-2 py-0.5 rounded-full bg-(--btn-regular-bg) text-(--btn-content)">{tag}</span>
            {/each}
            {#if hiddenTagCount > 0}
              <span class="text-xs px-2 py-0.5 rounded-full bg-(--btn-regular-bg) text-(--btn-content)">+{hiddenTagCount}</span>
            {/if}
          </div>
        {:else}
          <span></span>
        {/if}
        {#if item.date}
          <span class="text-xs text-neutral-500 dark:text-neutral-500 whitespace-nowrap ml-2">{item.date}</span>
        {/if}
      </div>
    </div>
  </a>
{:else}
  <div
    class="group relative flex flex-col overflow-hidden rounded-xl bg-(--card-bg) border border-(--line-divider) h-full cursor-default"
  >
    <!-- 封面 -->
    <div class="aspect-[16/10] relative overflow-hidden bg-(--btn-regular-bg)">
      {#if item.cover}
        <div class="lqip-placeholder absolute inset-0 pointer-events-none" style="background: var(--muted)" aria-hidden="true"></div>
        <img
          src={item.cover}
          alt={item.title}
          class="w-full h-full object-cover opacity-0 transition-all duration-500 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
          onload={handleLoad}
        />
      {:else}
        <div class="w-full h-full flex items-center justify-center text-(--btn-content)">
          <span class="text-4xl">🚀</span>
        </div>
      {/if}
    </div>

    <!-- 内容 -->
    <div class="flex flex-col flex-1 p-4">
      <h3 class="font-bold text-base text-neutral-900 dark:text-neutral-100 line-clamp-1 mb-1 group-hover:text-(--primary) transition-colors">
        {item.title || "Untitled"}
      </h3>
      {#if item.description}
        <p class="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-3 flex-1">
          {item.description}
        </p>
      {:else}
        <div class="flex-1"></div>
      {/if}

      <div class="flex items-center justify-between mt-auto pt-2">
        {#if visibleTags.length > 0}
          <div class="flex flex-wrap gap-1.5">
            {#each visibleTags as tag}
              <span class="text-xs px-2 py-0.5 rounded-full bg-(--btn-regular-bg) text-(--btn-content)">{tag}</span>
            {/each}
            {#if hiddenTagCount > 0}
              <span class="text-xs px-2 py-0.5 rounded-full bg-(--btn-regular-bg) text-(--btn-content)">+{hiddenTagCount}</span>
            {/if}
          </div>
        {:else}
          <span></span>
        {/if}
        {#if item.date}
          <span class="text-xs text-neutral-500 dark:text-neutral-500 whitespace-nowrap ml-2">{item.date}</span>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
