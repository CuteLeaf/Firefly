import type { DynamicConfig } from "@/types/dynamicConfig";

export const dynamicConfig: DynamicConfig = {
	// 页面标题，留空则自动使用系统 i18n 多语言翻译（如“动态”）
	title: "",

	// 页面描述文本，留空则自动使用系统内置多语言描述
	description: "",

	// 动态卡片中头像和名称的跳转地址，支持站内路径或完整外部 URL
	profileUrl: "/about/",

	// 是否为每条动态开启评论功能（需配合 commentConfig.ts 启用的评论系统）
	showComment: true,

	// 每页展示的动态卡片数量
	itemsPerPage: 20,

	// 动态数据源接口地址：
	// 默认使用本地生成的 "/api/dynamic.json"；当下方 memos.enable 为 true 时此配置自动失效
	apiUrl: "/api/dynamic.json",

	// ========== Memos 配置 ==========
	// 若使用自建 Memos 服务，开启后将直接在浏览器端请求 Memos API 实时获取数据
	memos: {
		// 是否启用 Memos 数据源（当前保持关闭）
		enable: false,

		// Memos 实例地址（如需开启，请填写如 "https://memos.example.com"）
		apiUrl: "https://memos.example.com",

		// Memos 用户标识（如 "users/用户名"），用于筛选对应账号发布的动态内容
		parent: "users/xiaye",
	},
};