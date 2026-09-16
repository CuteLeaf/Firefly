/**
 * 生成管理后台的 scrypt 密码哈希。
 * 用法：pnpm admin:hash-password -- 你的密码
 * 把输出的字符串粘贴到 admin/admin.config.ts 的 adminAuth.passwordHash 即可。
 */
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const password = process.argv.slice(2).join(" ");
if (!password) {
	console.error("用法：pnpm admin:hash-password -- <你的密码>");
	process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 32);

console.log(
	"\n将下面这行粘贴到 admin/admin.config.ts 的 passwordHash 字段：\n",
);
console.log(`scrypt$${salt.toString("base64")}$${hash.toString("base64")}\n`);
