/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

declare global {
	interface PrivateSpaceKVNamespace {
		get(key: string): Promise<string | null>;
		put(key: string, value: string): Promise<void>;
		delete(key: string): Promise<void>;
	}

	interface ImportMetaEnv {
		readonly MEILI_MASTER_KEY: string;
		readonly PRIVATE_SPACE_STORAGE?: "kv";
		readonly PRIVATE_SPACE_LOGIN_MODE?: "placeholder" | "session";
		readonly PRIVATE_SPACE_KV?: PrivateSpaceKVNamespace;
	}

	interface ITOCManager {
		init: () => void;
		cleanup: () => void;
	}

	interface Window {
		SidebarTOC: {
			manager: ITOCManager | null;
		};
		FloatingTOC: {
			btn: HTMLElement | null;
			panel: HTMLElement | null;
			manager: ITOCManager | null;
			isPostPage: () => boolean;
		};
		toggleFloatingTOC: () => void;
		tocInternalNavigation: boolean;
		// swup is defined in global.d.ts
		// biome-ignore lint/suspicious/noExplicitAny: External library without types
		spine: any;
		closeAnnouncement: () => void;
		// __fireflyMusic type is defined in global.d.ts
		semifullScrollHandler?: (() => void) | undefined;
		initSemifullScrollDetection?: () => void;
	}
}

export {};
