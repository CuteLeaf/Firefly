<script lang="ts">
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import type { UserSubjectCollection } from "@/types/bangumi";

interface Props {
	item: UserSubjectCollection;
	loadImage?: boolean;
	subjectBaseUrl?: string;
}

const {
	item,
	loadImage = false,
	subjectBaseUrl = "https://bangumi.one/subject/",
}: Props = $props();

const STATUS_COLORS: Record<number, string> = {
	1: "bg-blue-500",
	2: "bg-green-500",
	3: "bg-yellow-500",
	4: "bg-orange-500",
	5: "bg-red-500",
};

function getStatusText(type: number): string {
	const subjectType = item.subject?.type;
	switch (type) {
		case 1:
			if (subjectType === 1) return i18n(I18nKey.bangumiStatusBookWish);
			if (subjectType === 3) return i18n(I18nKey.bangumiStatusMusicWish);
			if (subjectType === 4) return i18n(I18nKey.bangumiStatusGameWish);
			return i18n(I18nKey.bangumiStatusWish);
		case 2:
			if (subjectType === 1) return i18n(I18nKey.bangumiStatusBookRead);
			if (subjectType === 3) return i18n(I18nKey.bangumiStatusMusicListened);
			if (subjectType === 4) return i18n(I18nKey.bangumiStatusGamePlayed);
			return i18n(I18nKey.bangumiStatusWatched);
		case 3:
			if (subjectType === 1) return i18n(I18nKey.bangumiStatusBookReading);
			if (subjectType === 3) return i18n(I18nKey.bangumiStatusMusicListening);
			if (subjectType === 4) return i18n(I18nKey.bangumiStatusGamePlaying);
			return i18n(I18nKey.bangumiStatusWatching);
		case 4:
			return i18n(I18nKey.bangumiStatusOnHold);
		case 5:
			return i18n(I18nKey.bangumiStatusDropped);
		default:
			return i18n(I18nKey.bangumiStatusUnknown);
	}
}

const tags = $derived(
	item.tags && item.tags.length > 0
		? item.tags
		: (item.subject?.tags || []).map((t) => t.name).slice(0, 5),
);
const visibleTags = $derived(tags.slice(0, 3));
const hiddenTagCount = $derived(Math.max(tags.length - visibleTags.length, 0));

const FAILED_COVERS_KEY = "bangumi-failed-covers";

function getFailedCovers(): Set<string> {
	try {
		return new Set(JSON.parse(localStorage.getItem(FAILED_COVERS_KEY) || "[]"));
	} catch {
		return new Set();
	}
}

function markCoverFailed(url: string) {
	try {
		const failed = getFailedCovers();
		failed.add(url);
		const arr = [...failed];
		localStorage.setItem(FAILED_COVERS_KEY, JSON.stringify(arr.slice(-200)));
	} catch {
		// localStorage 不可用时静默忽略
	}
}

const images = $derived(item.subject?.images);
const coverFallbacks = $derived(
	images
		? [images.medium, images.common, images.small, images.large].filter(Boolean)
		: [],
);
const title = $derived(item.subject?.name_cn || item.subject?.name || "");
const year = $derived(
	item.subject?.date ? item.subject.date.substring(0, 4) : "",
);
const statusColor = $derived(STATUS_COLORS[item.type] || "bg-gray-500");
const score = $derived(item.subject?.score || 0);

// SSR 阶段用第一个 URL，客户端挂载后跳过已知失败的 URL
let initialSrc = $state("");

$effect(() => {
	const srcs = coverFallbacks;
	initialSrc = srcs[0] || "";
	if (typeof window === "undefined" || srcs.length === 0) return;
	const failed = getFailedCovers();
	const firstGood = srcs.find((url) => !failed.has(url));
	if (firstGood) initialSrc = firstGood;
});

function handleLoad(e: Event) {
	const img = e.currentTarget as HTMLImageElement;
	img.style.opacity = "1";
	const ph = img.parentElement?.querySelector(".lqip-placeholder");
	if (ph) ph.classList.add("loaded");
}

function handleError(e: Event) {
	const img = e.currentTarget as HTMLImageElement;
	const current = img.src;
	markCoverFailed(current);
	const idx = coverFallbacks.indexOf(current);
	if (idx >= 0 && idx < coverFallbacks.length - 1) {
		img.src = coverFallbacks[idx + 1];
	} else {
		img.style.display = "none";
	}
}
</script>

<a
  href="{subjectBaseUrl}{item.subject?.id}"
  target="_blank"
  rel="noopener noreferrer nofollow"
  class="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] block"
>
  <div class="aspect-2/3 relative overflow-hidden">
    {#if initialSrc}
      <div class="lqip-placeholder absolute inset-0 pointer-events-none" style="background: var(--muted)" aria-hidden="true"></div>
      <img
        src={loadImage ? initialSrc : undefined}
        data-src={loadImage ? undefined : initialSrc}
        alt={title}
        class="w-full h-full object-cover pointer-events-none opacity-0 transition-all duration-500 ease-out group-hover:scale-105"
        loading="lazy"
        decoding="async"
        onload={handleLoad}
        onerror={handleError}
      />
    {:else}
      <div class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <div class="text-gray-400 text-4xl">📖</div>
      </div>
    {/if}

    <!-- Status badge -->
    <div class="absolute top-2 left-2 px-2 py-1 rounded-full text-xs text-white font-medium {statusColor}">
      {getStatusText(item.type)}
    </div>

    <!-- Score badge -->
    {#if score}
      <div class="absolute top-2 right-2 px-2 py-1 rounded-full text-xs text-white font-medium bg-black/50 backdrop-blur-sm flex items-center gap-1">
        <span class="text-yellow-400">⭐</span>
        {score}
      </div>
    {/if}

    <!-- Gradient overlay + info -->
    <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
    <div class="absolute bottom-0 left-0 right-0 p-3">
      <h3 class="font-bold text-sm text-white line-clamp-2 drop-shadow-lg">{title}</h3>
      {#if year}
        <p class="text-xs text-white/60 mt-1">{year}</p>
      {/if}
      {#if item.comment}
        <p class="text-xs text-white/75 line-clamp-1 mt-1 leading-relaxed" title={item.comment}>{item.comment}</p>
      {/if}
      {#if visibleTags.length > 0}
        <div class="flex flex-wrap gap-1 mt-1.5">
          {#each visibleTags as tag}
            <span class="text-[0.6rem] px-1.5 py-0.5 rounded bg-white/20 text-white/90 backdrop-blur-sm">{tag}</span>
          {/each}
          {#if hiddenTagCount > 0}
            <span class="text-[0.6rem] px-1.5 py-0.5 rounded bg-white/20 text-white/60 backdrop-blur-sm">+{hiddenTagCount}</span>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</a>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-1 {
    display: -webkit-box;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
