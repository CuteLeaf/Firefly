import {
	LinkPreset,
	type NavBarConfig,
	type NavBarLink,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/config";

const links: (NavBarLink | LinkPreset)[] = [
	LinkPreset.Home,
	{
		name: "我们的空间",
		url: "/space/",
		icon: "material-symbols:favorite-rounded",
		children: [
			{
				name: "空间主页",
				url: "/space/",
				icon: "material-symbols:home-rounded",
			},
			{
				name: "我的内容",
				url: "/space/mine/",
				icon: "material-symbols:person-rounded",
			},
			{
				name: "双方共享",
				url: "/space/shared/",
				icon: "material-symbols:group-rounded",
			},
			{
				name: "在线写作",
				url: "/space/write/",
				icon: "material-symbols:edit-square-outline-rounded",
			},
			{
				name: "KV 结构",
				url: "/space/kv-preview/",
				icon: "material-symbols:storage-rounded",
			},
		],
	},
	{
		name: "内容回看",
		url: "/archive/",
		icon: "material-symbols:history-rounded",
		children: [LinkPreset.Archive, LinkPreset.Categories, LinkPreset.Tags],
	},
	{
		name: "说明",
		url: "/about/",
		icon: "material-symbols:info-rounded",
		children: [
			LinkPreset.About,
			{
				name: "登录占位",
				url: "/space/login/",
				icon: "material-symbols:login-rounded",
			},
		],
	},
];

export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

export const navBarConfig: NavBarConfig = { links };
