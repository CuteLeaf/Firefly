import fs from "node:fs";
import path from "node:path";
import type { APIRoute } from "astro";

export const prerender = false;

function parseFrontmatter(content: string): Record<string, unknown> {
	const match = content.match(/^---\n([\s\S]*?)\n---\n/);
	if (!match) return {};

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

	return fm;
}

export const GET: APIRoute = async () => {
	if (import.meta.env.PROD) {
		return new Response(JSON.stringify({ error: "管理面板仅限开发环境使用" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	const postsDir = path.resolve(process.cwd(), "src/content/posts");
	const dynamicDir = path.resolve(process.cwd(), "src/content/dynamic");
	const specDir = path.resolve(process.cwd(), "src/content/spec");

	let totalPosts = 0;
	let publishedPosts = 0;
	let draftPosts = 0;
	const allTags = new Set<string>();
	const allCategories = new Set<string>();
	const recentPosts: Array<{ slug: string; title: string; published: string; draft: boolean }> = [];

	function walkPosts(dir: string) {
		if (!fs.existsSync(dir)) return;
		const entries = fs.readdirSync(dir, { withFileTypes: true });
		for (const entry of entries) {
			const fullPath = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				walkPosts(fullPath);
			} else if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) {
				const content = fs.readFileSync(fullPath, "utf-8");
				const fm = parseFrontmatter(content);
				totalPosts++;
				if (fm.draft) draftPosts++;
				else publishedPosts++;

				if (Array.isArray(fm.tags)) {
					for (const tag of fm.tags) allTags.add(String(tag));
				}
				if (fm.category) allCategories.add(String(fm.category));

				const relPath = path.relative(postsDir, fullPath);
				const slug = relPath.replace(/\\/g, "/").replace(/\.(md|mdx)$/i, "");
				recentPosts.push({
					slug,
					title: (fm.title as string) || slug,
					published: (fm.published as string) || "",
					draft: !!fm.draft,
				});
			}
		}
	}

	walkPosts(postsDir);

	// 最近5篇文章
	recentPosts.sort((a, b) => (b.published || "").localeCompare(a.published || ""));
	const topRecent = recentPosts.slice(0, 5);

	// 动态数量
	let totalDynamics = 0;
	if (fs.existsSync(dynamicDir)) {
		totalDynamics = fs.readdirSync(dynamicDir).filter((f) => /\.md$/i.test(f)).length;
	}

	// 单页数量
	let totalSpecs = 0;
	if (fs.existsSync(specDir)) {
		totalSpecs = fs.readdirSync(specDir).filter((f) => /\.(md|mdx)$/i.test(f)).length;
	}

	return new Response(
		JSON.stringify({
			totalPosts,
			publishedPosts,
			draftPosts,
			totalDynamics,
			totalSpecs,
			totalTags: allTags.size,
			totalCategories: allCategories.size,
			recentPosts: topRecent,
		}),
		{
			status: 200,
			headers: { "Content-Type": "application/json" },
		},
	);
};
