import fs from "node:fs";
import path from "node:path";
import type { APIRoute } from "astro";

export const prerender = false;

interface FriendLink {
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
	tags: string[];
	weight: number;
	enabled: boolean;
}

function stringifyFriends(friends: FriendLink[]): string {
	let out = "export const friendsConfig: FriendLink[] = [\n";
	for (const f of friends) {
		out += "	{\n";
		out += `		title: "${f.title.replace(/"/g, '\\"')}",\n`;
		out += `		imgurl: "${f.imgurl.replace(/"/g, '\\"')}",\n`;
		out += `		desc: "${f.desc.replace(/"/g, '\\"')}",\n`;
		out += `		siteurl: "${f.siteurl.replace(/"/g, '\\"')}",\n`;
		out += `		tags: [${f.tags.map((t) => `"${t.replace(/"/g, '\\"')}"`).join(", ")}],\n`;
		out += `		weight: ${f.weight},\n`;
		out += `		enabled: ${f.enabled},\n`;
		out += "	},\n";
	}
	out += "];\n";
	return out;
}

export const GET: APIRoute = async () => {
	if (import.meta.env.PROD) {
		return new Response(JSON.stringify({ error: "管理面板仅限开发环境使用" }), { status: 404 });
	}

	const configPath = path.resolve(process.cwd(), "src/config/friendsConfig.ts");
	try {
		const fileUrl = `file:///${configPath.replace(/\\/g, "/")}`;
		const mod = await import(/* @vite-ignore */ fileUrl);
		const friends: FriendLink[] = mod.friendsConfig || [];
		const pageConfig = mod.friendsPageConfig || {};
		return new Response(
			JSON.stringify({ friends, pageConfig }),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);
	} catch (err) {
		return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
	}
};

export const PUT: APIRoute = async ({ request }) => {
	if (import.meta.env.PROD) {
		return new Response(JSON.stringify({ error: "管理面板仅限开发环境使用" }), { status: 404 });
	}

	try {
		const body = await request.json();
		const { friends, pageConfig } = body as { friends?: FriendLink[]; pageConfig?: Record<string, unknown> };

		if (!Array.isArray(friends)) {
			return new Response(JSON.stringify({ error: "缺少 friends 数组" }), { status: 400 });
		}

		const configPath = path.resolve(process.cwd(), "src/config/friendsConfig.ts");
		let content = fs.readFileSync(configPath, "utf-8");

		// 替换 friendsConfig 数组
		const arrayRegex = /export const friendsConfig: FriendLink\[\] = \[[\s\S]*?\];/;
		const newFriendsStr = stringifyFriends(friends);
		content = content.replace(arrayRegex, newFriendsStr);

		// 如果有 pageConfig 更新
		if (pageConfig) {
			for (const [key, val] of Object.entries(pageConfig)) {
				if (key === "title" || key === "description" || key === "showCustomContent" || key === "showComment" || key === "randomizeSort") {
					const strVal = typeof val === "boolean" ? (val ? "true" : "false") : `"${String(val).replace(/"/g, '\\"')}"`;
					const re = new RegExp(`(\\b${key}\\s*:\\s*).*?(,|\\n)`);
					content = content.replace(re, `$1${strVal}$2`);
				}
			}
		}

		fs.writeFileSync(configPath, content, "utf-8");
		return new Response(
			JSON.stringify({ success: true, message: "友链已更新" }),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);
	} catch (err) {
		return new Response(JSON.stringify({ error: `更新失败: ${String(err)}` }), { status: 500 });
	}
};
