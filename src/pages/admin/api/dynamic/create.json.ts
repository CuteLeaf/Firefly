import fs from "node:fs";
import path from "node:path";
import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	if (import.meta.env.PROD) {
		return new Response(JSON.stringify({ error: "管理面板仅限开发环境使用" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		const body = await request.json();
		const { content = "" } = body;

		const now = new Date();
		const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
		const published = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

		const fileName = `${timestamp}.md`;
		const filePath = path.resolve(process.cwd(), "src/content/dynamic", fileName);

		const frontmatter = `---\npublished: ${published}\npinned: ${body.pinned || false}\n---\n`;
		const fullContent = `${frontmatter}${content}\n`;

		fs.writeFileSync(filePath, fullContent, "utf-8");

		return new Response(
			JSON.stringify({ success: true, slug: timestamp, fileName, message: "动态创建成功" }),
			{
				status: 201,
				headers: { "Content-Type": "application/json" },
			},
		);
	} catch (err) {
		return new Response(
			JSON.stringify({ error: `创建失败: ${String(err)}` }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};
