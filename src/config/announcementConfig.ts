import type { AnnouncementConfig } from "../types/config";

export const announcementConfig: AnnouncementConfig = {
	title: "公告",
	content: "欢迎来到我的博客！这是一则示例公告。",
	closable: true,
	link: {
		enable: true,
		text: "了解更多",
		url: "/about/",
		external: false,
	},
};
