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
	const links: NavBarLink[] = [
		LinkPresets.Home,
	];

	// 文章下拉父菜单 补充pageKey
	links.push({
		name: "文章",
		url: "#",
		icon: "material-symbols:article",
		pageKey: "menu-article",
		children: [
			LinkPresets.Archive,
			LinkPresets.Categories,
			LinkPresets.Tags,
		],
	});

	links.push(LinkPresets.Friends);
	links.push(LinkPresets.Guestbook);

	// 我的下拉父菜单 补充pageKey
	links.push({
		name: "我的",
		url: "#",
		icon: "material-symbols:person",
		pageKey: "menu-mine",
		children: [
			LinkPresets.Gallery,
			// LinkPresets.Anime,
			// LinkPresets.Bangumi,
		],
	});

	// 关于下拉父菜单 补充pageKey
	links.push({
		name: "关于",
		url: "#",
		icon: "material-symbols:info",
		pageKey: "menu-about",
		children: [
			// LinkPresets.Sponsor,
			LinkPresets.About,
		],
	});

	return { links } as NavBarConfig;
};

// 导航搜索配置
export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

// ============================================================================
// 所有链接预设 全部强制补齐 pageKey
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

	// 注释停用项，保留定义方便后续开启
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