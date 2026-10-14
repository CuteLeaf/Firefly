import type { ProfileConfig } from "../types/profileConfig";

export const profileConfig: ProfileConfig = {
	// 头像
	// 图片路径支持三种格式：
	// 1. public 目录（以 "/" 开头，不优化）："/assets/images/avatar.webp"
	// 2. src 目录（不以 "/" 开头，自动优化但会增加构建时间，推荐）："assets/images/avatar.webp"
	// 3. 远程 URL："https://example.com/avatar.jpg"
	avatar:
		"https://i0.hdslb.com/bfs/face/96a6399dffe9e203d3afcc83fe5af3377830fa19.png",

	// 名字
	name: "MC_Kero",

	// 个人签名
	bio: "依稀当年泪目干！",

	// 链接配置
	// 已经预装的图标集：fa7-brands，fa7-regular，fa7-solid，material-symbols，simple-icons
	// 访问https://icones.js.org/ 获取图标代码，
	// 如果想使用尚未包含相应的图标集，则需要安装它
	// `pnpm add @iconify-json/<icon-set-name>`
	// showName: true 时显示图标和名称，false 时只显示图标
	links: [
		{
			name: "Email",
			icon: "fa7-solid:envelope",
			url: "mailto:ai@mckero.com",
			showName: false,
		},
		{
			name: "BiliBili",
			icon: "fa7-brands:bilibili",
			url: "https://space.bilibili.com/3493260722964658",
			showName: false,
		},
		{
			name: "爱发电",
			icon: "simple-icons:afdian",
			url: "https://afdian.com/a/MCKeroblog",
			showName: false,
		},
		{
			name: "RSS",
			icon: "fa7-solid:rss",
			url: "/rss/",
			showName: false,
		},
	],
};
