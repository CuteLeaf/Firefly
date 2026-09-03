import type { SakuraManagerLike } from "./types/sakura-worker";
import type { WavesManagerLike } from "./types/waves";

declare global {
	interface HTMLElementTagNameMap {
		"table-of-contents": HTMLElement & {
			init?: () => void;
		};
	}

	interface Window {
		// biome-ignore lint/suspicious/noExplicitAny: External library
		swup: any;
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
		/** 按需加载 pagefind.js，由 Navbar.astro 的内联脚本挂载；幂等 */
		__loadPagefind?: () => Promise<void>;
		__pagefindLoading?: Promise<void>;
		__fireflyMusic?: {
			init: () => Promise<void>;
			getState: () => {
				playlist: Array<{
					name: string;
					artist: string;
					url: string;
					pic: string;
					lrc?: string;
				}>;
				currentIndex: number;
				track: {
					name: string;
					artist: string;
					url: string;
					pic: string;
					lrc?: string;
				} | null;
				isPlaying: boolean;
				playMode: number;
				volume: number;
				isMuted: boolean;
				currentTime: number;
				duration: number;
				progress: number;
				currentTimeStr: string;
				durationStr: string;
				lyrics: Array<{ time: number; text: string }>;
				currentLrcIndex: number;
				initialized: boolean;
				error: string | null;
				config: Record<string, unknown>;
			};
			togglePlay: () => void;
			playNext: () => void;
			playPrev: () => void;
			cyclePlayMode: () => void;
			setVolume: (val: number) => void;
			toggleMute: () => void;
			seek: (percent: number) => void;
			seekToTime: (time: number) => void;
			playTrackByIndex: (index: number) => void;
			loadTrack: (index: number, autoPlay: boolean) => void;
		};
		/** 樱花特效管理器,Worker 模式与主线程回退模式均实现该接口 */
		sakuraManager?: SakuraManagerLike;
		/** 樱花特效初始化守卫,确保只初始化一次(Swup 切页重跑脚本时复用) */
		sakuraInitialized?: boolean;
		/** 水波纹特效管理器(主线程 Canvas 2D 实现) */
		wavesManager?: WavesManagerLike;
		/** 水波纹特效初始化守卫,确保只初始化一次(Swup 切页重跑脚本时复用) */
		wavesInitialized?: boolean;
		/** 布局初始化守卫,确保 Swup 切页重跑模块脚本时只执行一次 */
		__fireflyLayoutInit?: boolean;
		/** 打字机特效监听器守卫,确保只注册一次 */
		__typewriterTextInit?: boolean;
		/** 分类栏监听器守卫,确保只注册一次 */
		__categoryBarInit?: boolean;
		/** 侧边栏目录监听器守卫,确保只注册一次 */
		__sidebarTOCInit?: boolean;
		/** 文章封面图监听器守卫,确保只注册一次 */
		__coverImageInit?: boolean;
		/** 悬浮目录自动关闭监听器守卫,确保只注册一次 */
		__floatingTOCAutoCloseInit?: boolean;
		/** 文章列表页布局监听器守卫,确保只注册一次 */
		__postPageInit?: boolean;
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
