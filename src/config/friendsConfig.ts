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
		title: "烟墨的屑站点",
		imgurl:
			"https://avatar.ymbit.cn",
		desc: "林花谢了春红，太匆匆。无奈朝来寒雨，晚来风。",
		siteurl: "https://www.ymbit.cn",
		tags: ["Blog"],
		weight: 10, // 权重，数字越大排序越靠前
		enabled: true, // 是否启用
	},
	{
		title: "夏沫花火zzz🌙 (Muska_Ami)のLife",
		imgurl: "https://blog.amaicat.work/images/avatar.jpg",
		desc: "Keep doing, keep loving",
		siteurl: "https://blog.amaicat.work",
		tags: ["Blog"],
		weight: 9,
		enabled: true,
	},
	{
		title: "win2k的小站",
		imgurl: "https://www.abjust.fun/upload/b_e04b0924f8e749918b3553c0f04cc099.jpg",
		desc: "生活本无意义，但人类选择追寻",
		siteurl: "https://www.abjust.fun",
		tags: ["Blog"],
		weight: 8,
		enabled: true,
	},
	{
		title: "星程课表 AstraSchedule",
		imgurl: "https://image-hk-1.oss-accelerate.aliyuncs.com/icon.png",
		desc: "灵活部署 · 智能调休 · 集中管控 · 兼容 Windows 7",
		siteurl: "https://getastra.cn",
		tags: ["Docs"],
		weight: 7,
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
