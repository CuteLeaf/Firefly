<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { navigateToPage } from "@utils/navigation-utils";
import { MeiliSearch } from "meilisearch";
import { onMount } from "svelte";
import type { SearchResult } from "@/global";
import { type MeiliSearchConfig, NavBarSearchMethod } from "@/types/config";
import { url as formatUrl } from "@/utils/url-utils";

// --- Props from Astro ---
export let searchMethod: NavBarSearchMethod;
export let meiliSearchConfig: MeiliSearchConfig;

// --- State ---
let keywordDesktop = "";
let keywordMobile = "";
let result: SearchResult[] = [];
let isSearching = false;
let initialized = false;
let meiliClient: MeiliSearch | null = null;
let debounceTimer: NodeJS.Timeout;

// --- Mocks for Dev Mode ---
const fakeResult: SearchResult[] = [
	{
		url: formatUrl("/"),
		meta: { title: "This Is a Fake Search Result" },
		excerpt:
			"Because Pagefind cannot work in the <mark>dev</mark> environment.",
	},
	{
		url: formatUrl("/"),
		meta: { title: "If You Want to Test the Search" },
		excerpt: "Try running <mark>npm build && npm preview</mark> instead.",
	},
];

// --- UI Logic ---
const togglePanel = () => {
	document
		.getElementById("search-panel")
		?.classList.toggle("float-panel-closed");
};

const setPanelVisibility = (show: boolean, isDesktop: boolean): void => {
	const panel = document.getElementById("search-panel");
	if (
		!panel ||
		(isDesktop && !keywordDesktop) ||
		(!isDesktop && !keywordMobile)
	)
		return;
	show
		? panel.classList.remove("float-panel-closed")
		: panel.classList.add("float-panel-closed");
};

const closeSearchPanel = (): void => {
	document.getElementById("search-panel")?.classList.add("float-panel-closed");
	keywordDesktop = "";
	keywordMobile = "";
	result = [];
};

const handleResultClick = (event: Event, url: string): void => {
	event.preventDefault();
	closeSearchPanel();
	navigateToPage(url);
};

// --- Core Search Logic ---
const search = async (keyword: string, isDesktop: boolean): Promise<void> => {
	if (!keyword) {
		setPanelVisibility(false, isDesktop);
		result = [];
		return;
	}
	if (!initialized) return;

	isSearching = true;

	clearTimeout(debounceTimer);
	debounceTimer = setTimeout(async () => {
		try {
			let searchResults: SearchResult[] = [];

			if (searchMethod === NavBarSearchMethod.MeiliSearch) {
				if (!meiliClient)
					throw new Error("MeiliSearch client not initialized.");
				const index = meiliClient.index(meiliSearchConfig.INDEX_NAME);
				const searchResponse = await index.search(keyword, {
					limit: 10,
					attributesToHighlight: ["title", "content", "description"],
					attributesToCrop: ["content:50"],
					highlightPreTag: "<mark>",
					highlightPostTag: "</mark>",
				});
				console.log(searchResponse);
				// Map MeiliSearch results to our standard SearchResult format
				searchResults = searchResponse.hits
					.filter((hit) => hit._formatted)
					.map((hit) => {
						return {
							url: hit._formatted?.slug,
							meta: { title: hit._formatted?.title },
							excerpt: hit._formatted?.description,
							content: hit._formatted?.content,
						};
					});
			} else if (searchMethod === NavBarSearchMethod.PageFind) {
				if (import.meta.env.PROD && window.pagefind) {
					const response = await window.pagefind.search(keyword);
					searchResults = await Promise.all(
						response.results.map((item) => item.data()),
					);
				} else if (import.meta.env.DEV) {
					searchResults = fakeResult;
				}
			}

			result = searchResults;
			setPanelVisibility(true, isDesktop);
		} catch (error) {
			console.error("Search error:", error);
			result = [];
			setPanelVisibility(false, isDesktop);
		} finally {
			isSearching = false;
		}
	}, 300); // 300ms debounce
};

// --- Initialization onMount ---
onMount(() => {
	if (searchMethod === NavBarSearchMethod.MeiliSearch) {
		try {
			meiliClient = new MeiliSearch({
				host: meiliSearchConfig.PUBLIC_MEILI_HOST,
				apiKey: meiliSearchConfig.PUBLIC_MEILI_SEARCH_KEY,
			});
			initialized = true;
			console.log("MeiliSearch client initialized.");
		} catch (e) {
			console.error("Failed to initialize MeiliSearch:", e);
		}
	} else if (searchMethod === NavBarSearchMethod.PageFind) {
		const initializePagefind = () => {
			initialized = true;
			if (keywordDesktop) search(keywordDesktop, true);
			if (keywordMobile) search(keywordMobile, false);
		};

		if (import.meta.env.DEV) {
			console.log("Pagefind mock enabled in development mode.");
			initializePagefind();
		} else {
			if (window.pagefind) {
				// If script already loaded
				initializePagefind();
			} else {
				// Listen for the event
				document.addEventListener("pagefindready", initializePagefind, {
					once: true,
				});
				document.addEventListener("pagefindloaderror", initializePagefind, {
					once: true,
				});
			}
		}
	}
});

// --- Reactive Statements ---
$: if (initialized && (keywordDesktop || keywordDesktop === "")) {
	search(keywordDesktop, true);
}
$: if (initialized && (keywordMobile || keywordMobile === "")) {
	search(keywordMobile, false);
}
</script>

<!-- search bar for desktop view -->
<div id="search-bar" class="hidden lg:flex transition-all items-center h-11 mr-2 rounded-lg
      bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06]
      dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10
">
    <Icon icon="material-symbols:search"
          class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-black/30 dark:text-white/30"></Icon>
    <input placeholder="{i18n(I18nKey.search)}" bind:value={keywordDesktop}
           on:focus={() => search(keywordDesktop, true)}
           class="transition-all pl-10 text-sm bg-transparent outline-0
         h-full w-40 active:w-60 focus:w-60 text-black/50 dark:text-white/50"
    >
</div>

<!-- toggle btn for phone/tablet view -->
<button on:click={togglePanel} aria-label="Search Panel" id="search-switch"
        class="btn-plain scale-animation lg:!hidden rounded-lg w-11 h-11 active:scale-90">
    <Icon icon="material-symbols:search" class="text-[1.25rem]"></Icon>
</button>

<!-- search panel -->
<div id="search-panel" class="float-panel float-panel-closed search-panel absolute md:w-[30rem]
top-20 left-4 md:left-[unset] right-4 shadow-2xl rounded-2xl p-2">

    <!-- search bar inside panel for phone/tablet -->
    <div id="search-bar-inside" class="flex relative lg:hidden transition-all items-center h-11 rounded-xl
      bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06]
      dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10
  ">
        <Icon icon="material-symbols:search"
              class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-black/30 dark:text-white/30"></Icon>
        <input placeholder="Search" bind:value={keywordMobile}
               class="pl-10 absolute inset-0 text-sm bg-transparent outline-0
               focus:w-60 text-black/50 dark:text-white/50"
        >
    </div>

    <!-- search results -->
    {#if isSearching}
        <div class="transition first-of-type:mt-2 lg:first-of-type:mt-0 block rounded-xl text-lg px-3 py-2 text-50">
            正在搜索...
        </div>
    {:else if result.length > 0}
        {#each result as item}
            <a href={item.url}
               on:click={(e) => handleResultClick(e, item.url)}
               class="transition first-of-type:mt-2 lg:first-of-type:mt-0 group block
           rounded-xl text-lg px-3 py-2 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)]">
                <div class="transition text-90 inline-flex font-bold group-hover:text-[var(--primary)]">
                    {@html item.meta.title}
                    <Icon icon="fa6-solid:chevron-right"
                          class="transition text-[0.75rem] translate-x-1 my-auto text-[var(--primary)]"></Icon>
                </div>
                {#if item.excerpt.includes('<mark>')}
                    <div class="transition text-sm text-50" style="display: flex; align-items: flex-start; margin-top: 0.1rem">
                        <span style="display: inline-block; background-color: var(--btn-plain-bg-hover); color: var(--primary); padding: 0.1em 0.4em; border-radius: 5px; font-size: 0.75em; font-weight: 600; margin-right: 0.5em; flex-shrink: 0;">
                            摘要
                        </span>
                        <div>
                            {@html item.excerpt}
                        </div>
                    </div>
                {/if}

                {#if item.content && item.content.includes('<mark>')}
                    <div class="transition text-sm text-30" style="display: flex; align-items: flex-start; margin-top: 0.1rem">
                        <span style="display: inline-block; background-color: var(--btn-plain-bg-active); color: var(--primary); padding: 0.1em 0.4em; border-radius: 5px; font-size: 0.75em; font-weight: 600; margin-right: 0.5em; flex-shrink: 0;">
                            内容
                        </span>
                        <div>
                            {@html item.content}
                        </div>
                    </div>
                {/if}
            </a>
        {/each}
    {:else if result.length === 0}
        <div class="transition first-of-type:mt-2 lg:first-of-type:mt-0 block rounded-xl text-lg px-3 py-2 text-50">
            找不到相关结果。
        </div>
    {:else if keywordDesktop || keywordMobile}
        <div class="transition first-of-type:mt-2 lg:first-of-type:mt-0 block rounded-xl text-lg px-3 py-2 text-50">
            请输入搜索关键词。
        </div>
    {/if}
</div>

<style>
    input:focus {
        outline: 0;
    }

    .search-panel {
        max-height: calc(100vh - 100px);
        overflow-y: auto;
    }
</style>
