import type { UserSubjectCollection } from "@/types/bangumi";
import type { MalListItem } from "@/types/mal";
import type { NsfwMode } from "@/types/nsfw";
import type { VndbUlistEntry } from "@/types/vndb";

// 三个库共用的 NSFW 违禁词，按需增删。
// 各库标签 / genre 命名不同，但常见 NSFW 用语大多重叠，集中一处便于维护。
// 注：MAL 只有英文 genre，中 / 日词匹配不到；ecchi 属打码边缘，这里一并拦截。
const NSFW_KEYWORDS = [
	"Hentai",
	"Ecchi",
	"えっち",
	"エッチ",
	"NSFW",
	"R18",
	"R-18",
	"18禁",
	"黄油",
	"卖肉",
	"成人",
	"成人向け",
	"エロ",
];

export function isVndbNsfw(item: VndbUlistEntry): boolean {
	const img = item.vn?.image;
	// VNDB 以自带图片评分为权威信号，共用词表作为标签补充
	return (
		(img?.sexual ?? 0) > 1 ||
		(img?.violence ?? 0) > 1 ||
		(item.vn?.tags ?? []).some((t) => NSFW_KEYWORDS.includes(t.name))
	);
}

export function isMalNsfw(item: MalListItem): boolean {
	return (item.node?.genres ?? []).some((g) => NSFW_KEYWORDS.includes(g.name));
}

export function isBangumiNsfw(item: UserSubjectCollection): boolean {
	if (item.subject?.nsfw === true) return true; // 原生布尔（首选）
	const names = [
		...(item.tags ?? []),
		...(item.subject?.tags ?? []).map((t) => t.name),
	];
	return names.some((n) => NSFW_KEYWORDS.includes(n)); // 标签回退
}

// mode === "hide" 时过滤掉 NSFW 条目
export function filterNsfw<T>(
	items: T[],
	mode: NsfwMode,
	isNsfw: (x: T) => boolean,
): T[] {
	return mode === "hide" ? items.filter((x) => !isNsfw(x)) : items;
}
