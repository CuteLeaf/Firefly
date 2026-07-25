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
		const { url } = body as { url?: string };

		if (!url || !url.startsWith("/uploads/")) {
			return new Response(JSON.stringify({ error: "无效的图片路径" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		// 安全检查：防止路径穿越
		const fileName = path.basename(url);
		if (!/^[\w.-]+$/.test(fileName)) {
			return new Response(JSON.stringify({ error: "非法的文件名" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		const filePath = path.resolve(process.cwd(), "public/uploads", fileName);

		if (!fs.existsSync(filePath)) {
			return new Response(JSON.stringify({ error: "文件不存在" }), {
				status: 404,
				headers: { "Content-Type": "application/json" },
			});
		}

		fs.unlinkSync(filePath);

		return new Response(
			JSON.stringify({ success: true, message: "图片已删除" }),
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
