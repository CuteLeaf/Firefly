// 字体子集化构建后脚本
// 在 astro build 之后运行，扫描 dist/ 中所有 HTML 页面，收集实际使用的字符，
// 为标记了 subset: true 的本地字体生成轻量 woff2 子集文件。

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { glob } from "glob";
import subsetFont from "subset-font";
import { fontConfig, fontsList } from "../src/config";
import { collectUsedFontCssVars, toPublicPath } from "../src/utils/fontHelper";

// ─── 配置 ───────────────────────────────────────────────

const DIST_DIR = "dist";
const OUTPUT_DIR = "dist/_astro/fonts";

// ─── 字体配置解析 ────────────────────────────────────────

type LocalSubsetFont = {
	id: string;
	family: string;
	src: string;
	weight?: string | number;
	style?: string;
	display?: string;
	subsetExtraChars?: string;
};

/**
 * 从 fontConfig.subsetFonts 获取需要子集化的本地字体，
 * 交叉引用 fonts 数组获取字体文件路径。
 * 仅处理实际被使用的字体（在 selected、bannerTitleFont 等区域字段中引用的）。
 */
function getLocalSubsetFonts(): LocalSubsetFont[] {
	if (!fontConfig.enable || !fontConfig.subsetFonts) return [];

	const subsetEntries = Object.entries(fontConfig.subsetFonts);
	if (subsetEntries.length === 0) return [];

	// 构建实际使用的字体 CSS 变量集合（与 astro.config.mjs 共享同一逻辑）
	const used = collectUsedFontCssVars(fontConfig);

	// 建立 cssVariable → fontsList 条目的映射
	const fontByCssVar = new Map<string, typeof fontsList[number]>();
	for (const f of fontsList) {
		if (f.cssVariable) fontByCssVar.set(f.cssVariable, f);
	}

	const result: LocalSubsetFont[] = [];
	for (const [cssVar, opts] of subsetEntries) {
		// 跳过未被使用的字体，避免生成无用的子集文件
		if (!used.has(cssVar)) {
			console.log(`   ⏭ Skipping '${cssVar}' — not referenced in selected or any font region.`);
			continue;
		}

		const f = fontByCssVar.get(cssVar);
		if (!f?.options?.variants) continue;

		for (const v of f.options.variants) {
			if (!v.src?.length) continue;
			const rawSrc = v.src[0];
			// 将本地路径（如 "./public/assets/fonts/MyFont.woff2"）转换为访问路径
			const publicPath = toPublicPath(rawSrc);
			if (publicPath === null) {
				console.warn(
					`   ⚠ Skipping variant with unexpected src path: "${rawSrc}".\n` +
					`     Expected a path under public/ (e.g. "./public/assets/fonts/MyFont.woff2") or an absolute path (e.g. "/assets/fonts/MyFont.woff2").`
				);
				continue;
			}
			result.push({
				id: `${f.name}-${v.weight || "default"}`.toLowerCase().replace(/\s+/g, "-"),
				family: f.name,
				src: publicPath,
				weight: v.weight,
				style: v.style,
				subsetExtraChars: opts.extraChars,
			});
		}
	}
	return result;
}

// ─── 字符收集 ────────────────────────────────────────────

/**
 * 从 HTML 字符串中提取纯文本内容（比 JSDOM 轻量得多）
 */
function extractTextFromHtml(html: string): string {
	// 移除 script 和 style 标签及其内容
	let text = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ");
	// 移除所有 HTML 标签
	text = text.replace(/<[^>]+>/g, " ");
	// 解码常见 HTML 实体
	text = text
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&nbsp;/g, " ");
	// 提取 alt、title、aria-label、placeholder 属性值
	const attrMatches = html.matchAll(/(?:alt|title|aria-label|placeholder)=["']([^"']+)["']/gi);
	for (const match of attrMatches) {
		text += match[1];
	}
	return text;
}

/**
 * 扫描 dist/ 中所有 HTML 文件，提取页面中实际使用的所有字符
 */
async function collectChars(): Promise<string> {
	const htmlFiles = await glob(`${DIST_DIR}/**/*.html`);
	const charSet = new Set<string>();

	for (const file of htmlFiles) {
		const html = await fs.readFile(file, "utf-8");
		const text = extractTextFromHtml(html);
		for (const c of text) charSet.add(c);
	}

	return [...charSet].join("");
}

// ─── 子集生成 ────────────────────────────────────────────

function contentHash(buffer: Buffer): string {
	return crypto
		.createHash("sha256")
		.update(buffer)
		.digest("hex")
		.slice(0, 16);
}

function fullHash(buffer: Buffer): string {
	return crypto.createHash("sha256").update(buffer).digest("hex");
}

/**
 * 将本地 src 路径解析为 public/ 下的绝对文件路径
 */
function resolveFontPath(src: string): string {
	const relativePath = src.startsWith("/") ? src.slice(1) : src;
	return path.resolve("public", relativePath);
}

/**
 * 检测字体文件的实际格式
 */
function detectFontFormat(
	filePath: string,
): "woff2" | "woff" | "truetype" | "opentype" {
	const ext = path.extname(filePath).toLowerCase();
	switch (ext) {
		case ".woff2":
			return "woff2";
		case ".woff":
			return "woff";
		case ".otf":
			return "opentype";
		case ".ttf":
		default:
			return "truetype";
	}
}

// ─── 主流程 ──────────────────────────────────────────────

interface SubsetResult {
	id: string;
	family: string;
	weight?: string | number;
	style?: string;
	display?: string;
	hash: string;
	format: string;
	originalSrc: string;
	originalHash: string;
	originalSize: number;
}

async function main() {
	console.log("🔤 Font subsetting started...");

	// 1. 从配置中获取需要子集化的本地字体
	const localSubsetFonts = getLocalSubsetFonts();

	if (localSubsetFonts.length === 0) {
		console.log("   No local fonts with subset: true found. Skipping.");
		return;
	}

	console.log(
		`   Found ${localSubsetFonts.length} font(s) to subset: ${localSubsetFonts.map((f) => f.id).join(", ")}`,
	);

	// 2. 收集页面字符
	console.log("🔍 Collecting characters from dist/...");
	const pageChars = await collectChars();
	console.log(`   Collected ${pageChars.length} unique characters.`);

	if (pageChars.length === 0) {
		console.warn("⚠ No characters found in dist/. Skipping subsetting.");
		return;
	}

	// 3. 确保输出目录存在
	await fs.mkdir(OUTPUT_DIR, { recursive: true });

	// 4. 为每个字体生成子集
	const results: SubsetResult[] = [];

	for (const font of localSubsetFonts) {
		const fontPath = resolveFontPath(font.src);

		// 检查字体文件是否存在
		try {
			await fs.access(fontPath);
		} catch {
			console.error(
				`❌ Font file not found: ${fontPath} (src: ${font.src})`,
			);
			continue;
		}

		// 合并页面字符和额外字符
		let chars = pageChars;
		if (font.subsetExtraChars) {
			const extraSet = new Set<string>([
				...pageChars,
				...font.subsetExtraChars,
			]);
			chars = [...extraSet].join("");
		}

		console.log(
			`⏳ Generating subset for '${font.id}' (${font.family})...`,
		);

		const fontBuffer = await fs.readFile(fontPath);
		const originalFormat = detectFontFormat(fontPath);

		try {
			const subsetBuffer = await subsetFont(fontBuffer, chars, {
				targetFormat: "woff2",
				preserveNameTable: true,
			});

			const hash = contentHash(subsetBuffer);
			const outFile = path.join(OUTPUT_DIR, `${hash}.woff2`);
			await fs.writeFile(outFile, subsetBuffer);

			const sizeKB = (subsetBuffer.length / 1024).toFixed(1);
			const originalSizeKB = (fontBuffer.length / 1024).toFixed(1);
			const ratio = (
				((fontBuffer.length - subsetBuffer.length) / fontBuffer.length) *
				100
			).toFixed(1);

			console.log(
				`   ✔ ${hash}.woff2 (${sizeKB} KB, original: ${originalSizeKB} KB, saved ${ratio}%)`,
			);

			results.push({
				id: font.id,
				family: font.family,
				weight: font.weight,
				style: font.style,
				display: font.display,
				hash,
				format: originalFormat,
				originalSrc: font.src,
				originalHash: fullHash(fontBuffer),
				originalSize: fontBuffer.length,
			});
		} catch (err) {
			console.error(`   ❌ Failed to subset '${font.id}':`, err);
		}
	}

	if (results.length === 0) {
		console.warn("⚠ No subsets were generated.");
		return;
	}

	// 5. 找到 Astro 复制到 dist/ 的原字体，并替换 CSS/HTML 引用。
	//    本地字体会被 Astro 重命名为哈希文件名，不能直接根据源路径定位。
	console.log("🔄 Replacing original font URLs in dist/ CSS and HTML files...");
	const filesToReplace = await glob(`${DIST_DIR}/**/*.{css,html}`);
	const distFontFiles = await glob(
		`${DIST_DIR}/**/*.{ttf,otf,woff,woff2}`,
		{ nodir: true },
	);
	const originalFilesByResult = new Map<SubsetResult, string[]>();

	for (const result of results) {
		const originalFiles: string[] = [];

		for (const distFontFile of distFontFiles) {
			const stat = await fs.stat(distFontFile);
			if (stat.size !== result.originalSize) continue;

			if (fullHash(await fs.readFile(distFontFile)) === result.originalHash) {
				originalFiles.push(distFontFile);
			}
		}

		originalFilesByResult.set(result, originalFiles);
		if (originalFiles.length === 0) {
			console.warn(
				`   ⚠ Original asset for '${result.id}' was not found in dist/.`,
			);
		}
	}

	for (const file of filesToReplace) {
		let content = await fs.readFile(file, "utf-8");
		let replaced = false;

		for (const result of results) {
			const subsetUrl = `/_astro/fonts/${result.hash}.woff2`;
			const originalFiles = originalFilesByResult.get(result) ?? [];

			for (const originalFile of originalFiles) {
				const relativePath = path
					.relative(DIST_DIR, originalFile)
					.split(path.sep)
					.join("/");
				const originalUrl = `/${relativePath}`;

				if (!content.includes(originalUrl)) continue;

				const originalExtension = path
					.extname(originalFile)
					.slice(1)
					.toLowerCase();
				content = content
					.replaceAll(
						`url("${originalUrl}") format("${result.format}")`,
						`url("${subsetUrl}") format("woff2")`,
					)
					.replaceAll(
						`href="${originalUrl}" as="font" type="font/${originalExtension}"`,
						`href="${subsetUrl}" as="font" type="font/woff2"`,
					)
					.replaceAll(originalUrl, subsetUrl);
				replaced = true;
			}
		}

		if (replaced) {
			await fs.writeFile(file, content);
			console.log(`   ✔ Updated: ${file}`);
		}
	}

	// 6. 清理 dist/ 中的原始字体文件，避免大文件进入部署包
	console.log("🗑 Cleaning up original font files from dist/...");
	for (const originalFiles of originalFilesByResult.values()) {
		for (const originalFile of originalFiles) {
			await fs.unlink(originalFile);
			console.log(`   ✔ Removed: ${originalFile}`);
		}
	}

	console.log("✨ Font subsetting completed!");
}

main().catch((err) => {
	console.error("❌ Font subsetting failed:", err);
	process.exit(1);
});
