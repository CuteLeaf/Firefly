import type { SponsorConfig } from "../types/config";

export const sponsorConfig: SponsorConfig = {
	// 留空以使用 i18n 中的翻译
	title: "",
	description: "",

	usage:
		"您的赞助将用于服务器维护、内容创作和功能开发，帮助我持续提供优质内容。",
	showSponsorsList: true,
	showComment: true,
	showButtonInPost: true,
	methods: [
		{
			name: "支付宝",
			icon: "fa7-brands:alipay",
			qrCode: "/assets/images/sponsor/alipay.png",
			link: "",
			description: "使用 支付宝 扫码赞助",
			enabled: true,
		},
		{
			name: "微信",
			icon: "fa7-brands:weixin",
			qrCode: "/assets/images/sponsor/wechat.png",
			link: "",
			description: "使用 微信 扫码赞助",
			enabled: true,
		},
		{
			name: "ko-fi",
			icon: "simple-icons:kofi",
			qrCode: "",
			link: "https://ko-fi.com/cuteleaf",
			description: "Buy a Coffee for Firefly",
			enabled: true,
		},
		{
			name: "爱发电",
			icon: "simple-icons:afdian",
			qrCode: "",
			link: "https://ifdian.net/a/cuteleaf",
			description: "通过 爱发电 进行赞助",
			enabled: true,
		},
	],
	// 赞助者列表（可选）
	sponsors: [
		// 示例：已实名赞助者
		{
			name: "夏叶",
			amount: "¥50",
			date: "2025-10-01",
		},
		// 示例：匿名赞助者
		{
			name: "匿名用户",
			amount: "¥20",
			date: "2025-10-01",
		},
	],
};
