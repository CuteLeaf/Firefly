import type {
  DARK_MODE,
  LIGHT_MODE,
  SYSTEM_MODE,
  WALLPAPER_BANNER,
  WALLPAPER_OVERLAY,
  WALLPAPER_NONE,
} from "../constants/constants";

export type SiteConfig = {
  title: string;
  subtitle: string;
  description?: string; // 网站描述，用于生成 <meta name="description">
  keywords?: string[]; // 站点关键词，用于生成 <meta name="keywords">

  lang:
    | "en"
    | "zh_CN"
    | "zh_TW"
    | "ja"
    | "ru";

  themeColor: {
    hue: number;
    fixed: boolean;
    defaultMode?: LIGHT_DARK_MODE; // 默认模式：浅色、深色或跟随系统
  };

  // 字体配置
  font: FontConfig;

  // 添加bangumi配置
  bangumi?: {
    userId?: string; // Bangumi用户ID
  };

  backgroundWallpaper: BackgroundWallpaperConfig;
  toc: {
    enable: boolean;
    depth: 1 | 2 | 3;
  };
  generateOgImages: boolean;
  favicon: Array<{
    src: string;
    theme?: "light" | "dark";
    sizes?: string;
  }>;
  /** 导航栏Logo图标，可选类型：icon库、图片链接、本地图片 */
  navbarLogo?: {
    type: "icon" | "image";
    value: string; // icon名或图片url
    alt?: string; // 图片alt文本
  };
  navbarTitle?: string; // 导航栏标题，如果不设置则使用 title
  showLastModified: boolean; // 控制"上次编辑"卡片显示的开关

  // 页面开关配置
  pages: {
    anime: boolean; // 追番页面开关
    sponsor: boolean; // 赞助页面开关
  };

  // 文章列表布局配置
  postListLayout: {
    defaultMode: "list" | "grid"; // 默认布局模式：list=列表模式，grid=网格模式
    allowSwitch: boolean; // 是否允许用户切换布局
  };

  // 分页配置
  pagination: {
    postsPerPage: number; // 每页显示的文章数量
  };
};

export type Favicon = {
  src: string;
  theme?: "light" | "dark";
  sizes?: string;
};

export enum LinkPreset {
  Home = 0,
  Archive = 1,
  About = 2,
  Friends = 3,
  Anime = 4,
  Sponsor = 5,
}

export type NavBarLink = {
  name: string;
  url: string;
  external?: boolean;
  icon?: string; // 菜单项图标
  children?: (NavBarLink | LinkPreset)[]; // 支持子菜单，可以是NavBarLink或LinkPreset
};

export type NavBarConfig = {
  links: (NavBarLink | LinkPreset)[];
};

export type ProfileConfig = {
  avatar?: string;
  name: string;
  bio?: string;
  links: {
    name: string;
    url: string;
    icon: string;
  }[];
};

export type LicenseConfig = {
  enable: boolean;
  name: string;
  url: string;
};
// 评论配置

export type CommentConfig = {
  /**
   * 当前启用的评论系统类型
   * "none" | "twikoo" | "waline" | "giscus" | "disqus"
   */
  type: 'none' | 'twikoo' | 'waline' | 'giscus' | 'disqus';
  twikoo?: {
    envId: string;
    region?: string;
    lang?: string;
    visitorCount?: boolean; 
  };
  waline?: {
    serverURL: string;
    lang?: string;
    login?: 'enable' | 'force' | 'disable';
    visitorCount?: boolean; // 是否统计访问量，true 启用访问量，false 关闭
  };
  giscus?: {
    repo: string;
    repoId: string;
    category: string;
    categoryId: string;
    mapping: string;
    strict: string;
    reactionsEnabled: string;
    emitMetadata: string;
    inputPosition: string;
    theme: string;
    lang: string;
    loading: string;
  };
  disqus?: {
    shortname: string;
  };
};

export type LIGHT_DARK_MODE =
  | typeof LIGHT_MODE
  | typeof DARK_MODE
  | typeof SYSTEM_MODE;

export type WALLPAPER_MODE =
  | typeof WALLPAPER_BANNER
  | typeof WALLPAPER_OVERLAY
  | typeof WALLPAPER_NONE;

export type BlogPostData = {
  body: string;
  title: string;
  published: Date;
  description: string;
  tags: string[];
  draft?: boolean;
  image?: string;
  category?: string;
  pinned?: boolean;
  prevTitle?: string;
  prevSlug?: string;
  nextTitle?: string;
  nextSlug?: string;
};

export type ExpressiveCodeConfig = {
  theme: string;
};

export type AnnouncementConfig = {
  // enable属性已移除，现在通过sidebarLayoutConfig统一控制
  title?: string; // 公告栏标题
  content: string; // 公告栏内容
  icon?: string; // 公告栏图标
  type?: "info" | "warning" | "success" | "error"; // 公告类型
  closable?: boolean; // 是否可关闭
  link?: {
    enable: boolean; // 是否启用链接
    text: string; // 链接文字
    url: string; // 链接地址
    external?: boolean; // 是否外部链接
  };
};

// 单个字体配置
export type FontItem = {
  id: string; // 字体唯一标识符
  name: string; // 字体显示名称
  src: string; // 字体文件路径或URL链接
  family: string; // CSS font-family 名称
  weight?: string | number; // 字体粗细，如 "normal", "bold", 400, 700 等
  style?: "normal" | "italic" | "oblique"; // 字体样式
  display?: "auto" | "block" | "swap" | "fallback" | "optional"; // font-display 属性
  unicodeRange?: string; // Unicode 范围，用于字体子集化
  format?:
    | "woff"
    | "woff2"
    | "truetype"
    | "opentype"
    | "embedded-opentype"
    | "svg"; // 字体格式，仅当 src 为本地文件时需要
};

// 字体配置
export type FontConfig = {
  enable: boolean; // 是否启用自定义字体功能
  selected: string | string[]; // 当前选择的字体ID，支持单个或多个字体组合
  fonts: Record<string, FontItem>; // 字体库，以ID为键的对象
  fallback?: string[]; // 全局字体回退列表
  preload?: boolean; // 是否预加载字体文件以提高性能
};

export type FooterConfig = {
  enable: boolean; // 是否启用Footer HTML注入功能
  customHtml?: string; // 自定义HTML内容，用于添加备案号等信息
};

// 组件配置类型定义
export type WidgetComponentType =
  | "profile"
  | "announcement"
  | "categories"
  | "tags"
  | "toc"
  | "advertisement"
  | "custom";

export type WidgetComponentConfig = {
  type: WidgetComponentType; // 组件类型
  enable: boolean; // 是否启用该组件
  order: number; // 显示顺序，数字越小越靠前
  position: "top" | "sticky"; // 组件位置：顶部固定区域或粘性区域
  class?: string; // 自定义CSS类名
  style?: string; // 自定义内联样式
  animationDelay?: number; // 动画延迟时间（毫秒）
  configId?: string; // 配置ID，用于广告组件指定使用哪个配置
  responsive?: {
    hidden?: ("mobile" | "tablet" | "desktop")[]; // 在指定设备上隐藏
    collapseThreshold?: number; // 折叠阈值
  };
  customProps?: Record<string, any>; // 自定义属性，用于扩展组件功能
};

export type SidebarLayoutConfig = {
  enable: boolean; // 是否启用侧边栏
  position: "left" | "right"; // 侧边栏位置：左侧或右侧
  components: WidgetComponentConfig[]; // 组件配置列表
  defaultAnimation: {
    enable: boolean; // 是否启用默认动画
    baseDelay: number; // 基础延迟时间（毫秒）
    increment: number; // 每个组件递增的延迟时间（毫秒）
  };
  responsive: {
    breakpoints: {
      mobile: number; // 移动端断点（px）
      tablet: number; // 平板端断点（px）
      desktop: number; // 桌面端断点（px）
    };
    layout: {
      mobile: "hidden" | "bottom" | "drawer" | "sidebar"; // 移动端布局模式
      tablet: "sidebar" | "bottom" | "drawer"; // 平板端布局模式
      desktop: "sidebar"; // 桌面端布局模式
    };
  };
};

export type SakuraConfig = {
  enable: boolean; // 是否启用樱花特效
  sakuraNum: number; // 樱花数量，默认21
  limitTimes: number; // 樱花越界限制次数，-1为无限循环
  size: {
    min: number; // 樱花最小尺寸倍数
    max: number; // 樱花最大尺寸倍数
  };
  opacity: {
    min: number; // 樱花最小不透明度
    max: number; // 樱花最大不透明度
  };
  speed: {
    horizontal: {
      min: number; // 水平移动速度最小值
      max: number; // 水平移动速度最大值
    };
    vertical: {
      min: number; // 垂直移动速度最小值
      max: number; // 垂直移动速度最大值
    };
    rotation: number; // 旋转速度
    fadeSpeed: number; // 消失速度，不应大于最小不透明度
  };
  zIndex: number; // 层级，确保樱花在合适的层级显示
};

// Spine 看板娘配置
export type SpineModelConfig = {
  enable: boolean; // 是否启用 Spine 看板娘
  model: {
    path: string; // 模型文件路径 (.json)
    scale?: number; // 模型缩放比例，默认1.0
    x?: number; // X轴偏移，默认0
    y?: number; // Y轴偏移，默认0
  };
  position: {
    corner: "bottom-left" | "bottom-right" | "top-left" | "top-right"; // 显示位置
    offsetX?: number; // 水平偏移量，默认20px
    offsetY?: number; // 垂直偏移量，默认20px
  };
  size: {
    width?: number; // 容器宽度，默认280px
    height?: number; // 容器高度，默认400px
  };
  interactive?: {
    enabled?: boolean; // 是否启用交互功能，默认true
    clickAnimations?: string[]; // 点击时随机播放的动画列表
    clickMessages?: string[]; // 点击时随机显示的文字消息
    messageDisplayTime?: number; // 文字显示时间（毫秒），默认3000
    idleAnimations?: string[]; // 待机动画列表
    idleInterval?: number; // 待机动画切换间隔（毫秒），默认10000
  };
  responsive?: {
    hideOnMobile?: boolean; // 是否在移动端隐藏，默认false
    mobileBreakpoint?: number; // 移动端断点，默认768px
  };
  zIndex?: number; // 层级，默认1000
  opacity?: number; // 透明度，0-1，默认1.0
};

// Live2D 看板娘配置
export type Live2DModelConfig = {
  enable: boolean; // 是否启用 Live2D 看板娘
  model: {
    path: string; // 模型文件夹路径或model3.json文件路径
  };
  position?: {
    corner?: "bottom-left" | "bottom-right" | "top-left" | "top-right"; // 显示位置，默认bottom-right
    offsetX?: number; // 水平偏移量，默认20px
    offsetY?: number; // 垂直偏移量，默认20px
  };
  size?: {
    width?: number; // 容器宽度，默认280px
    height?: number; // 容器高度，默认250px
  };
  interactive?: {
    enabled?: boolean; // 是否启用交互功能，默认true
    // motions 和 expressions 将从模型 JSON 文件中自动读取
    clickMessages?: string[]; // 点击时随机显示的文字消息
    messageDisplayTime?: number; // 文字显示时间（毫秒），默认3000
  };
  responsive?: {
    hideOnMobile?: boolean; // 是否在移动端隐藏，默认false
    mobileBreakpoint?: number; // 移动端断点，默认768px
  };
};

export type BackgroundWallpaperConfig = {
  mode: "banner" | "overlay" | "none"; // 壁纸模式：banner横幅模式、overlay全屏透明覆盖模式或none纯色背景
  switchable?: boolean; // 是否允许用户通过导航栏切换壁纸模式，默认true
  src:
    | string
    | string[]
    | {
        desktop?: string | string[];
        mobile?: string | string[];
      }; // 支持单个图片、图片数组或分别设置桌面端和移动端图片
  position?:
    | "top"
    | "center"
    | "bottom"
    | "top left"
    | "top center"
    | "top right"
    | "center left"
    | "center center"
    | "center right"
    | "bottom left"
    | "bottom center"
    | "bottom right"
    | "left top"
    | "left center"
    | "left bottom"
    | "right top"
    | "right center"
    | "right bottom"
    | string; // 壁纸位置，支持CSS object-position的所有值，包括百分比和像素值
  // Banner模式特有配置
  banner?: {
    homeText?: {
      enable: boolean; // 是否在首页显示自定义文字（全局开关）
      title?: string; // 主标题
      subtitle?: string | string[]; // 副标题，支持单个字符串或字符串数组
      typewriter?: {
        enable: boolean; // 是否启用打字机效果
        speed: number; // 打字速度（毫秒）
        deleteSpeed: number; // 删除速度（毫秒）
        pauseTime: number; // 完整显示后的暂停时间（毫秒）
      };
    };
    credit?: {
      enable:
        | boolean
        | {
            desktop: boolean; // 桌面端是否显示横幅图片来源文本
            mobile: boolean; // 移动端是否显示横幅图片来源文本
          }; // 是否显示横幅图片来源文本，支持布尔值或分别设置桌面端和移动端
      text:
        | string
        | {
            desktop: string; // 桌面端显示的来源文本
            mobile: string; // 移动端显示的来源文本
          }; // 横幅图片来源文本，支持字符串或分别设置桌面端和移动端
      url?:
        | string
        | {
            desktop: string; // 桌面端原始艺术品或艺术家页面的 URL 链接
            mobile: string; // 移动端原始艺术品或艺术家页面的 URL 链接
          }; // 原始艺术品或艺术家页面的 URL 链接，支持字符串或分别设置桌面端和移动端
    };
    navbar?: {
      transparentMode?: "semi" | "full" | "semifull"; // 导航栏透明模式
    };
    waves?: {
      enable:
        | boolean
        | {
            desktop: boolean; // 桌面端是否启用波浪动画效果
            mobile: boolean; // 移动端是否启用波浪动画效果
          }; // 是否启用波浪动画效果，支持布尔值或分别设置桌面端和移动端
      performance?: {
        quality: "high" | "medium" | "low"; // 渲染质量：high=高质量，medium=中等质量，low=低质量
        hardwareAcceleration: boolean; // 是否启用硬件加速
      }; // 波浪效果性能优化配置
    };
  };
  // 全屏透明覆盖模式特有配置
  overlay?: {
    zIndex?: number; // 层级，确保壁纸在合适的层级显示
    opacity?: number; // 壁纸透明度，0-1之间
    blur?: number; // 背景模糊程度，单位px
  };
};

// 广告栏配置
export type AdConfig = {
  title?: string; // 广告栏标题
  content?: string; // 广告栏文本内容
  image?: {
    src: string; // 图片地址
    alt?: string; // 图片描述
    link?: string; // 图片点击链接
    external?: boolean; // 是否外部链接
  };
  link?: {
    text: string; // 链接文本
    url: string; // 链接地址
    external?: boolean; // 是否外部链接
  };
  padding?: {
    top?: string; // 上边距，如 "0", "1rem", "16px"
    right?: string; // 右边距
    bottom?: string; // 下边距
    left?: string; // 左边距
    all?: string; // 统一边距，会覆盖单独设置
  };
  closable?: boolean; // 是否可关闭
  displayCount?: number; // 显示次数限制，-1为无限制
  expireDate?: string; // 过期时间 (ISO 8601 格式)
};

// 友链配置
export type FriendLink = {
  title: string; // 友链标题
  imgurl: string; // 头像图片URL
  desc: string; // 友链描述
  siteurl: string; // 友链地址
  tags?: string[]; // 标签数组
  weight: number; // 权重，数字越大排序越靠前
  enabled: boolean; // 是否启用
};

// 音乐播放器配置
export type MusicPlayerConfig = {
  // 基础功能开关
  enable: boolean; // 启用音乐播放器功能

  // 播放器模式配置
  mode?: "local" | "meting"; // 播放器模式："local" 本地音乐，"meting" 在线音乐

  // Meting API 配置
  meting?: {
    // Meting API 地址
    api?: string;

    // 歌单配置
    playlist?: {
      id?: string; // 歌单ID
      server?: "netease" | "tencent" | "kugou" | "xiami" | "baidu"; // 音乐平台
      type?: "playlist" | "album" | "song"; // 类型
    };

    // 备用 API 配置
    fallbackApis?: string[];
  };

  // 本地音乐配置
  local?: {
    // 本地播放列表
    // 本地音乐文件路径（相对于 public 目录）
    playlist?: Array<{
      id: number;
      title: string;
      artist: string;
      cover: string;
      url: string;
      duration: number;
    }>;
  };

  // 播放器行为配置
  behavior?: {
    // 自动播放
    autoplay?: boolean;

    // 默认音量
    defaultVolume?: number;

    // 默认播放模式
    defaultShuffle?: boolean;
    defaultRepeat?: 0 | 1 | 2; // 0=不循环, 1=单曲循环, 2=列表循环

    // 播放器位置
    position?: {
      bottom?: number;
      right?: number;
    };
  };

  // 界面配置
  ui?: {
    // 动画配置
    animation?: {
      coverRotation?: {
        enable?: boolean;
        speed?: number;
        pauseOnHover?: boolean;
      };
    };

    // 显示配置
    display?: {
      showPlaylistButton?: boolean;
      showVolumeControl?: boolean;
      showShuffleButton?: boolean;
      showRepeatButton?: boolean;
      showSkipButtons?: boolean;
    };

    // 播放列表配置
    playlist?: {
      maxHeight?: number;
      width?: number;
      showTrackNumbers?: boolean;
      showDuration?: boolean;
    };
  };

  // 响应式配置
  responsive?: {
    // 移动端配置
    mobile?: {
      position?: {
        bottom?: number;
        right?: number;
      };
    };

    // 小屏幕配置
    smallScreen?: {};
  };

  // 错误处理配置
  errorHandling?: {
    showErrorMessages?: boolean;
    errorDisplayDuration?: number;
    autoSkipOnError?: boolean;
  };
};

// 赞助方式类型
export type SponsorMethod = {
  name: string; // 赞助方式名称，如 "支付宝"、"微信"、"PayPal"
  icon?: string; // 图标名称（Iconify 格式），如 "fa6-brands:alipay"
  qrCode?: string; // 收款码图片路径（相对于 public 目录），可选
  link?: string; // 赞助链接 URL，可选。如果提供，会显示跳转按钮
  description?: string; // 描述文本
  enabled: boolean; // 是否启用
};

// 赞助者列表项
export type SponsorItem = {
  name: string; // 赞助者名称，如果想显示匿名，可以直接设置为"匿名"或使用 i18n
  amount?: string; // 赞助金额（可选）
  date?: string; // 赞助日期（可选，ISO 格式）
  message?: string; // 留言（可选）
};

// 赞助配置
export type SponsorConfig = {
  title?: string; // 页面标题，默认使用 i18n
  description?: string; // 页面描述文本
  usage?: string; // 赞助用途说明
  methods: SponsorMethod[]; // 赞助方式列表
  sponsors?: SponsorItem[]; // 赞助者列表（可选）
  showSponsorsList?: boolean; // 是否显示赞助者列表，默认 true
  showButtonInPost?: boolean; // 是否在文章详情页底部显示赞助按钮，默认 false
};
