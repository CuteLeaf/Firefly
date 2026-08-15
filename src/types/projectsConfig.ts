// 项目分类
export type ProjectCategory = {
	id: string; // 分类唯一标识
	name: string; // 分类名称
};

// 项目条目
export type ProjectItem = {
	id: string; // 项目唯一标识
	title: string; // 项目名称
	description?: string; // 项目简介
	cover?: string; // 封面图路径或 URL（可选）
	link?: string; // 项目链接，可以是外部链接或站内路径；不填时优先进入详情页
	external?: boolean; // 是否为外部链接，true 时在新标签页打开
	category: string; // 所属分类 id
	tags?: string[]; // 项目标签
	date?: string; // 项目日期，格式 YYYY-MM-DD
	// 详情页字段
	content?: string; // 详情页内容，支持 HTML / 纯文本
	features?: string[]; // 功能特性列表
	techStack?: string[]; // 技术栈标签
	screenshots?: string[]; // 详情页截图路径或 URL
};

// 项目页面配置
export type ProjectsConfig = {
	categories: ProjectCategory[]; // 分类列表，决定页面标签顺序
	projects: ProjectItem[]; // 项目列表
	showAllTab?: boolean; // 是否显示“全部”标签，默认 true
};
