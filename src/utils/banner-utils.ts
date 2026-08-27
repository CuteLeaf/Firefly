/** 当前是否为 banner 壁纸模式（导航栏/滚动行为依赖；模式由 html[data-wallpaper-mode] 同步设置） */
export function isBannerMode(): boolean {
	return (
		document.documentElement.getAttribute("data-wallpaper-mode") === "banner"
	);
}
