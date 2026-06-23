import type { ProfileConfig } from "../types/profileConfig";

export const profileConfig: ProfileConfig = {
	// 头像
	// 图片路径支持三种格式：
	// 1. public 目录（以 "/" 开头，不优化）："/assets/images/avatar.webp"
	// 2. src 目录（不以 "/" 开头，自动优化但会增加构建时间，推荐）："assets/images/avatar.webp"
	// 3. 远程 URL："https://example.com/avatar.jpg"
	avatar: "/assets/images/touxiang.avif",

	// 名字
	name: "小黄",

	// 个人签名
	bio: "Hello, I'm 小黄.",

	// 链接配置
	// 已经预装的图标集：fa7-brands，fa7-regular，fa7-solid，material-symbols，simple-icons
	// 访问https://icones.js.org/ 获取图标代码，
	// 如果想使用尚未包含相应的图标集，则需要安装它
	// `pnpm add @iconify-json/<icon-set-name>`
	// showName: true 时显示图标和名称，false 时只显示图标
	links: [
		{
			name: "QQ",
			icon: "fa7-brands:qq",
			url: "tencent://message/?uin=1183222829&Site=&Menu=yes",
			showName: false,
		},
		{
			name: "Steam",
			icon: "fa7-brands:steam",
			url: "https://steamcommunity.com/id/DrakenWong/",
			showName: false,
		},
		{
			name: "bilibili",
			icon: "fa7-brands:bilibili",
			url: "https://space.bilibili.com/44820473",
			showName: false,
		},
		{
			name: "weibo",
			icon: "fa7-brands:weibo",
			url: "https://weibo.com/u/3208411043",
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
