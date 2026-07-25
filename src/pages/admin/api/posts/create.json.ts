import fs from "node:fs";
import path from "node:path";
import type { APIRoute } from "astro";

export const prerender = false;

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

export const POST: APIRoute = async ({ request }) => {
	if (import.meta.env.PROD) {
		return new Response(JSON.stringify({ error: "管理面板仅限开发环境使用" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		const body = await request.json();
		const { title, content = "", fileName: customFileName } = body;

		if (!title) {
			return new Response(JSON.stringify({ error: "标题不能为空" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		// 生成 slug 和文件名
		let slug = customFileName;
		if (!slug) {
			slug = title
				.toLowerCase()
				// 将 CJK 字符转为拼音风格的占位（保留中文）
				.replace(/[^\w\s\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff-]/g, "")
				.replace(/[\s_]+/g, "-")
				.replace(/^-+|-+$/g, "")
				// 如果 slug 为空（纯中文标题），用日期时间作为 slug
				|| `post-${Date.now()}`;
		}

		// 确定文件扩展名
		const ext = ".md";
		const fileName = `${slug}${ext}`;
		const filePath = path.resolve(process.cwd(), "src/content/posts", fileName);

		if (fs.existsSync(filePath)) {
			return new Response(JSON.stringify({ error: `文件 ${fileName} 已存在` }), {
				status: 409,
				headers: { "Content-Type": "application/json" },
			});
		}

		// 获取今天的日期
		const today = new Date().toISOString().split("T")[0];

		const frontmatterData = {
			title,
			published: body.published || today,
			updated: body.updated || "",
			description: body.description || "",
			image: body.image || "",
			tags: body.tags || [],
			category: body.category || "",
			draft: body.draft !== undefined ? body.draft : true,
			lang: body.lang || "",
			pinned: body.pinned || false,
			author: body.author || "",
			password: body.password || "",
			comment: body.comment !== undefined ? body.comment : true,
		};

		const frontmatter = generateFrontmatter(frontmatterData);
		const fullContent = `${frontmatter}\n${content || ""}\n`;

		fs.writeFileSync(filePath, fullContent, "utf-8");

		return new Response(
			JSON.stringify({ success: true, slug, fileName, message: "文章创建成功" }),
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
