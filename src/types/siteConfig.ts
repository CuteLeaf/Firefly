import type {
	DARK_MODE,
	LIGHT_MODE,
	SYSTEM_MODE,
	WALLPAPER_BANNER,
	WALLPAPER_FULLSCREEN,
	WALLPAPER_NONE,
	WALLPAPER_OVERLAY,
} from "../constants/constants";

export type LIGHT_DARK_MODE =
	| typeof LIGHT_MODE
	| typeof DARK_MODE
	| typeof SYSTEM_MODE;

export type WALLPAPER_MODE =
	| typeof WALLPAPER_BANNER
	| typeof WALLPAPER_FULLSCREEN
	| typeof WALLPAPER_OVERLAY
	| typeof WALLPAPER_NONE;

export type Favicon = {
	src: string;
	theme?: "light" | "dark";
	sizes?: string;
};

export type SiteConfig = {
	title: string;
	subtitle: string;
	site_url: string;
	description?: string; // 网站描述，用于生成 <meta name="description">
	keywords?: string[]; // 站点关键词，用于生成 <meta name="keywords">

	lang: "en" | "zh_CN" | "zh_TW" | "ja" | "ru" | "ko";

	themeColor: {
		hue: number;
		defaultMode?: LIGHT_DARK_MODE; // 默认模式：浅色、深色或跟随系统
	};

	// 页面整体宽度（单位：rem）
	pageWidth?: number;

	// 卡片样式配置
	card: {
		// 是否开启卡片边框和阴影立体效果
		border: boolean;
		// 是否让卡片风格跟随主题色相
		followTheme?: boolean;
	};

	// 站点开始日期，用于计算运行天数
	siteStartDate?: string; // 格式: "YYYY-MM-DD"

	// 可选：站点时区，使用 IANA 时区标识，例如 "Asia/Shanghai"、"UTC"
	timezone?: string;

	favicon: Array<{
		src: string;
		theme?: "light" | "dark";
		sizes?: string;
	}>;

	navbar: {
		/** 导航栏Logo图标，可选类型：icon库、本地图片、网络图片链接 */
		logo?: {
			type: "icon" | "image" | "url";
			value: string; // icon名、本地图片路径或网络图片url
			alt?: string; // 图片alt文本
		};
		title?: string; // 导航栏标题，如果不设置则使用 title
		widthFull?: boolean; // 导航栏是否占满屏幕宽度
		menuAlign?: "left" | "center"; // 导航菜单对齐方式（仅桌面端菜单）
		followTheme?: boolean; // 导航栏图标和标题是否跟随主题色
		stickyNavbar?: boolean; // 导航栏是否固定在顶部始终可见
	};

	// 页面开关配置
	pages: {
		friends: boolean; // 友链页面开关
		sponsor: boolean; // 打赏页面开关
		guestbook: boolean; // 留言板页面开关
		bangumi: boolean;
		gallery: boolean; // 相册页面开关
		anime: boolean; // 追番页面开关
		dynamic: boolean; // 动态页面开关
	};

	// 分类导航栏开关
	categoryBar?: boolean;

	// 归档页是否折叠非最新年份文章
	foldArticle?: boolean;

	// 文章列表布局配置
	postListLayout: {
		defaultMode: "list" | "grid"; // 默认布局模式：list=列表模式，grid=网格模式
		mobileDefaultMode?: "list" | "grid"; // 移动端默认布局模式（视口宽度<780px时使用），不设置则跟随 defaultMode
		descriptionLines?: number; // 文章简介显示行数，设为 0 则不截断，默认 2
		showStatsIcons?: boolean; // 文章卡片底部统计是否显示图标
		// 标签显示位置："meta"=跟随元数据行（默认），"bottom"=卡片底部独立一行（将替换stats显示，二者只能选其一）
		tagsPosition?: "meta" | "bottom";
		// PostMeta 元数据显示控制
		meta?: {
			showPublished?: boolean; // 是否显示发布日期
			showCategory?: boolean; // 是否显示分类
			showTags?: boolean; // 是否显示标签
			tagCount?: number; // 标签数量
			showWords?: boolean; // 是否显示字数
			showReadingTime?: boolean; // 是否显示阅读时间
		};
		// PostStats 统计信息显示控制
		stats?: {
			showPublished?: boolean; // 是否显示发布日期
			showWords?: boolean; // 是否显示字数
			showReadingTime?: boolean; // 是否显示阅读时间
		};
		grid: {
			// 网格布局配置，仅在 defaultMode 为 "grid" 或允许切换布局时生效
			// 是否开启瀑布流布局
			masonry: boolean;
			// 网格模式卡片最小宽度(px)，浏览器根据容器宽度自动计算列数，默认 320
			columnWidth?: number;
		};
	};

	// 文章内容页配置
	post: {
		// 提醒框（Admonitions）配置
		rehypeCallouts: {
			theme: "github" | "obsidian" | "vitepress" | "docusaurus";
			enablePythonMarkdownAdmonitions?: boolean;
		};
		// 控制"上次编辑时间"卡片显示的开关
		showLastModified: boolean;
		// 文章过期阈值（天数），超过此天数才显示"上次编辑"卡片
		outdatedThreshold?: number;
		// 是否显示分享海报按钮
		sharePoster?: boolean;
		// OpenGraph图片功能
		generateOgImages: boolean;
	};

	// bangumi配置
	bangumi?: {
		userId?: string; // Bangumi用户ID
		mode?: "static" | "dynamic"; // 数据模式：static=构建时获取，dynamic=客户端实时获取
		apiUrl?: string; // Bangumi API 地址
		subjectBaseUrl?: string; // 条目详情页地址
		categoryOrder?: ("anime" | "game" | "book" | "music" | "real")[]; // 条目类型排序顺序
		// 各分类的显示启用状态，未设置时默认启用
		categories?: {
			book?: boolean;
			anime?: boolean;
			music?: boolean;
			game?: boolean;
			real?: boolean;
		};
	};

	// 追番配置（Bilibili + TMDB）
	anime?: {
		bilibili?: {
			uid: string; // Bilibili 用户 UID
		};
		tmdb?: {
			apiKey: string; // TMDB API Key
			listId: string; // TMDB 列表 ID
		};
	};

	// 分页配置
	pagination: {
		postsPerPage: number; // 每页显示的文章数量
	};

	// 图片优化配置
	imageOptimization?: {
		/**
		 * 输出图片格式
		 * - "avif": 仅输出 AVIF 格式（最小体积，兼容性较低）
		 * - "webp": 仅输出 WebP 格式（体积适中，兼容性好）
		 * - "both": 同时输出 AVIF 和 WebP（推荐，浏览器自动选择最佳格式）
		 */
		formats?: "avif" | "webp" | "both";
		/**
		 * 图片压缩质量 (1-100)
		 * 值越低体积越小但质量越差，推荐 70-85
		 */
		quality?: number;
		/**
		 * 为特定域名的图片添加 referrerpolicy="no-referrer" 属性
		 * 开启后可解决指定域名图片加载时的 403 问题（如防盗链图片）
		 * 示例：["i0.hdslb.com", "*.bilibili.com"] 支持通配符 *
		 * 仅影响匹配域名的图片标签，不影响其他链接的 referrer 行为
		 */
		noReferrerDomains?: string[];
	};
};
