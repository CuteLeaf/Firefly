import fs from "node:fs";
import path from "node:path";
import type { APIRoute } from "astro";

// 可编辑的配置文件和对应的可配置字段
const CONFIG_META: Record<string, {
	label: string;
	file: string;
	exportName: string;
	fields: Record<string, { label: string; type: "string" | "boolean" | "number" | "string[]" | "text"; path?: string[]; comment?: string }>;
}> = {
	profile: {
		label: "个人资料",
		file: "src/config/profileConfig.ts",
		exportName: "profileConfig",
		fields: {
			avatar: { label: "头像路径", type: "string", comment: "支持 public(/开头) 或 src 目录路径，或远程 URL" },
			name: { label: "名字", type: "string" },
			bio: { label: "个人签名", type: "text" },
		},
	},
	comment: {
		label: "评论系统",
		file: "src/config/commentConfig.ts",
		exportName: "commentConfig",
		fields: {
			type: { label: "评论提供商", type: "string", comment: "none | twikoo | waline | giscus | disqus | artalk" },
			"giscus.repo": { label: "GitHub 仓库 (giscus)", type: "string", path: ["giscus", "repo"] },
			"giscus.repoId": { label: "Repo ID (giscus)", type: "string", path: ["giscus", "repoId"] },
			"giscus.category": { label: "Category (giscus)", type: "string", path: ["giscus", "category"] },
			"giscus.categoryId": { label: "Category ID (giscus)", type: "string", path: ["giscus", "categoryId"] },
			"twikoo.envId": { label: "Twikoo 环境 ID", type: "string", path: ["twikoo", "envId"] },
			"waline.serverURL": { label: "Waline 服务器地址", type: "string", path: ["waline", "serverURL"] },
		},
	},
	analytics: {
		label: "网站统计",
		file: "src/config/analyticsConfig.ts",
		exportName: "analyticsConfig",
		fields: {
			googleAnalyticsId: { label: "Google Analytics ID", type: "string" },
			microsoftClarityId: { label: "Microsoft Clarity ID", type: "string" },
			"umami.websiteId": { label: "Umami Website ID", type: "string", path: ["umamiAnalytics", "websiteId"] },
			"umami.scriptUrl": { label: "Umami JS 地址", type: "string", path: ["umamiAnalytics", "scriptUrl"] },
		},
	},
	announcement: {
		label: "公告",
		file: "src/config/announcementConfig.ts",
		exportName: "announcementConfig",
		fields: {
			title: { label: "公告标题", type: "string" },
			content: { label: "公告内容", type: "text" },
			closable: { label: "允许关闭", type: "boolean" },
			"link.text": { label: "链接文本", type: "string", path: ["link", "text"] },
			"link.url": { label: "链接 URL", type: "string", path: ["link", "url"] },
			"link.enable": { label: "启用链接", type: "boolean", path: ["link", "enable"] },
		},
	},
	music: {
		label: "音乐播放器",
		file: "src/config/musicConfig.ts",
		exportName: "musicPlayerConfig",
		fields: {
			showInNavbar: { label: "导航栏显示入口", type: "boolean" },
			showInSidebar: { label: "侧边栏显示", type: "boolean" },
			mode: { label: "音乐源", type: "string", comment: "meting (在线) 或 local (本地)" },
			server: { label: "音乐平台", type: "string", path: ["meting", "server"], comment: "netease | tencent | kugou | xiami | baidu" },
			type: { label: "歌单类型", type: "string", path: ["meting", "type"], comment: "playlist | song | album | search | artist" },
			id: { label: "歌单/音乐 ID", type: "string", path: ["meting", "id"] },
			volume: { label: "默认音量", type: "number", path: ["volume"], comment: "0-1 之间" },
			playMode: { label: "播放模式", type: "string", comment: "list | one | random" },
			showLyrics: { label: "显示歌词", type: "boolean" },
		},
	},
};

// 从模块导入获取值（优先），兜底用文本解析
async function readConfig(name: string): Promise<{ values: Record<string, unknown>; content: string } | null> {
	const meta = CONFIG_META[name];
	if (!meta) return null;

	const configPath = path.resolve(process.cwd(), meta.file);
	if (!fs.existsSync(configPath)) return null;

	const content = fs.readFileSync(configPath, "utf-8");
	const values: Record<string, unknown> = {};

	// 尝试用动态 import 获取实际对象值
	try {
		// 转成 file:// URL 以支持 Windows 路径
		const fileUrl = `file:///${configPath.replace(/\\/g, "/")}`;
		const module = await import(/* @vite-ignore */ fileUrl);
		const exportValue = module[meta.exportName];
		if (exportValue && typeof exportValue === "object") {
			for (const [key, field] of Object.entries(meta.fields)) {
				if (field.path && field.path.length > 0) {
					// 嵌套路径：如 ["giscus", "repo"]
					let val: unknown = exportValue;
					for (const p of field.path) {
						if (val && typeof val === "object") val = (val as Record<string, unknown>)[p];
						else { val = undefined; break; }
					}
					values[key] = val ?? "";
				} else {
					values[key] = (exportValue as Record<string, unknown>)[key] ?? "";
				}
			}
			return { values, content };
		}
	} catch (e) {
		// fall through to text parsing
	}

	// 兜底：用正则从文件文本中提取字段值
	for (const [key, field] of Object.entries(meta.fields)) {
		const searchKey = field.path ? field.path[field.path.length - 1] : key;
		const strVal = extractValue(content, searchKey);
		if (strVal !== undefined) {
			values[key] = parseValue(strVal, field.type);
		}
	}

	return { values, content };
}

// 从 TypeScript 文件文本中提取 key 的值（含注释的简单解析）
function extractValue(content: string, key: string): string | undefined {
	// 匹配 key: value  或 key: "value" 或 key: 'value'
	const regex = new RegExp(`\\b${key}\\s*:\\s*(.*?)(?:,|\\n)`, "s");
	const match = content.match(regex);
	return match?.[1]?.trim();
}

function parseValue(str: string, type: string): unknown {
	switch (type) {
		case "boolean":
			return str === "true";
		case "number":
			return Number(str);
		case "string[]": {
			const m = str.match(/\[(.*?)\]/s);
			if (!m) return [];
			return m[1].split(",").map((s) => s.trim().replace(/^['"]|['"]$/g, "")).filter(Boolean);
		}
		default:
			return str.replace(/^['"]|['"]$/g, "");
	}
}

// ===== 写入配置（正则替换保留原格式） =====
function serializeValue(value: unknown, type: string): string {
	switch (type) {
		case "boolean":
			return value ? "true" : "false";
		case "number":
			return String(value);
		case "string[]":
			if (Array.isArray(value)) {
				return `[${value.map((v) => `"${v}"`).join(", ")}]`;
			}
			return "[]";
		case "text":
			return `"${String(value).replace(/"/g, '\\"')}"`;
		default:
			// string: 用引号括起来
			return `"${String(value).replace(/"/g, '\\"')}"`;
	}
}

function writeConfig(name: string, updates: Record<string, unknown>): boolean {
	const meta = CONFIG_META[name];
	if (!meta) return false;

	const configPath = path.resolve(process.cwd(), meta.file);
	if (!fs.existsSync(configPath)) return false;

	let content = fs.readFileSync(configPath, "utf-8");
	let changed = false;

	for (const [key, value] of Object.entries(updates)) {
		const field = meta.fields[key];
		if (!field) continue;

		const serialized = serializeValue(value, field.type);
		// 对于嵌套路径，用路径最后一段作为搜索 key
		const searchKey = field.path ? field.path[field.path.length - 1] : key;
		const regex = new RegExp(`(\\b${searchKey}\\s*:\\s*).*?(,|\\n)`, "");
		const match = content.match(regex);
		if (match) {
			content = content.replace(regex, `$1${serialized}$2`);
			changed = true;
		}
	}

	if (changed) {
		fs.writeFileSync(configPath, content, "utf-8");
	}

	return changed;
}

export const GET: APIRoute = async ({ params }) => {
	if (import.meta.env.PROD) {
		return new Response(JSON.stringify({ error: "管理面板仅限开发环境使用" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	const { name } = params;
	if (!name || !CONFIG_META[name]) {
		return new Response(JSON.stringify({ error: "不支持的配置项", available: Object.keys(CONFIG_META) }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	const result = await readConfig(name);
	if (!result) {
		return new Response(JSON.stringify({ error: "读取配置失败" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}

	return new Response(
		JSON.stringify({
			name,
			label: CONFIG_META[name].label,
			fields: CONFIG_META[name].fields,
			values: result.values,
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

	const { name } = params;
	if (!name || !CONFIG_META[name]) {
		return new Response(JSON.stringify({ error: "不支持的配置项" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		const body = await request.json();
		const { values } = body;

		if (!values || typeof values !== "object") {
			return new Response(JSON.stringify({ error: "缺少 values 字段" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		const changed = writeConfig(name, values as Record<string, unknown>);

		return new Response(
			JSON.stringify({
				success: true,
				changed,
				message: changed ? "配置已更新" : "无需更改",
			}),
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

export const prerender = false;
