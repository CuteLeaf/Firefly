import { Hono } from "hono";
import { deleteCookie } from "hono/cookie";
import { adminAuth } from "../../admin.config";
import {
	SESSION_COOKIE,
	clearAttempts,
	consumeFailedAttempt,
	setSessionCookie,
	verifyPassword,
	verifySessionToken,
} from "../lib/auth";

/** 认证模块：登录 / 登出 / 会话状态 */
export function createAuthModule(): Hono {
	const app = new Hono();

	// 登录：账号密码只能通过 admin/admin.config.ts 修改，后台不提供改密功能
	app.post("/login", async (c) => {
		let body: { username?: string; password?: string };
		try {
			body = await c.req.json();
		} catch {
			return c.json({ error: "请求格式错误" }, 400);
		}
		const username = typeof body.username === "string" ? body.username : "";
		const password = typeof body.password === "string" ? body.password : "";

		const ip =
			c.req.header("x-forwarded-for")?.split(",")[0]?.trim() || "local";

		if (!username || !password) {
			return c.json({ error: "请输入用户名和密码" }, 400);
		}

		const ok = username === adminAuth.username && verifyPassword(password);
		if (!ok) {
			const locked = consumeFailedAttempt(ip);
			return c.json(
				{
					error: locked ? "失败次数过多，请 10 分钟后再试" : "用户名或密码错误",
				},
				401,
			);
		}

		clearAttempts(ip);
		setSessionCookie(c, username);
		return c.json({ ok: true, username });
	});

	app.post("/logout", (c) => {
		deleteCookie(c, SESSION_COOKIE, { path: "/" });
		return c.json({ ok: true });
	});

	app.get("/session", (c) => {
		const token = c.req
			.header("cookie")
			?.split(";")
			.map((s) => s.trim())
			.find((s) => s.startsWith(`${SESSION_COOKIE}=`))
			?.slice(SESSION_COOKIE.length + 1);
		const user = token ? verifySessionToken(decodeURIComponent(token)) : null;
		if (!user) return c.json({ loggedIn: false }, 401);
		return c.json({ loggedIn: true, username: user });
	});

	return app;
}
