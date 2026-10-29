import path from "node:path";
import { fileURLToPath } from "node:url";

/** admin/server/lib/paths.ts 所在目录 → admin/server/lib */
const here = path.dirname(fileURLToPath(import.meta.url));

/** 仓库根目录（admin/server/lib → 上三级） */
export const REPO_ROOT = path.resolve(here, "../../..");

/** 后台目录 */
export const ADMIN_DIR = path.resolve(REPO_ROOT, "admin");

/** 将相对路径解析到仓库根目录下，并确保不越出根目录（防目录穿越） */
export function resolveInRoot(rel: string): string {
	const abs = path.resolve(REPO_ROOT, rel);
	if (!abs.startsWith(REPO_ROOT + path.sep) && abs !== REPO_ROOT) {
		throw new Error(`路径越界：${rel}`);
	}
	return abs;
}

/** 将相对路径解析到指定基准目录下，并确保不越出基准目录 */
export function resolveIn(baseDir: string, rel: string): string {
	const abs = path.resolve(baseDir, rel);
	if (!abs.startsWith(baseDir + path.sep) && abs !== baseDir) {
		throw new Error(`路径越界：${rel}`);
	}
	return abs;
}
