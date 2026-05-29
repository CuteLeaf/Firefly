import type { AnnouncementConfig } from "../types/config";

export const announcementConfig: AnnouncementConfig = {
	// 公告标题
	title: "公告",

	// 公告内容
	content: "积木好课新站点，由Autodesk官方认证教师创办，研究生学历，12年一线软件经验。服务众多科研院所、高校、企业培训，一对一个人定制教学。已帮助数万学员朋友，旧站点23万访问。",

	// 是否允许用户关闭公告
	closable: false,

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
