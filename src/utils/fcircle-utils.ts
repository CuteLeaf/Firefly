import Parser from "rss-parser";
import {
	getEnabledFriends,
	getEnabledSubscriptions,
	profileConfig,
	siteConfig,
} from "@/config";
import { getSortedPostsList } from "./content-utils";
import {
	getFcircleDatePresentation,
	getFcircleRelativeDays,
} from "./fcircle-date-utils";
import { getAuthorAvatarUrl } from "./schema-image";
import { url as formatUrl } from "./url-utils";

export interface FcircleItem {
	friendName: string;
	friendAvatar: string;
	friendUrl: string;
	title: string;
	link: string;
	pubDate: Date;
	excerpt?: string;
	sourceType?: "self" | "friend" | "subscription";
	tags?: string[];
}

interface FeedEntry {
	title: string;
	link: string;
	pubDate: Date;
	excerpt?: string;
}

const BROWSER_UA =
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

const REQUEST_TIMEOUT_MS = 6000;
const MAX_FEED_BYTES = 5 * 1024 * 1024; // 单个 Feed 最大 5MB
const MAX_ENTRIES_PER_FEED = 15; // 单个 Feed 最多保留 15 篇
const CONCURRENT_LIMIT = 5; // 抓取并发池上限

const SOURCE_ORDER: Record<string, number> = {
	self: 0,
	friend: 1,
	subscription: 2,
};

/**
 * 判断友链是否属于导航/工具类站点（默认不聚合到朋友圈动态）
 * 友链页面的“导航”分区为工具与推荐网站（非博主个人自留地），不应抓取其文章或聚合动态
 */
function isNavigationFriend(friend: {
	tags?: string[];
	fcircle?: boolean;
}): boolean {
	// 若显式指定 fcircle 为 true，则强制允许抓取
	if (friend.fcircle === true) {
		return false;
	}
	if (!friend.tags || friend.tags.length === 0) {
		return false;
	}
	const navKeywords = new Set([
		"导航",
		"nav",
		"navigation",
		"工具",
		"tool",
		"tools",
	]);
	return friend.tags.some((tag) => navKeywords.has(tag.trim().toLowerCase()));
}

/**
 * 判断远程源是否为博主自身站点（避免在友链列表中展示自身卡片时，又通过 RSS 重复抓取自身文章）
 */
function isSelfSite(url?: string): boolean {
	if (!url) return false;
	const selfUrl = siteConfig.site_url;
	if (!selfUrl) return false;
	try {
		const selfHost = new URL(selfUrl).hostname.toLowerCase();
		const parsed = new URL(url, selfUrl);
		return parsed.hostname.toLowerCase() === selfHost;
	} catch {
		return false;
	}
}

/**
 * 校验是否为合法 HTTP/HTTPS 链接（防范 javascript: / data: 等 XSS 伪协议）
 */
export function isValidHttpUrl(urlString: string | null | undefined): boolean {
	if (!urlString) return false;
	try {
		const parsed = new URL(urlString);
		return parsed.protocol === "http:" || parsed.protocol === "https:";
	} catch {
		return false;
	}
}

/**
 * 判断主机名是否为私有/回环/本地保留地址（防范 SSRF）
 */
function isPrivateOrLocalHost(hostname: string): boolean {
	const host = hostname.toLowerCase().trim();
	if (
		host === "localhost" ||
		host.endsWith(".localhost") ||
		host.endsWith(".local") ||
		host === "::1" ||
		host === "[::1]" ||
		host === "0.0.0.0"
	) {
		return true;
	}

	const ipv4Match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
	if (ipv4Match) {
		const a = Number(ipv4Match[1]);
		const b = Number(ipv4Match[2]);
		const c = Number(ipv4Match[3]);
		const d = Number(ipv4Match[4]);
		if (a > 255 || b > 255 || c > 255 || d > 255) return true;
		if (a === 127) return true; // 127.0.0.0/8 回环
		if (a === 10) return true; // 10.0.0.0/8 A类私网
		if (a === 192 && b === 168) return true; // 192.168.0.0/16 C类私网
		if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12 B类私网
		if (a === 169 && b === 254) return true; // 169.254.0.0/16 链路本地
		if (a === 0) return true;
	}

	return false;
}

/**
 * 校验是否为安全的公共网络可访问 URL（用于发起抓取前的 SSRF 防御）
 */
export function isSafePublicUrl(urlString: string | null | undefined): boolean {
	if (!urlString) return false;
	try {
		const parsed = new URL(urlString);
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
			return false;
		}
		if (isPrivateOrLocalHost(parsed.hostname)) {
			return false;
		}
		return true;
	} catch {
		return false;
	}
}

/**
 * 安全抓取远程 Feed 文本：校验每一跳重定向（防范 SSRF 重定向穿透），并统一应用 5MB 流量截断与超时控制
 */
async function fetchSafeFeedText(
	initialUrl: string,
	signal: AbortSignal,
): Promise<string | null> {
	let currentUrl = initialUrl;
	const MAX_REDIRECTS = 3;

	for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
		if (!isSafePublicUrl(currentUrl)) {
			return null;
		}

		try {
			const res = await fetch(currentUrl, {
				headers: {
					"User-Agent": BROWSER_UA,
					Accept:
						"application/rss+xml, application/atom+xml, application/feed+json, application/xml, text/xml, application/json, */*",
				},
				signal,
				redirect: "manual",
			});

			// 严格校验每一跳重定向，阻断内网与私有目标
			if ([301, 302, 303, 307, 308].includes(res.status)) {
				const location = res.headers.get("location");
				if (!location) return null;
				const nextUrl = new URL(location, currentUrl).toString();
				if (!isSafePublicUrl(nextUrl)) {
					return null;
				}
				currentUrl = nextUrl;
				continue;
			}

			if (!res.ok || !res.body) {
				return null;
			}

			const contentLength = res.headers.get("content-length");
			if (
				contentLength &&
				Number.parseInt(contentLength, 10) > MAX_FEED_BYTES
			) {
				return null;
			}

			const reader = res.body.getReader();
			const chunks: Uint8Array[] = [];
			let receivedBytes = 0;

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				if (value) {
					receivedBytes += value.length;
					if (receivedBytes > MAX_FEED_BYTES) {
						await reader.cancel();
						return null;
					}
					chunks.push(value);
				}
			}

			const decoder = new TextDecoder();
			let result = "";
			for (const chunk of chunks) {
				result += decoder.decode(chunk, { stream: true });
			}
			result += decoder.decode();
			return result;
		} catch {
			return null;
		}
	}

	return null;
}

/**
 * 解析 Feed 原始文本（自动兼容 RSS 2.0 / Atom 与 JSON Feed）
 */
async function parseFeedText(
	rawText: string,
	parser: Parser,
): Promise<FeedEntry[]> {
	const trimmed = rawText.trim();
	if (!trimmed) return [];

	// 1. JSON Feed 尝试
	if (trimmed.startsWith("{")) {
		try {
			const json = JSON.parse(trimmed);
			if (Array.isArray(json.items)) {
				const entries: FeedEntry[] = [];
				for (const item of json.items) {
					if (entries.length >= MAX_ENTRIES_PER_FEED) break;
					const link = item.url || item.id;
					const dateStr = item.date_published || item.date_modified;
					if (item.title && link && dateStr && isValidHttpUrl(link)) {
						const pubDate = new Date(dateStr);
						if (!Number.isNaN(pubDate.getTime())) {
							entries.push({
								title: String(item.title).trim(),
								link: String(link).trim(),
								pubDate,
								excerpt: item.summary
									? String(item.summary).substring(0, 150)
									: undefined,
							});
						}
					}
				}
				if (entries.length > 0) return entries;
			}
		} catch {
			// 非有效 JSON，回退至 XML 解析
		}
	}

	// 2. RSS / Atom XML 解析
	try {
		const feed = await parser.parseString(trimmed);
		const entries: FeedEntry[] = [];
		for (const item of feed.items || []) {
			if (entries.length >= MAX_ENTRIES_PER_FEED) break;
			const dateStr = item.pubDate || item.date || item.updated;
			if (item.title && item.link && dateStr && isValidHttpUrl(item.link)) {
				const pubDate = new Date(dateStr);
				if (!Number.isNaN(pubDate.getTime())) {
					entries.push({
						title: item.title.trim(),
						link: item.link.trim(),
						pubDate,
						excerpt: item.contentSnippet
							? item.contentSnippet.substring(0, 150)
							: undefined,
					});
				}
			}
		}
		return entries;
	} catch {
		return [];
	}
}

/**
 * 通用 Feed 抓取与解析函数
 */
async function fetchAndParseFeed(
	feedUrl: string,
	parser: Parser,
	signal: AbortSignal,
): Promise<FeedEntry[]> {
	const rawText = await fetchSafeFeedText(feedUrl, signal);
	if (!rawText) return [];
	return parseFeedText(rawText, parser);
}

/**
 * 当未显式指定 feedUrl 时，依序轻量嗅探常用 RSS/Atom 规范路径，首个成功者即作为结果并终止后续探测
 */
async function discoverAndFetchFeed(
	siteUrl: string,
	parser: Parser,
	signal: AbortSignal,
): Promise<FeedEntry[]> {
	if (!isSafePublicUrl(siteUrl)) {
		return [];
	}
	const base = siteUrl.replace(/\/+$/, "");
	const candidates = [
		`${base}/atom.xml`,
		`${base}/rss.xml`,
		`${base}/feed/`,
		`${base}/feed.xml`,
		`${base}/index.xml`,
	];

	for (const candidateUrl of candidates) {
		if (signal.aborted) break;
		try {
			const entries = await fetchAndParseFeed(candidateUrl, parser, signal);
			if (entries && entries.length > 0) {
				return entries;
			}
		} catch {
			// 单个探测路径失败，继续依序探测下一个
		}
	}

	return [];
}

/**
 * 轻量级并发池执行器
 */
async function mapConcurrent<T, R>(
	items: T[],
	concurrency: number,
	fn: (item: T) => Promise<R>,
): Promise<R[]> {
	const results: R[] = new Array(items.length);
	let nextIndex = 0;

	async function worker() {
		while (nextIndex < items.length) {
			const index = nextIndex++;
			results[index] = await fn(items[index]);
		}
	}

	const workers = Array.from(
		{ length: Math.min(concurrency, items.length) },
		() => worker(),
	);
	await Promise.all(workers);
	return results;
}

/**
 * 聚合全站朋友圈动态：包含博主自身本地文章、启用的友链博客文章、独立订阅源文章
 */
export async function getFcircleItems(): Promise<FcircleItem[]> {
	const parser = new Parser({
		headers: {
			"User-Agent": BROWSER_UA,
			Accept:
				"application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
		},
		customFields: {
			item: ["pubDate", "date", "updated"],
		},
	});

	const items: FcircleItem[] = [];

	// 1. 本地博主文章（0 外部网络依赖，离线可用且构建即最新）
	try {
		const authorAvatar = await getAuthorAvatarUrl();
		const selfAvatar = authorAvatar || "/favicon/favicon.ico";

		const localPosts = await getSortedPostsList();
		for (const post of localPosts) {
			if (post.data.draft || post.data.password) continue;
			items.push({
				friendName: profileConfig.name || siteConfig.title,
				friendAvatar: selfAvatar,
				friendUrl: "/",
				title: post.data.title,
				link: formatUrl(`/posts/${post.id}/`),
				pubDate: new Date(post.data.published),
				excerpt: post.data.description,
				sourceType: "self",
				tags: post.data.tags || [],
			});
		}
	} catch (err) {
		console.warn("[Fcircle] Failed to load local self posts:", err);
	}

	// 2. 启用的友链列表（排除显式标记 fcircle === false、博主自身站点以及非博客类的导航/工具站点）
	const friends = getEnabledFriends()
		.filter(
			(f) =>
				f.fcircle !== false &&
				!isSelfSite(f.siteurl) &&
				!isSelfSite(f.feedUrl) &&
				!isNavigationFriend(f),
		)
		.map((f) => ({
			title: f.title,
			siteurl: f.siteurl,
			imgurl: f.imgurl,
			feedUrl: f.feedUrl,
			tags: f.tags,
			sourceType: "friend" as const,
		}));

	// 3. 启用的独立订阅源（支持 feedUrl 自动提取 origin 与默认 favicon）
	const subscriptions = getEnabledSubscriptions()
		.filter((s) => !isSelfSite(s.siteurl) && !isSelfSite(s.feedUrl))
		.map((s) => {
			let derivedSiteUrl = s.siteurl;
			if (!derivedSiteUrl && s.feedUrl) {
				try {
					derivedSiteUrl = new URL(s.feedUrl).origin;
				} catch {
					derivedSiteUrl = s.feedUrl;
				}
			}
			const finalSiteUrl = derivedSiteUrl || "";
			const defaultFavicon = finalSiteUrl
				? `${finalSiteUrl.replace(/\/+$/, "")}/favicon.ico`
				: "/favicon/favicon.ico";

			return {
				title: s.title,
				siteurl: finalSiteUrl,
				imgurl: s.imgurl || defaultFavicon,
				feedUrl: s.feedUrl,
				tags: s.tags && s.tags.length > 0 ? s.tags : undefined,
				sourceType: "subscription" as const,
			};
		});

	const remoteSources = [...friends, ...subscriptions];

	// 并发池控制抓取各远程源，单源硬超时 6 秒
	await mapConcurrent(remoteSources, CONCURRENT_LIMIT, async (source) => {
		try {
			const siteSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
			const cleanFeedUrl = source.feedUrl?.trim();
			let entries: FeedEntry[] = [];

			if (cleanFeedUrl) {
				entries = await fetchAndParseFeed(cleanFeedUrl, parser, siteSignal);
			} else if (source.siteurl) {
				entries = await discoverAndFetchFeed(
					source.siteurl,
					parser,
					siteSignal,
				);
			}

			if (entries.length > 0) {
				for (const entry of entries) {
					items.push({
						friendName: source.title,
						friendAvatar: source.imgurl,
						friendUrl: source.siteurl,
						title: entry.title,
						link: entry.link,
						pubDate: entry.pubDate,
						excerpt: entry.excerpt,
						sourceType: source.sourceType,
						tags: source.tags,
					});
				}
			}
		} catch {
			// 单站抓取异常不中断全站构建
		}
	});

	// 按时间倒序排序，遇到时间戳一致时执行确定性次级排序（类型 self > friend > sub -> 名称 -> 链接）
	items.sort((a, b) => {
		const diff = b.pubDate.getTime() - a.pubDate.getTime();
		if (diff !== 0) return diff;

		const orderA = SOURCE_ORDER[a.sourceType || "friend"] ?? 99;
		const orderB = SOURCE_ORDER[b.sourceType || "friend"] ?? 99;
		if (orderA !== orderB) return orderA - orderB;

		const nameDiff = (a.friendName || "").localeCompare(b.friendName || "");
		if (nameDiff !== 0) return nameDiff;

		return (a.link || "").localeCompare(b.link || "");
	});

	// 数据合规清洗：过滤无效日期、未来穿越文章（允许 10 分钟时钟误差）、非 HTTP(S) 外链
	const MAX_FUTURE_BUFFER_MS = 10 * 60 * 1000;
	const currentTimestamp = Date.now();
	const validItems = items.filter((item) => {
		const time = item.pubDate.getTime();
		if (Number.isNaN(time)) return false;
		if (time > currentTimestamp + MAX_FUTURE_BUFFER_MS) {
			return false;
		}
		if (!item.link || !item.title) return false;
		if (!isValidHttpUrl(item.link)) {
			// 允许博主自身站内相对路径 /posts/...
			if (item.sourceType !== "self" || !item.link.startsWith("/")) {
				return false;
			}
		}
		return true;
	});

	// 归一化文章链接（同时兼容站内相对路径与带有 site_url 前缀的绝对路径），防止博主自身或友链文章重复
	const normalizeLink = (link: string): string => {
		let clean = link.trim().replace(/\/+$/, "").toLowerCase();
		if (siteConfig.site_url) {
			try {
				const origin = new URL(siteConfig.site_url).origin.toLowerCase();
				if (clean.startsWith(origin)) {
					clean = clean.slice(origin.length);
				}
			} catch {}
		}
		return clean || "/";
	};

	// 综合链接与博主自身文章标题去重，彻底阻断外部抓取镜像产生重复
	const seenLinks = new Set<string>();
	const seenSelfTitles = new Set<string>();
	const uniqueItems: FcircleItem[] = [];

	for (const item of validItems) {
		const normLink = normalizeLink(item.link);
		const normTitle = (item.title || "").trim().toLowerCase();

		if (item.sourceType === "self") {
			seenSelfTitles.add(normTitle);
		} else if (seenSelfTitles.has(normTitle)) {
			// 若非 self 条目的标题与博主自身文章相同，判定为自身文章的外部 RSS 镜像，予以跳过
			continue;
		}

		if (!seenLinks.has(normLink)) {
			seenLinks.add(normLink);
			uniqueItems.push(item);
		}
	}

	// 限制最多保留 100 篇最新动态
	return uniqueItems.slice(0, 100);
}

export interface FcircleDateGroup {
	dateKey: string;
	displayDate: string;
	subLabel?: string;
	relativeDays: number;
	items: FcircleItem[];
}

export interface FcircleStats {
	todayCount: number;
	weekCount: number;
	totalCount: number;
	siteCount: number;
}

/**
 * 将朋友圈文章按站点时区的自然日聚类为时间线分组。
 */
export function groupFcircleByDate(
	items: FcircleItem[],
	now: Date = new Date(),
	timeZone: string = siteConfig.timezone || "UTC",
	lang = "zh-CN",
): FcircleDateGroup[] {
	const groupsMap = new Map<string, FcircleDateGroup>();

	for (const item of items) {
		const dateInfo = getFcircleDatePresentation(
			item.pubDate,
			now,
			timeZone,
			lang,
		);

		if (!groupsMap.has(dateInfo.dateKey)) {
			groupsMap.set(dateInfo.dateKey, {
				dateKey: dateInfo.dateKey,
				displayDate: dateInfo.displayDate,
				subLabel: dateInfo.subLabel,
				relativeDays: dateInfo.relativeDays,
				items: [],
			});
		}

		groupsMap.get(dateInfo.dateKey)?.items.push(item);
	}

	return Array.from(groupsMap.values());
}

/**
 * 计算朋友圈动态核心统计指标。
 */
export function getFcircleStats(
	items: FcircleItem[],
	now: Date = new Date(),
	timeZone: string = siteConfig.timezone || "UTC",
): FcircleStats {
	let todayCount = 0;
	let weekCount = 0;
	const sites = new Set<string>();

	for (const item of items) {
		const relativeDays = getFcircleRelativeDays(item.pubDate, now, timeZone);
		if (relativeDays === 0) {
			todayCount++;
		}
		if (relativeDays >= 0 && relativeDays <= 6) {
			weekCount++;
		}

		if (item.sourceType === "self") {
			sites.add("__self__");
		} else if (item.friendUrl) {
			try {
				const origin = new URL(item.friendUrl).hostname.toLowerCase();
				sites.add(origin || item.friendName.toLowerCase());
			} catch {
				sites.add(item.friendName.toLowerCase());
			}
		} else {
			sites.add(item.friendName.toLowerCase());
		}
	}

	return {
		todayCount,
		weekCount,
		totalCount: items.length,
		siteCount: sites.size,
	};
}

export {
	formatFcircleDate,
	formatFcircleTime,
	getFcircleDateKey,
	getFcircleDatePresentation,
	getFcircleRelativeDays,
} from "./fcircle-date-utils";
