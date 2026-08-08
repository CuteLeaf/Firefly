import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { siteConfig } from "../src/config";
import type { VndbUlistEntry } from "../src/types/vndb";
import { fetchVndbUlist } from "../src/utils/vndb-utils";

const OUTPUT_DIR = "public/vndb-covers";
const COVER_WIDTH = 400;
const CONCURRENCY = 4;
const REQUEST_DELAY = 100;
const MAX_TOTAL = 1000;

async function exists(filePath: string): Promise<boolean> {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

async function fetchAllItems(
	apiUrl: string,
	userId: string,
	apiToken: string,
): Promise<VndbUlistEntry[]> {
	const allItems: VndbUlistEntry[] = [];
	let page = 1;

	while (true) {
		if (allItems.length >= MAX_TOTAL) break;
		const data = await fetchVndbUlist({
			apiUrl,
			userId,
			apiToken,
			results: 100,
			page,
		});
		allItems.push(...data.results);
		if (!data.more || data.results.length === 0) break;
		page += 1;
		await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY));
	}

	return allItems;
}

async function downloadCover(item: VndbUlistEntry): Promise<boolean> {
	const remoteUrl = item.vn?.image?.thumbnail || item.vn?.image?.url;
	if (!remoteUrl) return false;

	const localPath = path.join(OUTPUT_DIR, `${item.id}.webp`);
	if (await exists(localPath)) return false;

	try {
		const response = await fetch(remoteUrl, {
			signal: AbortSignal.timeout(20000),
		});
		if (!response.ok) {
			console.warn(`[VNDB] 封面下载失败 ${item.id}: HTTP ${response.status}`);
			return false;
		}
		const buffer = Buffer.from(await response.arrayBuffer());
		await sharp(buffer)
			.rotate()
			.resize({ width: COVER_WIDTH, withoutEnlargement: true })
			.webp({ quality: 82, effort: 4 })
			.toFile(localPath);
		return true;
	} catch (error) {
		console.warn(`[VNDB] 封面处理失败 ${item.id}:`, error);
		return false;
	}
}

async function mapLimit<T>(
	items: T[],
	limit: number,
	worker: (item: T, index: number) => Promise<boolean>,
): Promise<boolean[]> {
	const results: boolean[] = new Array(items.length);
	let index = 0;
	const workers = Array.from(
		{ length: Math.min(limit, items.length) },
		async () => {
			while (index < items.length) {
				const current = index;
				index += 1;
				results[current] = await worker(items[current], current);
			}
		},
	);
	await Promise.all(workers);
	return results;
}

async function main() {
	const config = siteConfig.vndb;
	const userId = config?.userId?.trim();
	if (!userId || userId === "you-user-id") {
		console.log("[VNDB] 未配置用户 ID，跳过封面下载");
		return;
	}
	if (!config?.downloadCovers) {
		console.log("[VNDB] downloadCovers 未开启，跳过封面下载");
		return;
	}
	if ((config.mode || "static") !== "static") {
		console.log("[VNDB] dynamic 模式不支持本地封面，跳过下载");
		return;
	}

	await fs.mkdir(OUTPUT_DIR, { recursive: true });
	const items = await fetchAllItems(
		config.apiUrl || "https://api.vndb.org/kana",
		userId,
		config.apiToken || "",
	);
	const results = await mapLimit(items, CONCURRENCY, async (item, index) => {
		const result = await downloadCover(item);
		if (index % 5 === 0 || index === items.length - 1) {
			console.log(
				`[VNDB] 封面处理进度 ${index + 1}/${items.length} (${item.id})`,
			);
		}
		return result;
	});
	const downloaded = results.filter(Boolean).length;
	const skipped = results.length - downloaded;
	console.log(
		`[VNDB] 封面处理完成: 共 ${results.length} 个条目, 新下载 ${downloaded}, 已缓存 ${skipped}`,
	);
}

main();
