export type BackgroundWallpaperConfig = {
	mode: "banner" | "fullscreen" | "overlay" | "none"; // 壁纸模式：banner横幅模式、fullscreen全屏壁纸、overlay全屏透明覆盖模式或none纯色背景
	switchable?: boolean; // 是否允许用户通过导航栏切换壁纸模式，默认true
	playerEnable?: boolean; // 是否启用背景视频播放，默认false
	src:
		| string
		| string[]
		| {
				desktop?: string | string[];
				mobile?: string | string[];
				playerUrl?: string | string[]; // 背景视频播放地址，支持单个视频路径或数组（多视频列表循环）
		  }; // 支持单个图片、图片数组或分别设置桌面端和移动端图片
	// 横幅壁纸和全屏壁纸共享配置
	common?: {
		dimOpacity?: number; // 横幅文字遮罩暗度，0-1之间，值越大越暗，默认0.15
		playerMode?: "order" | "random"; // 多视频播放模式："order" 顺序循环（默认），"random" 随机切换
		homeText?: {
			enable: boolean; // 是否在首页显示自定义文字（全局开关）
			switchable?: boolean; // 是否允许用户通过控制面板切换横幅标题显示
			title?: string; // 主标题
			subtitle?: string | string[]; // 副标题，支持单个字符串或字符串数组
			titleSize?: string; // 主标题字体大小，如 "3.5rem"
			subtitleSize?: string; // 副标题字体大小，如 "1.5rem"
			typewriter?: {
				enable: boolean; // 是否启用打字机效果
				speed: number; // 打字速度（毫秒）
				deleteSpeed: number; // 删除速度（毫秒）
				pauseTime: number; // 完整显示后的暂停时间（毫秒）
			};
		};
		navbar?: {
			transparentMode?: "semi" | "full" | "semifull"; // 导航栏透明模式
			enableBlur?: boolean; // 是否开启毛玻璃模糊效果
			blur?: number; // 毛玻璃模糊度
		};
		waves?: {
			enable:
				| boolean
				| {
						desktop: boolean; // 桌面端是否启用水波纹动画效果
						mobile: boolean; // 移动端是否启用水波纹动画效果
				  }; // 是否启用水波纹动画效果，支持布尔值或分别设置桌面端和移动端
			switchable?: boolean; // 是否允许用户通过控制面板切换水波纹动画
		};
		// 渐变过渡效果配置，当水波纹关闭时自动启用，提供壁纸底部到背景色的平滑过渡
		gradient?: {
			enable:
				| boolean
				| {
						desktop: boolean; // 桌面端是否启用渐变过渡
						mobile: boolean; // 移动端是否启用渐变过渡
				  }; // 是否启用渐变过渡，支持布尔值或分别设置桌面端和移动端，默认true（水波纹关闭时自动生效）
			height?: string; // 渐变高度，默认 "30vh"
			switchable?: boolean; // 是否允许用户通过控制面板切换渐变过渡
		};
		// 壁纸轮播配置，横幅壁纸和全屏壁纸共享
		carousel?: {
			enable: boolean; // 是否启用壁纸轮播
			interval?: number; // 轮播间隔时间，单位毫秒
			transitionEffect?: "fade" | "zoom" | "slide" | "kenburns"; // 过渡效果: 'fade' 渐变 | 'zoom' 缩放 | 'slide' 滑动 | 'kenburns' 旋转木马
			switchable?: boolean; // 是否允许用户通过控制面板切换壁纸轮播
		};
	};

	// Banner模式特有配置
	banner?: {
		position?:
			| "top"
			| "center"
			| "bottom"
			| "top left"
			| "top center"
			| "top right"
			| "center left"
			| "center center"
			| "center right"
			| "bottom left"
			| "bottom center"
			| "bottom right"
			| "left top"
			| "left center"
			| "left bottom"
			| "right top"
			| "right center"
			| "right bottom"
			| string; // 壁纸位置，支持CSS object-position的所有值，包括百分比和像素值
	};
	// 全屏透明覆盖模式特有配置
	overlay?: {
		switchable?:
			| boolean
			| {
					opacity?: boolean; // 是否允许用户在控制面板调整壁纸透明度
					blur?: boolean; // 是否允许用户在控制面板调整背景模糊度
					cardOpacity?: boolean; // 是否允许用户在控制面板调整卡片透明度
			  }; // 透明模式参数是否可在控制面板调整，支持统一开关或分项开关
		zIndex?: number; // 层级，确保壁纸在合适的层级显示
		opacity?: number; // 壁纸透明度，0-1之间
		blur?: number; // 背景模糊程度，单位px
		cardOpacity?: number; // 卡片背景透明度，0-1之间
	};
	// 全屏壁纸模式特有配置
	fullscreen?: {
		position?: string; // 壁纸位置，支持CSS object-position的所有值
	};
};
