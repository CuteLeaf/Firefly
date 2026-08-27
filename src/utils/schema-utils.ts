import type { ProfileConfig, SiteConfig } from "@/types/config";
import { getSearchUrl, url } from "./url-utils";

/**
 * 把 src 解析成绝对 URL 字符串。
 * - http/https、协议相对（//）、data: 原样返回；
 * - 以 `/` 开头的 public 路径先经 url()（BASE_URL 感知）得到相对源路径，再对 base 求绝对；
 * - src 为空、或非 `/` 开头的 src 相对资源（会被 Astro 优化并哈希，本函数无法解析）返回 null。
 * 仅适用于"按原样可访问"的来源（public / 远程 / data）；src 内图片请用 schema-image 的 toAbsoluteImageUrl。
 */
export function toAbsoluteUrl(
	src: string | undefined | null,
	base: URL | string,
): string | null {
	if (!src) return null;
	if (
		src.startsWith("http://") ||
		src.startsWith("https://") ||
		src.startsWith("//") ||
		src.startsWith("data:")
	) {
		return src;
	}
	// 非 `/` 开头的相对路径属于 src 内资源（会被 Astro 优化并哈希），
	// 本函数无法解析成可访问 URL；避免产生 /assets/... 坏链，警告并跳过。
	// 这类资源应改用 toAbsoluteImageUrl。
	if (!src.startsWith("/")) {
		console.warn(
			`[schema-utils] toAbsoluteUrl 收到 src 相对路径 "${src}"，无法解析成可访问 URL，已跳过；请改用 toAbsoluteImageUrl`,
		);
		return null;
	}
	const baseUrl = base instanceof URL ? base : new URL(base);
	return new URL(url(src), baseUrl).toString();
}

export interface BreadcrumbItem {
	name: string;
	url: string;
}

export function buildBreadcrumbList(
	items: BreadcrumbItem[],
): Record<string, unknown> {
	return {
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: item.url,
		})),
	};
}

// sameAs 只保留绝对 http(s) 外链（去掉 mailto: 与 /rss/ 等相对/非外链）
function filterAbsoluteLinks(links: ProfileConfig["links"]): string[] {
	return (links ?? [])
		.map((l) => l?.url)
		.filter(
			(u): u is string =>
				!!u &&
				(u.startsWith("http://") ||
					u.startsWith("https://") ||
					u.startsWith("//")),
		);
}

export interface PersonEntityOpts {
	site: URL | string;
	profileConfig: ProfileConfig;
	/** 作者个人页（/about/）绝对 URL，亦作为 Person.url */
	authorUrl: string;
	/** 头像绝对 URL（schema-image 的 getAuthorAvatarUrl 产物） */
	avatarUrl?: string | null;
	/** profileConfig.bio */
	description?: string;
}

// 站点根（base 感知）：用 url("/") 拼上 BASE_URL（处理子路径 base）再对站点 origin 求绝对，
// 使 WebSite/Person 的 @id、url 在子路径部署（base 非空）时也正确。
// 注意：siteConfig.site_url 应填站点 origin（根，不含子路径 base），子路径由 BASE_URL 处理。
function resolveSiteRoot(site: URL | string): string {
	const baseUrl = site instanceof URL ? site : new URL(site);
	return new URL(url("/"), baseUrl).toString();
}

export function buildPersonEntity(
	opts: PersonEntityOpts,
): Record<string, unknown> {
	const siteUrl = resolveSiteRoot(opts.site);
	const sameAs = filterAbsoluteLinks(opts.profileConfig.links);
	return {
		"@type": "Person",
		"@id": `${siteUrl}#person`,
		name: opts.profileConfig.name,
		url: opts.authorUrl,
		...(opts.avatarUrl ? { image: opts.avatarUrl } : {}),
		...(opts.description ? { description: opts.description } : {}),
		...(sameAs.length ? { sameAs } : {}),
	};
}

/**
 * 作者简介页（/about/）结构化数据：ProfilePage + mainEntity Person。
 */
export function buildProfilePage(
	opts: PersonEntityOpts,
): Record<string, unknown> {
	return {
		"@context": "https://schema.org",
		"@type": "ProfilePage",
		mainEntity: buildPersonEntity(opts),
	};
}

/**
 * 站点发布者（publisher）实体：Organization。
 * 带稳定 @id（${siteRoot}#organization），BlogPosting.publisher 用它引用，便于跨页合并实体。
 */
export function buildPublisherEntity(opts: {
	site: URL | string;
	siteConfig: SiteConfig;
	logo?: { url: string; width?: number; height?: number } | null;
}): Record<string, unknown> {
	const siteUrl = resolveSiteRoot(opts.site);
	const logo = opts.logo ?? null;
	return {
		"@type": "Organization",
		"@id": `${siteUrl}#organization`,
		name: opts.siteConfig.title,
		url: siteUrl,
		...(logo
			? {
					logo: {
						"@type": "ImageObject",
						url: logo.url,
						contentUrl: logo.url,
						...(logo.width ? { width: logo.width } : {}),
						...(logo.height ? { height: logo.height } : {}),
					},
				}
			: {}),
	};
}

/**
 * 站点级 @graph：WebSite + Person（作者） + Organization（发布者）。仅首页注入。
 * 个人博客用 Person 表示作者，头像作为其 image（而非 Organization 的 logo）。
 * avatarUrl 需由调用方先经 getAuthorAvatarUrl 解析成真实存在的绝对 URL。
 */
export function buildSiteGraph(opts: {
	site: URL | string;
	siteConfig: SiteConfig;
	profileConfig: ProfileConfig;
	lang: string;
	authorUrl: string;
	avatarUrl?: string | null;
	logo?: { url: string; width?: number; height?: number } | null;
}): Record<string, unknown> {
	const siteUrl = resolveSiteRoot(opts.site);
	const person = buildPersonEntity({
		site: siteUrl,
		profileConfig: opts.profileConfig,
		authorUrl: opts.authorUrl,
		avatarUrl: opts.avatarUrl,
		description: opts.profileConfig.bio,
	});
	const publisher = buildPublisherEntity({
		site: siteUrl,
		siteConfig: opts.siteConfig,
		logo: opts.logo,
	});
	// 站点搜索页 /search/?q=，供 Sitelinks Search Box 使用
	const searchTarget = `${new URL(getSearchUrl(""), siteUrl).toString()}{search_term_string}`;

	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "WebSite",
				"@id": `${siteUrl}#website`,
				url: siteUrl,
				name: opts.siteConfig.title,
				description: opts.siteConfig.description,
				inLanguage: opts.lang,
				publisher: { "@id": `${siteUrl}#person` },
				potentialAction: {
					"@type": "SearchAction",
					target: {
						"@type": "EntryPoint",
						urlTemplate: searchTarget,
					},
					"query-input": "required name=search_term_string",
				},
			},
			person,
			publisher,
		],
	};
}
