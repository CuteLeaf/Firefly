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
		else fm[key] = rawValue.replace(/^['"]|['"]$/g, "");
	}

	return { frontmatter: fm, body: match[2].trimStart() };
}

export const GET: APIRoute = async ({ params }) => {
	if (import.meta.env.PROD) {
		return new Response(JSON.stringify({ error: "管理面板仅限开发环境使用" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	const { name } = params;
	if (!name) {
		return new Response(JSON.stringify({ error: "缺少 name 参数" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	const specDir = path.resolve(process.cwd(), "src/content/spec");

	function findFile(dir: string): string | null {
		if (!fs.existsSync(dir)) return null;
		const entries = fs.readdirSync(dir, { withFileTypes: true });
		for (const entry of entries) {
			if (!entry.isFile()) continue;
			if (!/\.(md|mdx)$/i.test(entry.name)) continue;
			const entryName = entry.name.replace(/\.(md|mdx)$/i, "");
			if (entryName === name) return path.join(dir, entry.name);
		}
		return null;
	}

	const filePath = findFile(specDir);
	if (!filePath) {
		return new Response(JSON.stringify({ error: "页面不存在" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	const content = fs.readFileSync(filePath, "utf-8");
	const { body } = parseFrontmatter(content);
	const fileName = path.basename(filePath);

	return new Response(
		JSON.stringify({ name, fileName, content: body || content }),
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
		const { name } = params;
		if (!name) {
			return new Response(JSON.stringify({ error: "缺少 name 参数" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		const specDir = path.resolve(process.cwd(), "src/content/spec");

		function findFile(dir: string): string | null {
			if (!fs.existsSync(dir)) return null;
			const entries = fs.readdirSync(dir, { withFileTypes: true });
			for (const entry of entries) {
				if (!entry.isFile()) continue;
				if (!/\.(md|mdx)$/i.test(entry.name)) continue;
				const entryName = entry.name.replace(/\.(md|mdx)$/i, "");
				if (entryName === name) return path.join(dir, entry.name);
			}
			return null;
		}

		const filePath = findFile(specDir);
		if (!filePath) {
			return new Response(JSON.stringify({ error: "页面不存在" }), {
				status: 404,
				headers: { "Content-Type": "application/json" },
			});
		}

		const body = await request.json();

		// 读取原文件保留 frontmatter
		const original = fs.readFileSync(filePath, "utf-8");
		const { frontmatter } = parseFrontmatter(original);

		// 如果有 frontmatter，保留它，只替换 body
		if (Object.keys(frontmatter).length > 0) {
			const fmLines = ["---"];
			for (const [key, value] of Object.entries(frontmatter)) {
				if (typeof value === "boolean") fmLines.push(`${key}: ${value}`);
				else fmLines.push(`${key}: '${String(value)}'`);
			}
			fmLines.push("---");
			const fullContent = `${fmLines.join("\n")}\n${body.content || ""}\n`;
			fs.writeFileSync(filePath, fullContent, "utf-8");
		} else {
			fs.writeFileSync(filePath, body.content || "", "utf-8");
		}

		return new Response(
			JSON.stringify({ success: true, message: "页面更新成功" }),
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
