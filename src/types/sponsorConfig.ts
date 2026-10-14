// 打赏方式类型
export type SponsorMethod = {
	name: string; // 打赏方式名称，如 "支付宝"、"微信"、"PayPal"
	icon?: string; // 图标名称（Iconify 格式），如 "fa7-brands:alipay"
	qrCode?: string; // 收款码图片路径（相对于 public 目录），可选
	link?: string; // 打赏链接 URL，可选。如果提供，会显示跳转按钮
	description?: string; // 描述文本
	enabled: boolean; // 是否启用
};

// 打赏者列表项
export type SponsorItem = {
	name: string; // 打赏者名称，如果想显示匿名，可以直接设置为"匿名"或使用 i18n
	avatar?: string; // 打赏者头像图片路径(可选,相对于 public 目录 或者 网络图片)
	amount?: string; // 打赏金额（可选）
	date?: string; // 打赏日期（可选，ISO 格式）
};

// 固定支出项目（用于运行成本展示）
export type SponsorRunningCostItem = {
	name: string; // 项目名称
	price: string; // 金额（USD 或其他货币，纯数字字符串）
	cycle: string; // 周期，如 "每月" / "每年"
	isYearly?: boolean; // 是否按年计费（用于折算月均）
	desc?: string; // 用途说明
};

// 历史收支记录
export type SponsorCostRecord = {
	date: string; // 日期，如 "2025/11"
	cost: string; // 支出金额
	income?: string; // 赞助金额
	items: string; // 消费内容
};

// 运行成本展示配置
export type SponsorRunningCosts = {
	enable?: boolean; // 是否显示运行成本板块，默认 false
	title?: string; // 板块标题
	description?: string; // 板块说明
	currency?: string; // 货币符号，默认 "$"
	fixed?: SponsorRunningCostItem[]; // 固定支出项目
	history?: SponsorCostRecord[]; // 历史收支明细
};

// 打赏配置
export type SponsorConfig = {
	title?: string; // 页面标题，默认使用 i18n
	description?: string; // 页面描述文本
	usage?: string; // 打赏用途说明
	methods: SponsorMethod[]; // 打赏方式列表
	sponsors?: SponsorItem[]; // 打赏者列表（可选）
	showSponsorsList?: boolean; // 是否显示打赏者列表，默认 true
	showComment?: boolean; // 是否显示评论区，默认 false
	showButtonInPost?: boolean; // 是否在文章详情页底部显示打赏按钮，默认 true
	runningCosts?: SponsorRunningCosts; // 运行成本展示（可选）
};
