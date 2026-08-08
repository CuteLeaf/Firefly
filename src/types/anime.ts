// 追番功能 TypeScript 接口定义

// 标准化后的番剧数据结构（页面和组件统一使用此接口）
export interface StandardizedAnime {
	id: number; // 唯一标识（TMDB ID 或 Bilibili media_id）
	title: string; // 中文标题
	originalTitle: string; // 原始标题（日文/英文）
	poster: string | null; // 海报 URL（null 表示无海报）
	type: "tv" | "movie"; // 类型：TV 动画 / 电影
	season_type: number; // Bilibili 分类：1=番剧, 2=电影, 3=纪录片, 4=国创, 5=电视剧；TMDB: 1=tv, 2=movie
	source: "tmdb" | "bilibili"; // 数据来源
	rating: number; // 评分（0-10）
	date: string; // 发布日期（YYYY-MM-DD）
	overview: string; // 剧情简介
	link: string; // 详情/播放链接
	epStatus: string | undefined; // 集数状态（仅 Bilibili 数据有此字段）
}
