export type MalMainPicture = {
	medium?: string;
	large?: string;
};

export type MalAlternativeTitles = {
	synonyms?: string[];
	en?: string;
	ja?: string;
};

export type MalGenre = {
	id: number;
	name: string;
};

export type MalStartSeason = {
	year: number;
	season?: string; // "winter" | "spring" | "summer" | "fall"
};

export type MalNode = {
	id: number;
	title?: string;
	main_picture?: MalMainPicture | null;
	alternative_titles?: MalAlternativeTitles | null;
	mean?: number | null; // 0-10，null 表示评分不足
	media_type?: string; // 动画: "tv" | "movie" | "ova" | ...；漫画: "manga" | "manhwa" | "novel" | ...
	genres?: MalGenre[];
	start_date?: string; // 漫画起始日期
	status?: string; // 连载状态 "currently_airing" | "finished_airing" | "publishing" | ...
	// 动画字段
	num_episodes?: number; // 未知时为 0 或缺失
	start_season?: MalStartSeason | null;
	// 漫画字段
	num_chapters?: number; // 未知时为 0 或缺失
	num_volumes?: number;
};

export type MalListStatus = {
	status?: string; // 动画: "watching" | "completed" | "on_hold" | "dropped" | "plan_to_watch"；漫画: "reading" | ... | "plan_to_read"
	score?: number; // 0-10，0 表示未评分
	updated_at?: string;
	start_date?: string;
	finish_date?: string;
	comments?: string;
	// 动画字段
	num_episodes_watched?: number;
	is_rewatching?: boolean;
	// 漫画字段
	num_chapters_read?: number;
	num_volumes_read?: number;
	is_rereading?: boolean;
};

export type MalListItem = {
	node: MalNode;
	list_status?: MalListStatus;
};

export type MalListResponse = {
	data: MalListItem[];
	paging?: {
		next?: string | null;
		previous?: string | null;
	} | null;
};
