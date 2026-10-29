import fs from "node:fs/promises";
import path from "node:path";
import { Hono } from "hono";
import { adminServer } from "../../admin.config";
import { resolveInRoot } from "../lib/paths";

/**
 * 媒体模块：上传/浏览/删除 public 目录下的图片与音频文件。
 * 默认上传到 public/images/admin/，站点内引用路径为 /images/admin/xxx。
 */

const ALLOWED_EXTENSIONS = [
	".png",
	".jpg",
	".jpeg",
	".webp",
	".avif",
	".gif",
	".svg",
	".mp3",
	".m4a",
	".mp4",
	".webm",
	".lrc",
];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

function mediaRoot(): string {
	return resolveInRoot(adminServer.mediaDir);
}

/** 站点引用 URL：public 下的路径去掉 public 前缀并转 posix */
function toPublicUrl(absPath: string): string {
	const rel = path.relative(resolveInRoot("public"), absPath);
	return `/${rel.split(path.sep).join("/")}`;
}

/** 子目录名净化（只允许安全字符，禁止 .. 与绝对路径） */
function sanitizeDir(dir: string): string {
	const cleaned = (dir || "")
		.replace(/\\/g, "/")
		.split("/")
		.map((seg) => seg.replace(/[^a-zA-Z0-9_-]/g, ""))
		.filter(Boolean)
		.join("/");
	return cleaned;
}

function sanitizeFileName(name: string): string {
	const base = path.basename(name).replace(/[^\w.\-()\u3400-\u9fff]/g, "_");
	return base || `file-${Date.now()}`;
}

async function collectFiles(
	dir: string,
	prefix: string,
): Promise<
	Array<{
		name: string;
		rel: string;
		url: string;
		size: number;
		mtimeMs: number;
	}>
> {
	let entries;
	try {
		entries = await fs.readdir(dir, { withFileTypes: true });
	} catch {
		return [];
	}
	const files: Array<{
		name: string;
		rel: string;
		url: string;
		size: number;
		mtimeMs: number;
	}> = [];
	for (const entry of entries) {
		if (entry.name.startsWith(".")) continue;
		const full = path.join(dir, entry.name);
		const rel = path.posix.join(prefix, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await collectFiles(full, rel)));
			continue;
		}
		const ext = path.extname(entry.name).toLowerCase();
		if (!ALLOWED_EXTENSIONS.includes(ext)) continue;
		try {
			const stat = await fs.stat(full);
			files.push({
				name: entry.name,
				rel,
				url: toPublicUrl(full),
				size: stat.size,
				mtimeMs: stat.mtimeMs,
			});
		} catch {
			/* 跳过 */
		}
	}
	return files;
}

export function createMediaModule(): Hono {
	const app = new Hono();

	// 列表（?dir= 子目录）
	app.get("/", async (c) => {
		const dir = sanitizeDir(c.req.query("dir") ?? "");
		const base = path.join(mediaRoot(), dir);
		const files = await collectFiles(base, dir);
		files.sort((a, b) => b.mtimeMs - a.mtimeMs);
		return c.json({ dir, files });
	});

	// 上传（multipart 表单：file 字段 + dir 字段）
	app.post("/upload", async (c) => {
		let body: Record<string, unknown>;
		try {
			body = await c.req.parseBody();
		} catch {
			return c.json(
				{ error: "上传解析失败（请使用 multipart/form-data）" },
				400,
			);
		}
		const file = body.file;
		if (!(file instanceof File)) {
			return c.json({ error: "缺少 file 文件字段" }, 400);
		}
		const ext = path.extname(file.name).toLowerCase();
		if (!ALLOWED_EXTENSIONS.includes(ext)) {
			return c.json({ error: `不支持的文件类型 ${ext || "(无扩展名)"}` }, 400);
		}
		if (file.size > MAX_FILE_SIZE) {
			return c.json({ error: "文件超过 20MB 限制" }, 413);
		}
		const dir = sanitizeDir(typeof body.dir === "string" ? body.dir : "");
		const targetDir = path.join(mediaRoot(), dir);
		await fs.mkdir(targetDir, { recursive: true });

		let name = sanitizeFileName(file.name);
		let target = path.join(targetDir, name);
		let counter = 1;
		while (true) {
			try {
				await fs.access(target);
				const base = name.replace(ext, "");
				name = `${base}-${counter}${ext}`;
				target = path.join(targetDir, name);
				counter += 1;
			} catch {
				break;
			}
		}
		await fs.writeFile(target, Buffer.from(await file.arrayBuffer()));
		return c.json({
			ok: true,
			name,
			rel: path.posix.join(dir, name),
			url: toPublicUrl(target),
			size: file.size,
		});
	});

	// 删除（?path= 相对 mediaDir 的文件路径）
	app.delete("/", async (c) => {
		const rel = (c.req.query("path") ?? "").replace(/\\/g, "/");
		if (!rel || rel.includes("..")) return c.json({ error: "非法路径" }, 400);
		const target = resolveInRoot(path.posix.join(adminServer.mediaDir, rel));
		try {
			const stat = await fs.stat(target);
			if (!stat.isFile()) return c.json({ error: "只能删除文件" }, 400);
		} catch {
			return c.json({ error: "文件不存在" }, 404);
		}
		await fs.rm(target);
		return c.json({ ok: true });
	});

	return app;
}
