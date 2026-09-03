<script lang="ts">
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import type { MalListItem } from "@/types/mal";
import type { NsfwMode } from "@/types/nsfw";
import { getFailedCovers, markCoverFailed } from "@/utils/failed-covers";
import {
	getMalSeasonText,
	getMalStatusText,
	type MalListKind,
} from "@/utils/mal-utils";
import { isMalNsfw } from "@/utils/nsfw-utils";

interface Props {
	item: MalListItem;
	loadImage?: boolean;
	kind?: MalListKind;
	baseUrl?: string;
	nsfw?: NsfwMode; // NSFW 处理："off" | "blur" | "hide"
}

const {
	item,
	loadImage = false,
	kind = "anime",
	baseUrl = "https://myanimelist.net/anime/",
	nsfw = "off",
}: Props = $props();

const STATUS_COLORS: Record<string, string> = {
	watching: "bg-yellow-500",
	reading: "bg-yellow-500",
	completed: "bg-green-500",
	on_hold: "bg-orange-500",
	dropped: "bg-red-500",
	plan_to_watch: "bg-blue-500",
	plan_to_read: "bg-blue-500",
	unknown: "bg-gray-500",
};

const node = $derived(item.node);
const isManga = $derived(kind === "manga");
const userStatus = $derived(item.list_status?.status || "unknown");
const statusText = $derived(getMalStatusText(userStatus));
const statusColor = $derived(STATUS_COLORS[userStatus] || "bg-gray-500");

const title = $derived(node.title || "MAL");
const altTitle = $derived(
	node.alternative_titles?.en && node.alternative_titles.en !== title
		? node.alternative_titles.en
		: node.alternative_titles?.ja && node.alternative_titles.ja !== title
			? node.alternative_titles.ja
			: "",
);
const coverUrl = $derived(
	node.main_picture?.large || node.main_picture?.medium || "",
);
const userScore = $derived(item.list_status?.score || 0);
const meanScore = $derived(node.mean || 0);

// NSFW 封面模糊：mode === "blur" 且命中时模糊封面
const imageNsfw = $derived(nsfw === "blur" && isMalNsfw(item));

// 日期：动画用季度+年份，漫画用起始日期年份
const seasonText = $derived(
	isManga
		? ""
		: node.start_season
			? [
					getMalSeasonText(node.start_season.season || ""),
					node.start_season.year,
				]
					.filter(Boolean)
					.join(" ")
			: "",
);
const yearText = $derived(
	isManga ? (node.start_date ? node.start_date.substring(0, 4) : "") : "",
);
const dateText = $derived(seasonText || yearText);

// 进度：动画看集数，漫画看章节（无章节信息时回退到卷数）
const watched = $derived(
	isManga
		? item.list_status?.num_chapters_read || 0
		: item.list_status?.num_episodes_watched || 0,
);
const total = $derived(
	isManga ? node.num_chapters || 0 : node.num_episodes || 0,
);
const volumesWatched = $derived(item.list_status?.num_volumes_read || 0);
const volumesTotal = $derived(node.num_volumes || 0);
const episodesText = $derived(
	watched > 0
		? `${watched}${total ? `/${total}` : ""}`
		: total > 0
			? `0/${total}`
			: "",
);
const volumesText = $derived(
	volumesWatched > 0
		? `${volumesWatched}${volumesTotal ? `/${volumesTotal}` : ""}卷`
		: "",
);
const progressText = $derived(
	isManga
		? [episodesText, volumesText].filter(Boolean).join(" ")
		: episodesText,
);
const genreNames = $derived((node.genres || []).map((g) => g.name));
const visibleGenres = $derived(genreNames.slice(0, 2));
const hiddenGenreCount = $derived(
	Math.max(genreNames.length - visibleGenres.length, 0),
);
const link = $derived(`${baseUrl}${node.id}`);

const FAILED_COVERS_KEY = "mal-failed-covers";

const srcs = $derived(coverUrl ? [coverUrl] : []);
let initialSrc = $state("");

$effect(() => {
	const sources = srcs;
	initialSrc = sources[0] || "";
	if (typeof window === "undefined" || sources.length === 0) return;
	const failed = getFailedCovers(FAILED_COVERS_KEY);
	const firstGood = sources.find((url) => !failed.has(url));
	if (firstGood) initialSrc = firstGood;
});

function handleLoad(e: Event) {
	const img = e.currentTarget as HTMLImageElement;
	img.style.opacity = "1";
	const placeholder = img.parentElement?.querySelector(".lqip-placeholder");
	if (placeholder) placeholder.classList.add("loaded");
}

function handleError(e: Event) {
	const img = e.currentTarget as HTMLImageElement;
	markCoverFailed(img.src, FAILED_COVERS_KEY);
	img.style.display = "none";
}
</script>

<a
  href={link}
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
        style={imageNsfw ? "filter: blur(20px)" : undefined}
        loading="lazy"
        decoding="async"
        onload={handleLoad}
        onerror={handleError}
      />
    {:else}
      <div class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <div class="text-gray-400 dark:text-gray-500 text-4xl font-bold">MAL</div>
      </div>
    {/if}

    <div class="absolute top-2 left-2 px-2 py-1 rounded-full text-xs text-white font-medium {statusColor}">
      {statusText}
    </div>

    {#if userScore > 0}
      <div class="absolute top-2 right-2 px-2 py-1 rounded-full text-xs text-white font-medium bg-black/50 backdrop-blur-sm flex items-center gap-1">
        <span class="text-yellow-400">&#11088;</span>
        {userScore}
      </div>
    {/if}

    <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
    <div class="absolute bottom-0 left-0 right-0 p-3">
      <h3 class="font-bold text-sm text-white line-clamp-2 drop-shadow-lg">{title}</h3>
      {#if altTitle}
        <p class="text-xs text-white/60 mt-0.5 line-clamp-1">{altTitle}</p>
      {/if}
      {#if dateText || progressText}
        <p class="text-xs text-white/70 mt-1">
          {#if dateText}{dateText}{/if}
          {#if dateText && progressText} · {/if}
          {#if progressText}{progressText}{/if}
        </p>
      {/if}
      {#if meanScore > 0}
        <p class="text-xs text-white/70 mt-0.5">
          <span class="text-yellow-300 font-medium">MAL</span> {meanScore}
        </p>
      {/if}
      {#if visibleGenres.length > 0}
        <div class="flex flex-wrap gap-1 mt-1.5">
          {#each visibleGenres as genre}
            <span class="text-[0.6rem] px-1.5 py-0.5 rounded bg-white/20 text-white/90 backdrop-blur-sm">{genre}</span>
          {/each}
          {#if hiddenGenreCount > 0}
            <span class="text-[0.6rem] px-1.5 py-0.5 rounded bg-white/20 text-white/60 backdrop-blur-sm">+{hiddenGenreCount}</span>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</a>
