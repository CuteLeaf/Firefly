import type { GalleryConfig } from "@/types/config";

// 相册配置
export const galleryConfig: GalleryConfig = {
	// 相册列表
	albums: [
	{
		id: "初二下学期的研学-2026",
		name: "八年级下学期研学",
		description: "八年级下学期的研学 可惜我没去.........",
		date: "2026-05-14-05-15",
		location: "商城金刚台基地",
		tags: [
			"初二",
			"研学"
		]
	}
],

	// 瀑布流最小列宽(px)，浏览器根据容器宽度自动计算列数，默认 240
	// 值越小列数越多，值越大列数越少
	columnWidth: 240,
};
