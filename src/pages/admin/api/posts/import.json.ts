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
		const formData = await request.formData();
		const file = formData.get("file") as File | null;
		const customPublished = formData.get("published") as string | null;

		if (!file) {
			return new Response(JSON.stringify({ error: "请选择文件" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		if (!file.name.endsWith(".md") && !file.name.endsWith(".mdx")) {
			return new Response(JSON.stringify({ error: "仅支持 .md 或 .mdx 文件" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		const content = await file.text();
		const postsDir = path.resolve(process.cwd(), "src/content/posts");

		// 解析 frontmatter
		const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
		let frontmatter: Record<string, string> = {};
		let body = content;

		if (fmMatch) {
			const fmRaw = fmMatch[1];
			body = fmMatch[2] || "";
			for (const line of fmRaw.split("\n")) {
				const idx = line.indexOf(":");
				if (idx === -1) continue;
				const key = line.slice(0, idx).trim();
				let val = line.slice(idx + 1).trim();
				// 去除引号
				val = val.replace(/^['"]|['"]$/g, "");
				frontmatter[key] = val;
			}
		}

		// 生成 slug
		const rawName = file.name.replace(/\.(md|mdx)$/i, "");
		let slug = rawName
			.toLowerCase()
			.replace(/[^\w\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff-]+/g, "-")
			.replace(/^-+|-+$/g, "")
			|| `imported-${Date.now()}`;

		// 检查是否已存在，追加数字
		let finalSlug = slug;
		let counter = 1;
		while (fs.existsSync(path.join(postsDir, `${finalSlug}.md`))) {
			finalSlug = `${slug}-${counter}`;
			counter++;
		}

		const fileName = `${finalSlug}.md`;
		const filePath = path.join(postsDir, fileName);

		// 如果文件没有 frontmatter，自动生成一个
		if (!fmMatch) {
			const title = frontmatter.title || rawName;
			const publishDate = customPublished || frontmatter.published || new Date().toISOString().split("T")[0];
			const autoFm = `---\ntitle: "${title}"\npublished: ${publishDate}\ndraft: ${frontmatter.draft !== "false"}\n---\n`;
			fs.writeFileSync(filePath, autoFm + body, "utf-8");
		} else if (customPublished) {
			// 有 frontmatter 但用户指定了日期，替换 published 字段
			const updated = content.replace(/^published:.*/m, `published: ${customPublished}`);
			fs.writeFileSync(filePath, updated, "utf-8");
		} else {
			// 直接保存，保留原始 frontmatter
			fs.writeFileSync(filePath, content, "utf-8");
		}

		return new Response(
			JSON.stringify({
				success: true,
				slug: finalSlug,
				fileName,
				title: frontmatter.title || rawName,
				message: "文件导入成功",
			}),
			{
				status: 201,
				headers: { "Content-Type": "application/json" },
			},
		);
	} catch (err) {
		return new Response(
			JSON.stringify({ error: `导入失败: ${String(err)}` }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};
