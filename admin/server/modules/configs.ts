import { Hono } from "hono";
import { configSections, getSection } from "../lib/config-manifest";
import {
	computeOverlay,
	mergeOverlay,
	readUserConfig,
	writeUserConfig,
} from "../lib/user-config";
import { loadFragment, validateConfigValue } from "../lib/schemas";

/** 个性化配置模块：读取/保存/重置各配置分区的覆盖层 */
export function createConfigsModule(): Hono {
	const app = new Hono();

	// 模块清单（含分组与已保存状态）
	app.get("/", async (c) => {
		const overlay = await readUserConfig();
		const groups = new Map<string, Array<Record<string, unknown>>>();
		for (const section of configSections) {
			if (!groups.has(section.group)) groups.set(section.group, []);
			groups.get(section.group)?.push({
				key: section.key,
				title: section.title,
				group: section.group,
				note: section.note,
				saved:
					overlay[section.key] !== undefined && overlay[section.key] !== null,
			});
		}
		return c.json({
			groups: [...groups.entries()].map(([name, sections]) => ({
				name,
				sections,
			})),
		});
	});

	// 某个模块的完整数据：defaults / saved（已保存覆盖层）/ current（当前生效值）/ schema
	app.get("/:key", async (c) => {
		const key = c.req.param("key");
		const section = getSection(key);
		if (!section) return c.json({ error: "未知的配置模块" }, 404);
		const overlay = await readUserConfig();
		const saved = overlay[key] ?? null;
		const fragment = await loadFragment(key);
		return c.json({
			key,
			title: section.title,
			group: section.group,
			note: section.note,
			defaults: section.defaults,
			saved,
			current: mergeOverlay(section.defaults, saved),
			schema: fragment?.schema ?? null,
			description: fragment?.description ?? "",
		});
	});

	// 保存（body 为表单提交的完整生效值；服务端校验后剥离默认值，只存差异）
	app.put("/:key", async (c) => {
		const key = c.req.param("key");
		const section = getSection(key);
		if (!section) return c.json({ error: "未知的配置模块" }, 404);
		let value: unknown;
		try {
			value = await c.req.json();
		} catch {
			return c.json({ error: "请求格式错误" }, 400);
		}
		const validation = await validateConfigValue(key, value);
		if (!validation.ok) {
			return c.json({ error: "配置校验失败", details: validation.errors }, 422);
		}
		const overlay = computeOverlay(section.defaults, value);
		await writeUserConfig((current) => {
			const next = { ...current };
			if (overlay === null || overlay === undefined) {
				delete next[key];
			} else {
				next[key] = overlay;
			}
			return next;
		});
		return c.json({
			ok: true,
			saved: overlay ?? null,
			current: mergeOverlay(section.defaults, overlay),
		});
	});

	// 恢复默认（删除该分区的覆盖层）
	app.delete("/:key", async (c) => {
		const key = c.req.param("key");
		const section = getSection(key);
		if (!section) return c.json({ error: "未知的配置模块" }, 404);
		await writeUserConfig((current) => {
			const next = { ...current };
			delete next[key];
			return next;
		});
		return c.json({ ok: true });
	});

	return app;
}
