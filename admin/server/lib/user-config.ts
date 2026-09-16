import fs from "node:fs/promises";
import path from "node:path";
import { ADMIN_DIR } from "./paths";

/**
 * 用户配置覆盖层（src/config/user-config.json）的读写与差异计算。
 * 语义与站点端 src/config/user-config.ts 的 mergeUserConfig() 保持一致：
 * 覆盖层只保存「与默认值不同」的叶子字段。
 */

/** 覆盖层文件在仓库中的相对路径 */
export const USER_CONFIG_REL = "src/config/user-config.json";

/** 读取覆盖层全部内容 */
export async function readUserConfig(): Promise<Record<string, unknown>> {
	const file = path.resolve(ADMIN_DIR, "../", USER_CONFIG_REL);
	try {
		const raw = await fs.readFile(file, "utf-8");
		const parsed: unknown = JSON.parse(raw);
		return parsed && typeof parsed === "object" && !Array.isArray(parsed)
			? (parsed as Record<string, unknown>)
			: {};
	} catch (err) {
		if ((err as NodeJS.ErrnoException).code === "ENOENT") return {};
		throw err;
	}
}

/** 写入覆盖层（保留未知的顶层键，例如手写的 "//" 注释键） */
export async function writeUserConfig(
	updater: (current: Record<string, unknown>) => Record<string, unknown>,
): Promise<Record<string, unknown>> {
	const file = path.resolve(ADMIN_DIR, "../", USER_CONFIG_REL);
	const current = await readUserConfig();
	const next = updater(current);
	const tmp = `${file}.${process.pid}.tmp`;
	await fs.writeFile(tmp, `${JSON.stringify(next, null, 2)}\n`, "utf-8");
	await fs.rename(tmp, file);
	return next;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return (
		typeof value === "object" &&
		value !== null &&
		!Array.isArray(value) &&
		!(value instanceof Date)
	);
}

function deepEqual(a: unknown, b: unknown): boolean {
	if (a === b) return true;
	if (typeof a !== typeof b) return false;
	if (a === null || b === null) return false;
	if (Array.isArray(a) || Array.isArray(b)) {
		if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
			return false;
		}
		return a.every((item, i) => deepEqual(item, b[i]));
	}
	if (isPlainObject(a) && isPlainObject(b)) {
		const ka = Object.keys(a);
		const kb = Object.keys(b);
		if (ka.length !== kb.length) return false;
		return ka.every((k) => deepEqual(a[k], b[k]));
	}
	return false;
}

/**
 * 计算覆盖值：从「表单提交的完整值」中剥离与默认值相同的部分，得到最小覆盖层。
 * - 对象递归比较；数组与原始值不同则整体保留；
 * - 提交值中不存在于默认值的键会被丢弃（形状守卫，与站点端合并语义一致）。
 */
export function computeOverlay(defaults: unknown, submitted: unknown): unknown {
	if (isPlainObject(defaults) && isPlainObject(submitted)) {
		const overlay: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(submitted)) {
			if (!(key in defaults)) continue; // 未知字段丢弃
			if (deepEqual(defaults[key], value)) continue; // 与默认值相同不保存
			if (isPlainObject(defaults[key]) && isPlainObject(value)) {
				const nested = computeOverlay(defaults[key], value);
				if (nested && Object.keys(nested as object).length > 0) {
					overlay[key] = nested;
				}
			} else {
				overlay[key] = value;
			}
		}
		return Object.keys(overlay).length > 0 ? overlay : null;
	}
	if (Array.isArray(defaults) && Array.isArray(submitted)) {
		return deepEqual(defaults, submitted) ? null : submitted;
	}
	return deepEqual(defaults, submitted) ? null : submitted;
}

/** 合并默认值与覆盖层（与站点端 mergeUserConfig 相同的形状守卫语义） */
export function mergeOverlay(defaults: unknown, overlay: unknown): unknown {
	if (isPlainObject(defaults) && isPlainObject(overlay)) {
		const result: Record<string, unknown> = { ...defaults };
		for (const [key, value] of Object.entries(overlay)) {
			if (!(key in result)) continue;
			result[key] = mergeOverlay(result[key], value);
		}
		return result;
	}
	if (Array.isArray(defaults) && Array.isArray(overlay)) {
		return [...overlay];
	}
	if (defaults !== null && defaults !== undefined && overlay !== null) {
		return typeof defaults === typeof overlay ? overlay : defaults;
	}
	return defaults;
}
