import type { AnnouncementConfig } from "../types/config";

export const announcementConfig: AnnouncementConfig = {
	// 公告标题
	title: "公告",

	// 公告内容
	content: "个人技术博客，请分享技术内容和操作",

	// 是否允许用户关闭公告
	closable: true,

	link: {
		// 启用链接
		enable: true,
		// 链接文本
		text: "了解版权",
		// 链接 URL
		url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
		// 内部链接
		external: false,
	},
};
