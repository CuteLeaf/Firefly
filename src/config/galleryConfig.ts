import type { GalleryConfig } from "@/types/config";

export const galleryConfig: GalleryConfig = {
	albums: [
		// 支持 jpg / png / webp / avif / gif 格式
		// 每添加一个数组项就相当于添加了一个相册，记得在 public/gallery/ 目录下创建对应的子目录并放入图片
		{
			id: "firefly-2026",
			name: "可爱流萤",
			description: "飞萤之火自无梦的长夜亮起，绽放在终竟的明天。",
			location: "崩坏：星穹铁道",
			date: "2026-01-01",
			tags: ["崩坏星穹铁道", "流萤"],
		},
		{
			id: "encrypted-test",
			name: "加密相册示例",
			description:
				"这是一个加密相册的示例，设置了访问密码，只有输入正确的密码才能查看相册内容。",
			location: "崩坏：星穹铁道",
			date: "2026-02-01",
			tags: ["加密相册", "示例"],
			password: "123456",
			passwordHint: "示例密码123456",
		},
	],
	columnWidth: 240,
};
