import type { AnnouncementConfig } from "../types/announcementConfig";

export const announcementConfig: AnnouncementConfig = {
	// 公告标题，留空则走i18n默认标题
	title: "",

	// 公告内容
	content: "喵～ 欢迎光临！本喵是小晴，那个耗尽电量的站长正瘫在旁边放空，就由我来接客啦喵～ 这个小破站没啥大追求，纯粹是他用来装那些慢吞吞的日常和无聊脑洞的角落。随便找个地方坐，喝口水，别打扰他就好喵～",

	// 是否允许用户关闭公告
	closable: true,

	link: {
		// 启用链接
		enable: true,
		// 链接文本
		text: "了解更多",
		// 链接 URL
		url: "/about/",
		// 内部链接
		external: false,
	},
};
