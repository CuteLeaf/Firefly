import type { ProfileConfig } from "../types/profileConfig";

export const profileConfig: ProfileConfig = {
	// 头像
	// 图片路径支持三种格式：
	// 1. public 目录（以 "/" 开头，不优化）："/assets/images/avatar.webp"
	// 2. src 目录（不以 "/" 开头，自动优化但会增加构建时间，推荐）："assets/images/avatar.webp"
	// 3. 远程 URL："https://example.com/avatar.jpg"
	avatar: "assets/images/avatar.avif",

	// 名字
	name: "Firefly",

	// 个人签名
	bio: "Hello, I'm Firefly.",

	// 链接配置
	// 已经预装的图标集：fa7-brands，fa7-regular，fa7-solid，material-symbols，simple-icons
	// 访问https://icones.js.org/ 获取图标代码，
	// 如果想使用尚未包含相应的图标集，则需要安装它
	// `pnpm add @iconify-json/<icon-set-name>`
	// showName: true 时显示图标和名称，false 时只显示图标
	// interaction 可配置悬停/点击交互选项：
	// - qrCode: 悬停/聚焦时弹出的二维码图片路径 (如 "/assets/qr-code/wechat.png")
	// - qrCodeAlt: 二维码图片的 Alt 描述文本
	// - copyText: 点击时自动复制到剪贴板的文本 (如微信号/QQ号)
	// - openDelayMs: 点击后延迟打开外链的时间（毫秒，默认 0）

	links: [
		{
			name: "qq",
			icon: "fa7-brands:qq",
			url: "https://qm.qq.com/q/ZGsFa8qX2G",
			showName: false,
			/* 			interaction: {
				copyText: "qq群:xxxx 网站:xxxx 欢迎扩列~",
				openDelayMs: 0,
				qrCode: "https://example.com/assets/qq_qrcode.png",
				qrCodeAlt: "QQ 二维码",
			}, */
		},
		/* 		{
			name: "微信",
			icon: "fa7-brands:weixin",
			url: "weixin://",
			showName: false,
			interaction: {
				copyText: "微信:xxx 网站:xxxx 欢迎扩列~",
				openDelayMs: 3000,
				qrCode: "https://example.com/assets/wechat_qrcode.png",
				qrCodeAlt: "微信二维码",
			},
		}, */
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
	],
};
