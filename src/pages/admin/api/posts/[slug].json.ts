import fs from "node:fs";
import path from "node:path";
import type { APIRoute } from "astro";

export const prerender = false;

function parseFrontmatter(content: string): { frontmatter: Record<string, unknown>; body: string } {
	const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	if (!match) {
		return { frontmatter: {}, body: content };
	}

	const fm: Record<string, unknown> = {};
	for (const line of match[1].split("\n")) {
		const sepIndex = line.indexOf(":");
		if (sepIndex === -1) continue;
		const key = line.slice(0, sepIndex).trim();
		const rawValue = line.slice(sepIndex + 1).trim();

		if (rawValue === "true") fm[key] = true;
		else if (rawValue === "false") fm[key] = false;
		else if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
			fm[key] = rawValue
				.slice(1, -1)
				.split(",")
				.map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
				.filter(Boolean);
		} else {
			fm[key] = rawValue.replace(/^['"]|['"]$/g, "");
		}
	}

	return { frontmatter: fm, body: match[2].trimStart() };
}

function generateFrontmatter(data: Record<string, unknown>): string {
	const lines = ["---"];
	for (const [key, value] of Object.entries(data)) {
		if (value === undefined || value === null || value === "") continue;
		if (key === "content") continue;
		if (Array.isArray(value)) {
			if (value.length === 0) continue;
			lines.push(`${key}: [${value.map((v) => `"${v}"`).join(", ")}]`);
		} else if (typeof value === "boolean") {
			lines.push(`${key}: ${value}`);
		} else if (typeof value === "string" && /^https?:\/\//.test(value)) {
			lines.push(`${key}: ${value}`);
		} else if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
			lines.push(`${key}: ${value}`);
		} else if (typeof value === "string") {
			lines.push(`${key}: '${value.replace(/'/g, "\\'")}'`);
		} else {
			lines.push(`${key}: ${value}`);
		}
	}
	lines.push("---");
	return lines.join("\n");
}

export const GET: APIRoute = async ({ params }) => {
	if (import.meta.env.PROD) {
		return new Response(JSON.stringify({ error: "管理面板仅限开发环境使用" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	const { slug } = params;
	if (!slug) {
		return new Response(JSON.stringify({ error: "缺少 slug 参数" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	const postsDir = path.resolve(process.cwd(), "src/content/posts");

	// 搜索匹配的文件（支持子目录）
	function findFile(dir: string): string | null {
		const entries = fs.readdirSync(dir, { withFileTypes: true });
		for (const entry of entries) {
			const fullPath = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				const found = findFile(fullPath);
				if (found) return found;
			} else if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) {
				const relPath = path.relative(postsDir, fullPath);
				const fileSlug = relPath.replace(/\\/g, "/").replace(/\.(md|mdx)$/i, "");
				if (fileSlug === slug) return fullPath;
			}
		}
		return null;
	}

	const filePath = findFile(postsDir);
	if (!filePath) {
		return new Response(JSON.stringify({ error: "文章不存在" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	const content = fs.readFileSync(filePath, "utf-8");
	const { frontmatter, body } = parseFrontmatter(content);
	const relPath = path.relative(postsDir, filePath);
	const fileName = relPath.replace(/\\/g, "/");

	return new Response(
		JSON.stringify({
			slug,
			fileName,
			title: frontmatter.title || slug,
			published: frontmatter.published || "",
			updated: frontmatter.updated || "",
			draft: frontmatter.draft || false,
			description: frontmatter.description || "",
			tags: frontmatter.tags || [],
			category: frontmatter.category || "",
			pinned: frontmatter.pinned || false,
			image: frontmatter.image || "",
			lang: frontmatter.lang || "",
			author: frontmatter.author || "",
			password: frontmatter.password || "",
			comment: frontmatter.comment !== false,
			content: body,
		}),
		{
			status: 200,
			headers: { "Content-Type": "application/json" },
		},
	);
};

export const PUT: APIRoute = async ({ params, request }) => {
	if (import.meta.env.PROD) {
		return new Response(JSON.stringify({ error: "管理面板仅限开发环境使用" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		const { slug } = params;
		if (!slug) {
			return new Response(JSON.stringify({ error: "缺少 slug 参数" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		const postsDir = path.resolve(process.cwd(), "src/content/posts");

		function findFile(dir: string): string | null {
			const entries = fs.readdirSync(dir, { withFileTypes: true });
			for (const entry of entries) {
				const fullPath = path.join(dir, entry.name);
				if (entry.isDirectory()) {
					const found = findFile(fullPath);
					if (found) return found;
				} else if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) {
					const relPath = path.relative(postsDir, fullPath);
					const fileSlug = relPath.replace(/\\/g, "/").replace(/\.(md|mdx)$/i, "");
					if (fileSlug === slug) return fullPath;
				}
			}
			return null;
		}

		const filePath = findFile(postsDir);
		if (!filePath) {
			return new Response(JSON.stringify({ error: "文章不存在" }), {
				status: 404,
				headers: { "Content-Type": "application/json" },
			});
		}

		const body = await request.json();

		const frontmatterData = {
			title: body.title || slug,
			published: body.published,
			updated: body.updated || new Date().toISOString().split("T")[0],
			description: body.description || "",
			image: body.image || "",
			tags: body.tags || [],
			category: body.category || "",
			draft: body.draft !== undefined ? body.draft : false,
			lang: body.lang || "",
			pinned: body.pinned || false,
			author: body.author || "",
			sourceLink: body.sourceLink || "",
			licenseName: body.licenseName || "",
			licenseUrl: body.licenseUrl || "",
			password: body.password || "",
			passwordHint: body.passwordHint || "",
			comment: body.comment !== undefined ? body.comment : true,
		};

		const frontmatter = generateFrontmatter(frontmatterData);
		const fullContent = `${frontmatter}\n${body.content || ""}\n`;

		fs.writeFileSync(filePath, fullContent, "utf-8");

		return new Response(
			JSON.stringify({ success: true, message: "文章更新成功" }),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			},
		);
	} catch (err) {
		return new Response(
			JSON.stringify({ error: `更新失败: ${String(err)}` }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};

export const DELETE: APIRoute = async ({ params }) => {
	if (import.meta.env.PROD) {
		return new Response(JSON.stringify({ error: "管理面板仅限开发环境使用" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		const { slug } = params;
		if (!slug) {
			return new Response(JSON.stringify({ error: "缺少 slug 参数" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		const postsDir = path.resolve(process.cwd(), "src/content/posts");

		function findFile(dir: string): string | null {
			const entries = fs.readdirSync(dir, { withFileTypes: true });
			for (const entry of entries) {
				const fullPath = path.join(dir, entry.name);
				if (entry.isDirectory()) {
					const found = findFile(fullPath);
					if (found) return found;
				} else if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) {
					const relPath = path.relative(postsDir, fullPath);
					const fileSlug = relPath.replace(/\\/g, "/").replace(/\.(md|mdx)$/i, "");
					if (fileSlug === slug) return fullPath;
				}
			}
			return null;
		}

		const filePath = findFile(postsDir);
		if (!filePath) {
			return new Response(JSON.stringify({ error: "文章不存在" }), {
				status: 404,
				headers: { "Content-Type": "application/json" },
			});
		}

		// 读取文章内容，提取 /uploads/ 图片引用
		const fileContent = fs.readFileSync(filePath, "utf-8");
		const uploadRefs = new Set<string>();
		const imgRegex = /\/uploads\/[^\s)"']+/g;
		for (const match of fileContent.matchAll(imgRegex)) {
			uploadRefs.add(match[0]);
		}
		// 也检查 cover image (frontmatter 中的 image 字段)
		const coverMatch = fileContent.match(/^image:\s*['"]?(\/uploads\/[^\s"']+)/m);
		if (coverMatch) uploadRefs.add(coverMatch[1]);

		// 删除文章文件
		fs.unlinkSync(filePath);

		// 扫描所有其他文章，收集仍在使用的图片
		const usedImages = new Set<string>();
		function scanDir(dir: string) {
			const entries = fs.readdirSync(dir, { withFileTypes: true });
			for (const entry of entries) {
				const full = path.join(dir, entry.name);
				if (entry.isDirectory()) scanDir(full);
				else if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) {
					const c = fs.readFileSync(full, "utf-8");
					for (const m of c.matchAll(imgRegex)) usedImages.add(m[0]);
				}
			}
		}
		scanDir(postsDir);

		// 删除没有被任何文章引用的图片
		const uploadDir = path.resolve(process.cwd(), "public/uploads");
		let deletedCount = 0;
		if (fs.existsSync(uploadDir)) {
			for (const imgUrl of uploadRefs) {
				if (!usedImages.has(imgUrl)) {
					const fileName = path.basename(imgUrl);
					const imgPath = path.join(uploadDir, fileName);
					if (fs.existsSync(imgPath)) {
						fs.unlinkSync(imgPath);
						deletedCount++;
					}
				}
			}
		}

		return new Response(
			JSON.stringify({
				success: true,
				message: "文章已删除",
				cleanedImages: deletedCount > 0 ? `已清理 ${deletedCount} 张无引用的图片` : undefined,
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			},
		);
	} catch (err) {
		return new Response(
			JSON.stringify({ error: `删除失败: ${String(err)}` }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};
