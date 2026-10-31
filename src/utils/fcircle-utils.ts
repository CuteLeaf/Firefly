import Parser from "rss-parser";
import { profileConfig, siteConfig } from "../config";
import { getEnabledFriends } from "../config/friendsConfig";
import { getEnabledSubscriptions } from "../config/subscriptionConfig";
import { getSortedPostsList } from "./content-utils";
import {
	getFcircleDatePresentation,
	getFcircleRelativeDays,
} from "./fcircle-date-utils";
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

/**
 * 通用 Feed 解析函数：支持 RSS 2.0 / 1.0、Atom 以及 JSON Feed
 */
async function fetchAndParseFeed(
	feedUrl: string,
	parser: Parser,
): Promise<FeedEntry[]> {
	// 1. 优先使用 rss-parser 解析 XML 格式（RSS / Atom）
	try {
		const feed = await parser.parseURL(feedUrl);
		const entries: FeedEntry[] = [];
		for (const item of feed.items) {
			const dateStr = item.pubDate || item.date || item.updated;
			if (item.title && item.link && dateStr) {
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
		if (entries.length > 0) return entries;
	} catch {
		// rss-parser 失败，继续尝试兜底 JSON Feed
	}

	// 2. 兜底尝试 JSON Feed 格式
	try {
		const res = await fetch(feedUrl, {
			headers: {
				"User-Agent": BROWSER_UA,
				Accept:
					"application/feed+json, application/json, application/xml, text/xml, */*",
			},
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});

		if (res.ok) {
			const text = await res.text();
			if (text.trim().startsWith("{")) {
				const json = JSON.parse(text);
				if (Array.isArray(json.items)) {
					const entries: FeedEntry[] = [];
					for (const item of json.items) {
						const link = item.url || item.id;
						const dateStr = item.date_published || item.date_modified;
						if (item.title && link && dateStr) {
							const pubDate = new Date(dateStr);
							if (!Number.isNaN(pubDate.getTime())) {
								entries.push({
									title: item.title.trim(),
									link: link.trim(),
									pubDate,
									excerpt: item.summary
										? String(item.summary).substring(0, 150)
										: undefined,
								});
							}
						}
					}
					return entries;
				}
			}
		}
	} catch {
		// 忽略单次网络/解析异常
	}

	return [];
}

/**
 * 当未显式指定 feedUrl 时，并发嗅探站点常用 RSS/Atom 规范路径，首个成功者即作为结果
 */
async function discoverAndFetchFeed(
	siteUrl: string,
	parser: Parser,
): Promise<FeedEntry[]> {
	const base = siteUrl.replace(/\/+$/, "");
	const candidates = [
		`${base}/atom.xml`,
		`${base}/rss.xml`,
		`${base}/feed/`,
		`${base}/feed.xml`,
		`${base}/index.xml`,
	];

	try {
		const result = await Promise.any(
			candidates.map(async (candidateUrl) => {
				const entries = await fetchAndParseFeed(candidateUrl, parser);
				if (entries && entries.length > 0) {
					return entries;
				}
				throw new Error(`No entries at ${candidateUrl}`);
			}),
		);
		return result;
	} catch {
		return [];
	}
}

/**
 * 聚合全站朋友圈动态：包含博主自身本地文章、启用的友链博客文章、独立订阅源文章
 */
export async function getFcircleItems(): Promise<FcircleItem[]> {
	const parser = new Parser({
		timeout: REQUEST_TIMEOUT_MS,
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
		const selfAvatar =
			profileConfig.avatar?.startsWith("http") ||
			profileConfig.avatar?.startsWith("/")
				? profileConfig.avatar
				: `${siteConfig.site_url.replace(/\/$/, "")}/${profileConfig.avatar || "avatar.webp"}`;

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

	// 2. 启用的友链列表（排除显式标记 fcircle === false 的条目）
	const friends = getEnabledFriends()
		.filter((f) => f.fcircle !== false)
		.map((f) => ({
			title: f.title,
			siteurl: f.siteurl,
			imgurl: f.imgurl,
			feedUrl: f.feedUrl,
			tags: f.tags,
			sourceType: "friend" as const,
		}));

	// 3. 启用的独立订阅源（不展示在友链页，但聚合至朋友圈）
	const subscriptions = getEnabledSubscriptions().map((s) => ({
		title: s.title,
		siteurl: s.siteurl || s.feedUrl,
		imgurl:
			s.imgurl ||
			(s.siteurl
				? `${s.siteurl.replace(/\/$/, "")}/favicon.ico`
				: "/favicon/favicon.ico"),
		feedUrl: s.feedUrl,
		tags: s.tags && s.tags.length > 0 ? s.tags : ["订阅"],
		sourceType: "subscription" as const,
	}));

	const remoteSources = [...friends, ...subscriptions];

	// 并发抓取各远程源
	const promises = remoteSources.map(async (source) => {
		try {
			const cleanFeedUrl = source.feedUrl?.trim();
			let entries: FeedEntry[] = [];

			if (cleanFeedUrl) {
				entries = await fetchAndParseFeed(cleanFeedUrl, parser);
			} else if (source.siteurl) {
				entries = await discoverAndFetchFeed(source.siteurl, parser);
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

	await Promise.allSettled(promises);

	// 按时间倒序排序
	items.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

	// 数据合规清洗：过滤无效日期、过滤发布时间超前的时钟穿越异常文章（允许 10 分钟偏差）、过滤无效链接
	const MAX_FUTURE_BUFFER_MS = 10 * 60 * 1000;
	const currentTimestamp = Date.now();
	const validItems = items.filter((item) => {
		const time = item.pubDate.getTime();
		if (Number.isNaN(time)) return false;
		if (time > currentTimestamp + MAX_FUTURE_BUFFER_MS) {
			return false;
		}
		if (!item.link || !item.title) return false;
		return true;
	});

	// 根据文章链接去重
	const seenLinks = new Set<string>();
	const uniqueItems: FcircleItem[] = [];
	for (const item of validItems) {
		const normLink = item.link.replace(/\/+$/, "").toLowerCase();
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
		sites.add(item.friendUrl || item.friendName);
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
