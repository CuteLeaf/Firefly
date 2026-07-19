import type { BackgroundWallpaperConfig } from "@/types/backgroundWallpaper";

export const backgroundWallpaper: BackgroundWallpaperConfig = {
	// 壁纸模式："banner" 横幅壁纸，"fullscreen" 全屏壁纸，"overlay" 全屏透明，"none" 纯色背景无壁纸
	mode: "banner",
	// 是否允许用户通过导航栏切换壁纸模式
	// 且同时维护多种壁纸模式过于复杂（已经屎山代码），在切换时有时候可能会出现一些奇怪的过渡效果或者bug
	// 推荐只选择自己喜欢的模式并关闭切换功能
	switchable: true,
	// 是否启用背景视频播放，配置后将在导航栏显示视频播放按钮
	playerEnable: true,
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
		desktop: "https://t.alcy.cc/pc",// [
			//"assets/images/DesktopWallpaper/d1.avif",
			//"assets/images/DesktopWallpaper/d2.avif",
			//"assets/images/DesktopWallpaper/d3.avif",
			//"assets/images/DesktopWallpaper/d4.avif",
			//"assets/images/DesktopWallpaper/d5.avif",
			//"assets/images/DesktopWallpaper/d6.avif",
		//],
		// 移动背景图片（支持单张或多张随机）
		// mobile: "assets/images/MobileWallpaper/m1.avif",
		mobile: "https://t.alcy.cc/mp",// [
			//"assets/images/MobileWallpaper/m1.avif",
			//"assets/images/MobileWallpaper/m2.avif",
			//"assets/images/MobileWallpaper/m3.avif",
			//"assets/images/MobileWallpaper/m4.avif",
			//"assets/images/MobileWallpaper/m5.avif",
			//"assets/images/MobileWallpaper/m6.avif",
		//],
		// 背景视频播放地址
		// 支持单个视频路径（字符串）或多个视频循环（数组）
		// 支持远程视频URL，本地视频请放在 public/assets/videos/ 目录下
		// playerUrl: "/assets/videos/firefly.mp4",
		playerUrl: [
			"https://www.image2url.com/r2/default/videos/1781765166391-f2ba6648-1597-40e0-9f0a-6768ae39e574.mp4",
		],
	},
	// 横幅壁纸和全屏壁纸共享配置
	common: {
		// 壁纸遮罩暗度，让横幅文字显示更清晰，0-1之间，值越大越暗
		dimOpacity: 0.2,
		// 多视频播放模式："order" 顺序循环，"random" 随机切换（仅当 playerUrl 为数组时生效）
		playerMode: "random",
		// 主页横幅文字
		homeText: {
			// 是否启用主页横幅文字
			enable: true,
			// 是否允许用户通过控制面板切换横幅标题显示
			switchable: true,
			// 主页横幅主标题
			title: "TXvlog の blog",
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
				"鲜衣怒马少年时，不负韶华行且知",
	            "且将新火试新茶，诗酒趁年华",
	            "追风赶月莫停留，平芜尽处是春山",
	            "纵有疾风起，人生不言弃",
	            "心有丘壑，眼存山河",
	            "道阻且长，行则将至",
	            "凡是过往，皆为序章",
	            "凡心所向，素履所往",
	            "生如逆旅，一苇以航",
	            "关关难过关关过，前路漫漫亦灿灿",
	            "不必追光，你我皆是星辰",
	            "沉心蓄力，静待花开",
	            "风雨自有归期，万事皆有转机",
	            "不负心中热爱，奔赴山海未来",
	            "半山腰总是挤的，你得去山顶看看",
	            "前路浩浩荡荡，万事尽可期待",
	            "以渺小启程，以伟大结束",
	            "心有山海，静而不争",
	            "行而不辍，未来可期",
	            "日拱一卒，功不唐捐",
	            "守得云开，终见月明",
	            "温一壶月光，渡半生慌张",
	            "山水万程，皆有好运",
	            "得失随缘，心无增减",
	            "平安喜乐，万事顺意",
	            "以梦为马，不负韶华",
	            "乘风破浪，直挂云帆",
	            "静守己心，淡看浮华",
	            "岁岁常欢愉，年年皆胜意",
	            "纵览星河，自在随心",
	            "但行好事，莫问前程",
	            "山河无恙，人间皆安",
	            "浅喜似苍狗，深爱如长风",
	            "时光知味，岁月沉香",
	            "万般熙攘化清风朗月",
	            "人间烟火，岁岁温柔",
	            "沉淀自我，厚积薄发",
	            "不忘初心，方得始终",
	            "所见皆美好，所行皆坦途",
	            "看淡世事沧桑，内心安然无恙",
	            "前路自有繁花，不必忧虑当下",
	            "修己以清心为要，涉世以慎言为先",
	            "人间值得，未来可期",
	            "不惧岁月颠簸，自有繁花相送",
	            "持一份热爱，抵岁月漫长",
	            "清风渡山海，温柔赴人间",
	            "万般努力，只为抬头有星光",
	            "自在随风，万事从容",
            	"人间朝暮，叶落惊秋，万事向好",
	            "怀赤诚之心，赴万丈理想"
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
		// 导航栏配置
		navbar: {
			// 导航栏透明模式："semi" 半透明，"full" 完全透明，"semifull" 动态透明
			transparentMode: "semifull",
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
		// 渐变过渡效果配置，当水波纹关闭时自动启用，提供壁纸底部到背景色的平滑过渡
		gradient: {
			enable: {
				// 桌面端是否启用渐变过渡
				desktop: true,
				// 移动端是否启用渐变过渡
				mobile: true,
			},
			// 渐变高度
			height: "10%",
			// 是否允许用户通过控制面板切换渐变过渡
			switchable: true,
		},
		// 壁纸轮播配置，横幅壁纸和全屏壁纸共享，仅在配置多张图片时生效
		carousel: {
			// 是否启用壁纸轮播；关闭时保持每次刷新随机显示一张
			enable: false,
			// 轮播切换间隔（毫秒）
			interval: 5000,
			// 过渡效果: 'fade' 渐变 | 'zoom' 缩放 | 'slide' 滑动 | 'kenburns' 旋转木马
			transitionEffect: "zoom",
			// 是否允许用户通过控制面板切换壁纸轮播
			switchable: true,
		},
	},
	// Banner模式特有配置
	banner: {
		// 图片位置
		// 支持所有CSS object-position值，如: 'top', 'center', 'bottom', 'left top', 'right bottom', '25% 75%', '10px 20px'..
		// 如果不知道怎么配置百分百之类的配置，推荐直接使用：'center'居中，'top'顶部居中，'bottom' 底部居中，'left'左侧居中，'right'右侧居中
		position: "0% 20%",
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
