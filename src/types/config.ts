import type {
	DARK_MODE,
	LIGHT_MODE,
	SYSTEM_MODE,
	WALLPAPER_BANNER,
	WALLPAPER_FULLSCREEN,
	WALLPAPER_NONE,
	WALLPAPER_OVERLAY,
} from "../constants/constants";

/**
 * 站点配置\
 * 站点配置是 Firefly 主题的核心配置文件，控制站点的基本信息、主题色、页面开关等全局设置。
 * @see https://docs-firefly.cuteleaf.cn/zh/guide/site.html
 */
export type SiteConfig = {
	/** 站点标题 */
	title: string;
	/** 站点副标题 */
	subtitle: string;
	/**
	 * 站点 URL
	 * @example "https://firefly.cuteleaf.cn"
	 */
	site_url: string;
	/** 网站描述，用于生成 `<meta name="description">` */
	description?: string;
	/** 站点关键词，用于生成 `<meta name="keywords">` */
	keywords?: string[];
	/**
	 * 站点语言
	 * @default "en"
	 * @example "zh_CN"
	 */
	lang: "en" | "zh_CN" | "zh_TW" | "ja" | "ru";
	/** 主题色配置 */
	themeColor: {
		/** 主题色色相，范围 0-360。 */
		hue: number;
		/** 是否对访问者隐藏主题色选择器 */
		fixed: boolean;
		/**
		 * 默认颜色模式
		 * @default "light"
		 * @example "system"
		 */
		defaultMode?: "light" | "dark" | "system";
	};

	/**
	 * 页面整体宽度，单位 `rem`，数值越大可以让页面内容区域更宽\
	 * 在使用单侧栏边栏时，建议调低一些宽度以获得更好的视觉效果。
	 * @default 100
	 */
	pageWidth?: number;

	/** 卡片样式配置 */
	card: {
		/** 是否开启卡片边框和阴影，开启后让网站更有立体感 */
		border: boolean;
		/** 是否让卡片风格跟随主题色相 */
		followTheme?: boolean;
	};

	/**
	 * 字体配置\
	 * Firefly 支持自定义字体配置，可以使用 CDN 字体或本地字体文件。
	 * @see https://docs-firefly.cuteleaf.cn/zh/guide/font.html
	 */
	font: FontConfig;

	/**
	 * 站点开始日期，格式 `YYYY-MM-DD`，用于计算运行天数。
	 * @default "2025-01-01"
	 */
	siteStartDate?: string;

	/**
	 * 站点时区（IANA 时区字符串），用于格式化 Bangumi、RSS 里的构建日期时间等。\
	 * 如果为空，则按照构建服务器的时区进行时区转换。
	 * @example "Asia/Shanghai"
	 * @example "UTC"
	 */
	timezone?: string;

	/**
	 * 提醒框（Admonitions）配置，修改后需要重启开发服务器才能生效。
	 */
	rehypeCallouts: {
		/**
		 * 提醒框主题\
		 * 每个主题风格和语法不同，可根据喜好选择。
		 * @default "github"
		 * @see https://firefly.cuteleaf.cn/posts/markdown-extended/
		 */
		theme: "github" | "obsidian" | "vitepress";
	};

	/**
	 * Bangumi 配置\
	 * Bangumi 的数据为编译时获取，不是实时数据。dev 调试时只获取一页数据，build 才会获取全部数据。
	 */
	bangumi?: {
		/** Bangumi 用户 ID */
		userId?: string;
		/**
		 * 条目类型排序顺序，未列出的类型将按默认顺序排在后面。
		 * @default []
		 */
		categoryOrder?: ("anime" | "game" | "book" | "music" | "real")[];
	};
	/**
	 * OpenGraph 图片功能\
	 * 注意开启后要渲染很长时间，不建议本地调试的时候开启
	 */
	generateOgImages: boolean;
	/**
	 * Favicon 配置
	 * @default defaultFavicons
	 */
	favicon: Favicon[];
	/** 导航栏配置 */
	navbar: {
		/** 导航栏 Logo 配置 */
		logo?: {
			/** Logo 类型，支持 Astro 图标库、本地图片、网络图片 */
			type: "icon" | "image" | "url";
			/**
			 * icon 名、本地图片路径或网络图片 URL\
			 * 本地图片分为以 `/` 开头的 public 目录下的图片（不优化）和以非 `/` 开头的 src 目录下的图片（自动优化但会增加构建时间）
			 * @default "material-symbols:home-pin-outline"
			 * @example "/assets/images/logo.webp"
			 * @example "assets/images/logo.webp"
			 * @example "https://example.com/logo.png"
			 */
			value: string;
			/** 图片缺省时的替代文本 */
			alt?: string;
		};
		/**
		 * 导航栏标题，如果不设置则使用站点标题
		 * @default SiteConfig.title
		 */
		title?: string;
		/**
		 * 导航栏是否占满屏幕宽度
		 * @default false
		 */
		widthFull?: boolean;
		/**
		 * 桌面端导航菜单对齐方式
		 * @default "center"
		 */
		menuAlign?: "left" | "center";
		/** 导航栏图标和标题是否跟随主题色 */
		followTheme?: boolean;
		/**
		 * 导航栏是否固定在顶部始终可见
		 * @default false
		 */
		stickyNavbar?: boolean;
	};

	/** 是否显示文章底部的“上次编辑时间”卡片 */
	showLastModified: boolean;
	/**
	 * 文章过期阈值（天数），超过此天数才显示“上次编辑时间”卡片
	 * @default 1
	 */
	outdatedThreshold?: number;
	/** 是否显示分享海报按钮 */
	sharePoster?: boolean;

	/** 页面开关配置 */
	pages: {
		/** 友链页面开关 */
		friends: boolean;
		/** 赞助页面开关 */
		sponsor: boolean;
		/** 留言板页面开关 */
		guestbook: boolean;
		/** Bangumi 页面开关 */
		bangumi: boolean;
		/** 相册页面开关 */
		gallery: boolean;
	};

	/** 分类导航栏开关，在首页和归档页顶部显示分类快捷导航 */
	categoryBar?: boolean;

	/**
	 * 文章列表布局配置
	 * @see https://firefly.cuteleaf.cn/posts/firefly-layout-system/
	 */
	postListLayout: {
		/**
		 * 默认布局模式
		 * - "list" 列表模式（单列布局）
		 * - "grid" 网格模式（多列布局）
		 * @default "list"
		 */
		defaultMode: "list" | "grid";
		/**
		 * 移动端默认布局模式（视口宽度 `<780px` 时使用），不设置则跟随 `defaultMode`
		 * @default SiteConfig.postListLayout.defaultMode
		 */
		mobileDefaultMode?: "list" | "grid";
		/**
		 * 是否在文章列表中显示标签
		 * @default true
		 */
		showTags: boolean;
		/**
		 * 文章简介显示行数，设为 0 则不截断
		 * @default 2
		 */
		descriptionLines?: number;
		/** 是否允许用户切换布局 */
		allowSwitch: boolean;
		/** 网格布局配置，仅在 `defaultMode` 为 `grid` 或允许切换布局时生效 */
		grid: {
			/** 是否开启瀑布流布局 */
			masonry: boolean;
			/**
			 * 网格模式卡片最小宽度（px），浏览器根据容器宽度自动计算列数
			 * @default 280
			 */
			columnWidth?: number;
		};
	};

	/** 分页配置 */
	pagination: {
		/** 每页显示的文章数量 */
		postsPerPage: number;
	};

	/** 统计分析配置 */
	analytics?: {
		/** Google Analytics ID */
		googleAnalyticsId?: string;
		/** Microsoft Clarity ID */
		microsoftClarityId?: string;
		/** Umami 统计配置 */
		umamiAnalytics?: {
			/** Umami Website ID */
			websiteId?: string;
			/** Umami JS 地址，支持使用自建 */
			scriptUrl?: string;
			/**
			 * 是否追踪出站链接点击事件
			 * @default true
			 */
			trackOutboundLinks?: boolean;
			/**
			 * 是否自动收集访客浏览器核心网页指标
			 * @default false
			 */
			collectWebVitals?: boolean;
			/** 会话回放配置 */
			relpays?: {
				/**
				 * 是否启用会话回放
				 * @default false
				 */
				enabled?: boolean;
				/**
				 * 录制会话采样率，范围 `0-1`
				 * @default 0.15
				 */
				sampleRate?: number;
				/**
				 * 隐私遮罩级别
				 * @default "moderate"
				 */
				maskLevel?: "moderate" | "strict";
				/**
				 * 单次录制最大时长（毫秒）
				 * @default 300000
				 */
				maxDuration?: number;
				/**
				 * 需要完全排除录制的元素 CSS 选择器
				 * @example ".sensitive-widget"
				 */
				blockSelector?: string;
			};
		};
		/** 51la 统计配置 */
		la51Analytics?: {
			/** 51la 统计 ID */
			Id?: string;
			/**
			 * 自定义 SDK 地址，防止 DNS 污染
			 * @default "http://sdk.51.la/js-sdk-pro.min.js"
			 * @default "https://sdk.51.la/js-sdk-pro.min.js"
			 */
			sdkUrl?: string;
			/**
			 * 多个统计 ID 的数据分离标识
			 * @default SiteConfig.analytics.la51Analytics.Id
			 */
			ck?: string;
			/** 开启事件分析功能
			 * @default true
			 */
			autoTrack?: boolean;
			/**
			 * Hash 路由模式\
			 * 项目使用 History API 路由，无需开启
			 * @default false
			 */
			hashMode?: boolean;
			/** 开启网站录屏功能
			 * @default true
			 */
			screenRecord?: boolean;
		};
	};

	/**
	 * 图片优化配置
	 * @see https://docs.astro.build/zh-cn/guides/images/
	 */
	imageOptimization?: {
		/**
		 * 输出图片格式
		 * - `"avif"`: 仅输出 AVIF 格式（最小体积，兼容性较低）
		 * - `"webp"`: 仅输出 WebP 格式（体积适中，兼容性好）
		 * - `"both"`: 同时输出 AVIF 和 WebP（推荐，浏览器自动选择最佳格式）
		 * @default "both"
		 */
		formats?: "avif" | "webp" | "both";
		/**
		 * 图片压缩质量（1-100）\
		 * 值越低体积越小但质量越差，推荐 70-85
		 * @default 80
		 */
		quality?: number;
		/**
		 * 为特定域名的图片添加 `referrerpolicy="no-referrer"` 属性，开启后可解决指定域名图片加载时的 403 问题（如防盗链图片）\
		 * 示例：`["i0.hdslb.com", "*.bilibili.com"]` 支持通配符 `*`\
		 * 仅影响匹配域名的图片标签，不影响其他链接的 referrer 行为
		 * @default []
		 */
		noReferrerDomains?: string[];
	};
};

/**
 * Favicon 配置
 * @see https://docs-firefly.cuteleaf.cn/zh/guide/site.html#favicon
 */
export type Favicon = {
	/**
	 * 图标文件路径（相对于 `public` 目录）
	 * @example "/favicon/favicon-light-32.png"
	 */
	src: string;
	/** 指定在浏览器哪个颜色模式显示图标，不填写默认全部 */
	theme?: "light" | "dark";
	/**
	 * 图标长宽
	 * @example "32x32"
	 */
	sizes?: string;
};

/**
 * 导航栏预设链接\
 * Firefly 提供了一组内置的导航链接预设，可以直接使用。
 * @see https://docs-firefly.cuteleaf.cn/zh/guide/navbar.html
 */
export enum LinkPreset {
	/** 首页 */
	Home = 0,
	/** 归档页 */
	Archive = 1,
	/** 关于页 */
	About = 2,
	/** 友链 */
	Friends = 3,
	/** 赞助页 */
	Sponsor = 4,
	/** 留言板 */
	Guestbook = 5,
	/** 番组计划 */
	Bangumi = 6,
	/** 相册 */
	Gallery = 7,
}

/**
 * 导航栏自定义链接
 * @see https://docs-firefly.cuteleaf.cn/zh/guide/navbar.html
 */
export type NavBarLink = {
	/** 链接名称 */
	name: string;
	/** 链接地址 */
	url: string;
	/** 菜单项图标 */
	icon?: string;
	/** 是否为外部链接 */
	external?: boolean;
	/** 子菜单项，支持嵌套 */
	children?: (NavBarLink | LinkPreset)[];
};

/**
 * 导航栏搜索方式
 * @see https://docs-firefly.cuteleaf.cn/zh/guide/navbar.html
 */
export enum NavBarSearchMethod {
	/**
	 * PageFind
	 * @see https://github.com/Pagefind/pagefind
	 */
	PageFind = 0,
}

/**
 * 导航栏搜索配置
 * @see https://docs-firefly.cuteleaf.cn/zh/guide/navbar.html
 */
export type NavBarSearchConfig = {
	/**
	 * 导航栏搜索方式
	 * @see https://docs-firefly.cuteleaf.cn/zh/guide/navbar.html
	 */
	method: NavBarSearchMethod;
};

/**
 * 导航栏配置\
 * 导航栏配置控制站点顶部导航菜单的链接和搜索功能。
 * @see https://docs-firefly.cuteleaf.cn/zh/guide/navbar.html
 */
export type NavBarConfig = {
	links: (NavBarLink | LinkPreset)[];
};

/**
 * 个人资料配置\
 * 个人资料配置控制侧边栏中的用户资料卡片，包括头像、名字、签名和社交链接。
 * @see https://docs-firefly.cuteleaf.cn/zh/guide/profile.html
 */
export type ProfileConfig = {
	/**
	 * 头像图片路径\
	 * 图片路径支持以 `/` 开头的 public 目录下的图片（不优化）和以非 `/` 开头的 src 目录下的图片（自动优化但会增加构建时间），以及远程 URL
	 * @example "/assets/images/avatar.webp"
	 * @example "assets/images/avatar.webp"
	 * @example "https://example.com/avatar.jpg"
	 * @default ""
	 */
	avatar?: string;
	/** 名字 */
	name: string;
	/** 个人签名 */
	bio?: string;
	/** 社交链接列表 */
	links: {
		/** 链接名称 */
		name: string;
		/** 图标（Iconify 格式） */
		icon: string;
		/** 链接地址 */
		url: string;
		/** 是否显示链接名称 */
		showName?: boolean;
	}[];
};

/**
 * 许可证配置
 * @see https://docs-firefly.cuteleaf.cn/zh/guide/license.html
 */
export type LicenseConfig = {
	/** 是否在文章顶部显示许可证信息 */
	enable: boolean;
	/** 许可证名称 */
	name: string;
	/** 许可证链接 */
	url: string;
};

/**
 * 评论配置\
 * Firefly 支持多种评论系统，包括 Twikoo、Waline、Giscus、Disqus 和 Artalk。
 * @see https://docs-firefly.cuteleaf.cn/zh/guide/comment.html
 */
export type CommentConfig = {
	/**
	 * 评论系统类型，`"none"` 为不启用评论系统
	 * @default "none"
	 */
	type: "none" | "twikoo" | "waline" | "giscus" | "disqus" | "artalk";
	/**
	 * Twikoo 评论系统\
	 * Twikoo 是一个简洁、安全、免费的静态网站评论系统。
	 * @see https://twikoo.js.org
	 * @see https://docs-firefly.cuteleaf.cn/zh/guide/comment.html#twikoo
	 */
	twikoo?: {
		/** Twikoo 环境 ID 或后端地址 */
		envId: string;
		/**
		 * Twikoo 环境地域
		 * @default "ap-shanghai"
		 */
		region?: string;
		/**
		 * Twikoo 评论系统语言
		 * @see https://github.com/twikoojs/twikoo/blob/main/src/client/utils/i18n/index.js
		 * @default "zh-CN"
		 */
		lang?: string;
		/** 是否启用文章访问量统计 */
		visitorCount?: boolean;
	};
	/**
	 * Waline 评论系统\
	 * Waline 一款从 Valine 衍生的带后端评论系统。可以将 Waline 等价成 With backend Valine.
	 * @see https://waline.js.org
	 * @see https://docs-firefly.cuteleaf.cn/zh/guide/comment.html#waline
	 */
	waline?: {
		/** Waline 后端服务地址 */
		serverURL: string;
		/**
		 * Waline 评论系统语言
		 * @see https://waline.js.org/reference/client/props.html#lang
		 */
		lang?: string;
		/**
		 * Waline 评论系统表情地址
		 * @see https://waline.js.org/reference/client/props.html#emoji
		 * @see https://waline.js.org/guide/features/emoji.html
		 * @default ['//unpkg.com/@waline/emojis@1.1.0/weibo']
		 */
		emoji: string[];
		/** 评论登录模式：
		 * - `"enable"` 允许访客匿名评论和用第三方 OAuth 登录评论，兼容性最佳。
		 * - `"force"` 强制必须登录后才能评论，适合严格社区，关闭匿名评论。
		 * - `"disable"` 禁止所有登录和 OAuth，仅允许匿名评论（填写昵称/邮箱），适用于极简留言。
		 * @see https://waline.js.org/reference/client/props.html#login
		 * @default "enable"
		 */
		login?: "enable" | "force" | "disable";
		/** 是否启用文章访问量统计 */
		visitorCount?: boolean;
	};
	/**
	 * Artalk 评论系统\
	 * Artalk 是一款简单易用但功能丰富的评论系统，你可以开箱即用地部署并置入任何博客、网站、Web 应用。
	 * @see https://artalk.js.org
	 * @see https://docs-firefly.cuteleaf.cn/zh/guide/comment.html#artalk
	 */
	artalk?: {
		/** Artalk 后端 API 地址 */
		server: string;
		/**
		 * Artalk 评论系统语言
		 * @see https://artalk.js.org/zh/guide/frontend/i18n.html
		 * @default "zh_CN"
		 */
		locale: string;
		/** 是否启用文章访问量统计 */
		visitorCount?: boolean;
	};
	/**
	 * Giscus 评论系统\
	 * Giscus 是一个由 GitHub Discussions 驱动的评论系统。
	 * @see https://giscus.app
	 * @see https://docs-firefly.cuteleaf.cn/zh/guide/comment.html#giscus
	 */
	giscus?: {
		/** 启用 Giscus 评论系统的仓库 */
		repo: string;
		/** 启用 Giscus 评论系统仓库的 ID */
		repoId: string;
		/** Giscus 使用的 Discussion 分类 */
		category: string;
		/** Giscus 使用的 Discussion 分类 ID */
		categoryId: string;
		/** 文章与 Giscus 的映射关系 */
		mapping: string;
		/**
		 * 是否启用严格标题匹配
		 * @see https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#data-strict
		 */
		strict: "0" | "1";
		/** 是否启用反应（Reaction）功能 */
		reactionsEnabled: "0" | "1";
		/**
		 * 是否获取 Giscus 元数据
		 * @see https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#imetadatamessage
		 */
		emitMetadata: "0" | "1";
		/** 配置 Giscus 评论输入框的所在位置 */
		inputPosition: "top" | "bottom";
		/** Giscus 评论系统语言 */
		lang: string;
		/** Giscus 评论系统加载方式 */
		loading: "lazy";
	};
	/**
	 * Disqus 评论系统\
	 * Disqus 是一个第三方评论托管平台。
	 * @see https://disqus.com
	 * @see https://docs-firefly.cuteleaf.cn/zh/guide/comment.html#disqus
	 */
	disqus?: {
		/** Disqus shortname */
		shortname: string;
	};
};

export type LIGHT_DARK_MODE =
	| typeof LIGHT_MODE
	| typeof DARK_MODE
	| typeof SYSTEM_MODE;

export type WALLPAPER_MODE =
	| typeof WALLPAPER_BANNER
	| typeof WALLPAPER_FULLSCREEN
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

/**
 * 代码块配置\
 * 代码块配置基于 Expressive Code，支持自定义主题和代码折叠功能。\
 * 修改本配置后需要重启Astro开发服务器才能生效。
 * @see https://expressive-code.com
 * @see https://docs-firefly.cuteleaf.cn/zh/guide/code-block.html
 */
export type ExpressiveCodeConfig = {
	/** @deprecated 使用 `darkTheme` 和 `lightTheme` 代替 */
	theme?: string;
	/**
	 * 暗色模式下的代码主题
	 * @see https://expressive-code.com/guides/themes/#available-themes
	 */
	darkTheme: string;
	/**
	 * 亮色模式下的代码主题
	 * @see https://expressive-code.com/guides/themes/#available-themes
	 */
	lightTheme: string;
	/**
	 * 代码块折叠配置
	 * @see https://expressive-code.com/plugins/collapsible-sections/
	 */
	pluginCollapsible?: PluginCollapsibleConfig;
	/** 语言徽章插件配置 */
	pluginLanguageBadge?: PluginLanguageBadgeConfig;
};

export type PluginLanguageBadgeConfig = {
	/** 是否启用语言徽章 */
	enable: boolean;
};

/**
 * 代码块折叠配置
 * @see https://expressive-code.com/plugins/collapsible-sections/
 */
export type PluginCollapsibleConfig = {
	/** 是否启用代码块折叠功能 */
	enable: boolean;
	/**
	 * 触发折叠的行数阈值
	 * @default 15
	 */
	lineThreshold: number;
	/**
	 * 折叠时显示的预览行数
	 * @default 8
	 */
	previewLines: number;
	/**
	 * 默认是否折叠
	 * @default true
	 */
	defaultCollapsed: boolean;
};

/**
 * PlantUML 图表配置\
 * PlantUML 配置用于控制 Markdown 中 plantuml 代码块的渲染行为，包括是否启用、服务端地址和亮暗主题。
 * @see https://docs-firefly.cuteleaf.cn/zh/guide/plantuml.html
 */
export type PlantUMLConfig = {
	/**
	 * 是否启用 PlantUML 渲染能力。关闭后 plantuml 代码块会退化为普通代码高亮，由 Expressive Code 处理。
	 * @default true
	 */
	enable: boolean;
	/**
	 * PlantUML 服务器地址，尾部斜杠会自动归一化。\
	 * 默认使用官方公共服务器；敏感内容请部署自建服务器，并把此字段替换为自建地址。
	 * @default "https://www.plantuml.com/plantuml"
	 */
	server: string;
	/**
	 * 亮色模式下注入的 PlantUML 主题名；空字符串表示不注入。
	 * @see https://plantuml.com/zh/theme
	 * @default ""
	 */
	lightTheme: string;
	/**
	 * 暗色模式下注入的 PlantUML 主题名；空字符串表示不注入。
	 * @see https://plantuml.com/zh/theme
	 * @default ""
	 */
	darkTheme: string;
};

/**
 * 公告配置\
 * 公告组件显示在侧边栏中，用于展示重要通知或消息。
 * @see https://docs-firefly.cuteleaf.cn/zh/guide/announcement.html
 */
export type AnnouncementConfig = {
	/**
	 * 公告标题
	 * @default I18nKey.announcement
	 */
	title?: string;
	/** 公告内容 */
	content: string;
	/** 公告图标（Iconify 格式） */
	icon?: string;
	/** 公告类型 */
	type?: "info" | "warning" | "success" | "error";
	/** 是否允许用户关闭公告 */
	closable?: boolean;
	/** 链接配置 */
	link?: {
		/** 是否启用链接 */
		enable: boolean;
		/** 链接文字 */
		text: string;
		/** 链接地址 */
		url: string;
		/** 是否外部链接 */
		external?: boolean;
	};
};

/** 字体项配置 */
export type FontItem = {
	/** 字体唯一标识符 */
	id: string;
	/** 字体显示名称 */
	name: string;
	/** 字体文件路径或 URL 链接 */
	src: string;
	/** CSS `font-family` 名称 */
	family: string;
	/** 字体粗细
	 * @example "normal"
	 * @example "bold"
	 * @example 400
	 * @example 700
	 */
	weight?: string | number;
	/** 字体样式 */
	style?: "normal" | "italic" | "oblique";
	/** `font-display` 属性 */
	display?: "auto" | "block" | "swap" | "fallback" | "optional";
	/** Unicode 范围，用于字体子集化 */
	unicodeRange?: string;
	/** 字体格式，仅当 `src` 为本地文件时需要 */
	format?:
	| "woff"
	| "woff2"
	| "truetype"
	| "opentype"
	| "embedded-opentype"
	| "svg";
};

/**
 * 字体配置\
 * Firefly 支持自定义字体配置，可以使用 CDN 字体或本地字体文件。
 * @see https://docs-firefly.cuteleaf.cn/zh/guide/font.html
 */
export type FontConfig = {
	/** 是否启用自定义字体功能 */
	enable: boolean;
	/** 是否预加载字体文件 */
	preload?: boolean;
	/**
	 * 当前选择的字体 ID，支持多个字体组合
	 * @example ["misans-regular"]
	 */
	selected: string | string[];
	/**
	 * 字体列表\
	 * 推荐使用可靠的 CDN 服务商提供的字体链接，它天然做了按需分片加载，且性能较好\
	 * 也可以使用本地字体文件，需自行进行字体子集化处理，否则会因为字体文件庞大增加带宽负担导致页面加载缓慢甚至无法加载\
	 * 如果进行字体子集化处理，会导致动态内容（如评论，Bangumi等）无法正确显示字体，因此不推荐使用本地字体文件
	 */
	fonts: Record<string, FontItem>;
	/**
	 * 全局字体回退列表
	 * @example ["system-ui","-apple-system","BlinkMacSystemFont","Segoe UI","Roboto","sans-serif",]
	 * @default []
	 */
	fallback?: string[];
};

/**
 * 页脚配置\
 * 页脚配置允许在站点底部注入自定义 HTML 内容，如备案号等。
 * @see https://docs-firefly.cuteleaf.cn/zh/guide/footer.html
 */
export type FooterConfig = {
	/** 是否启用 Footer HTML 注入功能 */
	enable: boolean;
	/**
	 * 自定义 HTML 内容，用于添加备案号等信息
	 * @default ""
	 */
	customHtml?: string;
};

/**
 * 封面图片配置\
 * 封面图片配置控制文章封面图的显示和随机封面图功能。
 * @see https://docs-firefly.cuteleaf.cn/zh/guide/cover-image.html
 */
export type CoverImageConfig = {
	/** 是否在文章详情页显示封面图 */
	enableInPost: boolean;
	/** 随机封面图配置 */
	randomCoverImage: {
		/** 是否启用随机图功能 */
		enable: boolean;
		/** 随机图 API 列表 */
		apis: string[];
		/** API 失败时的回退图片路径，支持以 `/` 开头的 public 目录下的图片和以非 `/` 开头的 src 目录下的图片。 */
		fallback?: string;
		/**
		 * 是否显示加载动画
		 * @default true
		 */
		showLoading?: boolean;
	};
};

/** 组件配置类型 */
export type WidgetComponentType =
	| "profile"
	| "announcement"
	| "categories"
	| "tags"
	| "sidebarToc"
	| "advertisement"
	| "stats"
	| "calendar"
	| "music";

/** 侧边栏组件配置 */
export type WidgetComponentConfig = {
	/** 组件类型 */
	type: WidgetComponentType;
	/** 是否启用该组件 */
	enable: boolean;
	/** 组件位置：
	 * - `top` 固定在顶部
	 * - `sticky` 粘贴性定位（可滚动）
	 */
	position: "top" | "sticky";
	/** 配置 ID，用于广告组件指定使用哪个配置 */
	configId?: string;
	/** 是否在文章详情页显示 */
	showOnPostPage?: boolean;
	/** 是否在非文章详情页显示 */
	showOnNonPostPage?: boolean;
	/** 响应式配置 */
	responsive?: {
		/** 在指定设备上隐藏 */
		hidden?: ("mobile" | "tablet" | "desktop")[];
		/** 折叠阈值 */
		collapseThreshold?: number;
	};
	/** 自定义属性，用于扩展组件功能 */
	customProps?: Record<string, unknown>;
};

/** 移动端底部组件配置列表（`<768px` 显示） */
export type MobileBottomComponentConfig = {
	/** 组件类型 */
	type: WidgetComponentType;
	/** 是否启用该组件 */
	enable: boolean;
	/** 配置 ID，用于广告组件指定使用哪个配置 */
	configId?: string;
	/** 是否在文章详情页显示 */
	showOnPostPage?: boolean;
	/** 是否在非文章详情页显示 */
	showOnNonPostPage?: boolean;
	responsive?: {
		/** 在指定设备上隐藏 */
		hidden?: ("mobile" | "tablet" | "desktop")[];
		/** 折叠阈值 */
		collapseThreshold?: number;
	};
	/** 自定义属性，用于扩展组件功能 */
	customProps?: Record<string, unknown>;
};

/**
 * 侧边栏配置\
 * 侧边栏布局配置控制站点的侧边栏显示位置和组件排列。
 * @see https://docs-firefly.cuteleaf.cn/zh/guide/sidebar.html
 */
export type SidebarLayoutConfig = {
	/** 是否启用侧边栏 */
	enable: boolean;
	/** 侧边栏位置
	 * - `left` 仅显示左侧边栏
	 * - `right` 仅显示右侧边栏
	 * - `both` 双侧边栏，1280px 以上同时显示左右，769-1279px 根据 tabletSidebar 配置显示其中一侧
	 */
	position: "left" | "right" | "both";
	/**
	 * 平板端（769-1279px）显示哪侧侧边栏，仅 `position` 为 `both` 时生效
	 * @default "left"
	 */
	tabletSidebar?: "left" | "right";
	/** 使用单侧栏时是否在文章详情页额外显示另一侧边栏 */
	showBothSidebarsOnPostPage?: boolean;
	/** 左侧边栏组件配置列表 */
	leftComponents: WidgetComponentConfig[];
	/** 右侧边栏组件配置列表 */
	rightComponents: WidgetComponentConfig[];
	/** 移动端底部组件配置列表（`<768px` 显示） */
	mobileBottomComponents: MobileBottomComponentConfig[];
};

/**
 * 樱花特效配置\
 * 樱花特效为站点添加飘落的樱花动画效果。
 * @see https://docs-firefly.cuteleaf.cn/zh/guide/effects.html
 */
export type SakuraConfig = {
	/**
	 * 是否启用樱花特效
	 * @default true
	 */
	enable: boolean;
	/** 是否允许用户在设置中切换樱花特效 */
	switchable?: boolean;
	/** 樱花数量 */
	sakuraNum: number;
	/** 樱花越界限制次数，`-1` 为无限循环 */
	limitTimes: number;
	/** 尺寸配置 */
	size: {
		/** 樱花最小尺寸倍数 */
		min: number;
		/** 樱花最大尺寸倍数 */
		max: number;
	};
	/** 不透明度配置 */
	opacity: {
		/** 樱花最小不透明度 */
		min: number;
		/** 樱花最大不透明度 */
		max: number;
	};
	/** 移动速度配置 */
	speed: {
		/** 水平移动速度配置 */
		horizontal: {
			/** 水平移动速度最小值 */
			min: number;
			/** 水平移动速度最大值 */
			max: number;
		};
		/** 垂直移动速度配置 */
		vertical: {
			/** 垂直移动速度最小值 */
			min: number;
			/** 垂直移动速度最大值 */
			max: number;
		};
		/** 旋转速度 */
		rotation: number;
		/** 消失速度，不应大于最小不透明度 */
		fadeSpeed: number;
	};
	/** 层级，确保樱花在合适的层级显示 */
	zIndex: number;
};

/**
 * Spine 模型配置\
 * Firefly 支持在页面上显示 Live2D 或 Spine 看板娘模型，两者可以二选一使用。
 * @see https://docs-firefly.cuteleaf.cn/zh/guide/pio.html
 */
export type SpineModelConfig = {
	/** 是否启用 Spine 看板娘 */
	enable: boolean;
	/** 模型配置 */
	model: {
		/** 模型文件路径（`.json`），相对于 `public` 目录 */
		path: string;
		/** 模型缩放比例 */
		scale?: number;
		/** X 轴偏移 */
		x?: number;
		/** Y 轴偏移 */
		y?: number;
	};
	/** 位置配置 */
	position: {
		/** 显示位置，注意在右下角可能会挡住返回顶部按钮 */
		corner: "bottom-left" | "bottom-right" | "top-left" | "top-right";
		/** 水平偏移量
		 * @default 20
		 */
		offsetX?: number;
		/** 垂直偏移量
		 * @default 20
		 */
		offsetY?: number;
	};
	/** 尺寸配置 */
	size: {
		/** 容器宽度
		 * @default 280
		 */
		width?: number;
		/** 容器高度
		 * @default 400
		 */
		height?: number;
	};
	/** 交互配置 */
	interactive?: {
		/** 是否启用交互功能 */
		enabled?: boolean;
		/** 点击时随机播放的动画列表 */
		clickAnimations?: string[];
		/** 点击时随机显示的文字消息 */
		clickMessages?: string[];
		/** 文字显示时间（毫秒）
		 * @default 3000
		 */
		messageDisplayTime?: number;
		/** 待机动画列表 */
		idleAnimations?: string[];
		/** 待机动画切换间隔（毫秒）
		 * @default 10000
		 */
		idleInterval?: number;
	};
	/** 响应式配置 */
	responsive?: {
		/** 是否在移动端隐藏 */
		hideOnMobile?: boolean;
		/** 移动端断点（单位 `px`）
		 * @default 768
		 */
		mobileBreakpoint?: number;
	};
	/** 层级
	 * @default 1000
	 */
	zIndex?: number;
	/** 透明度
	 * @default 1.0
	 */
	opacity?: number;
};

/**
 * Live2D 看板娘配置\
 * Firefly 支持在页面上显示 Live2D 或 Spine 看板娘模型，两者可以二选一使用。
 * @see https://docs-firefly.cuteleaf.cn/zh/guide/pio.html
 */
export type Live2DModelConfig = {
	/** 是否启用 Live2D 看板娘 */
	enable: boolean;
	model: {
		/** 模型文件夹路径或 `model3.json` 文件路径（相对于 `public` 目录） */
		path: string;
	};
	/** 位置配置 */
	position?: {
		/** 显示位置，注意在右下角可能会挡住返回顶部按钮 */
		corner?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
		/** 水平偏移量
		 * @default 20
		 */
		offsetX?: number;
		/** 垂直偏移量
		 * @default 20
		 */
		offsetY?: number;
	};
	/** 尺寸配置 */
	size?: {
		/** 容器宽度
		 * @default 280
		 */
		width?: number;
		/** 容器高度
		 * @default 400
		 */
		height?: number;
	};
	/** 交互配置 */
	interactive?: {
		/** 是否启用交互功能 */
		enabled?: boolean;
		/**
		 * 点击时随机显示的文字消息\
		 * `motions` 与 `expressions` 将从模型 JSON 文件中自动读取
		 */
		clickMessages?: string[];
		/**
		 * 文字显示时间（毫秒）
		 * @default 3000
		 */
		messageDisplayTime?: number;
	};
	responsive?: {
		/** 是否在移动端隐藏 */
		hideOnMobile?: boolean;
		/** 移动端断点（单位 `px`）
		 * @default 768
		 */
		mobileBreakpoint?: number;
	};
};

/**
 * 背景壁纸配置\
 * 背景壁纸配置控制站点的背景图片显示模式和相关效果。
 * @see https://docs-firefly.cuteleaf.cn/zh/guide/wallpaper.html
 */
export type BackgroundWallpaperConfig = {
	/**
	 * 壁纸模式：
	 * - `banner`：横幅模式
	 * - `fullscreen`：全屏壁纸
	 * - `overlay`：全屏透明覆盖模式
	 * - `none`：纯色背景
	 */
	mode: "banner" | "fullscreen" | "overlay" | "none";
	/**
	 * 是否允许用户通过导航栏切换壁纸模式\
	 * 由于同时维护多种壁纸模式过于复杂（已经屎山代码），在切换时有时候可能会出现一些奇怪的过渡效果或者 Bug，推荐只选择自己喜欢的模式并关闭切换功能
	 * @default true
	 */
	switchable?: boolean;
	/**
	 * 背景图片配置\
	 * 图片路径支持以 `/` 开头的 public 目录下的图片和以非 `/` 开头的 src 目录下的图片，以及网络图片 URL\
	 * 建议不要替换 d1-d6，m1-m6 这些默认示例图片（你可以删除掉节省空间），因为以后可能会更换示例图片，导致你自定义的图片被覆盖，同时建议使用自己的图片的时候命名为其他名称，不要使用 d1-d6，m1-m6 这些名称
	 */
	src:
	| string
	| string[]
	| {
		/**
		 * 桌面端图片配置
		 * @example "https://t.alcy.cc/pc"
		 * @example "assets/images/DesktopWallpaper/d1.avif"
		 * @example ["assets/images/DesktopWallpaper/d1.avif", "assets/images/DesktopWallpaper/d2.avif" ]
		 */
		desktop?: string | string[];
		/**
		 * 移动端图片配置
		 * @example "https://t.alcy.cc/mp"
		 * @example "assets/images/MobileWallpaper/m1.avif"
		 * @example ["assets/images/MobileWallpaper/m1.avif", "assets/images/MobileWallpaper/m2.avif" ]
		 */
		mobile?: string | string[];
	};
	/** 横幅壁纸 & 全屏壁纸共享配置 */
	common?: {
		/**
		 * 横幅文字遮罩暗度，`0-1` 之间，值越大越暗
		 * @default 0.15
		 */
		dimOpacity?: number;
		/** 首页横幅文字配置 */
		homeText?: {
			/**
			 * 是否在首页显示自定义文字
			 * @default true
			 */
			enable: boolean;
			/** 是否允许用户通过控制面板切换横幅标题显示 */
			switchable?: boolean;
			/** 主标题 */
			title?: string;
			/** 副标题，支持单个字符串或字符串数组 */
			subtitle?: string | string[];
			/**
			 * 主标题字体大小
			 * @example "3.5rem"
			 * @default "3rem"
			 */
			titleSize?: string;
			/**
			 * 副标题字体大小
			 * @default "1.5rem"
			 */
			subtitleSize?: string;
			/** 打字机效果配置 */
			typewriter?: {
				/**
				* 是否启用打字机效果
				* - 打字机开启 → 循环显示所有副标题
				* - 打字机关闭 → 每次刷新随机显示一条副标题
				*/
				enable: boolean;
				/** 打字速度（毫秒） */
				speed: number;
				/** 删除速度（毫秒） */
				deleteSpeed: number;
				/** 完整显示后的暂停时间（毫秒） */
				pauseTime: number;
			};
		};
		/** 导航栏透明模式配置 */
		navbar?: {
			/**
			 * 导航栏透明模式
			 * - `semi`：半透明
			 * - `full`：全透明
			 * - `semifull`：动态透明
			 */
			transparentMode?: "semi" | "full" | "semifull";
			/**
			 * 是否开启毛玻璃模糊效果。开启可能会影响页面性能，如果不开启则是半透明
			 * @default true
			 */
			enableBlur?: boolean;
			/**
			 * 毛玻璃模糊度
			 * @default 20
			 */
			blur?: number;
		};
		/**
		 * 水波纹动画配置\
		 * 开启会影响页面性能，请酌情开启
		 */
		waves?: {
			/**
			 * 是否启用水波纹动画效果，支持分别设置桌面端和移动端
			 */
			enable:
			| boolean
			| {
				/**
				 * 桌面端是否启用水波纹动画效果
				 * @default false
				 */
				desktop: boolean;
				/**
				 * 移动端是否启用水波纹动画效果
				 * @default false
				 */
				mobile: boolean;
			};
			/**
			 * 是否允许用户通过控制面板切换水波纹动画
			 * @default false
			 */
			switchable?: boolean;
		};
		/** 渐变过渡效果配置，当水波纹关闭时自动启用，提供壁纸底部到背景色的平滑过渡 */
		gradient?: {
			/**
			 * 是否启用渐变过渡，
			 * 支持分别设置桌面端和移动端，默认 `true`（水波纹关闭时自动生效）
			 */
			enable:
			| boolean
			| {
				/**
				 * 桌面端是否启用渐变过渡
				 * @default true
				 */
				desktop: boolean;
				/**
				 * 移动端是否启用渐变过渡
				 * @default true
				 */
				mobile: boolean;
			};
			/**
			 * 渐变高度（单位 `vh`）
			 * @default "30vh"
			 */
			height?: string;
			/**
			 * 是否允许用户通过控制面板切换渐变过渡
			 * @default false
			 */
			switchable?: boolean;
		};
	};

	/** Banner 模式特有配置 */
	banner?: {
		/** 壁纸位置，支持 CSS `object-position` 的所有值，包括百分比和像素值 */
		position?: string;
		/** 横幅图片轮播配置，仅在当配置多张图片时生效 */
		carousel?: {
			/** 是否启用横幅图片轮播 */
			enable: boolean;
			/**
			 * 轮播间隔时间（单位毫秒）
			 * @default 5000
			 */
			interval?: number;
			/**
			 * 是否允许用户通过控制面板切换横幅轮播
			 * @default false
			 */
			switchable?: boolean;
		};
	};
	/** 全屏透明覆盖模式特有配置 */
	overlay?: {
		/** 是否允许用户通过控制面板调整全屏透明模式参数，支持统一开关或分项开关 */
		switchable?:
		| boolean
		| {
			/** 是否允许用户在控制面板调整壁纸透明度 */
			opacity?: boolean;
			/** 是否允许用户在控制面板调整背景模糊度 */
			blur?: boolean;
			/** 是否允许用户在控制面板调整卡片透明度 */
			cardOpacity?: boolean;
		};
		/**
		 * 层级，确保壁纸在合适的层级显示
		 * @default -1
		 */
		zIndex?: number;
		/**
		 * 壁纸透明度，`0-1` 之间
		 * @default 0.8
		 */
		opacity?: number;
		/**
		 * 背景模糊程度（单位 `px`）
		 * @default 0
		 */
		blur?: number;
		/**
		 * 卡片背景透明度，`0-1` 之间，值越小越透明
		 * @default 0.6
		 */
		cardOpacity?: number;
	};
	/** 全屏壁纸模式特有配置 */
	fullscreen?: {
		/**
		 * 壁纸位置，支持 CSS `object-position` 的所有值
		 */
		position?: string;
	};
};

/**
 * 广告配置\
 * 广告组件显示在侧边栏中，支持图片广告和文字广告。
 * @see https://docs-firefly.cuteleaf.cn/zh/guide/ad.html
 */
export type AdConfig = {
	/** 广告标题 */
	title?: string;
	/** 广告文本内容 */
	content?: string;
	/** 图片配置 */
	image?: {
		/** 图片地址 */
		src: string;
		/** 图片描述 */
		alt?: string;
		/** 图片点击链接 */
		link?: string;
		/** 是否外部链接 */
		external?: boolean;
	};
	/** 链接配置 */
	link?: {
		/** 链接文本 */
		text: string;
		/** 链接地址 */
		url: string;
		/** 是否外部链接 */
		external?: boolean;
	};
	/** 内边距配置 */
	padding?: {
		/** 统一边距，会覆盖单独设置
		 * @example "0"
		 * @example "1rem"
		 * @example "16px"
		 */
		all?: string;
		/** 上边距 */
		top?: string;
		/** 右边距 */
		right?: string;
		/** 下边距 */
		bottom?: string;
		/** 左边距 */
		left?: string;
	};
	/** 是否可关闭 */
	closable?: boolean;
	/**
	 * 显示次数限制，`-1` 为无限制
	 * @default -1
	 */
	displayCount?: number;
	/** 过期时间（ISO 8601 格式） */
	expireDate?: string;
};

/**
 * 友链配置\
 * 友链配置管理友情链接页面的展示内容。
 * @see https://docs-firefly.cuteleaf.cn/zh/guide/friends.html
 */
export type FriendLink = {
	/** 友链标题 */
	title: string;
	/** 头像图片 URL */
	imgurl: string;
	/** 友链描述 */
	desc: string;
	/** 友链地址 */
	siteurl: string;
	/** 标签数组 */
	tags?: string[];
	/** 权重，数字越大排序越靠前 */
	weight: number;
	/** 是否启用 */
	enabled: boolean;
};

/**
 * 友链页面配置\
 * 友链配置管理友情链接页面的展示内容。
 * @see https://docs-firefly.cuteleaf.cn/zh/guide/friends.html
 */
export type FriendsPageConfig = {
	/**
	 * 页面标题，留空则使用 i18n 中的翻译
	 * @default I18nKey.friends
	 */
	title?: string;
	/**
	 * 页面描述，留空则使用 i18n 中的翻译
	 * @default I18nKey.friendsDescription
	 */
	description?: string;
	/** 是否显示 `friends.mdx` 中的自定义内容 */
	showCustomContent?: boolean;
	/** 是否显示友链页评论区 */
	showComment?: boolean;
	/**
	 * 是否开启随机排序配置\
	 * 如果开启，就会忽略权重规则并在构建时进行一次随机排序
	 */
	randomizeSort?: boolean;
};

/**
 * 音乐播放器配置\
 * Firefly 内置了音乐播放器，支持 Meting API（在线音乐平台）和本地音乐两种模式。
 * @see https://docs-firefly.cuteleaf.cn/zh/guide/music.html
 */
export type MusicPlayerConfig = {
	/**
	 * 使用方式：
	 * - `"meting"`：使用 Meting API
	 * - `"local"`：使用本地音乐列表
	 */
	mode?: "meting" | "local";
	/**
	 * 默认音量，`0-1` 之间
	 * @default 0.7
	 */
	volume?: number;
	/**
	 * 播放模式：
	 * - `list`：列表循环
	 * - `one`：单曲循环
	 * - `random`：随机播放
	 * @default "list"
	 */
	playMode?: "list" | "one" | "random";
	/**
	 * 是否显示歌词
	 * @default true
	 */
	showLyrics?: boolean;
	/** 是否在导航栏显示音乐播放器 */
	showInNavbar?: boolean;
	/** Meting API 配置 */
	meting?: {
		/** Meting API 地址 */
		api?: string;
		/**
		 * 音乐平台：
		 * - `netease`：网易云音乐
		 * - `tencent`：QQ 音乐
		 * - `kugou`：酷狗音乐
		 * - `xiami`：虾米音乐
		 * - `baidu`：百度音乐
		 */
		server?: "netease" | "tencent" | "kugou" | "xiami" | "baidu";
		/**
		 * 类型：
		 * - `song`：单曲
		 * - `playlist`：歌单
		 * - `album`：专辑
		 * - `search`：搜索
		 * - `artist`：艺术家
		 */
		type?: "song" | "playlist" | "album" | "search" | "artist";
		/** 歌单/专辑/单曲 ID 或搜索关键词 */
		id?: string;
		/** 认证 token */
		auth?: string;
		/** 备用 API 配置（当主 API 失败时使用） */
		fallbackApis?: string[];
	};
	/** 本地音乐配置 */
	local?: {
		/** 歌曲列表配置 */
		playlist?: Array<{
			/** 歌曲名称 */
			name: string;
			/** 艺术家 */
			artist: string;
			/** 音乐文件路径（相对于 `public` 目录） */
			url: string;
			/** 封面图片路径（相对于 `public` 目录） */
			cover?: string;
			/**
			 * 歌词文件路径（相对于 `public` 目录），支持 LRC 格式\
			 * 也可直接填入歌词内容
			 * @example "/assets/music/lrc/使一颗心免于哀伤-哼唱.lrc"
			 * @example "[00:00.00]歌词内容..."
			 */
			lrc?: string;
		}>;
	};
};

/** 赞助方式类型配置 */
export type SponsorMethod = {
	/**
	 * 赞助方式名称
	 * @example "支付宝"
	 * @example "微信"
	 * @example "PayPal"
	 */
	name: string;
	/** 图标名称（Iconify 格式） */
	icon?: string;
	/** 收款码图片路径（相对于 `public` 目录） */
	qrCode?: string;
	/** 赞助链接 URL。如果提供，会显示跳转按钮 */
	link?: string;
	/** 描述文本 */
	description?: string;
	/** 是否启用 */
	enabled: boolean;
};

/** 赞助者配置 */
export type SponsorItem = {
	/**
	 * 赞助者名称，如果想显示匿名，可以直接设置为 `"匿名"` 或使用 i18n
	 * @example "匿名" | i18n(I18nKey.sponsorAnonymous)
	 */
	name: string;
	/** 赞助金额 */
	amount?: string;
	/** 赞助日期（ISO 格式） */
	date?: string;
};

/**
 * 赞助配置\
 * 赞助配置管理赞助页面的展示内容，包括赞助方式和赞助者列表。
 * @see https://docs-firefly.cuteleaf.cn/zh/guide/sponsor.html
 */
export type SponsorConfig = {
	/**
	 * 页面标题
	 * @default I18nKey.sponsorTitle
	 */
	title?: string;
	/**
	 * 页面描述文本
	 * @default I18nKey.sponsorDescription
	 */
	description?: string;
	/** 赞助用途说明 */
	usage?: string;
	/** 赞助方式列表 */
	methods: SponsorMethod[];
	/** 赞助者列表 */
	sponsors?: SponsorItem[];
	/** 是否显示赞助者列表 */
	showSponsorsList?: boolean;
	/** 是否显示评论区 */
	showComment?: boolean;
	/** 是否在文章详情页底部显示赞助按钮 */
	showButtonInPost?: boolean;
};

/** 响应式图像布局类型 */
export type ResponsiveImageLayout = "constrained" | "full-width" | "none";

/** 图像格式类型 */
export type ImageFormat = "avif" | "webp" | "png" | "jpg" | "jpeg" | "gif";

/** 相册元信息配置 */
export type GalleryAlbum = {
	/** URL slug + 目录名，如 `"japan-2025"` */
	id: string;
	/** 相册名称 */
	name: string;
	/** 相册描述 */
	description?: string;
	/** 日期 */
	date?: string;
	/** 拍摄地点 */
	location?: string;
	/** 标签（用于首页筛选） */
	tags?: string[];
	/** 手动指定封面，不填写则自动取 `cover.*` 或第一张 */
	cover?: string;
	/** 加密密码（非空时启用加密） */
	password?: string;
	/** 密码提示 */
	passwordHint?: string;
};

/**
 * 相册配置\
 * 相册功能提供两级结构的图片展示页面：首页展示所有相册封面卡片，点击进入相册详情页查看照片（瀑布流布局）。
 * @see https://docs-firefly.cuteleaf.cn/zh/guide/gallery.html
 */
export type GalleryConfig = {
	/** 相册列表 */
	albums: GalleryAlbum[];
	/**
	 * 瀑布流最小列宽（单位 `px`），浏览器根据容器宽度自动计算列数
	 * @default 240
	 */
	columnWidth?: number;
};
