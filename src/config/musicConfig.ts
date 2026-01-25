import type { MusicPlayerConfig } from "../types/config";

// 音乐播放器配置
export const musicPlayerConfig: MusicPlayerConfig = {
	// 音乐播放器功能开关
	enable: true,

	// 使用方式："meting" 使用 Meting API，"local" 使用本地音乐列表
	mode: "local",

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
				url: "/assets/music/使一颗心免于哀伤-哼唱.wav",
				cover: "/assets/music/cover/109951169585655912.jpg",
				// 歌词内容，支持 LRC 格式
				lrc: "",
			},
		],
	},

	// APlayer 配置选项
	player: {
		// 是否自动播放  浏览器可能会阻止，需用户交互一次网页后才自动播放
		autoplay: false,
		// 主题色
		theme: "var(--btn-regular-bg)",
		// 循环模式：'all'=列表循环, 'one'=单曲循环, 'none'=不循环
		loop: "all",
		// 播放顺序：'list'=列表顺序, 'random'=随机播放
		order: "list",
		// 预加载：'none'=不预加载, 'metadata'=预加载元数据, 'auto'=自动
		preload: "auto",
		// 默认音量 (0-1)
		volume: 0.7,
		// 是否互斥播放（同时只能播放一个播放器）
		mutex: true,
		// local歌词类型：0=不显示, 1=显示（需要提供 lrc 字段）, 2=显示（从 HTML 内容读取）
		lrcType: 1,
		// 歌词是否默认隐藏（当 lrcType 不为 0 时，可以通过此选项控制初始显示状态）
		// true=默认隐藏（用户可以通过歌词按钮手动显示）, false=默认显示
		lrcHidden: true,
		// 播放列表是否默认折叠
		listFolded: false,
		// 播放列表最大高度
		listMaxHeight: "340px",
		// localStorage 存储键名
		storageName: "aplayer-setting",
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
