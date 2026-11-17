// 独立订阅源配置类型定义
export interface FeedSubscription {
	/** 订阅源名称（如博客名、专栏名、周刊名） */
	title: string;
	/** 订阅链接（RSS / Atom / JSON Feed 链接） */
	feedUrl: string;
	/** 博客/主页链接（可选，默认从 feed 或域名根目录提取） */
	siteurl?: string;
	/** 头像或图标链接（可选，未提供则自动尝试抓取或回退站点 favicon） */
	imgurl?: string;
	/** 订阅描述或备注（可选） */
	desc?: string;
	/** 分类标签（可选，如 ["周刊"]、["技术"]、["生活"]） */
	tags?: string[];
	/** 权重，数字越大排序越靠前（可选） */
	weight?: number;
	/** 是否启用（默认 true，若为 false 则构建时不抓取该源） */
	enabled?: boolean;
}
