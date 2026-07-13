import {
	type NavBarConfig,
	type NavBarLink,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/navBarConfig";

// ============================================================================
// 导航栏配置 - 根据顺序动态生成导航栏链接
// NavBar Configuration - Dynamically generate navigation bar links based on order
// ============================================================================
const getDynamicNavBarConfig = (): NavBarConfig => {
	// 基础导航栏链接
	const links: NavBarLink[] = [
		// 主页
		LinkPresets.Home,
	];

	// 文章及其子菜单（父级补充pageKey）
	links.push({
		name: "文章",
		url: "#",
		icon: "material-symbols:article",
		pageKey: "menu-article",
		children: [
			// 归档
			LinkPresets.Archive,
			// 分类
			LinkPresets.Categories,
			// 标签
			LinkPresets.Tags,
		],
	});

	// 友链
	links.push(LinkPresets.Friends);

	// 留言板
	links.push(LinkPresets.Guestbook);

	// 我的及其子菜单（父级补充pageKey）
	links.push({
		name: "我的",
		url: "#",
		icon: "material-symbols:person",
		pageKey: "menu-mine",
		children: [
			// 相册
			LinkPresets.Gallery,
			// 追番（已注释，不启用）
			// LinkPresets.Anime,
			// 番组计划（已注释，不启用）
			// LinkPresets.Bangumi,
		],
	});

	// 关于及其子菜单（父级补充pageKey）
	links.push({
		name: "关于",
		url: "#",
		icon: "material-symbols:info",
		pageKey: "menu-about",
		children: [
			// 打赏（已注释，不启用）
			// LinkPresets.Sponsor,
			// 关于页面
			LinkPresets.About,
		],
	});

	// 自定义导航栏链接
	//links.push({
	//	name: "链接",
	//	url: "#",
	//	icon: "material-symbols:link",
		// 子菜单
	//	children: [
	//		{
	//			name: "GitHub",
	//			url: "https://github.com/xyxnb123",
	//			external: true,
	//			icon: "fa7-brands:github",
	//		},
	//		{
	//			name: "QQ交流群",
	//			url: "https://qm.qq.com/q/ZGsFa8qX2G",
	//			external: true,
	//			icon: "fa7-brands:qq",
	//		},
	//		{
	//			name: "Firefly文档",
	//			url: "https://docs-firefly.cuteleaf.cn",
	//			external: true,
	//			icon: "material-symbols:docs",
	//		},
	//	],
	//});

	// 文档链接
	// links.push({
	// 	name: "文档",
	// 	url: "https://docs-firefly.cuteleaf.cn",
	// 	external: true,
	// 	icon: "material-symbols:docs",
	// });

	return { links } as NavBarConfig;
};

// 导航搜索配置
export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

// ============================================================================
// 链接预设 - 可自由自定义导航栏链接的名称、图标和URL
// Link Presets - Allows free customization of the name, icon, and URL of navigation bar links
// 全部项已补充 pageKey，无缺失
// ============================================================================
export const LinkPresets: Record<string, NavBarLink> = {
	Home: {
		name: "主页",
		url: "/",
		icon: "material-symbols:home",
		pageKey: "home",
	},
	Archive: {
		name: "归档",
		url: "/archive/",
		icon: "material-symbols:archive",
		pageKey: "archive",
	},
	Categories: {
		name: "分类",
		url: "/categories/",
		icon: "material-symbols:folder-open-rounded",
		pageKey: "categories",
	},
	Tags: {
		name: "标签",
		url: "/tags/",
		icon: "material-symbols:tag-rounded",
		pageKey: "tags",
	},
	Friends: {
		name: "友链",
		url: "/friends/",
		icon: "material-symbols:group",
		pageKey: "friends",
	},
	Guestbook: {
		name: "留言",
		url: "/guestbook/",
		icon: "material-symbols:chat",
		pageKey: "guestbook",
	},
	About: {
		name: "关于我",
		url: "/about/",
		icon: "material-symbols:person",
		pageKey: "about",
	},
	Gallery: {
		name: "相册",
		url: "/gallery/",
		icon: "material-symbols:photo-library",
		pageKey: "gallery",
	},

	// 下方为注释停用项，保留定义方便后续开启
	// Anime: {
	// 	name: "追番",
	// 	url: "/anime/",
	// 	icon: "material-symbols:live-tv",
	// 	pageKey: "anime",
	// },
	// Bangumi: {
	// 	name: "番组计划",
	// 	url: "/bangumi/",
	// 	icon: "material-symbols:movie",
	// 	pageKey: "bangumi",
	// },
	// Sponsor: {
	// 	name: "打赏",
	// 	url: "/sponsor/",
	// 	icon: "material-symbols:favorite",
	// 	pageKey: "sponsor",
	// },
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();