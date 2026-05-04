import type { SearchResult } from "@/global";
import { getPostUrlBySlug, url } from "@/utils/url-utils";

/** 与 `/api/allPostMeta.json` 返回结构一致 */
export type PostMetaLite = {
	id: string;
	title: string;
	description?: string;
	published: number;
	category: string;
	password: boolean;
};

let postMetaCache: PostMetaLite[] | null = null;

export function clearDevPostSearchCache(): void {
	postMetaCache = null;
}

export async function loadPostMetaForDevSearch(): Promise<PostMetaLite[]> {
	if (postMetaCache) return postMetaCache;
	const res = await fetch(url("/api/allPostMeta.json"));
	if (!res.ok) {
		throw new Error(`allPostMeta.json: ${res.status}`);
	}
	postMetaCache = (await res.json()) as PostMetaLite[];
	return postMetaCache;
}

function escapeHtml(s: string): string {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function matchesKeyword(haystack: string, keyword: string): boolean {
	const k = keyword.trim();
	if (!k) return false;
	const lower = haystack.toLowerCase();
	return lower.includes(k.toLowerCase()) || haystack.includes(k);
}

function excerptWithHighlight(snippet: string, keyword: string): string {
	const raw = snippet.trim().slice(0, 160);
	const k = keyword.trim();
	if (!raw) {
		return `<mark>${escapeHtml(k)}</mark>`;
	}
	const lowerRaw = raw.toLowerCase();
	const lowerK = k.toLowerCase();
	let idx = raw.indexOf(k);
	if (idx === -1) idx = lowerRaw.indexOf(lowerK);
	if (idx === -1) {
		return `${escapeHtml(raw)} · <mark>${escapeHtml(k)}</mark>`;
	}
	const end = Math.min(idx + k.length, raw.length);
	return `${escapeHtml(raw.slice(0, idx))}<mark>${escapeHtml(raw.slice(idx, end))}</mark>${escapeHtml(raw.slice(end))}`;
}

/**
 * 开发模式下用文章元数据做简单全文提示（标题 / 摘要 / 分类），不索引正文。
 * 加密文章不参与匹配。
 */
export function searchPostsInDev(
	posts: PostMetaLite[],
	keyword: string,
	max = 30,
): SearchResult[] {
	const k = keyword.trim();
	if (!k) return [];

	const results: SearchResult[] = [];
	for (const p of posts) {
		if (p.password) continue;
		const title = p.title || "";
		const desc = p.description || "";
		const cat = p.category || "";
		if (!matchesKeyword(title, k) && !matchesKeyword(desc, k) && !matchesKeyword(cat, k)) {
			continue;
		}
		const snippetSource = matchesKeyword(desc, k)
			? desc
			: matchesKeyword(title, k)
				? title
				: cat;
		results.push({
			url: getPostUrlBySlug(p.id),
			meta: { title: escapeHtml(title) },
			excerpt: excerptWithHighlight(snippetSource, k),
		});
		if (results.length >= max) break;
	}
	return results;
}
