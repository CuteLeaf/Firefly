import type { SidebarLayoutConfig } from "../types/config";

export const sidebarLayoutConfig: SidebarLayoutConfig = {
	enable: true,
	position: "both",
	tabletSidebar: "left",
	// 使用单侧栏时，是否在文章详情页额外显示另一侧边栏
	// 适用在只想用单侧栏，但在文章详情页想用对侧栏的目录等组件的场景
	showBothSidebarsOnPostPage: true,
	// 组件的渲染顺序完全取决于它们在配置数组中出现的顺序，但top的组件会优先于sticky位置的组件渲染
	leftComponents: [
		{
			// 组件类型：用户资料组件
			type: "profile",
			enable: true,
			position: "top",
			showOnPostPage: true,
		},
		{
			// 组件类型：公告组件
			type: "announcement",
			enable: true,
			position: "top",
			showOnPostPage: true,
		},
		{
			// 组件类型：音乐播放器
			type: "music",
			enable: true,
			position: "sticky",
			showOnPostPage: true,
		},
		{
			// 组件类型：分类组件
			type: "categories",
			enable: true,
			position: "sticky",
			showOnPostPage: true,
			responsive: {
				// 折叠阈值：当分类数量超过>5个时自动折叠
				collapseThreshold: 5,
			},
		},
		{
			// 组件类型：标签组件
			type: "tags",
			enable: true,
			position: "sticky",
			showOnPostPage: true,
			responsive: {
				// 折叠阈值：当标签数量超过>10个时自动折叠
				collapseThreshold: 10,
			},
		},
		{
			// 组件类型：广告栏组件 1
			type: "advertisement",
			enable: false,
			position: "sticky",
			showOnPostPage: true,
			// 配置ID：使用第一个广告配置
			configId: "ad1",
		},
	],
	rightComponents: [
		{
			// 组件类型：站点统计组件
			type: "stats",
			enable: true,
			position: "top",
			showOnPostPage: true,
		},
		{
			// 组件类型：日历组件
			type: "calendar",
			enable: true,
			position: "sticky",
			showOnPostPage: false,
		},
		{
			// 组件类型：侧边栏目录组件（只在文章详情页显示）
			type: "sidebarToc",
			enable: true,
			position: "sticky",
			showOnPostPage: true,
			showOnNonPostPage: false,
		},
		{
			// 组件类型：广告栏组件 2
			type: "advertisement",
			enable: false,
			position: "sticky",
			showOnPostPage: true,
			// 配置ID：使用第二个广告配置
			configId: "ad2",
		},
	],
	// 移动端底部组件配置列表
	// 这些组件只在移动端(<768px)显示在页面底部，独立于左右侧边栏配置
	mobileBottomComponents: [
		{
			// 组件类型：用户资料组件
			type: "profile",
			enable: true,
			showOnPostPage: true,
		},
		{
			// 组件类型：公告组件
			type: "announcement",
			enable: true,
			showOnPostPage: true,
		},
		{
			// 组件类型：音乐播放器
			type: "music",
			enable: true,
			showOnPostPage: true,
		},
		{
			// 组件类型：分类组件
			type: "categories",
			enable: true,
			showOnPostPage: true,
			responsive: {
				// 折叠阈值：当分类数量超过5个时自动折叠
				collapseThreshold: 5,
			},
		},
		{
			// 组件类型：标签组件
			type: "tags",
			enable: true,
			showOnPostPage: true,
			responsive: {
				// 折叠阈值：当标签数量超过20个时自动折叠
				collapseThreshold: 20,
			},
		},
		{
			// 组件类型：站点统计组件
			type: "stats",
			enable: true,
			showOnPostPage: true,
		},
	],
};
