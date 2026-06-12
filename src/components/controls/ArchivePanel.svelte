<script lang="ts">
import { onMount } from "svelte";

import { siteConfig } from "@/config";
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import { getPostUrlBySlug } from "@/utils/url-utils";

export let tags: string[] = [];
export let categories: string[] = [];
export let sortedPosts: Post[] = [];

const params = new URLSearchParams(window.location.search);
tags = params.has("tag") ? params.getAll("tag") : [];
categories = params.has("category") ? params.getAll("category") : [];
const uncategorized = params.get("uncategorized");

interface Post {
	id: string;
	data: {
		title: string;
		tags: string[];
		category?: string | null;
		published: Date;
	};
}

interface Group {
	year: number;
	posts: Post[];
}

interface ActiveFilter {
	labelKey: I18nKey;
	values: string[];
}

let groups: Group[] = [];
let activeFilters: ActiveFilter[] = [];
let primaryFilter: ActiveFilter | null = null;
let secondaryFilters: ActiveFilter[] = [];
let filteredPostCount = 0;
let collapsedYears: Set<number> = new Set();

function toggleYear(year: number) {
	const willCollapse = !collapsedYears.has(year);
	if (willCollapse) {
		collapsedYears.add(year);
	} else {
		collapsedYears.delete(year);
	}
	collapsedYears = new Set(collapsedYears);

	// 用 Web Animations API 做旋转动画，绕开 Swup 对 CSS transition 的干扰
	requestAnimationFrame(() => {
		const arrow = document.querySelector(
			`[data-year="${year}"] .archive-arrow`,
		);
		if (arrow) {
			arrow.animate(
				[
					{ transform: willCollapse ? "rotate(0deg)" : "rotate(-90deg)" },
					{ transform: willCollapse ? "rotate(-90deg)" : "rotate(0deg)" },
				],
				{ duration: 200, easing: "ease", fill: "forwards" },
			);
		}
	});
}

function formatDate(date: Date) {
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	return `${month}-${day}`;
}

function formatTag(tagList: string[]) {
	return tagList.map((t) => `#${t}`).join(" ");
}

function formatFilterValues(filter: ActiveFilter) {
	const prefix = filter.labelKey === I18nKey.tags ? "#" : "";
	return filter.values.map((value) => `${prefix}${value}`).join(" / ");
}

function resolvePrimaryFilter(filters: ActiveFilter[]) {
	return (
		filters.find((filter) => filter.labelKey === I18nKey.tags) ??
		filters[0] ??
		null
	);
}

function formatFilterSummary(filters: ActiveFilter[]) {
	return filters
		.map((filter) => `${i18n(filter.labelKey)}: ${formatFilterValues(filter)}`)
		.join("  ·  ");
}

onMount(async () => {
	let filteredPosts: Post[] = sortedPosts;
	const currentFilters: ActiveFilter[] = [];

	if (categories.length > 0) {
		currentFilters.push({ labelKey: I18nKey.categories, values: categories });
	}

	if (uncategorized) {
		currentFilters.push({
			labelKey: I18nKey.categories,
			values: [i18n(I18nKey.uncategorized)],
		});
	}

	if (tags.length > 0) {
		currentFilters.push({ labelKey: I18nKey.tags, values: tags });
	}

	activeFilters = currentFilters;
	primaryFilter = resolvePrimaryFilter(activeFilters);
	secondaryFilters = primaryFilter
		? activeFilters.filter((filter) => filter !== primaryFilter)
		: [];

	if (tags.length > 0) {
		filteredPosts = filteredPosts.filter(
			(post) =>
				Array.isArray(post.data.tags) &&
				post.data.tags.some((tag) => tags.includes(tag)),
		);
	}

	if (categories.length > 0) {
		filteredPosts = filteredPosts.filter(
			(post) => post.data.category && categories.includes(post.data.category),
		);
	}

	if (uncategorized) {
		filteredPosts = filteredPosts.filter((post) => !post.data.category);
	}

	// 按发布时间倒序排序，确保不受置顶影响
	filteredPosts = filteredPosts
		.slice()
		.sort((a, b) => b.data.published.getTime() - a.data.published.getTime());

	filteredPostCount = filteredPosts.length;

	const grouped = filteredPosts.reduce(
		(acc, post) => {
			const year = post.data.published.getFullYear();
			if (!acc[year]) {
				acc[year] = [];
			}
			acc[year].push(post);
			return acc;
		},
		{} as Record<number, Post[]>,
	);

	const groupedPostsArray = Object.keys(grouped).map((yearStr) => ({
		year: Number.parseInt(yearStr, 10),
		posts: grouped[Number.parseInt(yearStr, 10)],
	}));

	groupedPostsArray.sort((a, b) => b.year - a.year);

	groups = groupedPostsArray;

	if (siteConfig.foldArticle !== false && groupedPostsArray.length > 1) {
		collapsedYears = new Set(groupedPostsArray.slice(1).map((g) => g.year));
	}

	// 更新横幅标题为当前筛选的分类名或标签名（带淡入淡出）
	const bannerTitle = document.querySelector<HTMLElement>(
		".banner-page-title-text",
	);
	if (bannerTitle) {
		let newTitle = "";
		if (categories.length > 0) {
			newTitle = categories.join(" / ");
		} else if (uncategorized) {
			newTitle = i18n(I18nKey.uncategorized);
		} else if (tags.length > 0) {
			newTitle = tags.map((t) => `#${t}`).join(" / ");
		}
		if (newTitle && bannerTitle.textContent !== newTitle) {
			bannerTitle.style.opacity = "0";
			setTimeout(() => {
				bannerTitle.textContent = newTitle;
				bannerTitle.style.opacity = "1";
			}, 260);
		}
	}
});
</script>

<div class="card-base px-8 py-6">
	{#if primaryFilter}
		<div class="mb-5">
			<div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
				<div class="min-w-0 text-sm text-75">
					<a href={primaryFilter.labelKey === I18nKey.categories ? '/categories/' : '/tags/'}
					   class="text-50 hover:text-(--primary) transition-colors">{i18n(primaryFilter.labelKey)}</a>
					<span class="mx-2 text-30">/</span>
					<span class="font-semibold text-(--primary)">{formatFilterValues(primaryFilter)}</span>
					{#if secondaryFilters.length > 0}
						<span class="ml-2 text-50">· {formatFilterSummary(secondaryFilters)}</span>
					{/if}
				</div>
				<div class="shrink-0 text-xs text-50">
					{filteredPostCount} {i18n(filteredPostCount === 1 ? I18nKey.postCount : I18nKey.postsCount)}
				</div>
			</div>
		</div>
	{/if}

	{#each groups as group}
		<div data-year={group.year}>
			<button
				class="flex flex-row w-full items-center h-15 cursor-pointer rounded-lg
				       hover:bg-(--btn-plain-bg-hover) transition-colors group/yr"
				on:click={() => toggleYear(group.year)}
				aria-expanded={!collapsedYears.has(group.year)}
			>
				<div class="w-[15%] md:w-[10%] transition text-2xl font-bold text-right text-75
				            group-hover/yr:text-(--primary)">
					{group.year}
				</div>
				<div class="w-[15%] md:w-[10%]">
					<div
							class="h-3 w-3 bg-none rounded-full outline outline-(--primary) mx-auto
                  -outline-offset-2 z-50 outline-3"
					></div>
				</div>
				<div class="w-[70%] md:w-[80%] transition text-left text-50 flex items-center gap-2
				            group-hover/yr:text-(--primary)">
					{group.posts.length} {i18n(group.posts.length === 1 ? I18nKey.postCount : I18nKey.postsCount)}
					<span class="archive-arrow" style={collapsedYears.has(group.year) ? 'transform: rotate(-90deg)' : ''}>
						<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
							<path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</span>
				</div>
			</button>

			{#if !collapsedYears.has(group.year)}
			{#each group.posts as post}
				<a
						href={getPostUrlBySlug(post.id)}
						aria-label={post.data.title}
						class="group btn-plain block! h-10 w-full rounded-lg hover:text-[initial]"
				>
					<div class="flex flex-row justify-start items-center h-full">
						<!-- date -->
						<div class="w-[15%] md:w-[10%] transition text-sm text-right text-50">
							{formatDate(post.data.published)}
						</div>

						<!-- dot and line -->
						<div class="w-[15%] md:w-[10%] relative dash-line h-full flex items-center">
							<div
									class="transition-all mx-auto w-1 h-1 rounded group-hover:h-5
                       bg-[oklch(0.5_0.05_var(--hue))] group-hover:bg-(--primary)
                       outline outline-4 z-50
                       outline-(--card-bg)
                       group-hover:outline-(--btn-plain-bg-hover)
                       group-active:outline-(--btn-plain-bg-active)"
							></div>
						</div>

						<!-- post title -->
						<div
								class="w-[70%] md:max-w-[65%] md:w-[65%] text-left font-bold
                     group-hover:translate-x-1 transition-all group-hover:text-(--primary)
                     text-75 pr-8 whitespace-nowrap text-ellipsis overflow-hidden flex items-center gap-2"
						>
							{#if post.data.category}
								<span class="shrink-0 inline-block text-xs font-medium px-1.5 py-0.5 rounded
								             bg-[oklch(0.95_0.025_var(--hue))] dark:bg-[oklch(0.25_0.025_var(--hue))]
								             text-(--primary) group-hover:bg-(--primary) group-hover:text-white!
								             transition-colors">
									{post.data.category}
								</span>
							{/if}
							<span class="truncate">{post.data.title}</span>
						</div>

						<!-- tag list -->
						<div
								class="hidden md:block md:w-[15%] text-left text-sm transition
                     whitespace-nowrap text-ellipsis overflow-hidden text-30"
						>
							{formatTag(post.data.tags)}
						</div>
					</div>
				</a>
			{/each}
			{/if}
		</div>
	{/each}
</div>

<style>
	.archive-arrow {
		display: inline-flex;
	}
</style>
