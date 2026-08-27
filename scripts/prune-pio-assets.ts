// 看板娘资源裁剪构建后脚本
// public/pio/ 下的 Live2D / Spine 模型有 15 MiB 左右，而 Astro 会把整个 public/
// 原样拷进 dist/，看板娘开关是关的也一样拷。这里在 astro build 之后按开关删掉
// 用不到的模型、运行时和客户端脚本，避免白白撑大产物体积。

import fs from "node:fs/promises";
import path from "node:path";
import { glob } from "glob";
import { live2dWidgetConfig, spineModelConfig } from "../src/config";
import { resolveSiteRoot } from "./site-root";

// Cloudflare Pages 上产物在 dist/client，本地在 dist，统一对准真实根目录
const DIST_DIR = resolveSiteRoot();

// 看板娘资源根目录（相对 dist/），两种看板娘都关掉时整个删掉
const PIO_ROOT = "pio";
// Live2D 专属资源
const LIVE2D_ASSETS = ["pio/models/live2d"];
// Spine 专属资源：模型 + 本地回退的 spine-player 运行时
const SPINE_ASSETS = ["pio/models/spine", "pio/static"];
// Live2DWidget.astro 的客户端脚本（内联了 l2d-widget，约 650 KiB）。
// 组件没渲染时 Astro 仍会产出这个 chunk，且没有任何 HTML 引用它。
const L2D_CHUNK_GLOB = "_astro/Live2DWidget.astro_astro_type_script*";

/** 递归统计文件或目录占用的字节数，路径不存在则返回 null */
async function sizeOf(target: string): Promise<number | null> {
	let stat: Awaited<ReturnType<typeof fs.stat>>;
	try {
		stat = await fs.stat(target);
	} catch {
		return null;
	}
	if (!stat.isDirectory()) return stat.size;

	const names = await fs.readdir(target);
	let total = 0;
	for (const name of names) {
		total += (await sizeOf(path.join(target, name))) ?? 0;
	}
	return total;
}

/** 删除 dist/ 下的一个路径，返回释放的字节数；路径不存在则返回 null */
async function remove(relPath: string): Promise<number | null> {
	const target = path.join(DIST_DIR, relPath);
	// 空目录/空文件的体积是 0，不能用体积判断存在性，否则会漏删
	const bytes = await sizeOf(target);
	if (bytes === null) return null;

	await fs.rm(target, { recursive: true, force: true });
	console.log(`   ✂ ${relPath} (${(bytes / 1024 / 1024).toFixed(2)} MiB)`);
	return bytes;
}

/** 找出 dist/_astro/ 里 Live2DWidget 的客户端脚本 chunk */
async function findLive2dChunks(): Promise<string[]> {
	// 用 glob 而不是 fs.readdir：目录不存在时它返回空数组，不用额外兜底
	return glob(L2D_CHUNK_GLOB, { cwd: DIST_DIR, posix: true });
}

async function main() {
	const live2dEnabled = live2dWidgetConfig.enable;
	const spineEnabled = spineModelConfig.enable;

	if (live2dEnabled && spineEnabled) {
		console.log(
			"🎎 Live2D + Spine models are both enabled, keeping all pio assets",
		);
		return;
	}

	console.log("🎎 Pruning unused mascot assets in dist/...");

	const targets: string[] = [];
	if (!live2dEnabled && !spineEnabled) {
		// 都没启用，README 之类的杂项也没必要留
		targets.push(PIO_ROOT);
	} else {
		if (!live2dEnabled) targets.push(...LIVE2D_ASSETS);
		if (!spineEnabled) targets.push(...SPINE_ASSETS);
	}
	if (!live2dEnabled) targets.push(...(await findLive2dChunks()));

	let freed = 0;
	let removedCount = 0;
	for (const target of targets) {
		const bytes = await remove(target);
		if (bytes === null) continue;
		freed += bytes;
		removedCount++;
	}

	if (removedCount === 0) {
		console.log("✨ No mascot assets to prune");
		return;
	}
	console.log(
		`✨ Pruned ${removedCount} mascot assets, freed ${(freed / 1024 / 1024).toFixed(2)} MiB`,
	);
}

main().catch((err) => {
	console.error("❌ Failed to prune mascot assets:", err);
	process.exit(1);
});
