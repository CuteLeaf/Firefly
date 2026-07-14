import type { ProfileConfig } from "../types/profileConfig";

export const profileConfig: ProfileConfig = {
	avatar: "/assets/images/touxiang.jpg", // 移到public目录，构建更快
	name: "XYX",
	bio: "自律学习｜干货整理｜经验分享", // 微调更贴合你的技术博客定位

	links: [
		{
			name: "QQ",
			icon: "fa7-brands:qq",
			url: "https://qm.qq.com/q/HghbPuReoy",
			showName: true, // 图标+文字，访客一眼看懂
		},
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/xyxnb123",
			showName: true,
		},
		{
			name: "邮箱",
			icon: "fa7-solid:envelope",
			url: "mailto:yuxinxiao2025@163.com", // 修复mailto协议
			showName: true,
		},
		// 可选新增：博客主页直达，强化个人站点标识
		{
			name: "我的博客",
			icon: "material-symbols:home",
			url: "https://xyxstudy.kdns.fr",
			showName: true,
		},
	],
};