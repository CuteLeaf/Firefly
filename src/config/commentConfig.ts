import type { CommentConfig } from "../types/config";

export const commentConfig: CommentConfig = {
	type: "none", // 当前启用的评论系统类型: none, twikoo, waline, giscus, disqus，默认为none，即不启用评论系统。
	//twikoo评论系统配置
	twikoo: {
		envId: "https://twikoo.vercel.app",
		lang: "zh-CN", // 设置 Twikoo 评论系统语言
		visitorCount: true, // 文章访问量统计功能。
	},
	//waline评论系统配置
	waline: {
		serverURL: "https://waline.vercel.app",
		lang: "zh-CN", // 设置 Waline 评论系统语言
		login: "enable", // 评论登录模式。可选值如下：
		//   'enable'   —— 默认，允许访客匿名评论和用第三方 OAuth 登录评论，兼容性最佳。
		//   'force'    —— 强制必须登录后才能评论，适合严格社区，关闭匿名评论。
		//   'disable'  —— 禁止所有登录和 OAuth，仅允许匿名评论（填写昵称/邮箱），适用于极简留言。
		visitorCount: true, // 文章访问量统计功能。
	},
	//giscus评论系统配置（还未测试）
	giscus: {
		repo: "CuteLeaf/Firefly", // 设置 Giscus 评论系统仓库
		repoId: "R_kgD2gfdFGd", // 设置 Giscus 评论系统仓库ID
		category: "General", // 设置 Giscus 评论系统分类
		categoryId: "DIC_kwDOKy9HOc4CegmW", // 设置 Giscus 评论系统分类ID
		mapping: "title", // 设置 Giscus 评论系统映射方式
		strict: "0", // 设置 Giscus 评论系统严格模式
		reactionsEnabled: "1", // 设置 Giscus 评论系统反应功能
		emitMetadata: "1", // 设置 Giscus 评论系统元数据
		inputPosition: "top", // 设置 Giscus 评论系统输入位置
		theme: "light", // 设置 Giscus 评论系统主题
		lang: "zh-CN", // 设置 Giscus 评论系统语言
		loading: "lazy", // 设置 Giscus 评论系统加载方式
	},
	//disqus评论系统配置（还未测试）
	disqus: {
		shortname: "firefly", // 设置 Disqus 评论系统
	},
};
