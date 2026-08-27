import type { SiteConfig } from "@/types/siteConfig";

// 页面开关的环境变量覆盖工具
// 把「环境变量开启/关闭页面」的逻辑收敛在这里，让 siteConfig.ts 保持纯配置

const TRUTHY_VALUES = ["true", "1", "on", "yes", "enable", "enabled"];
const FALSY_VALUES = ["false", "0", "off", "no", "disable", "disabled"];

// 解析布尔类型的环境变量，返回 undefined 表示未设置或取值无法识别
function parseBooleanEnv(raw: unknown): boolean | undefined {
	if (typeof raw !== "string") return undefined;
	const value = raw.trim().toLowerCase();
	if (TRUTHY_VALUES.includes(value)) return true;
	if (FALSY_VALUES.includes(value)) return false;
	return undefined;
}

// 读取页面开关环境变量：PUBLIC_PAGES_<KEY>=true/false，KEY 为 pages 里的键名大写
// 页面与构建脚本走 Vite/Astro，import.meta.env 会被静态替换成具体值；
// 构建脚本（scripts/*.ts 用 tsx 在 Node 里跑）没有 import.meta.env，回退读 process.env
function readPageEnv(key: string): unknown {
	const envKey = `PUBLIC_PAGES_${key.toUpperCase()}`;
	try {
		return (import.meta.env as Record<string, unknown>)[envKey];
	} catch {
		return typeof process === "undefined" ? undefined : process.env[envKey];
	}
}

// 应用页面开关的环境变量覆盖：PUBLIC_PAGES_<KEY> 优先于 siteConfig.pages.<KEY>
// 这样在部署平台（Vercel / Cloudflare 等）配置环境变量即可开启/关闭页面，无需修改配置文件
// 变量名必须带 PUBLIC_ 前缀，否则不会注入到浏览器端
export function resolvePageToggles(
	pages: SiteConfig["pages"],
): SiteConfig["pages"] {
	const result = { ...pages };
	for (const key of Object.keys(result) as (keyof SiteConfig["pages"])[]) {
		const parsed = parseBooleanEnv(readPageEnv(key));
		if (parsed !== undefined) {
			result[key] = parsed;
		}
	}
	return result;
}
