import fs from "node:fs";
import path from "node:path";
import type { APIRoute } from "astro";

export const prerender = false;

interface ParsedSpec {
	name: string;
	fileName: string;
}

export const GET: APIRoute = async () => {
	if (import.meta.env.PROD) {
		return new Response(JSON.stringify({ error: "管理面板仅限开发环境使用" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	const specDir = path.resolve(process.cwd(), "src/content/spec");
	const items: ParsedSpec[] = [];

	if (fs.existsSync(specDir)) {
		const files = fs.readdirSync(specDir);
		for (const file of files) {
			if (!/\.(md|mdx)$/i.test(file)) continue;
			const name = file.replace(/\.(md|mdx)$/i, "");
			items.push({ name, fileName: file });
		}
	}

	return new Response(JSON.stringify(items), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
