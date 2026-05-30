import {
	LinkPreset,
	type NavBarConfig,
	type NavBarLink,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/config";
import { siteConfig } from "./siteConfig";

// 根据页面开关动态生成导航栏配置
const getDynamicNavBarConfig = (): NavBarConfig => {
	// 基础导航栏链接
	const links: (NavBarLink | LinkPreset)[] = [
		// 主页
		LinkPreset.Home,

		// 分类
		LinkPreset.Categories,

		// 归档
		LinkPreset.Archive,

		// 网站导航
		{
			name: "网站导航",
			url: "/navigation/",
			icon: "material-symbols:public",
		},
	];

	// 动态及其子菜单
	links.push({
		name: "动态",
		url: "/my/",
		icon: "material-symbols:local-cafe",
		children: [
			// 根据配置决定是否添加说说
			...(siteConfig.pages.talks ? [LinkPreset.Talk] : []),
			// 根据配置决定是否添加相册，在siteConfig关闭pages.gallery时导航栏不显示相册
			...(siteConfig.pages.gallery ? [LinkPreset.Gallery] : []),
			// 留言板
			...(siteConfig.pages.guestbook ? [LinkPreset.Guestbook] : []),
		],
	});

	// 记录及其子菜单
	links.push({
		name: "记录",
		url: "/records/",
		icon: "material-symbols:camera-outdoor",
		children: [
			{
				name: "书架",
				url: "/books/",
				icon: "material-symbols:book-5",
			},
			{
				name: "影视与游戏",
				url: "/movies-games/",
				icon: "material-symbols:movie",
			},
			{
				name: "音乐",
				url: "/music/",
				icon: "material-symbols:music-note",
			},
			{
				name: "更新日志",
				url: "/changelog/",
				icon: "material-symbols:history",
			},
			{
				name: "规划",
				url: "/life/routines/",
				icon: "material-symbols:list-alt",
			},
			{
				name: "足迹",
				url: "/life/places/",
				icon: "material-symbols:location-on",
			},
		],
	});

	// 关于及其子菜单
	links.push({
		name: "关于",
		url: "/about/",
		icon: "material-symbols:info",
		children: [
			// 关于页面
			LinkPreset.About,
			// 根据配置决定是否添加友链，在siteConfig关闭pages.friends时导航栏不显示友链
			...(siteConfig.pages.friends ? [LinkPreset.Friends] : []),
			// 根据配置决定是否添加赞助，在siteConfig关闭pages.sponsor时导航栏不显示赞助
			...(siteConfig.pages.sponsor ? [LinkPreset.Sponsor] : []),
		],
	});

	// 仅返回链接，其它导航搜索相关配置在模块顶层常量中独立导出
	return { links } as NavBarConfig;
};

// 导航搜索配置
export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
