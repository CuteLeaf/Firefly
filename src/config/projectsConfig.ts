import type { ProjectsConfig } from "@/types/projectsConfig";

// 项目展示页面配置
// 在此处添加你的项目，页面会按 category 分组显示
//
// 点击行为规则：
// 1. 填写了 link：
//    - external: true  -> 在新标签页打开 link（外部链接）
//    - external: false -> 在当前页打开 link（站内链接）
// 2. 没填 link，但填写了 content / features / screenshots 中的任意一个：
//    - 点击卡片进入项目详情页 /projects/{id}/
// 3. 都没填：
//    - 卡片纯展示，点击不跳转
//
// cover 图片路径规则：
// - 使用 public/ 目录下的图片：填以 / 开头的路径，如 "/assets/images/firefly.png"
// - 使用外部图片：填完整 URL，如 "https://example.com/cover.png"
// - 不填 cover 时会显示默认占位图
export const projectsConfig: ProjectsConfig = {
	// 是否显示“全部”标签，设为 false 可隐藏
	showAllTab: true,

	// 项目分类，id 需要与项目中的 category 字段对应
	categories: [
		{ id: "website", name: "网站" },
	],

	// 项目列表
	projects: [
		// 示例：项目详情页（不填 link，填写 content / features / techStack）
		// 点击卡片会进入 /projects/firefly-blog/ 展示详细介绍
		{
			id: "firefly-blog",
			title: "Firefly 博客",
			description: "使用 Firefly 主题搭建的个人博客示例，记录技术、生活与创作。",
			cover: "/favicon/firefly-32.png",
			category: "website",
			tags: ["Astro", "博客"],
			date: "2025-01-01",
			techStack: ["Astro", "Svelte", "Tailwind CSS", "TypeScript"],
			features: [
				"基于 Astro 的静态博客主题",
				"响应式布局，适配桌面端与移动端",
				"支持暗色模式与自动主题切换",
				"内置相册、追番、留言板等多种页面",
				"高度可配置的站点与导航配置",
			],
			content:
				"<p>这是一个使用 Firefly 主题搭建的个人博客示例，用于展示项目详情页的功能。</p>",
		},
	],
};
