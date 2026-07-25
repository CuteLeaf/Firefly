export interface PostMeta {
	slug: string;
	title: string;
	published: string;
	updated?: string;
	draft: boolean;
	description: string;
	tags: string[];
	category: string;
	pinned: boolean;
	image: string;
	lang: string;
	author: string;
	password: string;
	comment: boolean;
	fileName: string;
}

export interface PostDetail extends PostMeta {
	content: string;
}

export interface DynamicMeta {
	slug: string;
	published: string;
	pinned: boolean;
	fileName: string;
}

export interface DynamicDetail extends DynamicMeta {
	content: string;
}

export interface SpecMeta {
	name: string;
	fileName: string;
}

export interface SpecDetail extends SpecMeta {
	content: string;
}

export interface UploadResult {
	url: string;
	fileName: string;
}

export interface DashboardStats {
	totalPosts: number;
	publishedPosts: number;
	draftPosts: number;
	totalDynamics: number;
	totalSpecs: number;
	totalTags: number;
	totalCategories: number;
	recentPosts: PostMeta[];
}
