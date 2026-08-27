import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import type { VndbUlistEntry, VndbUlistResponse } from "@/types/vndb";

export const VNDB_ULIST_FIELDS: string = [
	"id",
	"vote",
	"notes",
	"started",
	"finished",
	"labels{label}",
	"vn{id,title,alttitle,released,languages,platforms,image{url,thumbnail,sexual,violence},rating,votecount,length,length_minutes,developers{name},tags{name}}",
].join(",");

const VNDB_TAGS_TO_KEEP = 3;

export type VndbUlistFetchOptions = {
	apiUrl: string;
	userId: string;
	apiToken?: string;
	results: number;
	page: number;
};

export async function fetchVndbUlist(
	options: VndbUlistFetchOptions,
): Promise<VndbUlistResponse> {
	const headers: Record<string, string> = {
		Accept: "application/json",
		"Content-Type": "application/json",
	};
	if (options.apiToken) {
		headers.Authorization = `Token ${options.apiToken}`;
	}

	const response = await fetch(`${options.apiUrl}/ulist`, {
		method: "POST",
		headers,
		body: JSON.stringify({
			user: options.userId,
			fields: VNDB_ULIST_FIELDS,
			results: options.results,
			page: options.page,
		}),
	});

	if (!response.ok) {
		throw new Error(`[VNDB] 无法获取数据 (状态码: ${response.status})`);
	}

	const data = (await response.json()) as VndbUlistResponse;
	return {
		...data,
		results: data.results.map((item) => {
			const tagNames = (item.vn?.tags || [])
				.map((tag) => tag.name)
				.filter(Boolean);
			return {
				...item,
				labels: (item.labels || []).map(({ label }) => ({ label })),
				vn: {
					...item.vn,
					developers: (item.vn?.developers || []).map(({ name }) => ({ name })),
					tags: tagNames.slice(0, VNDB_TAGS_TO_KEEP).map((name) => ({ name })),
					tagCount: tagNames.length,
				},
			};
		}),
	};
}

export type VndbTab = {
	id: string;
	name: string;
	count: number;
};

const VNDB_LABEL_ORDER = [
	"wishlist",
	"playing",
	"finished",
	"stalled",
	"dropped",
];

export function normalizeVndbLabel(label: string): string {
	const lower = label.trim().toLowerCase();
	if (/wish|want/.test(lower)) return "wishlist";
	if (/play/.test(lower)) return "playing";
	if (/finish|complete|clear|done/.test(lower)) return "finished";
	if (/stall|hold|pause/.test(lower)) return "stalled";
	if (/drop|abandon/.test(lower)) return "dropped";
	return lower.replace(/\s+/g, "-") || "unknown";
}

export function getVndbStatusText(key: string, fallback = ""): string {
	switch (key) {
		case "wishlist":
			return i18n(I18nKey.vndbStatusWishlist);
		case "playing":
			return i18n(I18nKey.vndbStatusPlaying);
		case "finished":
			return i18n(I18nKey.vndbStatusFinished);
		case "stalled":
			return i18n(I18nKey.vndbStatusStalled);
		case "dropped":
			return i18n(I18nKey.vndbStatusDropped);
		case "unknown":
			return i18n(I18nKey.vndbStatusUnknown);
		default:
			return fallback || key;
	}
}

export function buildVndbTabs(items: VndbUlistEntry[]): VndbTab[] {
	const labelMap = new Map<string, string>();
	for (const item of items) {
		for (const label of item.labels || []) {
			const key = normalizeVndbLabel(label.label);
			if (!labelMap.has(key)) {
				labelMap.set(key, label.label);
			}
		}
	}

	const tabs: VndbTab[] = [
		{ id: "all", name: i18n(I18nKey.all), count: items.length },
	];
	for (const key of VNDB_LABEL_ORDER) {
		if (labelMap.has(key)) {
			tabs.push({
				id: key,
				name: getVndbStatusText(key, labelMap.get(key) || key),
				count: getVndbItemsForTab(items, key).length,
			});
		}
	}
	for (const [key, label] of labelMap) {
		if (!VNDB_LABEL_ORDER.includes(key)) {
			tabs.push({
				id: key,
				name: label,
				count: getVndbItemsForTab(items, key).length,
			});
		}
	}
	return tabs;
}

export function getVndbItemsForTab(
	items: VndbUlistEntry[],
	tabId: string,
): VndbUlistEntry[] {
	if (tabId === "all") return items;
	return items.filter((item) =>
		(item.labels || []).some(
			(label) => normalizeVndbLabel(label.label) === tabId,
		),
	);
}

export function getVndbLengthText(length?: number | null): string {
	switch (length) {
		case 1:
			return i18n(I18nKey.vndbLengthVeryShort);
		case 2:
			return i18n(I18nKey.vndbLengthShort);
		case 3:
			return i18n(I18nKey.vndbLengthMedium);
		case 4:
			return i18n(I18nKey.vndbLengthLong);
		case 5:
			return i18n(I18nKey.vndbLengthVeryLong);
		default:
			return "";
	}
}

function formatPlaytime(minutes?: number | null): string {
	if (!minutes || minutes <= 0) return "";
	if (minutes < 60) return `~${minutes}m`;
	const hours = Math.floor(minutes / 60);
	const rest = minutes % 60;
	return rest > 0 ? `~${hours}h ${rest}m` : `~${hours}h`;
}

export function formatVndbLength(
	length?: number | null,
	minutes?: number | null,
): string {
	const label = getVndbLengthText(length);
	const playtime = formatPlaytime(minutes);
	if (label && playtime) return `${label} · ${playtime}`;
	return label || playtime;
}
