import fs from "node:fs";
import path from "node:path";
import type { APIRoute } from "astro";

interface NavLinkItem {
	key: string;
	name: string;
	url: string;
	icon: string;
	pageKey?: string;
}

export const GET: APIRoute = async () => {
	if (import.meta.env.PROD) {
		return new Response(JSON.stringify({ error: "管理面板仅限开发环境使用" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	const configPath = path.resolve(process.cwd(), "src/config/navBarConfig.ts");

	try {
		const fileUrl = `file:///${configPath.replace(/\\/g, "/")}`;
		const module = await import(/* @vite-ignore */ fileUrl);
		const presets: Record<string, unknown> = module.LinkPresets || {};
		const content = fs.readFileSync(configPath, "utf-8");

		const items: NavLinkItem[] = [];
		for (const [key, val] of Object.entries(presets)) {
			if (val && typeof val === "object") {
				const v = val as Record<string, string>;
				items.push({
					key,
					name: v.name || key,
					url: v.url || "/",
					icon: v.icon || "",
					pageKey: v.pageKey,
				});
			}
		}

		return new Response(JSON.stringify({ items, fileContent: content }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: String(err) }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};

export const PUT: APIRoute = async ({ request }) => {
	if (import.meta.env.PROD) {
		return new Response(JSON.stringify({ error: "管理面板仅限开发环境使用" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		const body = await request.json();
		const { key, name, url } = body as { key: string; name?: string; url?: string };

		if (!key) {
			return new Response(JSON.stringify({ error: "缺少 key 参数" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		const configPath = path.resolve(process.cwd(), "src/config/navBarConfig.ts");
		let content = fs.readFileSync(configPath, "utf-8");

		// 找到 LinkPresets 中对应 key 的对象并替换 name 和 url
		// 匹配模式: Key: { ... name: "旧值" ... url: "旧值" ... }
		if (name !== undefined) {
			const nameRegex = new RegExp(`(${key}\\s*:\\s*\\{[^}]*?name\\s*:\\s*")[^"]*(")`, "s");
			content = content.replace(nameRegex, `$1${name.replace(/"/g, '\\"')}$2`);
		}
		if (url !== undefined) {
			const urlRegex = new RegExp(`(${key}\\s*:\\s*\\{[^}]*?url\\s*:\\s*")[^"]*(")`, "s");
			content = content.replace(urlRegex, `$1${url.replace(/"/g, '\\"')}$2`);
		}

		fs.writeFileSync(configPath, content, "utf-8");

		return new Response(JSON.stringify({ success: true, message: "导航链接已更新" }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: `更新失败: ${String(err)}` }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};

export const prerender = false;
