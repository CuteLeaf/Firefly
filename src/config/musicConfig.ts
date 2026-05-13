import type { MusicPlayerConfig } from "../types/config";

// 禁用音乐播放器方法：
// 模板默认侧边栏和导航栏两个都显示
// 1. 侧边栏：在sidebarConfig.ts侧边栏配置把音乐组件enable设为false禁用即可
// 2. 导航栏：在本配置文件把showInNavbar设为false禁用即可

export const musicPlayerConfig: MusicPlayerConfig = {
	showInNavbar: true,
	mode: "meting",
	volume: 0.7,
	playMode: "list",
	showLyrics: true,
	meting: {
		// 默认使用官方 API，也可以使用自定义 API
		api: "https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r",
		server: "netease",
		type: "playlist",
		id: "10046455237",
		auth: "",
		fallbackApis: [
			"https://api.injahow.cn/meting/?server=:server&type=:type&id=:id",
			"https://api.moeyao.cn/meting/?server=:server&type=:type&id=:id",
		],
	},
	local: {
		playlist: [
			{
				name: "使一颗心免于哀伤",
				artist: "知更鸟 / HOYO-MiX / Chevy",
				url: "/assets/music/使一颗心免于哀伤-哼唱.mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
		],
	},
};
