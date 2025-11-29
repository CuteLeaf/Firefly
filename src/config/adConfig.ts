import type { AdConfig } from "../types/config";

// 这里只是配置广告内容，如果要开关请在sidebarConfig.ts中控制侧边栏组件的的启用组件即可

// 广告配置1 - 纯图片广告（无边距）
export const adConfig1: AdConfig = {
	image: {
		src: "/assets/images/d1.webp",
		alt: "广告横幅",
		link: "#",
		external: true,
	},
	closable: true, // 是否可关闭
	displayCount: -1,
	padding: {
		all: "0", // 零边距，图片占满整个组件
		// all: "1rem", // 默认边距
		// top: "0", // 仅顶部无边距
		// right: "1rem", // 仅右侧无边距
		// bottom: "1rem", // 仅底部无边距
		// left: "1rem", // 仅左侧无边距
	},
};

// 广告配置2 - 完整内容广告
export const adConfig2: AdConfig = {
	title: "支持博主",
	content:
		"如果您觉得本站内容对您有帮助，欢迎支持我们的创作！您的支持是我们持续更新的动力。",
	image: {
		src: "/assets/images/d2.webp",
		alt: "支持博主",
		link: "about/",
		external: false,
	},
	link: {
		text: "支持一下",
		url: "about/",
		external: false,
	},
	closable: true,
	displayCount: -1,
	padding: {
		// all: "1rem",
	},
};
