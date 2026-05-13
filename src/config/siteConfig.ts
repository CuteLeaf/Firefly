import type { SiteConfig } from "@/types/config";
import { fontConfig } from "./fontConfig";

// 定义站点语言
// 语言代码，例如：'zh_CN', 'zh_TW', 'en', 'ja', 'ru'。
const SITE_LANG = "zh_CN";

export const siteConfig: SiteConfig = {
	title: "Firefly",
	subtitle: "Demo site",
	site_url: "https://firefly.cuteleaf.cn",
	description:
		"Firefly 是一款基于 Astro 框架和 Fuwari 模板开发的清新美观且现代化个人博客主题模板，专为技术爱好者和内容创作者设计。该主题融合了现代 Web 技术栈，提供了丰富的功能模块和高度可定制的界面，让您能够轻松打造出专业且美观的个人博客网站。",
	keywords: [
		"Firefly",
		"Fuwari",
		"Astro",
		"ACGN",
		"博客",
		"技术博客",
		"静态博客",
	],
	themeColor: {
		// 主题色的默认色相，范围从 0 到 360。例如：红色：0，青色：200，蓝绿色：250，粉色：345
		hue: 165,
		fixed: false,
		defaultMode: "system",
	},
	pageWidth: 100,
	card: {
		border: true,
		followTheme: false,
	},
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
		title: "Firefly",
		widthFull: false,
		menuAlign: "center",
		followTheme: false,
		stickyNavbar: true,
	},
	siteStartDate: "2025-01-01",
	timezone: "Asia/Shanghai",
	rehypeCallouts: {
		theme: "github",
	},
	showLastModified: true,
	outdatedThreshold: 30,
	sharePoster: true,
	generateOgImages: false,
	// Bangumi 的数据为编译时获取的，所以不是实时数据
	bangumi: {
		userId: "1143164",
		// 条目类型排序，数组中的类型将按顺序优先展示
		// 可选值: "anime" | "book" | "music" | "game" | "real" (暂不支持"real"类型)
		// 未列出的类型将按默认顺序排在后面
		categoryOrder: ["anime", "book", "music", "game"],
	},
	// 控制特定页面的访问权限，设为 false 会返回404
	pages: {
		// 友链页面开关
		friends: true,
		// 赞助页面开关
		sponsor: true,
		// 留言板页面开关，需要配置评论系统
		guestbook: true,
		// 番组计划页面开关，含追番、游戏、书籍和音乐，dev 调试时只获取一页数据，build 才会获取全部数据
		bangumi: true,
		// 相册页面开关
		gallery: true,
	},
	categoryBar: true,
	postListLayout: {
		defaultMode: "list",
		mobileDefaultMode: "list",
		showTags: true,
		descriptionLines: 2,
		allowSwitch: true,
		grid: {
			// 是否开启瀑布流布局，同时有封面图和无封面图的混合文章推荐开启
			masonry: false,
			columnWidth: 320,
		},
	},
	pagination: {
		postsPerPage: 10,
	},
	analytics: {
		// Google Analytics
		googleAnalyticsId: "",
		// Microsoft Clarity
		microsoftClarityId: "",
		// Umami
		umamiAnalytics: {
			websiteId: "",
			scriptUrl: "https://cloud.umami.is/script.js",
			trackOutboundLinks: true,
			collectWebVitals: false,
			relpays: {
				enabled: false,
				sampleRate: 0.15,
				maskLevel: "moderate",
				maxDuration: 300000,
				blockSelector: "",
			},
		},
		// 51la
		la51Analytics: {
			Id: "",
			sdkUrl: "",
			ck: "",
			autoTrack: false,
			// Hash 路由模式, 项目使用 History API 路由, 所以不必开启
			hashMode: false,
			screenRecord: true,
		},
	},
	// 响应式图像是为在不同设备上提高性能而调整的图像。这些图像可以调整大小以适应其容器，并且可以根据访问者的屏幕尺寸和分辨率以不同的大小提供。
	// Astro 仅能对 src 目录下的图像进行优化，src 目录下的图像越多，构建时间会越长
	imageOptimization: {
		formats: "webp",
		quality: 85,
		noReferrerDomains: [],
	},
	// 字体配置
	// 在 src/config/fontConfig.ts 中配置具体字体
	font: fontConfig,
	// 站点语言，在本配置文件顶部 SITE_LANG 定义
	lang: SITE_LANG,
};
