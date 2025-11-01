import type { SiteConfig } from "../types/config";
import { fontConfig } from "./fontConfig";

// 定义站点语言
// 语言代码，例如：'zh_CN', 'zh_TW', 'en', 'ja', 'ru'。
const SITE_LANG = "zh_CN"; 

export const siteConfig: SiteConfig = {
  title: "Firefly",
  subtitle: "Demo site",
  description:
    "Firefly 是一款基于 Astro 框架开发的清新美观且现代化个人博客主题，专为技术爱好者和内容创作者设计。该主题融合了现代 Web 技术栈，提供了丰富的功能模块和高度可定制的界面，让您能够轻松打造出专业且美观的个人博客网站。",
  keywords: [
    "Firefly",
    "Fuwari",
    "Astro",
    "ACGN",
    "博客",
    "技术博客",
    "静态博客",
  ],

  lang: SITE_LANG,

  themeColor: {
    hue: 165, // 主题色的默认色相，范围从 0 到 360。例如：红色：0，青色：200，蓝绿色：250，粉色：345
    fixed: false, // 对访问者隐藏主题色选择器
    defaultMode: "system", // 默认模式："light" 亮色，"dark" 暗色，"system" 跟随系统
  },

  favicon: [
    // 留空以使用默认 favicon
    {
      src: "/assets/images/favicon.ico", // 图标文件路径
      theme: "light", // 可选，指定主题 'light' | 'dark'
      sizes: "32x32", // 可选，图标大小
    },
  ],

  // 导航栏Logo
  // navbarLogo 支持三种类型：Astro图标库，本地图片，网络图片
  // { type: "icon", value: "material-symbols:home-pin-outline" }
  // { type: "image", value: "/assets/images/logo.webp", alt: "Firefly Logo" }
  // { type: "image", value: "https://example.com/logo.png", alt: "Firefly Logo" }
  navbarLogo: {
    type: "image",
    value: "/assets/images/LiuYingPure3.svg",
    alt: "🍀",
  },
  navbarTitle: "Firefly", // 导航栏标题，可以设置为与 title 不同的值，如果不设置则使用 title

  
  // 追番配置
  bangumi: {
    userId: "1163581", // 在此处设置你的Bangumi用户ID
  },

  // 文章页底部的"上次编辑时间"卡片开关
  showLastModified: true,

  // OpenGraph图片功能,注意开启后要渲染很长时间，不建议本地调试的时候开启
  generateOgImages: false,

  // 页面开关配置 - 控制特定页面的访问权限，设为false会返回404
  pages: {
    anime: true, // 追番页面开关
    sponsor: true, // 赞助页面开关
  },

  // 文章列表布局配置
  postListLayout: {
    // 默认布局模式："list" 列表模式（单列布局），"grid" 网格模式（双列布局）
    defaultMode: "list",
    // 是否允许用户切换布局
    allowSwitch: true,
  },

  // 分页配置
  pagination: {
    // 每页显示的文章数量
    postsPerPage: 10,
  },

  backgroundWallpaper: {
    // 壁纸模式："banner" 横幅壁纸，"overlay" 全屏壁纸，"none" 纯色背景无壁纸
    mode: "banner",
    // 是否允许用户通过导航栏切换壁纸模式，设为false可提升性能（只渲染当前模式）
    switchable: true,

    // 背景图片配置
    src: {
      // 桌面背景图片
      desktop: "/assets/images/d1.webp",
      // 移动背景图片
      mobile: "/assets/images/m1.webp",
    },

    // 图片位置
    // 支持所有CSS object-position值，如: 'top', 'center', 'bottom', 'left top', 'right bottom', '25% 75%', '10px 20px'..
    // 如果不知道怎么配置百分百之类的配置，推荐直接使用：'center'居中，'top'顶部居中，'bottom' 底部居中，'left'左侧居中，'right'右侧居中
    position: "0% 20%",

    // Banner模式特有配置
    banner: {
      homeText: {
        // 主页显示自定义文本（全局开关）
        enable: true,
        // 主页横幅主标题
        title: "Lovely firefly!",
        // 主页横幅副标题
        subtitle: [
          "In Reddened Chrysalis, I Once Rest",
          "From Shattered Sky, I Free Fall",
          "Amidst Silenced Stars, I Deep Sleep",
          "Upon Lighted Fyrefly, I Soon Gaze",
          "From Undreamt Night, I Thence Shine",
          "In Finalized Morrow, I Full Bloom",
        ],
        typewriter: {
          enable: true, // 启用副标题打字机效果
          speed: 100, // 打字速度（毫秒）
          deleteSpeed: 50, // 删除速度（毫秒）
          pauseTime: 2000, // 完全显示后的暂停时间（毫秒）
        },
      },
      credit: {
        enable: {
          desktop: true, // 桌面端显示横幅图片来源文本
          mobile: false, // 移动端显示横幅图片来源文本
        },
        text: {
          desktop: "Pixiv - 晚晚喵", // 桌面端要显示的来源文本
          mobile: "Mobile Credit", // 移动端要显示的来源文本
        },
        url: {
          desktop: "https://www.pixiv.net/artworks/135490046", // 桌面端原始艺术品或艺术家页面的 URL 链接
          mobile: "", // 移动端原始艺术品或艺术家页面的 URL 链接
        },
      },
      navbar: {
        transparentMode: "semifull", // 导航栏透明模式："semi" 半透明加圆角，"full" 完全透明，"semifull" 动态透明
      },
      // 波浪动画效果配置，开启可能会影响页面性能，请根据实际情况开启
      waves: {
        enable: {
          desktop: true, // 桌面端启用波浪动画效果
          mobile: true, // 移动端启用波浪动画效果
        },
        performance: {
          quality: "high", 
          hardwareAcceleration: true, // 是否启用硬件加速
        },
        // 性能优化说明：
        // quality: "high" - 最佳视觉效果，但GPU占用较高，适合高性能设备
        // quality: "medium" - 平衡性能和质量，适合中等性能设备
        // quality: "low" - 最低GPU占用，动画更简单，适合低性能设备
        // hardwareAcceleration: true - 启用GPU加速，提升性能但增加GPU占用
        // hardwareAcceleration: false - 禁用GPU加速，降低GPU占用但可能影响性能
      },
    },

    // 全屏透明覆盖模式特有配置
    overlay: {
      zIndex: -1, // 层级，确保壁纸在背景层
      opacity: 0.8, // 壁纸透明度
      blur: 1, // 背景模糊程度
    },
  },

  // 目录功能
  toc: {
    // 目录功能开关
    enable: true,
    // 目录深度，1-3，1 表示只显示 h1 标题，2 表示显示 h1 和 h2 标题，依此类推
    // depth在新版已弃用
    depth: 3,
  },

  // 字体配置
  // 在src/config/fontConfig.ts中配置具体字体
  font: fontConfig,
};
