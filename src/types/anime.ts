export interface StandardizedAnime {
	id: number;
	title: string;
	originalTitle: string;
	poster: string | null;
	type: "tv" | "movie";
	source: "tmdb" | "bilibili";
	rating: number;
	date: string;
	overview: string;
	link: string;
	epStatus: string | undefined;
}
