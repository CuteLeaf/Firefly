import type { DynamicConfig } from "@/types/dynamicConfig";

export const dynamicConfig: DynamicConfig = {
	// 页面标题，如果留空则使用 i18n 中的翻译
	title: "",

	// 页面描述文本，如果留空则使用 i18n 中的翻译
	description: "",

	// 动态头像和名称的跳转地址，支持站内路径或完整 URL
	profileUrl: "/about/",

	// 是否为每条动态启用评论，需要先在 commentConfig.ts 启用评论系统
	showComment: true,

	// 每页显示的动态数量
	itemsPerPage: 20,

	// 动态数据 json 地址，本地默认 "/api/dynamic.json"
	// 可改为第三方接口地址，如 "https://firefly.cuteleaf.cn/api/dynamic.json"
	// 数据结构可打开上方链接地址参考
	// 当 memos.enable 为 true 时，此配置会被忽略
	apiUrl: "/api/dynamic.json",

	// ========== Memos 配置 ==========
	// 启用后客户端会直接从 Memos API 实时获取数据，apiUrl 配置将被忽略
	// Memos 记得配置 CORS，否则可能会出现跨域问题
	memos: {
		// 是否启用 Memos 数据源
		enable: false,

		// Memos 实例地址
		apiUrl: "https://memos.example.com",

		// Memos 用户标识，如 "users/你的memos用户名"，用于过滤指定用户的动态
		// 注意：需与 Memos API 返回的 creator 字段完全一致（区分大小写），例如实际用户名为 admin 时应为 "users/admin"，而非"users/Administrator"
		parent: "users/xiaye",
	},
};
