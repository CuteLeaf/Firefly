<script lang="ts">
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import type { StandardizedAnime } from "@/types/anime";

interface Props {
	item: StandardizedAnime;
	onselect?: (item: StandardizedAnime) => void;
}

const { item, onselect }: Props = $props();

function handleDetailClick(e: MouseEvent) {
	e.preventDefault();
	e.stopPropagation();
	onselect?.(item);
}
</script>

<a
  href={item.link}
  target="_blank"
  rel="noopener noreferrer"
  class="block rounded-xl overflow-hidden bg-(--card-bg) border border-(--line-divider) hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
>
  <!-- 封面图 -->
  <div class="relative aspect-[2/3] overflow-hidden bg-(--btn-regular-bg)">
    {#if item.poster}
      <img
        src={item.poster}
        alt={item.title}
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
        referrerpolicy="no-referrer"
      />
    {:else}
      <div class="w-full h-full flex items-center justify-center text-neutral-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24"><path fill="currentColor" d="M21 5v6.5h-2V7H5v10h6.5v2H3V5zm4 4v10q0 .825-.587 1.413T20 21H8q-.825 0-1.412-.587T6 20V8q0-.825.588-1.412T8 5h10q.825 0 1.413.588T20 7zm-4 8V9H8v12h12zm-6-1"/></svg>
      </div>
    {/if}

    <!-- 评分角标 -->
    {#if item.rating > 0}
      <div class="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-yellow-400 px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="0.75em" height="0.75em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21z"/></svg>
        <span>{item.rating.toFixed(1)}</span>
      </div>
    {/if}

    <!-- 类型角标 -->
    <div class="absolute top-2 left-2 bg-(--primary)/80 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
      {item.type === "movie" ? i18n(I18nKey.animeMovie) : i18n(I18nKey.animeTV)}
    </div>

    <!-- 悬停遮罩 -->
    <div class="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4 text-center">
      <p class="text-white text-sm line-clamp-6 mb-4 leading-relaxed">
        {item.overview || "暂无简介"}
      </p>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/50 text-white text-xs hover:bg-white/20 transition-colors cursor-pointer"
        onclick={handleDetailClick}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="0.875em" height="0.875em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 16q-1.675 0-2.837-1.163T8 12t1.163-2.837T12 8t2.838 1.163T16 12t-1.162 2.838T12 16m0-1.8q.975 0 1.663-.687T14.4 12t-.687-1.663T12 9.6t-1.663.688T9.6 12t.687 1.663T12 14.2m0 4.8q-3.35 0-5.675-1.888T4 12q0-3.35 2.325-5.675T12 4q3.35 0 5.675 2.325T20 12q0 3.35-2.325 5.675T12 19M2 12q0-3.95 2.55-6.975T11.5 2.15q.425-.05.7.225t.25.675q0 .575-.2.95q-.15.275-.475.375q-2.325.525-3.863 2.45T6.5 12q0 2.625 1.538 4.55t3.862 2.45q.325.1.475.375t.2.95q0 .45-.25.675t-.7.225q-3.425-.7-5.975-3.725T2 12"/></svg>
        {i18n(I18nKey.animeViewDetails)}
      </button>
    </div>
  </div>

  <!-- 信息区域 -->
  <div class="p-3">
    <h3
      class="font-bold text-sm mb-0.5 line-clamp-1 text-neutral-800 dark:text-neutral-200 group-hover:text-(--primary) transition-colors"
      title={item.title}
    >
      {item.title}
    </h3>
    {#if item.originalTitle && item.originalTitle !== item.title}
      <p class="text-[10px] text-neutral-400 dark:text-neutral-500 line-clamp-1 mb-1 font-mono" title={item.originalTitle}>
        {item.originalTitle}
      </p>
    {/if}
    <div class="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
      <span class="flex items-center gap-1">
        {#if item.source === "bilibili" && item.epStatus}
          <svg xmlns="http://www.w3.org/2000/svg" width="0.75em" height="0.75em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m-2 14.5v-9l6 4.5z"/></svg>
          {item.epStatus}
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" width="0.75em" height="0.75em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 16H5V10h14zm0-12H5V6h14M9 14H7v-2h2zm4 0h-2v-2h2zm4 0h-2v-2h2zm-8 4H7v-2h2zm4 0h-2v-2h2zm4 0h-2v-2h2z"/></svg>
          {item.date ? item.date.split("-")[0] : "未知"}
        {/if}
      </span>
      <span class="flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="0.75em" height="0.75em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"/></svg>
        {item.source === "bilibili" ? "Bilibili" : "TMDB"}
      </span>
    </div>
  </div>
</a>

<style>
  .line-clamp-6 {
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
