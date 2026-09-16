import { siteConfigDefaults } from "../../../src/config/siteConfig";
import { profileConfigDefaults } from "../../../src/config/profileConfig";
import { commentConfigDefaults } from "../../../src/config/commentConfig";
import { announcementConfigDefaults } from "../../../src/config/announcementConfig";
import { sidebarLayoutConfigDefaults } from "../../../src/config/sidebarConfig";
import { getDynamicNavBarConfig } from "../../../src/config/navBarConfig";
import { backgroundWallpaperDefaults } from "../../../src/config/backgroundWallpaper";
import { musicPlayerConfigDefaults } from "../../../src/config/musicConfig";
import { sakuraConfigDefaults } from "../../../src/config/effectsConfig";
import {
	live2dWidgetConfigDefaults,
	spineModelConfigDefaults,
} from "../../../src/config/pioConfig";
import {
	booknavConfigDefaults,
	booknavPageConfigDefaults,
} from "../../../src/config/booknavConfig";
import { galleryConfigDefaults } from "../../../src/config/galleryConfig";
import { sponsorConfigDefaults } from "../../../src/config/sponsorConfig";
import {
	friendsConfigDefaults,
	friendsPageConfigDefaults,
} from "../../../src/config/friendsConfig";
import { analyticsConfigDefaults } from "../../../src/config/analyticsConfig";
import { displaySettingsConfigDefaults } from "../../../src/config/displaySettingsConfig";
import { dynamicConfigDefaults } from "../../../src/config/dynamicConfig";
import { coverImageConfigDefaults } from "../../../src/config/coverImageConfig";
import { expressiveCodeConfigDefaults } from "../../../src/config/expressiveCodeConfig";
import { mermaidConfigDefaults } from "../../../src/config/mermaidConfig";
import { plantumlConfigDefaults } from "../../../src/config/plantumlConfig";
import { fontConfigDefaults } from "../../../src/config/fontConfig";
import { licenseConfigDefaults } from "../../../src/config/licenseConfig";

/**
 * 配置模块清单 —— 管理后台「个性化设置」的唯一登记表。
 * 新增一个可编辑配置模块的步骤：
 *   1. 在 src/config/ 中把导出改为 mergeUserConfig("新key", XxxDefaults) 形式；
 *   2. 在 admin/schemas/fragments/ 添加 <key>.schema.json；
 *   3. 在本文件 import 该 Defaults 并登记一条记录。
 */
export interface ConfigSection {
	/** 覆盖层分区键（与 mergeUserConfig 的 section 参数一致） */
	key: string;
	/** 中文标题 */
	title: string;
	/** 中文分组（设置页左侧导航按组展示） */
	group: string;
	/** 默认值（模块导出的未合并原始对象/数组） */
	defaults: unknown;
	/** 对应 Schema 片段文件名 */
	schemaFile: string;
	/** 补充说明（可选，显示在表单顶部） */
	note?: string;
}

export const configSections: ConfigSection[] = [
	{
		key: "site",
		title: "站点基础配置",
		group: "核心设置",
		defaults: siteConfigDefaults,
		schemaFile: "site.schema.json",
	},
	{
		key: "profile",
		title: "用户资料",
		group: "核心设置",
		defaults: profileConfigDefaults,
		schemaFile: "profile.schema.json",
	},
	{
		key: "navbar",
		title: "导航栏",
		group: "核心设置",
		defaults: getDynamicNavBarConfig(),
		schemaFile: "navbar.schema.json",
		note: "导航栏链接由代码动态生成；在后台保存后，链接数组将整体以覆盖层形式生效。",
	},
	{
		key: "sidebar",
		title: "侧边栏布局",
		group: "核心设置",
		defaults: sidebarLayoutConfigDefaults,
		schemaFile: "sidebar.schema.json",
	},
	{
		key: "backgroundWallpaper",
		title: "背景壁纸",
		group: "核心设置",
		defaults: backgroundWallpaperDefaults,
		schemaFile: "backgroundWallpaper.schema.json",
	},
	{
		key: "announcement",
		title: "公告",
		group: "核心设置",
		defaults: announcementConfigDefaults,
		schemaFile: "announcement.schema.json",
	},
	{
		key: "gallery",
		title: "相册",
		group: "内容页面",
		defaults: galleryConfigDefaults,
		schemaFile: "gallery.schema.json",
	},
	{
		key: "sponsor",
		title: "打赏",
		group: "内容页面",
		defaults: sponsorConfigDefaults,
		schemaFile: "sponsor.schema.json",
	},
	{
		key: "friends",
		title: "友链列表",
		group: "内容页面",
		defaults: friendsConfigDefaults,
		schemaFile: "friends.schema.json",
	},
	{
		key: "friendsPage",
		title: "友链页面",
		group: "内容页面",
		defaults: friendsPageConfigDefaults,
		schemaFile: "friendsPage.schema.json",
	},
	{
		key: "booknav",
		title: "书签导航",
		group: "内容页面",
		defaults: booknavConfigDefaults,
		schemaFile: "booknav.schema.json",
	},
	{
		key: "booknavPage",
		title: "书签导航页面",
		group: "内容页面",
		defaults: booknavPageConfigDefaults,
		schemaFile: "booknavPage.schema.json",
	},
	{
		key: "dynamic",
		title: "动态页面",
		group: "内容页面",
		defaults: dynamicConfigDefaults,
		schemaFile: "dynamic.schema.json",
	},
	{
		key: "coverImage",
		title: "封面图",
		group: "内容页面",
		defaults: coverImageConfigDefaults,
		schemaFile: "coverImage.schema.json",
	},
	{
		key: "comment",
		title: "评论系统",
		group: "交互组件",
		defaults: commentConfigDefaults,
		schemaFile: "comment.schema.json",
	},
	{
		key: "musicPlayer",
		title: "音乐播放器",
		group: "交互组件",
		defaults: musicPlayerConfigDefaults,
		schemaFile: "musicPlayer.schema.json",
	},
	{
		key: "sakura",
		title: "樱花特效",
		group: "交互组件",
		defaults: sakuraConfigDefaults,
		schemaFile: "sakura.schema.json",
	},
	{
		key: "live2dWidget",
		title: "Live2D 看板娘",
		group: "交互组件",
		defaults: live2dWidgetConfigDefaults,
		schemaFile: "live2dWidget.schema.json",
	},
	{
		key: "spineModel",
		title: "Spine 看板娘",
		group: "交互组件",
		defaults: spineModelConfigDefaults,
		schemaFile: "spineModel.schema.json",
	},
	{
		key: "displaySettings",
		title: "显示设置面板",
		group: "交互组件",
		defaults: displaySettingsConfigDefaults,
		schemaFile: "displaySettings.schema.json",
		note: "这些是前台「设置面板」中各开关的可用性；总开关关闭时所有开关均不生效（与环境变量 PUBLIC_DISPLAY_SETTINGS 优先级更高）。",
	},
	{
		key: "analytics",
		title: "统计分析",
		group: "分析与代码",
		defaults: analyticsConfigDefaults,
		schemaFile: "analytics.schema.json",
	},
	{
		key: "expressiveCode",
		title: "代码高亮",
		group: "分析与代码",
		defaults: expressiveCodeConfigDefaults,
		schemaFile: "expressiveCode.schema.json",
	},
	{
		key: "mermaid",
		title: "Mermaid 图表",
		group: "分析与代码",
		defaults: mermaidConfigDefaults,
		schemaFile: "mermaid.schema.json",
	},
	{
		key: "plantuml",
		title: "PlantUML 图表",
		group: "分析与代码",
		defaults: plantumlConfigDefaults,
		schemaFile: "plantuml.schema.json",
	},
	{
		key: "font",
		title: "字体",
		group: "分析与代码",
		defaults: fontConfigDefaults,
		schemaFile: "font.schema.json",
	},
	{
		key: "license",
		title: "许可证",
		group: "分析与代码",
		defaults: licenseConfigDefaults,
		schemaFile: "license.schema.json",
	},
];

export function getSection(key: string): ConfigSection | undefined {
	return configSections.find((s) => s.key === key);
}
