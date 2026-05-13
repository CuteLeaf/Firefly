import type { AdConfig } from "../types/config";

// 这里只是配置广告内容，如果要开关请在 sidebarConfig.ts 中控制侧边栏组件的的启用组件即可

// 广告配置示例1 - 纯图片广告（无边距）
export const adConfig1: AdConfig = {
	image: {
		src: "assets/images/cover.avif",
		alt: "广告横幅",
		link: "#",
		external: true,
	},
	closable: true,
	displayCount: -1,
	padding: {
		// 零边距，图片占满整个组件
		all: "0",
		// 四边1rem边距
		// all: "1rem",
		// 顶部无边距
		// top: "0",
		// 右侧无边距
		// right: "1rem",
		// 底部无边距
		// bottom: "1rem",
		// 左侧无边距
		// left: "1rem",
	},
};

// 广告配置示例2 - 完整内容广告
export const adConfig2: AdConfig = {
	title: "支持博主",
	content:
		"如果您觉得本站内容对您有帮助，欢迎支持我们的创作！您的支持是我们持续更新的动力。",
	image: {
		src: "assets/images/cover.avif",
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
