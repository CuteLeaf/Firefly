import type { BackgroundWallpaperConfig } from "@/types/config";

export const backgroundWallpaper: BackgroundWallpaperConfig = {
	// 壁纸模式："banner" 横幅壁纸，"fullscreen" 全屏壁纸，"overlay" 全屏透明，"none" 纯色背景无壁纸
	mode: "banner",
	// 是否允许用户通过导航栏切换壁纸模式
	// 设为false可提升性能（只渲染当前模式）
	// 推荐只选择自己喜欢的模式并关闭切换功能以提升性能
	switchable: true,
	/**
	 * 背景图片配置
	 * 图片路径支持三种格式：
	 * 1. public 目录（以 "/" 开头，不优化）："/assets/images/banner.avif"
	 * 2. src 目录（不以 "/" 开头，自动优化但会增加构建时间，推荐）："assets/images/banner.avif"
	 * 3. 远程 URL："https://example.com/banner.jpg"
	 * 注意：远程URL和public目录的图片不会被优化，请确保图片体积足够小以免影响加载速度
	 *
	 * 建议不要替换d1-d6，m1-m6这些默认示例图片，但你可以删除掉节省空间
	 * 因为以后可能会更换示例图片，导致你自定义的图片被覆盖
	 * 所以建议使用自己的图片的时候命名为其他名称，不要使用d1-d6，m1-m6这些名称
	 *
	 * 如果只使用一张图片或者使用随机图API，推荐直接使用字符串格式：
	 * desktop: "https://t.alcy.cc/pc",   // 随机图API
	 * desktop: "assets/images/DesktopWallpaper/d1.avif", // 单张图片
	 *
	 * mobile: "https://t.alcy.cc/mp", // 随机图API
	 * mobile: "assets/images/MobileWallpaper/m1.avif", // 单张图片
	 *
	 * 支持配置多张图片（数组），每次刷新页面随机显示一张：
	 * desktop: [
	 * "assets/images/DesktopWallpaper/d1.avif",
	 * "assets/images/DesktopWallpaper/d2.avif",
	 * ],
	 *
	 * mobile:[
	 *   "assets/images/MobileWallpaper/m1.avif",
	 *   "assets/images/MobileWallpaper/m2.avif",
	 * ],
	 */
	src: {
		// 桌面背景图片（支持单张或多张随机）
		// desktop: "assets/images/DesktopWallpaper/d1.avif",
		desktop: [
			"assets/images/DesktopWallpaper/d1.avif",
			"assets/images/DesktopWallpaper/d2.avif",
			"assets/images/DesktopWallpaper/d3.avif",
			"assets/images/DesktopWallpaper/d4.avif",
			"assets/images/DesktopWallpaper/d5.avif",
			"assets/images/DesktopWallpaper/d6.avif",
		],
		// 移动背景图片（支持单张或多张随机）
		// mobile: "assets/images/MobileWallpaper/m1.avif",
		mobile: [
			"assets/images/MobileWallpaper/m1.avif",
			"assets/images/MobileWallpaper/m2.avif",
			"assets/images/MobileWallpaper/m3.avif",
			"assets/images/MobileWallpaper/m4.avif",
			"assets/images/MobileWallpaper/m5.avif",
			"assets/images/MobileWallpaper/m6.avif",
		],
	},
	// 横幅壁纸和全屏壁纸共享配置
	common: {
		// 横幅文字遮罩暗度，0-1之间，值越大越暗
		dimOpacity: 0.2,
		// 主页横幅文字
		homeText: {
			// 是否启用主页横幅文字
			enable: true,
			// 是否允许用户通过控制面板切换横幅标题显示
			switchable: true,
			// 主页横幅主标题
			title: "Lovely firefly!",
			// 主页横幅主标题字体大小
			titleSize: "3.8rem",
			// 主页横幅副标题
			subtitle: [
				"In Reddened Chrysalis, I Once Rest",
				"From Shattered Sky, I Free Fall",
				"Amidst Silenced Stars, I Deep Sleep",
				"Upon Lighted Fyrefly, I Soon Gaze",
				"From Undreamt Night, I Thence Shine",
				"In Finalized Morrow, I Full Bloom",
			],
			// 主页横幅副标题字体大小
			subtitleSize: "1.5rem",
			typewriter: {
				// 是否启用打字机效果
				// 打字机开启 → 循环显示所有副标题
				// 打字机关闭 → 每次刷新随机显示一条副标题
				enable: true,
				// 打字速度（毫秒）
				speed: 100,
				// 删除速度（毫秒）
				deleteSpeed: 50,
				// 完全显示后的暂停时间（毫秒）
				pauseTime: 2000,
			},
		},
		// 图片来源
		credit: {
			enable: {
				// 桌面端显示横幅图片来源文本
				desktop: true,
				// 移动端显示横幅图片来源文本
				mobile: true,
			},
			text: {
				// 桌面端要显示的来源文本
				desktop: "Pixiv - 晚晚喵",
				// 移动端要显示的来源文本
				mobile: "Pixiv - KiraraShss",
			},
			url: {
				// 桌面端原始艺术品或艺术家页面的 URL 链接
				desktop: "https://www.pixiv.net/users/108801776",
				// 移动端原始艺术品或艺术家页面的 URL 链接
				mobile: "https://www.pixiv.net/users/42715864",
			},
		},
		// 导航栏配置
		navbar: {
			// 导航栏透明模式："semi" 半透明，"full" 完全透明，"semifull" 动态透明
			transparentMode: "semi",
			// 是否开启毛玻璃模糊效果，开启可能会影响页面性能，如果不开启则是半透明，请根据自己的喜好开启
			enableBlur: true,
			// 毛玻璃模糊度
			blur: 5,
		},
		// 水波纹动画效果配置，开启会影响页面性能，请根据自己的喜好开启
		waves: {
			enable: {
				// 桌面端是否启用水波纹动画效果
				desktop: true,
				// 移动端是否启用水波纹动画效果
				mobile: true,
			},
			// 是否允许用户通过控制面板切换水波纹动画
			switchable: true,
		},
	},
	// Banner模式特有配置
	banner: {
		// 图片位置
		// 支持所有CSS object-position值，如: 'top', 'center', 'bottom', 'left top', 'right bottom', '25% 75%', '10px 20px'..
		// 如果不知道怎么配置百分百之类的配置，推荐直接使用：'center'居中，'top'顶部居中，'bottom' 底部居中，'left'左侧居中，'right'右侧居中
		position: "0% 20%",
		// 横幅图片轮播配置，仅在当配置多张图片时生效
		carousel: {
			// 是否启用横幅图片轮播；关闭时保持每次刷新随机显示一张
			// 开启轮播可能会有点奇怪，为了让图片之间的切换自然，图片会在下一张加载完成后，当前图片才会消失，所以会导致过渡有重影，可能会影响观感
			// 目前还没有找到更好的过渡效果方案，所以如果你觉得轮播切换时的过渡效果不好，可以考虑关闭轮播，保持每次刷新随机显示一张图片
			// 反正我目前不是很满意这个过渡效果，所以默认关闭了，如果你有更好的过渡效果方案，欢迎提交PR改进这个功能
			enable: false,
			// 轮播切换间隔（毫秒）
			interval: 5000,
			// 是否允许用户通过控制面板切换横幅轮播
			switchable: false,
		},
	},
	// 全屏透明覆盖模式特有配置
	overlay: {
		// 是否允许用户通过控制面板调整全屏透明模式参数
		switchable: {
			opacity: true,
			blur: true,
			cardOpacity: true,
		},
		// 层级，确保壁纸在背景层
		zIndex: -1,
		// 壁纸透明度
		opacity: 0.8,
		// 背景模糊度
		blur: 10,
		// 卡片透明度，0-1之间，值越小越透明
		cardOpacity: 0.5,
	},
	// 全屏壁纸模式特有配置
	fullscreen: {
		// 图片位置
		position: "center",
	},
};
