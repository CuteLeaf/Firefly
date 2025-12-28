import type { SiteConfig } from "@/types/config";
import { fontConfig } from "./fontConfig";

// 定义站点语言
// 语言代码，例如：'zh_CN', 'zh_TW', 'en', 'ja', 'ru'。
const SITE_LANG = "zh_CN";

export const siteConfig: SiteConfig = {
	title: "沈幼楚的博客",
	subtitle: "shenyouchu",
	site_url: "https://blog.shenyouchu.cn",
	description:
		"沈幼楚的博客",
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
			src: "https://q2.qlogo.cn/headimg_dl?dst_uin=1050925710&spec=640", // 图标文件路径
			theme: "light", // 可选，指定主题 'light' | 'dark'
			sizes: "256x256", // 可选，图标大小
		},
	],

	// 导航栏Logo
	// navbarLogo 支持三种类型：Astro图标库，本地图片，网络图片
	// { type: "icon", value: "material-symbols:home-pin-outline" }
	// { type: "image", value: "（刚刚灌灌灌灌灌个女", alt: "Firefly Logo" }
	// { type: "image", value: "https://example.com/logo.png", alt: "Firefly Logo" }
	navbarLogo: {
		type: "image",
		value: "https://q2.qlogo.cn/headimg_dl?dst_uin=1050925710&spec=640",
		alt: "🍀",
	},
	navbarTitle: "Firefly", // 导航栏标题，可以设置为与 title 不同的值，如果不设置则使用 title
	navbarWidthFull: false, // 全宽导航栏，导航栏是否占满屏幕宽度，true：占满，false：不占满

	// 站点开始日期，用于统计运行天数
	siteStartDate: "2025-01-01", // 请修改为你的站点实际开始日期，格式：YYYY-MM-DD

	// bangumi配置
	bangumi: {
		userId: "1163581", // 在此处设置你的Bangumi用户ID
	},

	// 文章页底部的"上次编辑时间"卡片开关
	showLastModified: true,

	// 文章过期阈值（天数），超过此天数才显示"上次编辑"卡片
	outdatedThreshold: 30,

	// OpenGraph图片功能,注意开启后要渲染很长时间，不建议本地调试的时候开启
	generateOgImages: false,

	// 页面开关配置 - 控制特定页面的访问权限，设为false会返回404
	// bangumi的数据为编译时获取的，所以不是实时数据，请配置bangumi.userId
	pages: {
		sponsor: true, // 赞助页面开关
		guestbook: true, // 留言板页面开关，需要配置评论系统
		bangumi: true, // 番组计划页面开关，含追番和游戏，dev调试时只获取一页数据，build才会获取全部数据
	},

	// 文章列表布局配置
	postListLayout: {
		// 默认布局模式："list" 列表模式（单列布局），"grid" 网格模式（双列布局）
		// 如果sidebarConfig.ts中侧边栏配置启用了"both"双侧边栏，则无法使用文章列表"grid"网格（双列）布局
		defaultMode: "list",
		// 是否允许用户切换布局
		allowSwitch: true,

		// 网格布局配置，仅在 defaultMode 为 "grid" 或允许切换布局时生效
		grid: {
			// 是否开启瀑布流布局，同时有封面图和无封面图的混合文章推荐开启
			masonry: true,
		},
	},

	// 分页配置
	pagination: {
		// 每页显示的文章数量
		postsPerPage: 10,
	},

	backgroundWallpaper: {
		// 壁纸模式："banner" 横幅壁纸，"overlay" 全屏透明，"none" 纯色背景无壁纸
		mode: "banner",
		// 是否允许用户通过导航栏切换壁纸模式，设为false可提升性能（只渲染当前模式）
		switchable: true,

		// 背景图片配置
		src: {
			// 桌面背景图片
			desktop: "/assets/images/d1.webp",
			// 移动背景图片
			mobile: "/assets/images/m3.webp",
		},

		// Banner模式特有配置
		banner: {
			// 图片位置
			// 支持所有CSS object-position值，如: 'top', 'center', 'bottom', 'left top', 'right bottom', '25% 75%', '10px 20px'..
			// 如果不知道怎么配置百分百之类的配置，推荐直接使用：'center'居中，'top'顶部居中，'bottom' 底部居中，'left'左侧居中，'right'右侧居中
			position: "0% 20%",

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
					//打字机开启 → 循环显示所有副标题
					//打字机关闭 → 每次刷新随机显示一条副标题
					enable: false, // 启用副标题打字机效果
					speed: 100, // 打字速度（毫秒）
					deleteSpeed: 50, // 删除速度（毫秒）
					pauseTime: 2000, // 完全显示后的暂停时间（毫秒）
				},
			},
			credit: {
				enable: {
					desktop: true, // 桌面端显示横幅图片来源文本
					mobile: true, // 移动端显示横幅图片来源文本
				},
				text: {
					desktop: "Pixiv - 晚晚喵", // 桌面端要显示的来源文本
					mobile: "Pixiv - KiraraShss", // 移动端要显示的来源文本
				},
				url: {
					desktop: "https://www.pixiv.net/artworks/135490046", // 桌面端原始艺术品或艺术家页面的 URL 链接
					mobile: "https://www.pixiv.net/users/42715864", // 移动端原始艺术品或艺术家页面的 URL 链接
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

	// 字体配置
	// 在src/config/fontConfig.ts中配置具体字体
	font: fontConfig,
};
