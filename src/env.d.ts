/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

declare global {
	interface ImportMetaEnv {
		readonly MEILI_MASTER_KEY: string;
		// 视图设置面板总开关，可在部署平台配置（true / 1 / on / yes 开启）
		readonly PUBLIC_DISPLAY_SETTINGS?: string;
	}

	interface ITOCManager {
		init: () => void;
		render: () => void;
		attach: () => void;
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
		ImmersiveReading: {
			btn: HTMLElement | null;
			tocBtn: HTMLElement | null;
			toc: HTMLElement | null;
			manager: ITOCManager | null;
			prevScroll: number;
			isImmersive: boolean;
		};
		toggleImmersiveReading: () => void;
		enterImmersiveReading: () => void;
		exitImmersiveReading: () => void;
		toggleImmersiveTOC: () => void;
		__immersiveReadingInit?: boolean;
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
