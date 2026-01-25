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

	// 是否在文章详情页底部显示赞助按钮
	showButtonInPost: true,

	// 赞助方式列表
	methods: [
		{
			name: "支付宝",
			icon: "fa6-brands:alipay",
			// 收款码图片路径（需要放在 public 目录下）
			qrCode: "/assets/images/sponsor/alipay.png",
			link: "",
			description: "使用 支付宝 扫码赞助",
			enabled: true,
		},
		{
			name: "微信",
			icon: "fa6-brands:weixin",
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
			link: "https://afdian.com/a/cuteleaf",
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
			message: "感谢分享！",
		},

		// 示例：匿名赞助者
		{
			name: "匿名用户",
			amount: "¥20",
			date: "2025-10-01",
		},
	],
};
