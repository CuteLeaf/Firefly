import type { ProfileConfig } from "../types/config";
//侧边栏个人信息配置
export const profileConfig: ProfileConfig = {
	// 头像
	// 图片路径支持三种格式：
	// 1. public 目录（以 "/" 开头，不优化）："/assets/images/avatar.webp"
	// 2. src 目录（不以 "/" 开头，自动优化但会增加构建时间，推荐）："assets/images/avatar.webp"
	// 3. 远程 URL："https://example.com/avatar.jpg"
	avatar: "assets/images/avatar.avif",

	// 名字
	name: "lyf",

	// 个人签名
	bio: "Hello, I'm LyF.",

	// 链接配置
	// 已经预装的图标集：fa7-brands，fa7-regular，fa7-solid，material-symbols，simple-icons
	// 访问https://icones.js.org/ 获取图标代码，
	// 如果想使用尚未包含相应的图标集，则需要安装它
	// `pnpm add @iconify-json/<icon-set-name>`
	// showName: true 时显示图标和名称，false 时只显示图标
	links: [
		{
			name: "Twitter",
			icon: "fa7-brands:x-twitter",
			url: "https://twitter.com/lyf_top",
			showName: false,
		},
		{
			name: "qq",
			icon: "fa7-brands:qq",
			url: "https://img.f3f3.top/img/2026/04/28/e33f856532011d1d2b188f154f8f4883.webp",
			showName: false,
		},
		{
			name: "qq",
			icon: "fa7-brands:weixin",
			url: "https://img.f3f3.top/img/2026/04/28/bd534d9f78d8c58ffa667d61d3c0b290.webp",
			showName: false,
		},
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/lyf-top",
			showName: false,
		},
		// {
		// 	name: "Email",
		// 	icon: "fa7-solid:envelope",
		// 	url: "28602960@qq.com",
		// 	showName: false,
		// },
		{
			name: "RSS",
			icon: "fa7-solid:rss",
			url: "/rss/",
			showName: false,
		},
	],
};
