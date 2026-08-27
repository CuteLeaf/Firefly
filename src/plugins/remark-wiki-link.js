/**
 * remark-wiki-link — Obsidian 风格 Wiki Link 插件
 * @author CuteLeaf <xiaye@msn.com>
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { slug } from "github-slugger";
import matter from "gray-matter";
import { getApiUrlList, processCoverImageSync } from "../utils/image-utils";

const POSTS_DIR = fileURLToPath(new URL("../content/posts/", import.meta.url));
const MARKDOWN_EXTENSION = /\.(?:md|mdx|markdown)$/i;
const WIKI_LINK = /!?\[\[([^[\]\n]+)\]\]/g;
const STANDALONE_WIKI_LINK = /^\[\[([^[\]\n]+)\]\]$/;
const SKIPPED_NODE_TYPES = new Set([
	"link",
	"linkReference",
	"mdxJsxFlowElement",
	"mdxJsxTextElement",
]);

const frontmatterCache = new Map();

function normalizeContentPath(value) {
	const contentPath = value
		.trim()
		.replaceAll("\\", "/")
		.replace(/^\.?\//, "")
		.replace(/\/+$/, "")
		.replace(MARKDOWN_EXTENSION, "");
	const segments = contentPath.split("/").filter(Boolean);

	if (
		segments.length === 0 ||
		segments.some((segment) => segment === "." || segment === "..")
	) {
		return "";
	}

	const withoutPrefix = segments[0] === "posts" ? segments.slice(1) : segments;

	return withoutPrefix.length > 0 ? withoutPrefix.join("/") : "";
}

function createPostUrl(contentPath) {
	const segments = contentPath.split("/");

	if (segments.at(-1)?.toLowerCase() === "index") {
		segments.pop();
	}

	const encodedPath = segments
		.map((segment) => encodeURIComponent(segment))
		.join("/");

	return `/posts/${encodedPath ? `${encodedPath}/` : ""}`;
}

/**
 * 由文章文件的绝对路径反推 content path。
 */
function toContentPath(filePath) {
	return path
		.relative(POSTS_DIR, filePath)
		.replaceAll("\\", "/")
		.replace(MARKDOWN_EXTENSION, "");
}

/**
 * 还原 Astro glob loader 生成的 entry.id——也就是文章 URL 的唯一来源。
 * loader 在 schema 校验前先读原始 frontmatter，`slug` 存在时直接作为 id，
 * 否则回退到文件路径。注意 `slug` 不在 posts 的 zod schema 里，
 * 所以它只在这里（直接读 frontmatter）可见，`entry.data` 上取不到。
 */
function toPostId(meta) {
	const declaredSlug =
		typeof meta.data.slug === "string" ? meta.data.slug.trim() : "";

	return declaredSlug || toContentPath(meta.filePath);
}

function readMetaFile(filePath) {
	let stats;
	try {
		stats = statSync(filePath);
	} catch {
		return null;
	}
	if (!stats.isFile()) {
		return null;
	}

	const cached = frontmatterCache.get(filePath);
	if (cached && cached.mtimeMs === stats.mtimeMs) {
		return cached.meta;
	}

	let data;
	try {
		data = matter(readFileSync(filePath, "utf8")).data ?? {};
	} catch {
		return null;
	}

	const meta = { filePath, data };
	frontmatterCache.set(filePath, { mtimeMs: stats.mtimeMs, meta });
	return meta;
}

function collectPostMetas() {
	const metas = [];
	const stack = [POSTS_DIR];

	while (stack.length > 0) {
		const dir = stack.pop();
		let entries;
		try {
			entries = readdirSync(dir, { withFileTypes: true });
		} catch {
			// 目录读不到就跳过；注意这里只包住 readdirSync，
			// 避免把下面的逻辑错误一起吞掉
			continue;
		}

		for (const entry of entries) {
			const fullPath = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				stack.push(fullPath);
				continue;
			}
			if (!MARKDOWN_EXTENSION.test(entry.name)) {
				continue;
			}
			const meta = readMetaFile(fullPath);
			if (meta) {
				metas.push(meta);
			}
		}
	}

	return metas;
}

function findMetaBySlug(metas, target) {
	return (
		metas.find(
			(meta) =>
				typeof meta.data.slug === "string" && meta.data.slug.trim() === target,
		) ?? null
	);
}

/**
 * 按裸文件名匹配，兼容 Obsidian「尽可能简短的形式」链接格式。
 * 只在全站唯一时接受，重名时要求写出更长的路径。
 */
function findMetaByBaseName(metas, target) {
	if (target.includes("/")) {
		return null;
	}

	const matches = metas.filter(
		(meta) =>
			path.basename(meta.filePath).replace(MARKDOWN_EXTENSION, "") === target,
	);

	if (matches.length === 1) {
		return matches[0];
	}
	if (matches.length > 1) {
		console.warn(
			`[remark-wiki-link] "[[${target}]]" 匹配到多个同名文件，已跳过：${matches
				.map((meta) => toContentPath(meta.filePath))
				.join(", ")}。请改写为更长的路径。`,
		);
	}

	return null;
}

function readPostMeta(contentPath) {
	const metas = collectPostMetas();

	// 1. frontmatter slug —— 它就是 Astro 的 entry.id，优先级最高
	const bySlug = findMetaBySlug(metas, contentPath);
	if (bySlug) {
		return bySlug;
	}

	// 2. 文件路径精确匹配
	const candidates = [
		`${contentPath}.md`,
		`${contentPath}.mdx`,
		`${contentPath}.markdown`,
		`${contentPath}/index.md`,
		`${contentPath}/index.mdx`,
	];

	for (const candidate of candidates) {
		const meta = readMetaFile(path.join(POSTS_DIR, candidate));
		if (meta) {
			return meta;
		}
	}

	// 3. 裸文件名兜底
	return findMetaByBaseName(metas, contentPath);
}

function formatPublishedDate(value) {
	if (value instanceof Date && !Number.isNaN(value.getTime())) {
		return value.toISOString().slice(0, 10);
	}
	if (typeof value === "string") {
		const match = value.match(/^\d{4}-\d{2}-\d{2}/);
		if (match) {
			return match[0];
		}
	}
	return "";
}

function createRemoteCoverImg(src, extraProperties) {
	return createElement(
		"img",
		{
			src,
			alt: "",
			loading: "lazy",
			decoding: "async",
			...extraProperties,
		},
		[],
	);
}

function createCoverNode(meta, resolvedPath, context) {
	const image =
		typeof meta.data.image === "string" ? meta.data.image.trim() : "";

	if (!image) {
		return null;
	}

	// 随机封面图 API：复用 CoverImage 的 data-api-urls 客户端重试机制
	// seed 与 PostCard / 文章页保持一致（Astro 的 entry.id 会去掉末尾的 /index）
	if (image === "api") {
		const seed = resolvedPath.replace(/\/index$/i, "");
		const firstUrl = processCoverImageSync(image, seed);
		if (!firstUrl) {
			return null;
		}
		const apiUrls = getApiUrlList(image, seed);
		return createElement(
			"div",
			{
				class: "cover-image-container",
				dataApiUrls: apiUrls.length > 0 ? JSON.stringify(apiUrls) : undefined,
			},
			[
				createRemoteCoverImg(firstUrl, {
					dataCoverImg: "true",
					dataRemote: "true",
				}),
			],
		);
	}

	// 外链或 public 目录下的封面：直接输出 img，不经过构建期图片管线
	if (/^(?:https?:)?\/\//i.test(image) || image.startsWith("/")) {
		return createRemoteCoverImg(image);
	}

	if (!context.currentDir) {
		return null;
	}

	const absolutePath = path.resolve(path.dirname(meta.filePath), image);
	try {
		if (!statSync(absolutePath).isFile()) {
			return null;
		}
	} catch {
		return null;
	}

	const relativePath = path
		.relative(context.currentDir, absolutePath)
		.replaceAll("\\", "/");
	const coverUrl = relativePath.startsWith(".")
		? relativePath
		: `./${relativePath}`;

	// 走 Astro 图片管线，width:640 生成小尺寸缩略图
	return {
		type: "image",
		url: coverUrl,
		alt: "",
		data: { hProperties: { width: 480 } },
	};
}

function parseWikiLinkValue(value) {
	const aliasSeparator = value.indexOf("|");
	const destination = (
		aliasSeparator === -1 ? value : value.slice(0, aliasSeparator)
	).trim();
	const alias =
		aliasSeparator === -1 ? "" : value.slice(aliasSeparator + 1).trim();

	if (!destination) {
		return null;
	}

	const headingSeparator = destination.indexOf("#");
	const pageName =
		headingSeparator === -1
			? destination
			: destination.slice(0, headingSeparator).trim();
	const heading =
		headingSeparator === -1
			? ""
			: destination.slice(headingSeparator + 1).trim();
	const contentPath = pageName ? normalizeContentPath(pageName) : "";

	if ((pageName && !contentPath) || (!contentPath && !heading)) {
		return null;
	}

	return { destination, alias, contentPath, heading };
}

/**
 * Obsidian 在「基于仓库根目录的绝对路径」模式下会自动把文件名填进别名位，
 * 写出 `[[guide/foo|foo]]`——这不是作者指定的标题，只是让笔记里别显示整条路径。
 * 因此别名与链接目标本身重合时视为噪声，回退到文章的 frontmatter title。
 */
function resolveAlias(parsed, meta) {
	if (!parsed.alias) {
		return "";
	}

	const noise = new Set([
		parsed.destination,
		parsed.contentPath,
		path.basename(parsed.contentPath),
	]);
	if (meta) {
		noise.add(toContentPath(meta.filePath));
		noise.add(path.basename(meta.filePath).replace(MARKDOWN_EXTENSION, ""));
	}

	return noise.has(parsed.alias) ? "" : parsed.alias;
}

function createElement(tagName, properties, children) {
	return {
		type: "paragraph",
		data: { hName: tagName, hProperties: properties },
		children,
	};
}

function createText(value) {
	return { type: "text", value };
}

function createWikiLinkCard(parsed, context) {
	const meta = readPostMeta(parsed.contentPath);
	if (!meta) {
		return null;
	}

	const resolvedPath = toPostId(meta);
	const title =
		resolveAlias(parsed, meta) ||
		(typeof meta.data.title === "string" && meta.data.title
			? meta.data.title
			: resolvedPath);
	const encrypted =
		typeof meta.data.password === "string" && meta.data.password.length > 0;
	const description =
		typeof meta.data.description === "string"
			? meta.data.description.trim()
			: "";
	const published = formatPublishedDate(meta.data.published);
	const category =
		typeof meta.data.category === "string" ? meta.data.category.trim() : "";
	const tags = Array.isArray(meta.data.tags)
		? meta.data.tags.filter((tag) => typeof tag === "string" && tag)
		: [];

	const metaItems = [];
	if (published) {
		metaItems.push(
			createElement("span", { class: "wlc-date" }, [createText(published)]),
		);
	}
	if (category) {
		metaItems.push(
			createElement("span", { class: "wlc-category" }, [createText(category)]),
		);
	}
	if (tags.length > 0) {
		// 标签作为一个整体，宽度不够时整组换行
		metaItems.push(
			createElement(
				"span",
				{ class: "wlc-tags" },
				tags.map((tag) =>
					createElement("span", { class: "wlc-tag" }, [createText(`#${tag}`)]),
				),
			),
		);
	}

	const info = [
		createElement(
			"div",
			{ class: `wlc-title${encrypted ? " wlc-encrypted" : ""}` },
			[createText(title)],
		),
	];
	if (description) {
		info.push(
			createElement("div", { class: "wlc-description" }, [
				createText(description),
			]),
		);
	}
	if (metaItems.length > 0) {
		info.push(createElement("div", { class: "wlc-meta" }, metaItems));
	}

	const children = [createElement("div", { class: "wlc-info" }, info)];

	const cover = createCoverNode(meta, resolvedPath, context);
	if (cover) {
		children.push(createElement("div", { class: "wlc-cover" }, [cover]));
	}

	return createElement(
		"a",
		{
			class: "card-wiki-link no-styling",
			href: createPostUrl(resolvedPath),
		},
		children,
	);
}

function createWikiLink(value) {
	const parsed = parseWikiLinkValue(value);
	if (!parsed) {
		return null;
	}

	const meta = parsed.contentPath ? readPostMeta(parsed.contentPath) : null;
	const title =
		typeof meta?.data.title === "string" && meta.data.title
			? meta.data.title
			: "";

	let text = resolveAlias(parsed, meta);
	if (!text) {
		if (parsed.contentPath) {
			const pageText =
				title || parsed.destination.replace(MARKDOWN_EXTENSION, "");
			text = parsed.heading ? `${pageText}#${parsed.heading}` : pageText;
		} else {
			text = parsed.heading;
		}
	}

	const pageUrl = parsed.contentPath
		? createPostUrl(meta ? toPostId(meta) : parsed.contentPath)
		: "";
	const url = `${pageUrl}${parsed.heading ? `#${slug(parsed.heading)}` : ""}`;

	return {
		type: "link",
		url,
		children: [createText(text)],
	};
}

function replaceWikiLinks(value) {
	const children = [];
	let cursor = 0;
	let changed = false;

	for (const match of value.matchAll(WIKI_LINK)) {
		if (match[0].startsWith("!")) {
			continue;
		}

		const link = createWikiLink(match[1]);
		if (!link) {
			continue;
		}

		const index = match.index;
		if (index > cursor) {
			children.push({ type: "text", value: value.slice(cursor, index) });
		}
		children.push(link);
		cursor = index + match[0].length;
		changed = true;
	}

	if (!changed) {
		return null;
	}

	if (cursor < value.length) {
		children.push({ type: "text", value: value.slice(cursor) });
	}

	return children;
}

function tryCreateCardFromParagraph(node, context) {
	if (node.type !== "paragraph" || node.children?.length !== 1) {
		return null;
	}

	const child = node.children[0];
	if (child.type !== "text") {
		return null;
	}

	const match = child.value.trim().match(STANDALONE_WIKI_LINK);
	if (!match) {
		return null;
	}

	const parsed = parseWikiLinkValue(match[1]);
	if (!parsed || parsed.heading || !parsed.contentPath) {
		return null;
	}

	return createWikiLinkCard(parsed, context);
}

function transformNode(node, context) {
	if (SKIPPED_NODE_TYPES.has(node.type) || !Array.isArray(node.children)) {
		return;
	}

	for (let index = 0; index < node.children.length; index++) {
		const child = node.children[index];

		const card = tryCreateCardFromParagraph(child, context);
		if (card) {
			node.children[index] = card;
			continue;
		}

		if (child.type === "text") {
			const replacement = replaceWikiLinks(child.value);
			if (replacement) {
				node.children.splice(index, 1, ...replacement);
				index += replacement.length - 1;
			}
			continue;
		}

		transformNode(child, context);
	}
}

/**
 * Convert Obsidian-style Wiki Links into Markdown links and post link cards.
 *
 * - `[[slug]]` alone in a paragraph becomes a link card with the post's
 *   title, description, published date, category, tags and cover image.
 * - `[[slug|alias]]` alone in a paragraph also becomes a link card, with
 *   the alias replacing the post title.
 * - Inline `[[slug]]` becomes a normal link whose text is the post title.
 * - `[[slug#heading]]` always renders as a normal link.
 *
 * An alias that merely repeats the link target (`[[guide/foo|foo]]`, which is
 * what Obsidian inserts on its own) is treated as noise and ignored, so the
 * post's real title still wins.
 *
 * Targets resolve in three steps: `frontmatter.slug`, then exact file path,
 * then bare file name (for Obsidian's "shortest path when possible" format,
 * accepted only when unique). URLs are always derived from the resolved
 * post's `entry.id` rather than from the link text, so a bare file name
 * still produces the post's real URL.
 */
export function remarkWikiLink() {
	return (tree, file) => {
		const context = {
			currentDir: file?.path ? path.dirname(file.path) : null,
		};
		transformNode(tree, context);
	};
}
