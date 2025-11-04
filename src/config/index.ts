// 配置索引文件 - 统一导出所有配置
// 这样组件可以一次性导入多个相关配置，减少重复的导入语句

// 核心配置
export { siteConfig } from "./siteConfig"; // 站点基础配置
export { profileConfig } from "./profileConfig"; // 用户资料配置

// 功能配置
export { commentConfig } from "./commentConfig"; // 评论系统配置
export { announcementConfig } from "./announcementConfig"; // 公告配置
export { licenseConfig } from "./licenseConfig"; // 许可证配置
export { footerConfig } from "./footerConfig"; // 页脚配置
export { coverImageConfig } from "./coverImageConfig"; // 封面图配置

// 样式配置
export { expressiveCodeConfig } from "./expressiveCodeConfig"; // 代码高亮配置
export { sakuraConfig } from "./sakuraConfig"; // 樱花特效配置
export { fontConfig } from "./fontConfig"; // 字体配置

// 布局配置
export { sidebarLayoutConfig } from "./sidebarConfig"; // 侧边栏布局配置
export { navBarConfig, navBarSearchConfig } from "./navBarConfig"; // 导航栏配置与搜索配置

// 组件配置
export { musicPlayerConfig } from "./musicConfig"; // 音乐播放器配置
export { spineModelConfig, live2dModelConfig } from "./pioConfig"; // 看板娘配置
export { adConfig1, adConfig2 } from "./adConfig"; // 广告配置
export { getEnabledFriends } from "./friendsConfig"; // 友链配置
export { sponsorConfig } from "./sponsorConfig"; // 赞助配置

// 类型导出
export type {
  SiteConfig,
  ProfileConfig,
  CommentConfig,
  AnnouncementConfig,
  LicenseConfig,
  FooterConfig,
  CoverImageConfig,
  ExpressiveCodeConfig,
  SakuraConfig,
  MusicPlayerConfig,
  SidebarLayoutConfig,
  NavBarConfig,
  WidgetComponentConfig,
  WidgetComponentType,
  SponsorConfig,
  SponsorMethod,
  SponsorItem,
} from "../types/config";
