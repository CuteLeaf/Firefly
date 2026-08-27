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
// = BANNER_HEIGHT_HOME(65) - 15vh lift = 50. Set to 45 for a 20vh lift, or 35 to reproduce the original fuwari 30vh lift.
export const BANNER_HEIGHT_NON_HOME = 50;

// Page width: rem
export const PAGE_WIDTH = 100;

// Category constants
export const UNCATEGORIZED = "uncategorized";
