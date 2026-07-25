import fs from "node:fs";
import path from "node:path";
import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async () => {
	if (import.meta.env.PROD) {
		return new Response(JSON.stringify({ error: "管理面板仅限开发环境使用" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	const uploadDir = path.resolve(process.cwd(), "public/uploads");
	const images: Array<{ fileName: string; url: string; size: number; date: string }> = [];

	if (fs.existsSync(uploadDir)) {
		const files = fs.readdirSync(uploadDir);
		for (const file of files) {
			if (!/\.(png|jpg|jpeg|gif|webp|avif)$/i.test(file)) continue;
			const stat = fs.statSync(path.join(uploadDir, file));
			images.push({
				fileName: file,
				url: `/uploads/${file}`,
				size: stat.size,
				date: stat.mtime.toISOString(),
			});
		}
	}

	// 按时间降序
	images.sort((a, b) => b.date.localeCompare(a.date));

	return new Response(JSON.stringify(images), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
