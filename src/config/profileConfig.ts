import type { ProfileConfig } from "../types/profileConfig";

export const profileConfig: ProfileConfig = {
	// 头像
	// 图片路径支持三种格式：
	// 1. public 目录（以 "/" 开头，不优化）："/assets/images/avatar.webp"
	// 2. src 目录（不以 "/" 开头，自动优化但会增加构建时间，推荐）："assets/images/avatar.webp"
	// 3. 远程 URL："https://example.com/avatar.jpg"
	avatar: "assets/images/avatar.avif",

	// 名字
	name: "XiaYe",

	// 个人签名
	bio: "Hello, I'm XiaYe.",

	// 链接显示模式
	// "icon"   = 仅图标：紧凑方形按钮（默认，与旧版表现一致）
	// "banner" = 横幅：横向宽按钮、常显名称，一行放不下自动换行
	// 这里只是默认值，开启显示设置面板后可在「外观 → Profile 链接样式」里运行时切换
	linkDisplayMode: "icon",

	// 链接配置
	// 已经预装的图标集：fa7-brands，fa7-regular，fa7-solid，material-symbols，simple-icons
	// 访问https://icones.js.org/ 获取图标代码，
	// 如果想使用尚未包含相应的图标集，则需要安装它
	// `pnpm add @iconify-json/<icon-set-name>`
	// showName 只在「仅图标」模式下生效：true 显示图标和名称，false 只显示图标
	// 「横幅」模式下恒显示名称，showName 被忽略
	links: [
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/CuteLeaf",
			showName: false,
		},
		{
			name: "Email",
			icon: "fa7-solid:envelope",
			url: "mailto:xiaye@msn.com",
			showName: false,
		},
		{
			name: "RSS",
			icon: "fa7-solid:rss",
			url: "/rss/",
			showName: false,
		},
		{
			name: "Atom",
			icon: "fa7-solid:atom",
			url: "/atom/",
			showName: false,
		},
	],
};
