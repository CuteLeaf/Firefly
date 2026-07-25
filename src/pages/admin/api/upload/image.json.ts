import fs from "node:fs";
import path from "node:path";
import type { APIRoute } from "astro";

export const prerender = false;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export const POST: APIRoute = async ({ request }) => {
	if (import.meta.env.PROD) {
		return new Response(JSON.stringify({ error: "管理面板仅限开发环境使用" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		const formData = await request.formData();
		const file = formData.get("image") as File | null;

		if (!file) {
			return new Response(JSON.stringify({ error: "请选择图片文件" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		if (!ALLOWED_TYPES.includes(file.type)) {
			return new Response(
				JSON.stringify({ error: `不支持的图片格式: ${file.type}，支持 jpeg/png/webp/gif/avif` }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		// 限制文件大小 10MB
		if (file.size > 10 * 1024 * 1024) {
			return new Response(JSON.stringify({ error: "图片大小不能超过 10MB" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		// 生成唯一文件名
		const ext = file.name.split(".").pop() || "webp";
		const timestamp = Date.now();
		const randomStr = Math.random().toString(36).slice(2, 8);
		const fileName = `${timestamp}-${randomStr}.${ext}`;

		// 保存到 public/uploads/ 目录
		const uploadDir = path.resolve(process.cwd(), "public/uploads");
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}

		const buffer = Buffer.from(await file.arrayBuffer());
		const filePath = path.join(uploadDir, fileName);
		fs.writeFileSync(filePath, buffer);

		const url = `/uploads/${fileName}`;

		return new Response(
			JSON.stringify({ success: true, url, fileName, message: "上传成功" }),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			},
		);
	} catch (err) {
		return new Response(
			JSON.stringify({ error: `上传失败: ${String(err)}` }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};
