import fs from "node:fs";
import path from "node:path";
import type { APIRoute } from "astro";

export const prerender = false;

interface ParsedPost {
	slug: string;
	title: string;
	published: string;
	updated?: string;
	draft: boolean;
	description: string;
	tags: string[];
	category: string;
	pinned: boolean;
	image: string;
	lang: string;
	author: string;
	password: string;
	comment: boolean;
	fileName: string;
}

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

export const GET: APIRoute = async () => {
	if (import.meta.env.PROD) {
		return new Response(JSON.stringify({ error: "管理面板仅限开发环境使用" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	const postsDir = path.resolve(process.cwd(), "src/content/posts");
	const posts: ParsedPost[] = [];

	function walkDir(dir: string) {
		const entries = fs.readdirSync(dir, { withFileTypes: true });
		for (const entry of entries) {
			const fullPath = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				walkDir(fullPath);
			} else if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) {
				const content = fs.readFileSync(fullPath, "utf-8");
				const { frontmatter } = parseFrontmatter(content);
				const relPath = path.relative(postsDir, fullPath);
				const fileName = relPath.replace(/\\/g, "/");
				const slug = fileName.replace(/\.(md|mdx)$/i, "");

				posts.push({
					slug,
					fileName,
					title: (frontmatter.title as string) || slug,
					published: (frontmatter.published as string) || "",
					updated: frontmatter.updated as string | undefined,
					draft: (frontmatter.draft as boolean) || false,
					description: (frontmatter.description as string) || "",
					tags: (frontmatter.tags as string[]) || [],
					category: (frontmatter.category as string) || "",
					pinned: (frontmatter.pinned as boolean) || false,
					image: (frontmatter.image as string) || "",
					lang: (frontmatter.lang as string) || "",
					author: (frontmatter.author as string) || "",
					password: (frontmatter.password as string) || "",
					comment: frontmatter.comment !== false,
				});
			}
		}
	}

	walkDir(postsDir);

	// 按发布时间降序排列
	posts.sort((a, b) => (b.published || "").localeCompare(a.published || ""));

	return new Response(JSON.stringify(posts), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
