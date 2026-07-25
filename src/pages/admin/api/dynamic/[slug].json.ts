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
		else {
			fm[key] = rawValue.replace(/^['"]|['"]$/g, "");
		}
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

	const { slug } = params;
	if (!slug) {
		return new Response(JSON.stringify({ error: "缺少 slug 参数" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	const dynamicDir = path.resolve(process.cwd(), "src/content/dynamic");
	const filePath = path.join(dynamicDir, `${slug}.md`);

	if (!fs.existsSync(filePath)) {
		return new Response(JSON.stringify({ error: "动态不存在" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	const content = fs.readFileSync(filePath, "utf-8");
	const { frontmatter, body } = parseFrontmatter(content);

	return new Response(
		JSON.stringify({
			slug,
			fileName: `${slug}.md`,
			published: frontmatter.published || "",
			pinned: frontmatter.pinned || false,
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

		const dynamicDir = path.resolve(process.cwd(), "src/content/dynamic");
		const filePath = path.join(dynamicDir, `${slug}.md`);

		if (!fs.existsSync(filePath)) {
			return new Response(JSON.stringify({ error: "动态不存在" }), {
				status: 404,
				headers: { "Content-Type": "application/json" },
			});
		}

		const body = await request.json();
		const published = body.published || new Date().toISOString().replace("T", " ").slice(0, 19);
		const frontmatter = `---\npublished: ${published}\npinned: ${body.pinned || false}\n---\n`;
		const fullContent = `${frontmatter}${body.content || ""}\n`;

		fs.writeFileSync(filePath, fullContent, "utf-8");

		return new Response(
			JSON.stringify({ success: true, message: "动态更新成功" }),
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

		const dynamicDir = path.resolve(process.cwd(), "src/content/dynamic");
		const filePath = path.join(dynamicDir, `${slug}.md`);

		if (!fs.existsSync(filePath)) {
			return new Response(JSON.stringify({ error: "动态不存在" }), {
				status: 404,
				headers: { "Content-Type": "application/json" },
			});
		}

		// 读取内容，提取 /uploads/ 图片引用
		const fileContent = fs.readFileSync(filePath, "utf-8");
		const uploadRefs = new Set<string>();
		for (const m of fileContent.matchAll(/\/uploads\/[^\s)"']+/g)) uploadRefs.add(m[0]);

		fs.unlinkSync(filePath);

		// 扫描所有文章 + 动态，收集仍在使用的图片
		const usedImages = new Set<string>();
		const postsDir = path.resolve(process.cwd(), "src/content/posts");
		function scanDir(dir: string) {
			if (!fs.existsSync(dir)) return;
			for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
				const f = path.join(dir, e.name);
				if (e.isDirectory()) scanDir(f);
				else if (e.isFile() && /\.(md|mdx)$/i.test(e.name))
					for (const m of fs.readFileSync(f, "utf-8").matchAll(/\/uploads\/[^\s)"']+/g)) usedImages.add(m[0]);
			}
		}
		scanDir(postsDir);
		scanDir(dynamicDir);

		const uploadDir = path.resolve(process.cwd(), "public/uploads");
		let cleaned = 0;
		if (fs.existsSync(uploadDir)) {
			for (const imgUrl of uploadRefs) {
				if (!usedImages.has(imgUrl)) {
					const p = path.join(uploadDir, path.basename(imgUrl));
					if (fs.existsSync(p)) { fs.unlinkSync(p); cleaned++; }
				}
			}
		}

		return new Response(
			JSON.stringify({ success: true, message: "动态已删除", cleanedImages: cleaned ? `已清理 ${cleaned} 张图片` : undefined }),
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
