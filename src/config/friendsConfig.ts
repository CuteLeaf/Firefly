import type { FriendLink, FriendsPageConfig } from "../types/friendsConfig";

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
	randomizeSort: true,
};

// 友链配置
export const friendsConfig: FriendLink[] = [
	{
		title: "萧小晓",
		imgurl:
			"https://www.lxlovo.top/png.png",
		desc: "飞一个爱写文的菜鸡。",
		siteurl: "https://blog.lxlovo.top",
		tags: ["Blog"],
		weight: 10, // 权重，数字越大排序越靠前
		enabled: false, // 是否启用true
	},
		{
		title: "年华",
		imgurl:
			"https://blog.amamo.top/favicon/favicon2.png",
		desc: "分享生活和技术。",
		siteurl: "https://blog.520781.xyz",
		tags: ["Blog"],
		weight: 10, // 权重，数字越大排序越靠前
		enabled: false, // 是否启用true
	},
		{
		title: "董健颖的个人博客",
		imgurl:
			"https://dongjianying.xyz/_astro/2.g0rWXCmt_ZRPm2Q.webphttps://weavatar.com/api/avatar/e3e6c5e34c0111ab1a16acb37cec03f01907406e60b49477c089001f5ed083b8?s=50&t=1781771969751?s=640",
		desc: "这是我的个人博客，记录我的学习和生活点滴，分享我的学习经验和见解。希望在这里能与志同道合的朋友们交流和成长！",
		siteurl: "https://dongjianying.xyz",
		tags: ["Blog"],
		weight: 10, // 权重，数字越大排序越靠前
		enabled: false, // 是否启用true
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
