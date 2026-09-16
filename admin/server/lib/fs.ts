import fs from "node:fs/promises";
import path from "node:path";

/** 原子写入：先写临时文件再重命名，避免写一半崩溃导致文件损坏 */
export async function atomicWrite(
	filePath: string,
	content: string,
): Promise<void> {
	const dir = path.dirname(filePath);
	await fs.mkdir(dir, { recursive: true });
	const tmp = path.join(
		dir,
		`.${path.basename(filePath)}.${process.pid}.${Date.now()}.tmp`,
	);
	try {
		await fs.writeFile(tmp, content, "utf-8");
		await fs.rename(tmp, filePath);
	} catch (err) {
		await fs.rm(tmp, { force: true }).catch(() => {});
		throw err;
	}
}

/** 安全读取 JSON 文件，不存在或损坏时返回 fallback */
export async function readJson<T>(filePath: string, fallback: T): Promise<T> {
	try {
		const raw = await fs.readFile(filePath, "utf-8");
		return JSON.parse(raw) as T;
	} catch (err) {
		if ((err as NodeJS.ErrnoException).code === "ENOENT") return fallback;
		throw err;
	}
}

/** 安全写入 JSON 文件（原子、两空格缩进、末尾换行） */
export async function writeJson(
	filePath: string,
	data: unknown,
): Promise<void> {
	await atomicWrite(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

/** 深比较两个 JSON 值 */
export function deepEqual(a: unknown, b: unknown): boolean {
	if (a === b) return true;
	if (typeof a !== typeof b) return false;
	if (a === null || b === null) return false;
	if (Array.isArray(a) || Array.isArray(b)) {
		if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
			return false;
		}
		return a.every((item, i) => deepEqual(item, b[i]));
	}
	if (typeof a === "object" && typeof b === "object") {
		const ka = Object.keys(a as object);
		const kb = Object.keys(b as object);
		if (ka.length !== kb.length) return false;
		return ka.every((k) =>
			deepEqual(
				(a as Record<string, unknown>)[k],
				(b as Record<string, unknown>)[k],
			),
		);
	}
	return false;
}

/** 判断是否为普通对象 */
export function isPlainObject(
	value: unknown,
): value is Record<string, unknown> {
	return (
		typeof value === "object" &&
		value !== null &&
		!Array.isArray(value) &&
		!(value instanceof Date)
	);
}
