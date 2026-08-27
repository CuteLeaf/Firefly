// 在 astro build 之后运行 Pagefind。
// 之前直接在 package.json 里写 `pagefind --site dist`，在 Cloudflare Pages（产物在
// dist/client）上会索引出 /client/... 的假路径，并且索引输出到 dist/pagefind，
// 根本不会随站点部署 —— 线上搜索一直是 404。这里对准真正的站点根目录再跑，
// 索引会输出到 <root>/pagefind，随站点一起上传。

import { spawnSync } from "node:child_process";
import { resolveSiteRoot } from "./site-root";

const siteRoot = resolveSiteRoot();

const result = spawnSync("pagefind", ["--site", siteRoot], {
	stdio: "inherit",
	// Windows 下 .bin 里是 .cmd 包装，需要 shell 才能解析到
	shell: process.platform === "win32",
});
process.exit(result.status ?? 1);
