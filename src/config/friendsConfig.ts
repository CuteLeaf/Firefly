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
		title: "Summerの图床",
		imgurl: "https://hry.54120721.xyz/file/头像/1778338329973_myy2.jpeg",
		desc: "傻傻的钰钰...... 窈窕淑女 君子好逑.",
		siteurl: "https://hry.54120721.xyz/",
		tags: [
			"图床"
		],
		weight: 100,
		enabled: true
	},
	{
		title: "West2Cloud",
		imgurl: "https://hry.54120721.xyz/file/头像/1778338161140_myy.png",
		desc: "您的个性化云服务-为您开启畅想IDC之旅",
		siteurl: "https://west2cloud.cn/",
		tags: [
			"云服务器"
		],
		weight: 99,
		enabled: true
	},
	{
		title: "番茄主理人",
		imgurl: "https://q1.qlogo.cn/g?b=qq&nk=20447289&s=640",
		desc: "坐而言不如起而行.",
		siteurl: "https://fqzlr.com/",
		tags: [
			"Blog"
		],
		weight: 98,
		enabled: true
	},
	{
		title: "UpXuu's blog",
		imgurl: "https://upxuu.com/images/20260214145619.jpg",
		desc: "逐光而上",
		siteurl: "https://upxuu.com",
		tags: [
			"Blog"
		],
		weight: 97,
		enabled: true
	},
	{
		title: "团子和蛋糕",
		imgurl: "https://re.tsh520.cn/zl/tx.webp",
		desc: "如果你喜欢那么欢迎来到我的世界！",
		siteurl: "https://blog.tsh520.cn",
		tags: [
			"Blog"
		],
		weight: 96,
		enabled: true
	}
];

// 获取启用的友链并进行排序
export const getEnabledFriends = (): FriendLink[] => {
	const friends = friendsConfig.filter((friend) => friend.enabled);

	if (friendsPageConfig.randomizeSort) {
		return friends.sort(() => Math.random() - 0.5);
	}

	return friends.sort((a, b) => b.weight - a.weight);
};
