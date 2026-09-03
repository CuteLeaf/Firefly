/** 当前是否为 banner 壁纸模式（导航栏/滚动行为依赖；模式由 html[data-wallpaper-mode] 同步设置） */
export function isBannerMode(): boolean {
	return (
		document.documentElement.getAttribute("data-wallpaper-mode") === "banner"
	);
}

/** 当前是否为 fullscreen 壁纸模式（static 导航栏在首页需像 banner 一样跨壁纸保持） */
export function isFullscreenMode(): boolean {
	return (
		document.documentElement.getAttribute("data-wallpaper-mode") ===
		"fullscreen"
	);
}
