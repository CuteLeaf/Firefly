export type VndbUlistResponse = {
	results: VndbUlistEntry[];
	more: boolean;
};

export type VndbUlistEntry = {
	id: string;
	vote: number | null;
	started: string | null;
	finished: string | null;
	notes: string | null;
	labels: VndbListLabel[];
	vn: VndbVisualNovel;
};

export type VndbListLabel = {
	label: string;
};

export type VndbImage = {
	url?: string;
	thumbnail?: string;
	sexual?: number;
	violence?: number;
};

export type VndbTag = {
	name: string;
};

export type VndbProducer = {
	name: string;
};

export type VndbVisualNovel = {
	id: string;
	title?: string | null;
	alttitle?: string | null;
	released?: string | null;
	languages?: string[];
	platforms?: string[];
	image?: VndbImage | null;
	rating?: number | null;
	votecount?: number | null;
	length?: number | null;
	length_minutes?: number | null;
	developers?: VndbProducer[];
	tags?: VndbTag[];
	tagCount?: number;
};
