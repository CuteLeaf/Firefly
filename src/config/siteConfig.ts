import type { SiteConfig } from "@/types/config";
import { fontConfig } from "./fontConfig";

// 定义站点语言
// 语言代码，例如：'zh_CN', 'zh_TW', 'en', 'ja', 'ru'。
const SITE_LANG = "zh_CN";

export const siteConfig: SiteConfig = {
	// 站点标题
	title: "Firefly",

	// 站点副标题
	subtitle: "Demo site",

	// 站点 URL
	site_url: "https://firefly.cuteleaf.cn",

	// 站点描述
	description:
		"Firefly 是一款基于 Astro 框架和 Fuwari 模板开发的清新美观且现代化个人博客主题模板，专为技术爱好者和内容创作者设计。该主题融合了现代 Web 技术栈，提供了丰富的功能模块和高度可定制的界面，让您能够轻松打造出专业且美观的个人博客网站。",

	// 站点关键词
	keywords: [
		"Firefly",
		"Fuwari",
		"Astro",
		"ACGN",
		"博客",
		"技术博客",
		"静态博客",
	],

	// 主题色
	themeColor: {
		// 主题色的默认色相，范围从 0 到 360。例如：红色：0，青色：200，蓝绿色：250，粉色：345
		hue: 165,
		// 是否对访问者隐藏主题色选择器
		fixed: false,
		// 默认模式："light" 亮色，"dark" 暗色，"system" 跟随系统
		defaultMode: "system",
	},

	// 页面整体宽度（单位：rem）
	// 数值越大可以让页面内容区域更宽
	// 在使用单侧栏边栏时，建议调低一些宽度以获得更好的视觉效果。
	pageWidth: 100,

	// 网站Card样式配置
	card: {
		// 是否开启卡片边框和阴影，开启后让网站更有立体感
		border: true,
	},

	// Favicon 配置
	favicon: [
		{
			// 图标文件路径
			src: "/favicon/favicon.ico",
			// 可选，指定主题 'light' | 'dark'
			// theme: "light",
			// 可选，图标大小
			// sizes: "32x32",
		},
	],

	// 导航栏配置
	navbar: {
		// 导航栏Logo
		// 支持三种类型：
		// 1. Astro图标库: { type: "icon", value: "material-symbols:home-pin-outline" }
		// 2. 本地图片（public目录，不优化）: { type: "image", value: "/assets/images/logo.webp", alt: "Logo" }
		// 3. 本地图片（src目录，自动优化但会增加构建时间，推荐）: { type: "image", value: "assets/images/logo.webp", alt: "Logo" }
		// 4. 网络图片: { type: "url", value: "https://example.com/logo.png", alt: "Logo" }
		logo: {
			type: "image",
			value: "assets/images/firefly.png",
			alt: "🍀",
		},
		// 导航栏标题
		title: "Firefly",
		// 全宽导航栏，导航栏是否占满屏幕宽度，true：占满，false：不占满
		widthFull: false,
		// 导航栏图标和标题是否跟随主题色
		followTheme: false,
	},

	// 站点开始日期，用于统计运行天数
	siteStartDate: "2025-01-01",

	// 站点时区（IANA 时区字符串），用于格式化bangumi、rss里的构建日期时间等等..
	// 示例："Asia/Shanghai", "UTC", 如果为空，则按照构建服务器的时区进行时区转换
	timezone: "Asia/Shanghai",

	// 提醒框（Admonitions）配置，修改后需要重启开发服务器才能生效
	// 主题：'github' | 'obsidian' | 'vitepress'，每个主题风格和语法不同，可根据喜好选择
	rehypeCallouts: {
		theme: "github",
	},

	// 文章页底部的"上次编辑时间"卡片开关
	showLastModified: true,

	// 文章过期阈值（天数），超过此天数才显示"上次编辑"卡片
	outdatedThreshold: 30,

	// 是否开启分享海报生成功能
	sharePoster: true,

	// OpenGraph图片功能,注意开启后要渲染很长时间，不建议本地调试的时候开启
	generateOgImages: false,

	// bangumi配置
	bangumi: {
		// Bangumi用户ID
		userId: "1143164",
	},

	// 页面开关配置 - 控制特定页面的访问权限，设为false会返回404
	// bangumi的数据为编译时获取的，所以不是实时数据，请配置bangumi.userId
	pages: {
		// 赞助页面开关
		sponsor: true,
		// 留言板页面开关，需要配置评论系统
		guestbook: true,
		// 番组计划页面开关，含追番、游戏、书籍和音乐，dev调试时只获取一页数据，build才会获取全部数据
		bangumi: true,
		// 相册页面开关
		gallery: true,
	},

	// 分类导航栏开关，在首页和归档页顶部显示分类快捷导航
	categoryBar: true,

	// 文章列表布局配置
	postListLayout: {
		// 默认布局模式："list" 列表模式（单列布局），"grid" 网格模式（多列布局）
		defaultMode: "list",
		// 是否允许用户切换布局
		allowSwitch: true,
		// 网格布局配置，仅在 defaultMode 为 "grid" 或允许切换布局时生效
		grid: {
			// 是否开启瀑布流布局，同时有封面图和无封面图的混合文章推荐开启
			masonry: false,
			// 网格模式卡片最小宽度(px)，浏览器根据容器宽度自动计算列数，默认 280
			columnWidth: 320,
		},
	},

	// 分页配置
	pagination: {
		// 每页显示的文章数量
		postsPerPage: 10,
	},

	// 统计分析
	analytics: {
		// Google Analytics ID
		googleAnalyticsId: "",
		// Microsoft Clarity ID
		microsoftClarityId: "",
	},

	// 图像优化及响应式配置
	// 图像优化压缩只保留avif或webp
	// 响应式图像是为在不同设备上提高性能而调整的图像。这些图像可以调整大小以适应其容器，并且可以根据访问者的屏幕尺寸和分辨率以不同的大小提供。
	// Astro 仅能对 src 目录下的图像进行优化，src 目录下的图像越多，构建时间会越长
	// Astro 图像文档 https://docs.astro.build/zh-cn/guides/images/
	imageOptimization: {
		// 输出图片格式
		// - "avif": 仅输出 AVIF 格式（最新技术，最小体积，目前兼容性较低）
		// - "webp": 仅输出 WebP 格式（体积适中，兼容性好）
		// - "both": 同时输出 AVIF 和 WebP（推荐，浏览器自动选择最佳格式）
		formats: "webp",
		// 图片压缩质量 (1-100)，值越低体积越小但质量越差，推荐 70-85
		quality: 85,
	},

	// 字体配置
	// 在src/config/fontConfig.ts中配置具体字体
	font: fontConfig,

	// 站点语言，在本配置文件顶部SITE_LANG定义
	lang: SITE_LANG,
};
