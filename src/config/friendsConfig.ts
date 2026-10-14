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
	randomizeSort: false,
};

// 友链配置
export const friendsConfig: FriendLink[] = [
	{
		title: "Ad_closeNN の Blog",
		imgurl: "https://adclosenn.top/assets/avatar.jpg",
		desc: "Ad_closeNN 的小站，时不时会刷新一些野生东西",
		siteurl: "https://adclosenn.top",
		tags: ["Blog"],
		weight: 20,
		enabled: true,
	},
	{
		title: "LYEy_isine个人博客",
		imgurl: "https://img.cdn1.vip/i/68bbdee513eb9_1757142757.webp",
		desc: "花海无一日，少年踏自来",
		siteurl: "https://caiyifeng.top/",
		tags: ["Blog"],
		weight: 19,
		enabled: true,
	},
	{
		title: "Elykia",
		imgurl: "https://bu.dusays.com/2024/10/25/671b2438203a6.gif",
		desc: "致以无暇之人",
		siteurl: "https://blog.elykia.cn/",
		tags: ["Blog"],
		weight: 18,
		enabled: true,
	},
	{
		title: "咖啡豆子coffee的小站",
		imgurl: "https://images.kfdzcoffee.cn/i/1/avatar.png",
		desc: "所有奇迹的始发点",
		siteurl: "https://blog.kfdzcoffee.cn",
		tags: ["Blog"],
		weight: 17,
		enabled: true,
	},
	{
		title: "Pinpe 的云端",
		imgurl: "https://pinpe.top/head.jpg",
		desc: "一个属于自己的云朵。",
		siteurl: "https://pinpe.top/",
		tags: ["Blog"],
		weight: 16,
		enabled: true,
	},
	{
		title: "星雪",
		imgurl: "https://snowtafir.top/img/avatar.webp",
		desc: "银光渐深星无灭，古杉月空探花雪。",
		siteurl: "https://snowtafir.top",
		tags: ["Blog"],
		weight: 15,
		enabled: true,
	},
	{
		title: "AcoFork Blog",
		imgurl: "https://q2.qlogo.cn/headimg_dl?dst_uin=2726730791&spec=0",
		desc: "爱你所爱~ ❤。",
		siteurl: "https://2x.nz/",
		tags: ["Blog"],
		weight: 14,
		enabled: true,
	},
	{
		title: "路明笔记",
		imgurl:
			"https://cn.cravatar.com/avatar/302380667bdaf4e1390800e62494d4af?s=500&r=X",
		desc: "不慌张，不绝望，不狂妄，不投降。",
		siteurl: "https://luming.cool",
		tags: ["Blog"],
		weight: 13,
		enabled: true,
	},
	{
		title: "张洪Heo",
		imgurl: "https://img.zhheo.com/i/67d8fa75943e4.webp",
		desc: "分享设计与科技生活",
		siteurl: "https://blog.zhheo.com/",
		tags: ["Blog"],
		weight: 12,
		enabled: true,
	},
	{
		title: "神奇的Willem",
		imgurl:
			"https://cdn.bk.wished.cc/upload/%E6%88%AA%E5%B1%8F2025-11-01%2014.37.30_compressed.png",
		desc: "我们为什么活着？当然是为了我们以后更好的活着。",
		siteurl: "https://cdn.bk.wished.cc/",
		tags: ["Blog"],
		weight: 11,
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
