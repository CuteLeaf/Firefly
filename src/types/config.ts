export type { AnalyticsConfig } from "./analyticsConfig";
export type { AnnouncementConfig } from "./announcementConfig";
export type { BackgroundWallpaperConfig } from "./backgroundWallpaper";
export type { CommentConfig } from "./commentConfig";
export type { CoverImageConfig } from "./coverImageConfig";
export type { SakuraConfig } from "./effectsConfig";
export type {
	ExpressiveCodeConfig,
	PluginCollapsibleConfig,
	PluginLanguageBadgeConfig,
} from "./expressiveCodeConfig";
export type { FontSelectionConfig } from "./fontConfig";
export type { FooterConfig } from "./footerConfig";
export type { FriendLink, FriendsPageConfig } from "./friendsConfig";
export type { GalleryAlbum, GalleryConfig } from "./galleryConfig";
export type { LicenseConfig } from "./licenseConfig";
export type { MermaidConfig } from "./mermaidConfig";
export type { MusicPlayerConfig } from "./musicConfig";
export type {
	NavBarConfig,
	NavBarLink,
	NavBarSearchConfig,
	NavBarSearchMethod,
} from "./navBarConfig";
export type { Live2DWidgetConfig, SpineModelConfig } from "./pioConfig";
export type { PlantUMLConfig } from "./plantumlConfig";
export type { ProfileConfig } from "./profileConfig";
export type {
	AdConfig,
	CalendarConfig,
	MobileBottomComponentConfig,
	SidebarLayoutConfig,
	SiteInfoConfig,
	WidgetComponentConfig,
	WidgetComponentType,
	WidgetSpecificConfig,
} from "./sidebarConfig";
export type {
	Favicon,
	LIGHT_DARK_MODE,
	SiteConfig,
	WALLPAPER_MODE,
} from "./siteConfig";
export type {
	SponsorConfig,
	SponsorItem,
	SponsorMethod,
} from "./sponsorConfig";

// 响应式图像布局类型
export type ResponsiveImageLayout = "constrained" | "full-width" | "none";

// 图像格式类型
export type ImageFormat = "avif" | "webp" | "png" | "jpg" | "jpeg" | "gif";
