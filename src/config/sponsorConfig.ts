import type { SponsorConfig } from "../types/config";

export const sponsorConfig: SponsorConfig = {
	// 页面标题，如果留空则使用 i18n 中的翻译
	title: "",

	// 页面描述文本，如果留空则使用 i18n 中的翻译
	description: "",

	// 赞助用途说明
	usage:
		"您的赞助将用于服务器维护、内容创作和功能开发，帮助我持续提供优质内容。",

	// 是否显示赞助者列表
	showSponsorsList: true,

	// 是否显示评论区，需要先在commentConfig.ts启用评论系统
	showComment: true,

	// 是否在文章详情页底部显示赞助按钮
	showButtonInPost: true,

	// 赞助方式列表
	methods: [
		{
			name: "精神资助",
			icon: "fa7-brands:alipay",
			// 收款码图片路径（需要放在 public 目录下）
			qrCode: "/assets/images/jszz.gif",
			link: "",
			description: "在 精神层面 赞助",
			enabled: true,
		},
		// {
		// 	name: "ko-fi",
		// 	icon: "simple-icons:kofi",
		// 	qrCode: "",
		// 	link: "https://ko-fi.com/cuteleaf",
		// 	description: "Buy a Coffee for Firefly",
		// 	enabled: true,
		// },
		// {
		// 	name: "爱发电",
		// 	icon: "simple-icons:afdian",
		// 	qrCode: "",
		// 	link: "https://ifdian.net/a/cuteleaf",
		// 	description: "通过 爱发电 进行赞助",
		// 	enabled: true,
		// },
	],

	// 赞助者列表（可选）
	sponsors: [
		// 示例：已实名赞助者
		{
			name: "高赞首富",
			amount: "¥648",
			date: "2026-01-01",
		},
		{
			name: "非凡",
			amount: "¥999",
			date: "2026-01-01",
		},
		// 示例：匿名赞助者
		{
			name: "哈基敦",
			amount: "¥0.01",
			date: "2026-01-01",
		},
	],
};
