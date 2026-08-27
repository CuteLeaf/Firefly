import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import type { MalListItem, MalListResponse } from "@/types/mal";

// MAL 只返回请求中明确列出的字段，必须显式声明
export const MAL_ANIME_FIELDS: string = [
	"id",
	"title",
	"main_picture",
	"alternative_titles",
	"mean",
	"media_type",
	"num_episodes",
	"genres",
	"start_season",
	"status",
	"list_status{status,score,num_episodes_watched,is_rewatching,updated_at,start_date,finish_date,comments}",
].join(",");

export const MAL_MANGA_FIELDS: string = [
	"id",
	"title",
	"main_picture",
	"alternative_titles",
	"mean",
	"media_type",
	"num_chapters",
	"num_volumes",
	"genres",
	"start_date",
	"status",
	"list_status{status,score,num_chapters_read,num_volumes_read,is_rereading,updated_at,start_date,finish_date,comments}",
].join(",");

export type MalListKind = "anime" | "manga";

export type MalCategory = {
	id: MalListKind;
	name: string;
	count: number;
	items: MalListItem[];
};

export type MalFetchOptions = {
	apiUrl: string;
	username: string;
	clientId: string;
	kind?: MalListKind;
	limit: number;
	offset: number;
};

export async function fetchMalList(
	options: MalFetchOptions,
): Promise<MalListResponse> {
	const kind = options.kind === "manga" ? "manga" : "anime";
	const endpoint = kind === "manga" ? "mangalist" : "animelist";
	const fields = kind === "manga" ? MAL_MANGA_FIELDS : MAL_ANIME_FIELDS;
	const params = new URLSearchParams({
		fields,
		limit: String(options.limit),
		offset: String(options.offset),
	});
	const response = await fetch(
		`${options.apiUrl}/users/${encodeURIComponent(options.username)}/${endpoint}?${params.toString()}`,
		{
			headers: {
				"X-MAL-CLIENT-ID": options.clientId,
				Accept: "application/json",
			},
		},
	);

	if (!response.ok) {
		throw new Error(`[MAL] 无法获取数据 (状态码: ${response.status})`);
	}

	const data = (await response.json()) as MalListResponse;
	return data;
}

const MAL_ANIME_STATUS_ORDER = [
	"watching",
	"completed",
	"on_hold",
	"dropped",
	"plan_to_watch",
];

const MAL_MANGA_STATUS_ORDER = [
	"reading",
	"completed",
	"on_hold",
	"dropped",
	"plan_to_read",
];

export function getMalStatusOrder(kind: MalListKind): string[] {
	return kind === "manga" ? MAL_MANGA_STATUS_ORDER : MAL_ANIME_STATUS_ORDER;
}

export function getMalStatusText(status: string, fallback = ""): string {
	switch (status) {
		case "watching":
			return i18n(I18nKey.malStatusWatching);
		case "reading":
			return i18n(I18nKey.malStatusReading);
		case "completed":
			return i18n(I18nKey.malStatusCompleted);
		case "on_hold":
			return i18n(I18nKey.malStatusOnHold);
		case "dropped":
			return i18n(I18nKey.malStatusDropped);
		case "plan_to_watch":
			return i18n(I18nKey.malStatusPlanToWatch);
		case "plan_to_read":
			return i18n(I18nKey.malStatusPlanToRead);
		default:
			return fallback || status;
	}
}

export function getMalSeasonText(season: string): string {
	switch (season) {
		case "winter":
			return i18n(I18nKey.malSeasonWinter);
		case "spring":
			return i18n(I18nKey.malSeasonSpring);
		case "summer":
			return i18n(I18nKey.malSeasonSummer);
		case "fall":
			return i18n(I18nKey.malSeasonFall);
		default:
			return season;
	}
}
