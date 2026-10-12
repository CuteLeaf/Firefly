/**
 * Firefly 管理后台配置文件
 *
 * ⚠️ 账号与密码【只能】通过修改本文件来更改，后台网页不提供任何修改密码的功能。
 *    修改本文件后，需要重启后台服务（pnpm admin）才会生效。
 *
 * 密码有两种填写方式（二选一，若都填写则优先使用 passwordHash）：
 *  1. password：明文密码，简单直接，适合本地使用；
 *  2. passwordHash：scrypt 哈希，运行 `pnpm admin:hash-password -- 你的密码` 生成后粘贴到这里，
 *     适合希望配置文件中不出现明文密码的场景。
 */
export const adminAuth = {
	/** 登录用户名 */
	username: "admin",

	/** 明文密码（与 passwordHash 二选一） */
	password: "admin123",

	/** scrypt 哈希密码（由 pnpm admin:hash-password 生成，优先级高于 password） */
	passwordHash: "",

	/** 会话有效期（小时），到期后需要重新登录 */
	sessionTtlHours: 24,
};

export const adminServer = {
	/** 监听地址：默认 127.0.0.1，仅本机可访问；如需局域网访问可改为 0.0.0.0（注意安全） */
	host: "127.0.0.1",

	/** 后台端口，浏览器访问 http://localhost:4001 */
	port: 4001,

	/** 文章目录（相对仓库根目录），与 Astro content 集合保持一致 */
	postsDir: "src/content/posts",

	/** 媒体上传目录（相对仓库根目录）。需位于 public/ 下才能被站点直接以 /xxx 路径引用 */
	mediaDir: "public/images/admin",

	/** 是否启用「构建部署」模块（在后台一键触发 pnpm build 并实时查看日志） */
	enableBuildModule: true,

	/** 自定义构建命令（数组形式），留空则自动使用 pnpm build */
	buildCommand: [],
};
