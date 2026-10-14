import type { SponsorConfig } from "../types/sponsorConfig";

export const sponsorConfig: SponsorConfig = {
	// 页面标题，如果留空则使用 i18n 中的翻译
	title: "",

	// 页面描述文本，如果留空则使用 i18n 中的翻译
	description: "",

	// 打赏用途说明
	usage:
		"你的支持是我持续更新的最大动力！打赏将用于支付本站的服务器、域名与 CDN 运行成本，哪怕是一杯咖啡的钱，也能让我开心很久，非常感谢！",

	// 是否显示打赏者列表
	showSponsorsList: false,

	// 是否显示评论区，需要先在commentConfig.ts启用评论系统
	showComment: true,

	// 是否在文章详情页底部显示打赏按钮
	showButtonInPost: true,

	// 打赏方式列表
	methods: [
		{
			name: "爱发电",
			icon: "simple-icons:afdian",
			qrCode: "",
			link: "https://afdian.com/a/MCKeroblog",
			description: "通过 爱发电 进行打赏",
			enabled: true,
		},
		{
			name: "支付宝",
			icon: "fa7-brands:alipay",
			// 收款码图片路径（需要放在 public 目录下）
			qrCode: "/assets/images/sponsor/alipay.png",
			link: "",
			description: "使用 支付宝 扫码打赏",
			enabled: false,
		},
		{
			name: "微信",
			icon: "fa7-brands:weixin",
			qrCode: "/assets/images/sponsor/wechat.png",
			link: "",
			description: "使用 微信 扫码打赏",
			enabled: false,
		},
	],

	// 打赏者列表（可选）
	sponsors: [],

	// 运行成本展示（原「运行成本」页面迁移至此）
	runningCosts: {
		enable: true,
		title: "运行成本",
		description: "为了追求极致的访问速度与稳定性，这是本站当前的必要投入。",
		currency: "$",
		// 固定支出项目
		fixed: [
			{
				name: "Cloudflare Argo Smart Routing",
				price: "5.00",
				cycle: "每月",
				isYearly: false,
				desc: "智能路由加速，优化全球访问速度",
			},
			{
				name: "域名 (mckero.com)",
				price: "10.00",
				cycle: "每年",
				isYearly: true,
				desc: "域名的持有成本",
			},
			{
				name: "Cloudflare Pages",
				price: "0.00",
				cycle: "每月",
				isYearly: false,
				desc: "静态页面托管 (Free Plan)",
			},
		],
		// 历史收支明细
		history: [
			{ date: "2025/11", cost: "5.00", income: "0.00", items: "Argo 订阅费" },
			{ date: "2025/11", cost: "0.80", income: "0.00", items: "Argo 流量费" },
		],
	},
};
