import fs from "node:fs";
import path from "node:path";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { adminAuth, adminServer } from "../admin.config";
import { authMiddleware } from "./lib/auth";
import { ADMIN_DIR, REPO_ROOT } from "./lib/paths";
import { createAuthModule } from "./modules/auth";
import { createDashboardModule } from "./modules/dashboard";
import { createPostsModule } from "./modules/posts";
import { createConfigsModule } from "./modules/configs";
import { createMediaModule } from "./modules/media";
import { createSiteModule } from "./modules/site";

/**
 * Firefly 管理后台入口。
 *
 * 模块化设计：每个功能模块位于 modules/<name>.ts，导出 createXxxModule(): Hono，
 * 在下方 moduleRegistry 登记一行即可挂载。新增功能的完整步骤见 admin/README.md。
 */

const moduleRegistry: Array<{
	path: string;
	create: () => Hono;
	/** 该模块是否需要登录（登录/会话接口自身除外） */
	auth: boolean;
}> = [
	{ path: "/api/auth", create: createAuthModule, auth: false },
	{ path: "/api/dashboard", create: createDashboardModule, auth: true },
	{ path: "/api/posts", create: createPostsModule, auth: true },
	{ path: "/api/configs", create: createConfigsModule, auth: true },
	{ path: "/api/media", create: createMediaModule, auth: true },
	{ path: "/api/site", create: createSiteModule, auth: true },
];

const app = new Hono();

// 请求日志
app.use("*", async (c, next) => {
	const start = Date.now();
	await next();
	console.log(
		`[admin] ${c.req.method} ${c.req.path} → ${c.res.status} (${Date.now() - start}ms)`,
	);
});

// 认证中间件：除登录与会话查询外的所有 /api 请求都需要有效会话
app.use("*", async (c, next) => {
	const p = c.req.path;
	if (
		p.startsWith("/api/") &&
		p !== "/api/auth/login" &&
		p !== "/api/auth/session"
	) {
		return authMiddleware()(c, next);
	}
	await next();
});

// 挂载功能模块
for (const mod of moduleRegistry) {
	app.route(mod.path, mod.create());
}

// 未匹配的 API 路由返回 JSON 404（避免被 SPA 兜底路由吞掉）
app.get("/api/*", (c) => c.json({ error: "接口不存在" }, 404));
app.all("/api/*", (c) => c.json({ error: "接口不存在" }, 404));

// Markdown 渲染器（来自项目已有依赖 marked，无需打包进前端）
app.get("/vendor/marked.js", async (c) => {
	const file = path.join(
		REPO_ROOT,
		"node_modules",
		"marked",
		"lib",
		"marked.esm.js",
	);
	if (!fs.existsSync(file)) {
		return c.json({ error: "marked 未安装" }, 404);
	}
	const content = await fs.promises.readFile(file);
	return c.body(content, 200, {
		"Content-Type": "text/javascript; charset=utf-8",
	});
});

// 前端需要的 JSON Schema（文章表单等）
app.get("/schemas/:name", async (c) => {
	const name = c.req.param("name");
	if (!/^[\w-]+\.schema\.json$/.test(name)) {
		return c.json({ error: "非法文件名" }, 400);
	}
	const file = path.join(ADMIN_DIR, "schemas", name);
	if (!fs.existsSync(file)) return c.json({ error: "Schema 不存在" }, 404);
	const content = await fs.promises.readFile(file);
	return c.body(content, 200, {
		"Content-Type": "application/json; charset=utf-8",
	});
});

// 后台前端静态资源
const uiDir = path.join(ADMIN_DIR, "ui");
app.use("/css/*", serveStatic({ root: uiDir }));
app.use("/js/*", serveStatic({ root: uiDir }));
app.get("/favicon.svg", serveStatic({ root: uiDir, path: "favicon.svg" }));

// SPA 兜底：其余 GET 一律返回 index.html（前端使用 hash 路由）
app.get("*", serveStatic({ root: uiDir, path: "index.html" }));

// 启动
const { host, port } = adminServer;

serve({ fetch: app.fetch, port, hostname: host }, (info) => {
	console.log("");
	console.log("  ✨ Firefly 管理后台已启动");
	console.log(`  ➜  地址: http://${host}:${port}`);
	console.log(
		`  ➜  账号: ${adminAuth.username}（修改账号密码请编辑 admin/admin.config.ts）`,
	);
	console.log("");
	console.log("  提示：");
	console.log(
		"  - 同时运行 pnpm dev 可实时预览站点改动（http://localhost:4321）",
	);
	console.log("  - 个性化设置保存后，运行中的 dev 服务器会自动热更新");
	console.log(
		"  - 生产部署前请在后台「构建部署」中执行 pnpm build，或自行运行",
	);
	console.log("");
});
