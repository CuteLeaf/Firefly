import type { CommentConfig } from "../types/config";

export const commentConfig: CommentConfig = {
	// 评论系统类型，默认不启用
	type: "none",
	// Twikoo 版本1.7.4
	twikoo: {
		envId: "https://twikoo.vercel.app",
		lang: "zh-CN",
		visitorCount: true,
	},
	waline: {
		serverURL: "https://waline.vercel.app",
		lang: "zh-CN",
		emoji: [
			"https://unpkg.com/@waline/emojis@1.4.0/weibo",
			"https://unpkg.com/@waline/emojis@1.4.0/bilibili",
			"https://unpkg.com/@waline/emojis@1.4.0/bmoji",
		],
		login: "enable",
		visitorCount: true,
	},
	artalk: {
		server: "https://artalk.example.com/",
		locale: "zh-CN",
		visitorCount: true,
	},
	giscus: {
		repo: "CuteLeaf/Firefly",
		repoId: "R_kgD2gfdFGd",
		category: "General",
		categoryId: "DIC_kwDOKy9HOc4CegmW",
		mapping: "title",
		strict: "0",
		reactionsEnabled: "1",
		emitMetadata: "1",
		inputPosition: "top",
		lang: "zh-CN",
		loading: "lazy",
	},
	disqus: {
		shortname: "firefly",
	},
};
