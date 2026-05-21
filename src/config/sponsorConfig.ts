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
			name: "支付宝",
			icon: "fa7-brands:alipay",
			qrCode: "",
			link: "",
			description: "",
			enabled: false,
		},
		{
			name: "微信",
			icon: "fa7-brands:weixin",
			qrCode: "",
			link: "",
			description: "",
			enabled: false,
		},
		{
			name: "ko-fi",
			icon: "simple-icons:kofi",
			qrCode: "",
			link: "",
			description: "",
			enabled: false,
		},
		{
			name: "爱发电",
			icon: "simple-icons:afdian",
			qrCode: "",
			link: "",
			description: "",
			enabled: false,
		},
	],

	// 赞助者列表（可选）
	sponsors: [],
};
