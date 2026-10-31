import type { FeedSubscription } from "../types/subscriptionConfig";

// 独立订阅列表配置（不展示在友链页面，但文章动态会聚合到朋友圈 /fcircle）
// 支持协议：RSS 2.0 / 1.0、Atom、JSON Feed
export const subscriptionConfig: FeedSubscription[] = [
	{
		title: "阮一峰的网络日志",
		siteurl: "https://www.ruanyifeng.com/blog/",
		feedUrl: "https://www.ruanyifeng.com/blog/atom.xml",
		imgurl: "https://www.ruanyifeng.com/favicon.ico",
		desc: "每周五发布科技爱好者周刊",
		tags: ["周刊", "技术"],
		enabled: true,
	},
];

// 获取所有启用的订阅源
export const getEnabledSubscriptions = (): FeedSubscription[] => {
	return subscriptionConfig.filter((sub) => sub.enabled !== false);
};
