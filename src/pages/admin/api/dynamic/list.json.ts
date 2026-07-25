import fs from "node:fs";
import path from "node:path";
import type { APIRoute } from "astro";

export const prerender = false;

interface ParsedDynamic {
	slug: string;
	published: string;
	pinned: boolean;
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

	const dynamicDir = path.resolve(process.cwd(), "src/content/dynamic");
	const items: ParsedDynamic[] = [];

	if (fs.existsSync(dynamicDir)) {
		const files = fs.readdirSync(dynamicDir);
		for (const file of files) {
			if (!/\.md$/i.test(file)) continue;
			const content = fs.readFileSync(path.join(dynamicDir, file), "utf-8");
			const { frontmatter } = parseFrontmatter(content);
			const slug = file.replace(/\.md$/i, "");

			items.push({
				slug,
				fileName: file,
				published: (frontmatter.published as string) || "",
				pinned: (frontmatter.pinned as boolean) || false,
			});
		}
	}

	items.sort((a, b) => (b.published || "").localeCompare(a.published || ""));

	return new Response(JSON.stringify(items), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
