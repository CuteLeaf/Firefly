import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { glob } from "glob";
import { pinyin } from "pinyin-pro";
import { Hono } from "hono";
import { adminServer } from "../../admin.config";
import { ADMIN_DIR, resolveInRoot } from "../lib/paths";
import { atomicWrite } from "../lib/fs";

/* ── 常量与类型 ─────────────────────────────────────────── */

const EXT_RE = /\.(md|mdx)$/i;
const CJK_RE = /[\u3400-\u9fff\uf900-\ufaff]/;

/** frontmatter 允许写入的字段白名单（prevTitle/nextTitle 等为站点内部字段，不在此列） */
const FRONTMATTER_FIELDS = [
	"title",
	"published",
	"updated",
	"draft",
	"description",
	"image",
	"tags",
	"category",
	"lang",
	"pinned",
	"author",
	"sourceLink",
	"licenseName",
	"licenseUrl",
	"comment",
	"password",
	"passwordHint",
	"series",
	"seriesOrder",
] as const;

export interface PostMeta {
	id: string;
	relPath: string;
	title: string;
	draft: boolean;
	published: string;
	updated: string;
	description: string;
	image: string;
	tags: string[];
	category: string;
	pinned: boolean;
	series: string;
	encrypted: boolean;
	wordCount: number;
	mtimeMs: number;
}

/* ── 工具函数 ──────────────────────────────────────────── */

function postsRoot(): string {
	return resolveInRoot(adminServer.postsDir);
}

/** 把 Date / ISO / 任意时间值规整为 YYYY-MM-DD 字符串 */
function toDateString(value: unknown): string {
	if (!value) return "";
	const date = value instanceof Date ? value : new Date(String(value));
	if (Number.isNaN(date.getTime())) return String(value);
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}

function todayString(): string {
	return toDateString(new Date());
}

/** 统计字数：CJK 逐字计，其余按单词计 */
function countWords(body: string): number {
	const cjk = body.match(CJK_RE)?.length ?? 0;
	const rest = body
		.replace(CJK_RE, " ")
		.trim()
		.split(/\s+/)
		.filter(Boolean).length;
	return cjk + rest;
}

/** 与 scripts/new-post.js 一致的 slug 规范化（中文转拼音） */
export function normalizeSlug(raw: string): string {
	let slug = raw.trim().replace(EXT_RE, "");
	if (slug.endsWith("/index")) slug = slug.slice(0, -"/index".length);
	return slug
		.split("/")
		.map((segment) => {
			if (!CJK_RE.test(segment)) return segment;
			const parts: string[] = [];
			let buf = "";
			for (const ch of segment) {
				if (CJK_RE.test(ch)) {
					if (buf) {
						parts.push(buf);
						buf = "";
					}
					parts.push(pinyin(ch, { toneType: "none", type: "array" })[0]);
				} else {
					buf += ch;
				}
			}
			if (buf) parts.push(buf);
			return parts
				.join("-")
				.toLowerCase()
				.replace(/[^a-z0-9-]/g, "")
				.replace(/-+/g, "-")
				.replace(/^-|-$/g, "");
		})
		.filter(Boolean)
		.join("/");
}

/** 从标题生成 slug */
function slugFromTitle(title: string): string {
	const base = pinyin(title, { toneType: "none", type: "array" }).join("-");
	const normalized = base
		.toLowerCase()
		.replace(/[^a-z0-9-\s]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
	return normalized || `post-${Date.now()}`;
}

/** 把相对 id 安全解析为 posts 目录内绝对路径，越界或不存在返回 null */
async function resolvePostPath(id: string): Promise<string | null> {
	try {
		const abs = resolveInRoot(path.posix.join(adminServer.postsDir, id));
		// 补扩展名
		const candidates = [abs, `${abs}.md`, `${abs}.mdx`];
		for (const candidate of candidates) {
			try {
				const stat = await fs.stat(candidate);
				if (stat.isFile()) return candidate;
			} catch {
				/* 继续尝试 */
			}
		}
		return null;
	} catch {
		return null;
	}
}

/** 从绝对文件路径反推 id（posix、无扩展名） */
function idFromFilePath(filePath: string): string {
	const rel = path.relative(postsRoot(), filePath).split(path.sep).join("/");
	return rel.replace(EXT_RE, "");
}

function parsePost(content: string): {
	data: Record<string, unknown>;
	body: string;
} {
	const parsed = matter(content);
	return { data: parsed.data, body: parsed.content };
}

/** 把 frontmatter 数据规整为可写回 YAML 的干净对象 */
function sanitizeFrontmatter(
	data: Record<string, unknown>,
): Record<string, unknown> {
	const clean: Record<string, unknown> = {};
	for (const key of FRONTMATTER_FIELDS) {
		const value = data[key];
		if (value === undefined || value === null || value === "") continue;
		if (key === "published" || key === "updated") {
			clean[key] = toDateString(value);
			continue;
		}
		if (key === "seriesOrder" && typeof value !== "number") continue;
		if (key === "tags" && Array.isArray(value)) {
			const tags = value.filter(
				(t): t is string => typeof t === "string" && t.trim() !== "",
			);
			if (tags.length > 0) clean[key] = tags;
			continue;
		}
		clean[key] = value;
	}
	if (!clean.published) clean.published = todayString();
	if (!clean.title) clean.title = "未命名文章";
	return clean;
}

function toMeta(
	filePath: string,
	data: Record<string, unknown>,
	body: string,
	mtimeMs: number,
): PostMeta {
	return {
		id: idFromFilePath(filePath),
		relPath: path.relative(postsRoot(), filePath).split(path.sep).join("/"),
		title: typeof data.title === "string" ? data.title : "未命名文章",
		draft: data.draft === true,
		published: toDateString(data.published),
		updated: toDateString(data.updated),
		description: typeof data.description === "string" ? data.description : "",
		image: typeof data.image === "string" ? data.image : "",
		tags: Array.isArray(data.tags)
			? data.tags.filter((t): t is string => typeof t === "string")
			: [],
		category: typeof data.category === "string" ? data.category : "",
		pinned: data.pinned === true,
		series: typeof data.series === "string" ? data.series : "",
		encrypted: typeof data.password === "string" && data.password !== "",
		wordCount: countWords(body),
		mtimeMs,
	};
}

/** 列出全部文章（元数据） */
export async function listPostFiles(): Promise<PostMeta[]> {
	const root = postsRoot();
	await fs.mkdir(root, { recursive: true });
	const files = await glob("**/*.{md,mdx}", { cwd: root, nodir: true });
	const metas: PostMeta[] = [];
	for (const rel of files) {
		const full = path.join(root, rel);
		try {
			const [content, stat] = await Promise.all([
				fs.readFile(full, "utf-8"),
				fs.stat(full),
			]);
			const { data, body } = parsePost(content);
			metas.push(toMeta(full, data, body, stat.mtimeMs));
		} catch {
			/* 跳过读取失败的文件 */
		}
	}
	metas.sort((a, b) => {
		const da = Date.parse(a.published) || 0;
		const db = Date.parse(b.published) || 0;
		if (db !== da) return db - da;
		return b.mtimeMs - a.mtimeMs;
	});
	return metas;
}

async function readPost(filePath: string): Promise<{
	data: Record<string, unknown>;
	body: string;
}> {
	const content = await fs.readFile(filePath, "utf-8");
	return parsePost(content);
}

function writePost(
	filePath: string,
	body: string,
	data: Record<string, unknown>,
): Promise<void> {
	const output = matter.stringify(body, sanitizeFrontmatter(data));
	return atomicWrite(filePath, output);
}

/* ── 路由 ──────────────────────────────────────────────── */

export function createPostsModule(): Hono {
	const app = new Hono();

	// 列表（支持 ?q= 搜索、?status=draft|published|all）
	app.get("/", async (c) => {
		const q = (c.req.query("q") ?? "").trim().toLowerCase();
		const status = c.req.query("status") ?? "all";
		let posts = await listPostFiles();
		if (status === "draft") posts = posts.filter((p) => p.draft);
		else if (status === "published") posts = posts.filter((p) => !p.draft);
		if (q) {
			posts = posts.filter((p) =>
				[p.title, p.description, p.category, p.series, ...p.tags]
					.join(" ")
					.toLowerCase()
					.includes(q),
			);
		}
		return c.json({ posts });
	});

	// 可选项（分类/标签/系列），供表单下拉补全
	app.get("/options", async (c) => {
		const posts = await listPostFiles();
		const categories = new Set<string>();
		const tags = new Set<string>();
		const series = new Set<string>();
		for (const p of posts) {
			if (p.category) categories.add(p.category);
			for (const t of p.tags) tags.add(t);
			if (p.series) series.add(p.series);
		}
		return c.json({
			categories: [...categories].sort(),
			tags: [...tags].sort(),
			series: [...series].sort(),
		});
	});

	// 详情（?id= 相对路径，不含扩展名）
	app.get("/detail", async (c) => {
		const id = c.req.query("id") ?? "";
		const filePath = await resolvePostPath(id);
		if (!filePath) return c.json({ error: "文章不存在" }, 404);
		const stat = await fs.stat(filePath);
		const { data, body } = await readPost(filePath);
		return c.json({
			id: idFromFilePath(filePath),
			data,
			body,
			mtimeMs: stat.mtimeMs,
		});
	});

	// 新建
	app.post("/", async (c) => {
		let body: {
			slug?: string;
			title?: string;
			content?: string;
			data?: Record<string, unknown>;
		};
		try {
			body = await c.req.json();
		} catch {
			return c.json({ error: "请求格式错误" }, 400);
		}
		const title =
			typeof body.title === "string" && body.title.trim()
				? body.title.trim()
				: "未命名文章";
		let slug =
			typeof body.slug === "string" && body.slug.trim()
				? normalizeSlug(body.slug)
				: slugFromTitle(title);
		if (!slug) slug = `post-${Date.now()}`;

		const root = postsRoot();
		const filePath = path.join(root, `${slug}.md`);
		try {
			await fs.access(filePath);
			return c.json({ error: `同名文章已存在：${slug}` }, 409);
		} catch {
			/* 不存在，继续 */
		}

		const data: Record<string, unknown> = {
			...((body.data as Record<string, unknown>) ?? {}),
			title,
			published: body.data?.published ?? todayString(),
		};
		const content = typeof body.content === "string" ? body.content : "";

		await fs.mkdir(path.dirname(filePath), { recursive: true });
		await writePost(filePath, content, data);
		return c.json({ ok: true, id: slug });
	});

	// 更新（?id=）
	app.put("/", async (c) => {
		const id = c.req.query("id") ?? "";
		let body: { content?: string; data?: Record<string, unknown> };
		try {
			body = await c.req.json();
		} catch {
			return c.json({ error: "请求格式错误" }, 400);
		}
		const filePath = await resolvePostPath(id);
		if (!filePath) return c.json({ error: "文章不存在" }, 404);

		const existing = await readPost(filePath);
		const nextData: Record<string, unknown> = {
			...existing.data,
			...(body.data ?? {}),
		};
		const nextBody =
			typeof body.content === "string" ? body.content : existing.body;

		// 正文发生变化时自动更新「上次编辑时间」（用户显式填写的 updated 优先）
		if (nextBody !== existing.body && !nextData.updated) {
			nextData.updated = todayString();
		}

		await writePost(filePath, nextBody, nextData);
		return c.json({ ok: true, id: idFromFilePath(filePath) });
	});

	// 发布/下架切换（?id=，body: { draft: boolean }）
	app.post("/publish", async (c) => {
		const id = c.req.query("id") ?? "";
		let reqBody: { draft?: boolean };
		try {
			reqBody = await c.req.json();
		} catch {
			return c.json({ error: "请求格式错误" }, 400);
		}
		const filePath = await resolvePostPath(id);
		if (!filePath) return c.json({ error: "文章不存在" }, 404);
		const post = await readPost(filePath);
		post.data.draft = reqBody.draft !== false;
		await writePost(filePath, post.body, post.data);
		return c.json({ ok: true, draft: post.data.draft });
	});

	// 删除（移入 admin/trash/posts 回收站）
	app.delete("/", async (c) => {
		const id = c.req.query("id") ?? "";
		const filePath = await resolvePostPath(id);
		if (!filePath) return c.json({ error: "文章不存在" }, 404);
		const trashDir = path.join(ADMIN_DIR, "trash", "posts");
		await fs.mkdir(trashDir, { recursive: true });
		const target = path.join(
			trashDir,
			`${Date.now()}-${path.basename(filePath)}`,
		);
		await fs.rename(filePath, target);
		return c.json({ ok: true, trashedTo: path.relative(ADMIN_DIR, target) });
	});

	return app;
}
