<script lang="ts">
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import type { VndbUlistEntry } from "@/types/vndb";
import {
	formatVndbLength,
	getVndbStatusText,
	normalizeVndbLabel,
} from "@/utils/vndb-utils";

interface Props {
	item: VndbUlistEntry;
	loadImage?: boolean;
	vnBaseUrl?: string;
	blurNsfw: boolean;
}

const {
	item,
	loadImage = false,
	vnBaseUrl = "https://vndb.org/",
	blurNsfw,
}: Props = $props();

const STATUS_COLORS: Record<string, string> = {
	wishlist: "bg-blue-500",
	playing: "bg-yellow-500",
	finished: "bg-green-500",
	stalled: "bg-orange-500",
	dropped: "bg-red-500",
	unknown: "bg-gray-500",
};

const firstLabel = $derived(
	(item.labels || []).find((label) =>
		["wishlist", "playing", "finished", "stalled", "dropped"].includes(
			normalizeVndbLabel(label.label),
		),
	)?.label ||
		item.labels?.[0]?.label ||
		"",
);
const labelKey = $derived(normalizeVndbLabel(firstLabel));
const statusText = $derived(
	firstLabel
		? getVndbStatusText(labelKey, firstLabel)
		: i18n(I18nKey.vndbStatusUnknown),
);
const statusColor = $derived(STATUS_COLORS[labelKey] || "bg-gray-500");

const title = $derived(item.vn?.alttitle || item.vn?.title || "VNDB");
const altTitle = $derived(
	item.vn?.title && item.vn.title !== title ? item.vn.title : "",
);
const year = $derived(
	item.vn?.released ? item.vn.released.substring(0, 4) : "",
);
const imageUrl = $derived(
	item.vn?.image?.url || item.vn?.image?.thumbnail || "",
);
const imageNsfw = $derived(
	((item.vn?.image?.sexual ?? 0) > 1 || (item.vn?.image?.violence ?? 0) > 1) &&
		blurNsfw,
);
const userVote = $derived(item.vote);
const rating = $derived(item.vn?.rating);
const voteCount = $derived(item.vn?.votecount);
const lengthText = $derived(
	formatVndbLength(item.vn?.length, item.vn?.length_minutes),
);
const developerText = $derived(
	(item.vn?.developers || [])
		.slice(0, 2)
		.map((producer) => producer.name)
		.join(" / "),
);
const languageText = $derived(
	(item.vn?.languages || [])
		.slice(0, 4)
		.map((lang) => lang.toUpperCase())
		.join(" / "),
);
const platformText = $derived(
	(item.vn?.platforms || [])
		.slice(0, 4)
		.map((platform) => platform.toUpperCase())
		.join(" / "),
);
const metaText = $derived(
	[developerText, languageText, platformText].filter(Boolean).join(" · "),
);
const notes = $derived(item.notes || "");
const playRange = $derived(
	[item.started, item.finished].filter(Boolean).join(" ~ "),
);
const tags = $derived((item.vn?.tags || []).map((tag) => tag.name));
const visibleTags = $derived(tags.slice(0, 3));
const hiddenTagCount = $derived(
	Math.max((item.vn?.tagCount ?? tags.length) - visibleTags.length, 0),
);
const link = $derived(`${vnBaseUrl}${item.vn?.id || item.id}`);

const FAILED_COVERS_KEY = "vndb-failed-covers";

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

const srcs = $derived(imageUrl ? [imageUrl] : []);
let initialSrc = $state("");

$effect(() => {
	const sources = srcs;
	initialSrc = sources[0] || "";
	if (typeof window === "undefined" || sources.length === 0) return;
	const failed = getFailedCovers();
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
	markCoverFailed(img.src);
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
        loading="lazy"
        decoding="async"
        onload={handleLoad}
        onerror={handleError}
        style={imageNsfw?"filter: blur(20px)":undefined}
      />
    {:else}
      <div class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <div class="text-gray-400 dark:text-gray-500 text-4xl font-bold">VN</div>
      </div>
    {/if}

    <div class="absolute top-2 left-2 px-2 py-1 rounded-full text-xs text-white font-medium {statusColor}">
      {statusText}
    </div>

    {#if userVote}
      <div class="absolute top-2 right-2 px-2 py-1 rounded-full text-xs text-white font-medium bg-black/50 backdrop-blur-sm flex items-center gap-1">
        <span class="text-yellow-400">&#11088;</span>
        {userVote}
      </div>
    {/if}

    <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
    <div class="absolute bottom-0 left-0 right-0 p-3">
      <h3 class="font-bold text-sm text-white line-clamp-2 drop-shadow-lg">{title}</h3>
      {#if altTitle}
        <p class="text-xs text-white/60 mt-0.5 line-clamp-1">{altTitle}</p>
      {/if}
      {#if year || lengthText}
        <p class="text-xs text-white/70 mt-1">
          {#if year}{year}{/if}
          {#if year && lengthText} · {/if}
          {#if lengthText}{lengthText}{/if}
        </p>
      {/if}
      {#if playRange}
        <p class="text-xs text-white/70 mt-1">{playRange}</p>
      {/if}
      {#if rating}
        <p class="text-xs text-white/70 mt-0.5">
          <span class="text-yellow-300 font-medium">VNDB</span> {rating}
          {#if voteCount}
            <span class="text-white/50">· {voteCount} {i18n(I18nKey.vndbVotes)}</span>
          {/if}
        </p>
      {/if}
      {#if metaText}
        <p class="text-xs text-white/65 mt-0.5 line-clamp-1" title={metaText}>{metaText}</p>
      {/if}
      {#if notes}
        <p class="text-xs text-white/75 line-clamp-1 mt-1 leading-relaxed" title={notes}>{notes}</p>
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
