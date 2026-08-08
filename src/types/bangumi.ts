export type UserSubjectCollectionResponse = {
	data: UserSubjectCollection[];
	total: number;
	limit: number;
	offset: number;
};

export type UserSubjectCollection = {
	subject_id: number; // 条目 ID
	subject_type: SubjectType; // 条目类型
	rate: number; // 评分
	type: CollectionType; // 收藏类型
	comment?: string | null; // 评价
	tags: string[]; // 标签
	ep_status: number; // 章节进度
	vol_status: number; // 卷进度
	updated_at: string; // 更新时间（ISO 8601 格式）
	private: boolean; // 是否私有
	subject: SlimSubject; // 条目信息
};

// 1: 想看，2: 看过，3: 在看，4: 搁置，5: 抛弃
export type CollectionType = 1 | 2 | 3 | 4 | 5;

export type SlimSubject = {
	id: number; // ID
	type: SubjectType; // 类型
	name: string; // 名称
	name_cn: string; // 中文名
	short_summary: string; // 简介
	date?: string | null; // 日期 YYYY-MM-DD
	images: SubjectImages; // 图片
	volumes: number; // 卷数
	eps: number; // 集数
	collection_total: number; // 收藏人数
	score: number; // 评分
	rank: number; // 排名
	tags: SubjectTag[]; // 标签
};

// 1: 书籍，2: 动画，3: 音乐，4: 游戏，6: 三次元
export type SubjectType = 1 | 2 | 3 | 4 | 6;

export type SubjectTag = {
	name: string;
	count: number;
	total_cont: number;
};

export type SubjectImages = {
	large: string;
	common: string;
	medium: string;
	small: string;
	grid: string;
};
