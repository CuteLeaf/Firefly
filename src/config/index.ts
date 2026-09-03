// 配置索引文件 - 统一导出所有配置
// 这样组件可以一次性导入多个相关配置，减少重复的导入语句

import type { NavbarMode } from "../types/siteConfig";
import { siteConfig } from "./siteConfig"; // 站点基础配置（用于派生 navbarMode）

/** 解析导航栏模式：navbarMode 优先，否则按旧 stickyNavbar 兼容映射（true→fixed，false→static） */
export function resolveNavbarMode(navbar: {
	navbarMode?: NavbarMode;
	stickyNavbar?: boolean;
}): NavbarMode {
	if (navbar.navbarMode) return navbar.navbarMode;
	return navbar.stickyNavbar === false ? "static" : "fixed";
}

/** 当前导航栏模式（已按 navbarMode / 旧 stickyNavbar 解析），供各消费方统一读取 */
export const navbarMode: NavbarMode = resolveNavbarMode(siteConfig.navbar);

// 类型导出
export type {
	AdConfig,
	AnalyticsConfig,
	AnnouncementConfig,
	BackgroundWallpaperConfig,
	BooknavFaviconConfig,
	BooknavGroup,
	BooknavItem,
	BooknavPageConfig,
	CommentConfig,
	CoverImageConfig,
	DisplaySettingsConfig,
	DynamicConfig,
	ExpressiveCodeConfig,
	FooterConfig,
	GalleryAlbum,
	GalleryConfig,
	LicenseConfig,
	MermaidConfig,
	MusicPlayerConfig,
	NavBarConfig,
	PageDisplayConfig,
	PlantUMLConfig,
	ProfileConfig,
	SakuraConfig,
	SidebarLayoutConfig,
	SiteConfig,
	SponsorConfig,
	SponsorItem,
	SponsorMethod,
	WidgetComponentConfig,
	WidgetComponentType,
	WidgetSpecificConfig,
} from "../types/config";
export type {
	BuiltinFontProvider,
	CustomFontProvider,
	FontDefinition,
	FontSelectionConfig,
} from "../types/fontConfig"; // 字体类型定义
export { analyticsConfig } from "./analyticsConfig"; // 统计分析配置
export { announcementConfig } from "./announcementConfig"; // 公告配置
// 样式配置
export { backgroundWallpaper } from "./backgroundWallpaper"; // 背景壁纸配置
export { booknavConfig, booknavPageConfig } from "./booknavConfig"; // 书签导航配置
// 功能配置
export { commentConfig } from "./commentConfig"; // 评论系统配置
export { coverImageConfig } from "./coverImageConfig"; // 封面图配置
export { displaySettingsConfig } from "./displaySettingsConfig"; // 显示设置面板开关配置
export { dynamicConfig } from "./dynamicConfig"; // 动态页面配置
export { sakuraConfig } from "./effectsConfig"; // 动画特效配置（樱花等）
export { expressiveCodeConfig } from "./expressiveCodeConfig"; // 代码高亮配置
export { fontConfig, fontsList } from "./fontConfig"; // 字体配置
export { footerConfig } from "./footerConfig"; // 页脚配置
export { friendsPageConfig, getEnabledFriends } from "./friendsConfig"; // 友链配置
export { galleryConfig } from "./galleryConfig"; // 相册配置
export { licenseConfig } from "./licenseConfig"; // 许可证配置
// 组件配置
export { mermaidConfig } from "./mermaidConfig"; // Mermaid 图表配置
export { musicPlayerConfig } from "./musicConfig"; // 音乐播放器配置
export { navBarConfig, navBarSearchConfig } from "./navBarConfig"; // 导航栏配置与搜索配置
export { live2dWidgetConfig, spineModelConfig } from "./pioConfig"; // 看板娘配置
export { plantumlConfig } from "./plantumlConfig"; // PlantUML 图表配置
export { profileConfig } from "./profileConfig"; // 用户资料配置
export { pageDisplayConfig } from "./pageDisplayConfig"; // 文章页面显示配置
// 布局配置
export { sidebarLayoutConfig } from "./sidebarConfig"; // 侧边栏布局配置
// 核心配置
export { siteConfig } from "./siteConfig"; // 站点基础配置
export { sponsorConfig } from "./sponsorConfig"; // 打赏配置
