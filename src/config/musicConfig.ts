import type { MusicPlayerConfig } from "../types/config";

// 音乐播放器配置
export const musicPlayerConfig: MusicPlayerConfig = {
  // 基础功能开关
  enable: true, // 启用音乐播放器功能

  // 播放器模式配置
  mode: "local", // 播放器模式："local" 本地音乐，"meting" 在线音乐

  // Meting API 配置
  meting: {
    // Meting API 地址，默认使用 bilibili.uno 提供的免费服务
    // 你也可以使用其他 Meting API 服务或自建服务
    api: "https://www.bilibili.uno/api?server=:server&type=:type&id=:id&auth=:auth&r=:r",

    // 歌单配置
    playlist: {
      id: "8814137515", // 歌单ID
      server: "netease", // 音乐平台：netease=网易云音乐, tencent=QQ音乐, kugou=酷狗音乐, xiami=虾米音乐, baidu=百度音乐
      type: "playlist", // 类型：playlist=歌单, album=专辑, song=单曲
    },

    // 备用 API 配置（当主 API 失败时使用）
    fallbackApis: [
      "https://api.injahow.cn/bete/?server=:server&type=:type&id=:id",
      "https://api.uomg.com/api/other/163music?format=json&id=:id",
    ],
  },

  // 本地音乐配置
  local: {
    // 本地播放列表
    // 本地音乐文件路径（相对于 public 目录）
    playlist: [
      {
        id: 1,
        title: "呼吸着你的香水味",
        artist: "小小宇",
        cover: "/assets/music/cover/49ef802e45ff9613eb79039c00ad46151761349423978.jpg",
        url: "/assets/music/小小宇唱歌.mp3",
        duration: 240,
      },
    ],
  },

  // 播放器行为配置
  behavior: {
    // 自动播放（注意：现代浏览器通常阻止自动播放）
    autoplay: false,

    // 默认音量 (0-1)
    defaultVolume: 0.7,

    // 默认播放模式
    defaultShuffle: false, // 随机播放
    defaultRepeat: 2, // 循环模式：0=不循环, 1=单曲循环, 2=列表循环

    // 播放器位置
    position: {
      bottom: 16, // 距离底部距离 (px)
      right: 16, // 距离右侧距离 (px)
      left: "auto", // 距离左侧距离 (px)，设为 "auto" 时使用 right 定位
    },
  },

  // 界面配置
  ui: {
    // 动画配置
    animation: {
      // 封面旋转动画
      coverRotation: {
        enable: true, // 启用封面旋转
        speed: 3, // 旋转速度（秒/圈）
        pauseOnHover: true, // 鼠标悬停时暂停旋转
      },
    },

    // 显示配置
    display: {
      // 是否显示播放列表按钮
      showPlaylistButton: true,

      // 是否显示音量控制
      showVolumeControl: true,

      // 是否显示随机播放按钮
      showShuffleButton: true,

      // 是否显示循环按钮
      showRepeatButton: true,

      // 是否显示上一首/下一首按钮
      showSkipButtons: true,
    },

    // 播放列表配置
    playlist: {
      // 播放列表面板最大高度 (px)
      maxHeight: 384,

      // 播放列表面板宽度 (px)
      width: 320,

      // 是否显示歌曲序号
      showTrackNumbers: true,

      // 是否显示歌曲时长
      showDuration: true,
    },
  },

  // 响应式配置
  responsive: {
    // 移动端配置
    mobile: {
      // 移动端播放器位置
      position: {
        bottom: 8,
        right: 8,
        left: 8,
      },
    },

    // 小屏幕配置 (≤480px)
    smallScreen: {},
  },

  // 错误处理配置
  errorHandling: {
    // 是否显示错误提示
    showErrorMessages: true,

    // 错误提示显示时长 (ms)
    errorDisplayDuration: 3000,

    // 是否在播放失败时自动跳转到下一首
    autoSkipOnError: true,
  },
};
