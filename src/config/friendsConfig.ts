import type { FriendLink, FriendsPageConfig } from "../types/config";

// 可以在src/content/spec/friends.md中编写友链页面下方的自定义内容

// 友链页面配置
export const friendsPageConfig: FriendsPageConfig = {
	// 页面标题，如果留空则使用 i18n 中的翻译
	title: "",

	// 页面描述文本，如果留空则使用 i18n 中的翻译
	description: "",

	// 是否显示底部自定义内容（friends.mdx 中的内容）
	showCustomContent: true,

	// 是否显示评论区，需要先在commentConfig.ts启用评论系统
	showComment: true,

	// 是否开启随机排序配置，如果开启，就会忽略权重，构建时进行一次随机排序
	randomizeSort: false,
};

// 友链配置
export const friendsConfig: FriendLink[] = [

	{
		title: "u7",
		imgurl: "https://avatars.githubusercontent.com/u/10252805?v=4&s=640",
		desc: "悠然的Hexo博客",
		siteurl: "https://u7u7.top",
		tags: ["Blog"],
		weight: 11, // 权重，数字越大排序越靠前
		enabled: true, // 是否启用
	},
	{
		title: "团子和蛋糕",
		imgurl: "https://avatars.githubusercontent.com/u/10252805?v=4&s=640",
		desc: "团子和蛋糕的博客",
		siteurl: "https://blog.tsh520.cn",
		tags: ["Blog"],
		weight: 12, // 权重，数字越大排序越靠前
		enabled: true, // 是否启用
	},

	{
		title: "一飞",
		imgurl:
			"https://weavatar.com/avatar/d252655d40d6874417a720bad0a6c5f77f8f6a1fd2f882f8f338402dc37e4190?s=640",
		desc: "一飞的博客",
		siteurl: "https://f3f3.top",
		tags: ["Blog"],
		weight: 99, // 权重，数字越大排序越靠前
		enabled: true, // 是否启用
	},
	{
		title: "阿夜",
		imgurl: "https://docs-firefly.cuteleaf.cn/logo.png",
		desc: "这是基于springbootvue3的博客系统",
		siteurl: "https://blog.ayeez.cn/",
		tags: ["Blog"],
		weight: 9,
		enabled: true,
	},
	{
		title: "Fqlr",
		imgurl: "https://avatars.githubusercontent.com/u/44914786?v=4&s=640",
		desc: "番茄主理人",
		siteurl: "https://fqzlr.com",
		tags: ["Blog"],
		weight: 8,
		enabled: true,
	},
	{
		title: "喵斯基部落",
		imgurl: "https://avatars.githubusercontent.com/u/44914786?v=4&s=640",
		desc: "运维博客",
		siteurl: "https://blog.moewah.com",
		tags: ["Blog"],
		weight: 8,
		enabled: true,
	},
];

// 获取启用的友链并进行排序
export const getEnabledFriends = (): FriendLink[] => {
	const friends = friendsConfig.filter((friend) => friend.enabled);

	if (friendsPageConfig.randomizeSort) {
		return friends.sort(() => Math.random() - 0.5);
	}

	return friends.sort((a, b) => b.weight - a.weight);
};
