declare global {
	interface HTMLElementTagNameMap {
		"table-of-contents": HTMLElement & {
			init?: () => void;
		};
	}

	interface Window {
		// biome-ignore lint/suspicious/noExplicitAny: External library
		swup: any;
		live2dModelInitialized?: boolean;
		spineModelInitialized?: boolean;
		floatingTOCListenersInitialized?: boolean;
		// biome-ignore lint/suspicious/noExplicitAny: External library
		spinePlayerInstance?: any;
		pagefind: {
			search: (query: string) => Promise<{
				results: Array<{
					data: () => Promise<SearchResult>;
				}>;
			}>;
		};
	}

	interface MediaQueryList {
		addListener(listener: (e: MediaQueryListEvent) => void): void;
		removeListener(listener: (e: MediaQueryListEvent) => void): void;
	}
}

interface SearchResult {
	url: string;
	meta: {
		title: string;
	};
	excerpt: string;
	content?: string;
	word_count?: number;
	filters?: Record<string, unknown>;
	anchors?: Array<{
		element: string;
		id: string;
		text: string;
		location: number;
	}>;
	weighted_locations?: Array<{
		weight: number;
		balanced_score: number;
		location: number;
	}>;
	locations?: number[];
	raw_content?: string;
	raw_url?: string;
	sub_results?: SearchResult[];
}

export type { SearchResult };
