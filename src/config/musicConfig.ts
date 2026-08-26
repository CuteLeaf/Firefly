import type { MusicPlayerConfig } from "../types/musicConfig";

// 音乐播放器配置
export const musicPlayerConfig: MusicPlayerConfig = {
  // 是否在导航栏显示音乐播放器入口
  showInNavbar: true,

  // 是否在侧边栏显示音乐播放器组件
  showInSidebar: true,

  // 使用 Meting API 获取网易云音乐歌单
  mode: "meting",

  // 默认音量 (0-1)
  volume: 0.7,

  // 播放模式：设为 'random' 让歌单内歌曲随机播放
  playMode: "random",

  // 是否启用歌词显示
  showLyrics: true,

  // Meting API 配置
  meting: {
    // Meting API 地址（官方及备用）
    api: "https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r",
    // 音乐平台：netease = 网易云音乐
    server: "netease",
    // 类型：playlist = 歌单
    type: "playlist",
    // ★ 二次元风格歌单 ID（可替换为你喜欢的歌单 ID）
    id: "7756226060",
    // 认证 token（可选）
    auth: "",
    // 备用 API 地址（当主 API 失败时自动切换）
    fallbackApis: [
      "https://api.injahow.cn/meting/?server=:server&type=:type&id=:id",
      "https://api.moeyao.cn/meting/?server=:server&type=:type&id=:id",
    ],
  },

  // 本地音乐配置（当前使用 meting 模式，此处仅作占位）
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