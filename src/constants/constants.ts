export const PAGE_SIZE = 8;

export const LIGHT_MODE = "light",
	DARK_MODE = "dark",
	SYSTEM_MODE = "system";
export const DEFAULT_THEME: typeof LIGHT_MODE = LIGHT_MODE; // 仅作为向后兼容的默认值，实际使用 siteConfig.themeColor.defaultMode

// Wallpaper modes
export const WALLPAPER_BANNER = "banner",
	WALLPAPER_FULLSCREEN = "fullscreen",
	WALLPAPER_OVERLAY = "overlay",
	WALLPAPER_NONE = "none";

// Banner height unit: vh
export const BANNER_HEIGHT = 35;
export const BANNER_HEIGHT_EXTEND = 30;
export const BANNER_HEIGHT_HOME: number = BANNER_HEIGHT + BANNER_HEIGHT_EXTEND;

// The height the main panel overlaps the banner, unit: rem
export const MAIN_PANEL_OVERLAPS_BANNER_HEIGHT = 3.5;

// Non-home banner height (unit: vh) — banner mode, desktop only.
// Lift = BANNER_HEIGHT_HOME(65) - BANNER_HEIGHT_NON_HOME: 45=20vh, 50=15vh, 35=fuwari 30vh.
export const BANNER_HEIGHT_NON_HOME = 45;
// Pixel floor for the non-home banner (unit: px) — cushions short (laptop) screens,
// so the vh value resolving to too few absolute pixels doesn't cramp the title/description.
// Combined as `max(...vh, ...px)` in Layout.astro.
export const BANNER_HEIGHT_NON_HOME_MIN = 380;

// Page width: rem
export const PAGE_WIDTH = 100;

// Category constants
export const UNCATEGORIZED = "uncategorized";
