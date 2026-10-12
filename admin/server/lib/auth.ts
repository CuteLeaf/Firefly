import fs from "node:fs";
import path from "node:path";
import {
	createHmac,
	randomBytes,
	scryptSync,
	timingSafeEqual,
} from "node:crypto";
import { getCookie, setCookie } from "hono/cookie";
import type { Context, MiddlewareHandler } from "hono";
import { adminAuth } from "../../admin.config";
import { ADMIN_DIR } from "./paths";

export const SESSION_COOKIE = "firefly_admin";

/* ── 会话密钥：环境变量 > admin/.secret（自动生成持久化）── */

let cachedSecret: string | null = null;

function getSecret(): string {
	if (cachedSecret) return cachedSecret;
	const env = process.env.FIREFLY_ADMIN_SECRET;
	if (env) {
		cachedSecret = env;
		return env;
	}
	const secretFile = path.join(ADMIN_DIR, ".secret");
	try {
		const existing = fs.readFileSync(secretFile, "utf-8").trim();
		if (existing) {
			cachedSecret = existing;
			return existing;
		}
	} catch {
		/* 文件不存在则生成 */
	}
	const generated = randomBytes(32).toString("base64");
	try {
		fs.writeFileSync(secretFile, generated, { mode: 0o600 });
	} catch {
		/* 只读环境下降级为进程级密钥 */
	}
	cachedSecret = generated;
	return generated;
}

function sign(payload: string): string {
	return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function sessionTtlMs(): number {
	return Math.max(1, adminAuth.sessionTtlHours || 24) * 3_600_000;
}

/* ── 会话令牌（无状态：用户名 + 过期时间 + HMAC 签名）── */

export function createSessionToken(username: string): string {
	const payload = `${username}.${Date.now() + sessionTtlMs()}`;
	return `${payload}.${sign(payload)}`;
}

/** 校验令牌，合法则返回用户名，否则返回 null */
export function verifySessionToken(token: string): string | null {
	const parts = token.split(".");
	if (parts.length !== 3) return null;
	const [username, expRaw, sig] = parts;
	if (!username || sign(`${username}.${expRaw}`) !== sig) return null;
	const exp = Number(expRaw);
	if (!Number.isFinite(exp) || Date.now() > exp) return null;
	return username;
}

export function setSessionCookie(c: Context, username: string): void {
	setCookie(c, SESSION_COOKIE, createSessionToken(username), {
		httpOnly: true,
		sameSite: "Strict",
		path: "/",
		maxAge: Math.floor(sessionTtlMs() / 1000),
		secure: false,
	});
}

/* ── 密码校验（明文 password 与 scrypt passwordHash 二选一）── */

export function verifyPassword(candidate: string): boolean {
	const { password, passwordHash } = adminAuth;
	if (passwordHash) {
		const parts = passwordHash.split("$");
		if (parts.length !== 3 || parts[0] !== "scrypt") return false;
		const salt = Buffer.from(parts[1], "base64");
		const expected = Buffer.from(parts[2], "base64");
		if (salt.length === 0 || expected.length === 0) return false;
		const actual = scryptSync(candidate, salt, expected.length);
		return timingSafeEqual(actual, expected);
	}
	if (!password) return false;
	const a = Buffer.from(candidate, "utf-8");
	const b = Buffer.from(password, "utf-8");
	if (a.length !== b.length) return false;
	return timingSafeEqual(a, b);
}

/* ── 登录防爆破（按 IP 限次，内存实现，重启清零）── */

const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60_000;

export function consumeFailedAttempt(ip: string): boolean {
	const now = Date.now();
	const entry = attempts.get(ip);
	if (!entry || now > entry.resetAt) {
		attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
		return false;
	}
	entry.count += 1;
	return entry.count > MAX_ATTEMPTS;
}

export function clearAttempts(ip: string): void {
	attempts.delete(ip);
}

/* ── 认证中间件 ── */

export function authMiddleware(): MiddlewareHandler {
	return async (c, next) => {
		const token = getCookie(c, SESSION_COOKIE);
		if (!token) return c.json({ error: "未登录" }, 401);
		const user = verifySessionToken(token);
		if (!user) return c.json({ error: "会话已过期，请重新登录" }, 401);

		// 剩余有效期不足 1 小时则自动续期
		const exp = Number(token.split(".")[1]);
		if (Number.isFinite(exp) && exp - Date.now() < 3_600_000) {
			setSessionCookie(c, user);
		}

		// 写操作要求自定义头，配合 SameSite=Strict 防 CSRF
		if (
			c.req.method !== "GET" &&
			c.req.method !== "HEAD" &&
			c.req.header("x-admin-request") !== "1"
		) {
			return c.json({ error: "非法请求：缺少安全请求头" }, 403);
		}

		c.set("adminUser", user);
		await next();
	};
}
