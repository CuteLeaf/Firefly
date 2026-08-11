/**
 * 隔离引用了不存在图片的文章
 * 把这些文章移到 src/content/posts/_quarantine/
 * Astro 不会构建 _quarantine 里的文章
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = "src/content/posts";
const QUARANTINE_DIR = "src/content/_quarantine";

if (!fs.existsSync(QUARANTINE_DIR)) {
	fs.mkdirSync(QUARANTINE_DIR, { recursive: true });
}

function walk(dir) {
	return fs.readdirSync(dir).flatMap((f) => {
		const p = path.join(dir, f);
		if (fs.statSync(p).isDirectory()) return walk(p);
		// 收录所有 .md / .mdx 文章（含顶层文件和子目录里的 index.md）
		return /\.mdx?$/.test(f) ? [p] : [];
	});
}

function hasMissingImage(file) {
	const raw = fs.readFileSync(file, "utf8");
	let data, content;
	try {
		({ data, content } = matter(raw));
	} catch (err) {
		// frontmatter 解析失败（如重复键 / 缩进错误）：视为坏文章，隔离并告警
		console.warn(`⚠️ frontmatter 解析失败，将隔离: ${file}\n   ${err.message}`);
		return true;
	}

	const images = new Set();

	// frontmatter 里的 image
	// "api" 是主题内置随机封面图，不是真实路径，跳过；
	// http(s) 外链也不检查（与正文图片的处理一致）
	if (
		typeof data.image === "string" &&
		data.image !== "api" &&
		!/^https?:\/\//.test(data.image)
	) {
		images.add(data.image);
	}

	// 先把代码块/行内代码剥掉，避免把示例代码里的 ![...] 当真实引用
	const codeStripped = content
		.replace(/^ {4,}.*$/gm, "") // 缩进代码块（4+ 空格）
		.replace(/^\t.*$/gm, "") // tab 缩进代码块
		.replace(/```[\s\S]*?```/g, "") // 围栏代码块（反引号）
		.replace(/~~~[\s\S]*?~~~/g, "") // 围栏代码块（波浪号）
		.replace(/`[^`\n]+`/g, ""); // 行内代码

	// markdown 里的 ![alt](path)
	const mdImages = [...codeStripped.matchAll(/!\[.*?\]\((.+?)\)/g)]
		.map((m) => m[1])
		.filter((p) => !p.startsWith("http"));

	for (const p of mdImages) images.add(p);

	return [...images].some((img) => {
		const abs = img.startsWith("/")
			? path.join("public", img)
			: path.resolve(path.dirname(file), img);

		return !fs.existsSync(abs);
	});
}

function main() {
	const files = walk(POSTS_DIR);
	let moved = 0;

	for (const file of files) {
		if (hasMissingImage(file)) {
			// 用 path.relative + path.join 拼目标路径，避免 Windows 下正反斜杠不匹配导致 replace 失效、文件没真挪走
			const target = path.resolve(QUARANTINE_DIR, path.relative(POSTS_DIR, file));
			fs.mkdirSync(path.dirname(target), { recursive: true });
			fs.renameSync(file, target);
			console.log(`🚫 Quarantined: ${file}`);
			moved++;
		}
	}

	console.log(`\n✅ Done. Quarantined ${moved} broken posts.`);
}

main();
