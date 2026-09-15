import { Hono } from "hono";
import fs from "node:fs/promises";
import path from "node:path";
import { adminServer } from "../../admin.config";
import { configSections } from "../lib/config-manifest";
import { REPO_ROOT, resolveInRoot } from "../lib/paths";
import { readUserConfig } from "../lib/user-config";
import { listPostFiles } from "./posts";

/** 仪表盘模块：后台首页的汇总数据 */
export function createDashboardModule(): Hono {
	const app = new Hono();

	app.get("/", async (c) => {
		const overlay = await readUserConfig();
		const savedSections = configSections.filter(
			(section) =>
				overlay[section.key] !== undefined && overlay[section.key] !== null,
		);

		const posts = await listPostFiles();
		const published = posts.filter((p) => !p.draft).length;

		let mediaCount = 0;
		try {
			const mediaDir = resolveInRoot(adminServer.mediaDir);
			const walk = async (dir: string): Promise<void> => {
				for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
					if (entry.name.startsWith(".")) continue;
					const full = path.join(dir, entry.name);
					if (entry.isDirectory()) await walk(full);
					else mediaCount += 1;
				}
			};
			await walk(mediaDir);
		} catch {
			mediaCount = 0;
		}

		return c.json({
			posts: {
				total: posts.length,
				published,
				drafts: posts.length - published,
			},
			configs: { total: configSections.length, saved: savedSections.length },
			media: { count: mediaCount },
			server: {
				buildModule: adminServer.enableBuildModule,
				startedAt: new Date().toISOString(),
				repoRoot: REPO_ROOT,
			},
		});
	});

	return app;
}
