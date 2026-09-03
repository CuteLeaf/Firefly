// 内联脚本压缩构建后脚本
// Astro 只压缩打包后的 script，is:inline 一律原样输出（连注释和缩进都在）。
// 这里在 astro build 之后扫一遍 dist/ 的 HTML，把内联 JS 过一遍 esbuild。

import fs from "node:fs/promises";
import { transformSync } from "esbuild";
import { glob } from "glob";
import { resolveSiteRoot } from "./site-root";

// Cloudflare Pages 上产物在 dist/client，本地在 dist，统一对准真实根目录
const DIST_DIR = resolveSiteRoot();

// <script ...>...</script>，惰性匹配内容，属性里不允许出现 >
const SCRIPT_RE = /<script([^>]*)>([\s\S]*?)<\/script>/gi;

// 只碰这几种 type（空 type 就是普通 JS）
const JS_TYPES = new Set([
	"",
	"text/javascript",
	"application/javascript",
	"module",
]);

/**
 * 判断某段 <script> 是否该压缩：
 * 外链的没有内容可压；type 不是 JS 的（application/ld+json、text/template、
 * Pagefind 的数据块之类）一律不碰。
 */
function shouldMinify(attrs: string): boolean {
	if (/\ssrc\s*=/i.test(attrs)) return false;
	const typeMatch = attrs.match(/\stype\s*=\s*["']?([^"'\s>]*)/i);
	const type = (typeMatch?.[1] ?? "").toLowerCase();
	return JS_TYPES.has(type);
}

function minifyInline(code: string, file: string): string {
	if (!code.trim()) return code;
	try {
		const result = transformSync(code, {
			loader: "js",
			target: "es2018",
			minifyWhitespace: true,
			minifySyntax: true,
			// 标识符不能改名：这些脚本处在全局作用域、彼此靠全局函数名互相调用
			// （如 MainGridLayout 的 setRandomSubtitle），改名会静默炸掉。
			minifyIdentifiers: false,
		});
		// 压完不能出现 </script，否则会提前闭合标签
		if (/<\/script/i.test(result.code)) return code;
		return result.code;
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		console.warn(`   ⚠ Skipped a script in ${file}: ${message}`);
		return code;
	}
}

async function main() {
	console.log("🗜 Minifying inline scripts in dist/...");

	const htmlFiles = await glob(`${DIST_DIR}/**/*.html`);
	let savedBytes = 0;
	let touchedFiles = 0;
	let scriptCount = 0;

	for (const file of htmlFiles) {
		const html = await fs.readFile(file, "utf-8");
		let fileSaved = 0;

		const output = html.replace(
			SCRIPT_RE,
			(whole, attrs: string, code: string) => {
				if (!shouldMinify(attrs)) return whole;
				const minified = minifyInline(code, file);
				if (minified === code) return whole;
				scriptCount++;
				fileSaved +=
					Buffer.byteLength(code, "utf-8") -
					Buffer.byteLength(minified, "utf-8");
				return `<script${attrs}>${minified}</script>`;
			},
		);

		if (fileSaved !== 0 || output !== html) {
			await fs.writeFile(file, output);
			savedBytes += fileSaved;
			touchedFiles++;
		}
	}

	const savedKiB = (savedBytes / 1024).toFixed(1);
	console.log(
		`✨ Minified ${scriptCount} inline scripts in ${touchedFiles}/${htmlFiles.length} HTML files, saved ${savedKiB} KiB`,
	);
}

main().catch((err) => {
	console.error("❌ Inline script minification failed:", err);
	process.exit(1);
});
