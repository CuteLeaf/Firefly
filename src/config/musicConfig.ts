import type { MusicPlayerConfig } from "../types/config";

// 音乐播放器配置
export const musicPlayerConfig: MusicPlayerConfig = {
	// 使用方式："meting" 使用 Meting API，"local" 使用本地音乐列表
	mode: "meting",

	// 默认音量 (0-1)
	volume: 0.7,

	// 播放模式：'list'=列表循环, 'one'=单曲循环, 'random'=随机播放
	playMode: "list",

	// Meting API 配置
	meting: {
		// Meting API 地址
		// 默认使用官方 API，也可以使用自定义 API
		api: "https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r",
		// 音乐平台：netease=网易云音乐, tencent=QQ音乐, kugou=酷狗音乐, xiami=虾米音乐, baidu=百度音乐
		server: "netease",
		// 类型：song=单曲, playlist=歌单, album=专辑, search=搜索, artist=艺术家
		type: "playlist",
		// 歌单/专辑/单曲 ID 或搜索关键词
		id: "10046455237",
		// 认证 token（可选）
		auth: "",
		// 备用 API 配置（当主 API 失败时使用）
		fallbackApis: [
			"https://api.injahow.cn/meting/?server=:server&type=:type&id=:id",
			"https://api.moeyao.cn/meting/?server=:server&type=:type&id=:id",
		],
		// MetingJS 脚本路径
		// 默认使用 CDN：https://cdn.jsdelivr.net/npm/meting@2/dist/Meting.min.js
		// 备用CDN：https://unpkg.com/meting@2/dist/Meting.min.js
		// 也可配置为本地路径
		jsPath: "https://unpkg.com/meting@2/dist/Meting.min.js",
	},

	// 本地音乐配置（当 mode 为 'local' 时使用）
	local: {
		playlist: [
			{
				name: "使一颗心免于哀伤",
				artist: "知更鸟 / HOYO-MiX / Chevy",
				url: "/assets/music/使一颗心免于哀伤-哼唱.mav",
				cover: "/assets/music/cover/109951169585655912.webp",
				// 歌词内容，支持 LRC 格式
				lrc: "",
			},
		],
	},


	// 响应式配置
	responsive: {
		// 移动端配置
		mobile: {
			// 在移动端是否隐藏
			hide: false,
			// 移动端断点（小于此宽度时应用移动端配置）
			breakpoint: 768,
		},
	},
};
