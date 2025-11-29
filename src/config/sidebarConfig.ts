import type { SidebarLayoutConfig } from "../types/config";

/**
 * 侧边栏布局配置
 * 用于控制侧边栏组件的显示、排序、动画和响应式行为
 */
export const sidebarLayoutConfig: SidebarLayoutConfig = {
	// 是否启用侧边栏功能
	enable: true,

	// 侧边栏位置：left=左侧，both=双侧
	// 开启双侧后网格（双列）模式将无法使用，且右侧组件会在宽度低于1200px时隐藏
	position: "both",

	// 左侧边栏组件配置列表
	// 组件位置position：top=顶部，sticky=粘性定位(会跟随页面滚动)
	leftComponents: [
		{
			// 组件类型：用户资料组件
			type: "profile",
			// 是否启用该组件
			enable: true,
			// 组件显示顺序（数字越小越靠前）
			order: 1,
			// 组件位置
			position: "top",
			// CSS 类名，用于应用样式和动画
			class: "onload-animation",
			// 动画延迟时间（毫秒），用于错开动画效果
			animationDelay: 0,
		},
		{
			// 组件类型：公告组件
			type: "announcement",
			// 是否启用该组件
			enable: true,
			// 组件显示顺序
			order: 2,
			// 组件位置
			position: "top",
			// CSS 类名
			class: "onload-animation",
			// 动画延迟时间
			animationDelay: 50,
		},
		{
			// 组件类型：分类组件
			type: "categories",
			// 是否启用该组件
			enable: true,
			// 组件显示顺序
			order: 3,
			// 组件位置
			position: "sticky",
			// CSS 类名
			class: "onload-animation",
			// 动画延迟时间
			animationDelay: 150,
			// 响应式配置
			responsive: {
				// 折叠阈值：当分类数量超过5个时自动折叠
				collapseThreshold: 5,
			},
		},
		{
			// 组件类型：标签组件
			type: "tags",
			// 是否启用该组件
			enable: true,
			// 组件显示顺序
			order: 4,
			// 组件位置
			position: "sticky",
			// CSS 类名
			class: "onload-animation",
			// 动画延迟时间
			animationDelay: 250,
			// 响应式配置
			responsive: {
				// 折叠阈值：当标签数量超过20个时自动折叠
				collapseThreshold: 20,
			},
		},
		{
			// 组件类型：广告栏组件 1
			type: "advertisement",
			// 是否启用该组件
			enable: false,
			// 组件显示顺序
			order: 5,
			// 组件位置
			position: "sticky",
			// CSS 类名
			class: "onload-animation",
			// 动画延迟时间
			animationDelay: 300,
			// 配置ID：使用第一个广告配置
			configId: "ad1",
		},
	],

	// 右侧边栏组件配置列表
	rightComponents: [
		{
			// 组件类型：站点统计组件
			type: "stats",
			// 是否启用该组件
			enable: true,
			// 组件显示顺序
			order: 1,
			// 组件位置
			position: "top",
			// 是否在文章详情页显示
			showOnPostPage: true,
			// CSS 类名
			class: "onload-animation",
			// 动画延迟时间
			animationDelay: 200,
		},
		{
			// 组件类型：日历组件
			type: "calendar",
			// 是否启用该组件
			enable: true,
			// 组件显示顺序
			order: 2,
			// 组件位置
			position: "sticky",
			// 是否在文章详情页显示
			showOnPostPage: false,
			// CSS 类名
			class: "onload-animation",
			// 动画延迟时间
			animationDelay: 250,
		},
		{
			// 组件类型：侧边栏目录组件（只在文章详情页显示）
			type: "sidebarToc",
			// 是否启用该组件
			enable: true,
			// 组件显示顺序
			order: 3,
			// 组件位置
			position: "sticky",
			// 是否在文章详情页显示
			showOnPostPage: true,
			// CSS 类名
			class: "onload-animation",
			// 动画延迟时间
			animationDelay: 250,
		},
		{
			// 组件类型：广告栏组件 2
			type: "advertisement",
			// 是否启用该组件
			enable: false,
			// 组件显示顺序
			order: 4,
			// 组件位置
			position: "sticky",
			// 是否在文章详情页显示
			showOnPostPage: true,
			// CSS 类名
			class: "onload-animation",
			// 动画延迟时间
			animationDelay: 350,
			// 配置ID：使用第二个广告配置
			configId: "ad2",
		},
	],

	// 默认动画配置
	defaultAnimation: {
		// 是否启用默认动画
		enable: true,
		// 基础延迟时间（毫秒）
		baseDelay: 0,
		// 递增延迟时间（毫秒），每个组件依次增加的延迟
		increment: 50,
	},

	// 响应式布局配置
	responsive: {
		// 不同设备的布局模式
		// hidden:不显示侧边栏   drawer:抽屉模式(移动端不显示)   sidebar:显示侧边栏
		// 使用 Tailwind 标准断点：mobile(<768px), tablet(768px-1023px), desktop(>=1024px)
		layout: {
			// 移动端：<768px
			mobile: "sidebar",
			// 平板端：768px-1023px
			tablet: "sidebar",
			// 桌面端：>=1024px
			desktop: "sidebar",
		},
	},
};
