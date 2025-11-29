declare global {
	interface HTMLElementTagNameMap {
		"table-of-contents": HTMLElement & {
			init?: () => void;
		};
	}

	interface IconifyLoader {
		isLoaded?: boolean;
		load: () => Promise<void>;
		onLoad: (cb: () => void) => void;
		addToPreloadQueue: (icons: string[]) => void;
	}

	interface FloatingTOCGlobal {
		btn?: HTMLElement | null;
		panel?: HTMLElement | null;
		manager?: any;
		isPostPage?: () => boolean;
	}

	interface SidebarTOCGlobal {
		manager?: any;
	}

	interface SpineGlobal {
		SpinePlayer?: any;
	}

	interface Window {
		// Define swup type directly since @swup/astro doesn't export AstroIntegration
		swup: any;
		live2dModelInitialized?: boolean;
		spineModelInitialized?: boolean;
		spinePlayerInstance?: any;
		pagefind: {
			search: (query: string) => Promise<{
				results: Array<{
					data: () => Promise<SearchResult>;
				}>;
			}>;
		};

		// Iconify loader
		iconifyLoaded?: boolean;
		__iconifyLoader?: IconifyLoader;
		onIconifyReady?: (cb: () => void) => void;
		preloadIcons?: (icons: string[]) => void;
		loadIconify?: () => void;

		// TOC related
		FloatingTOC?: FloatingTOCGlobal;
		SidebarTOC?: SidebarTOCGlobal;
		tocInternalNavigation?: boolean;
		toggleFloatingTOC?: () => void;

		// Announcement
		closeAnnouncement?: () => void;

		// Spine
		spine?: SpineGlobal;

		// Allow dynamic properties
		[key: string]: any;
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

export { SearchResult };
