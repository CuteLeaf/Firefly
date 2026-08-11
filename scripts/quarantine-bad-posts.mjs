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

// 图片是不是外链：http(s) / 协议相对的 //xxx / 其它协议都算。
// 前言和正文共用这一个判断，免得两边规则又对不齐。
function isExternalUrl(url) {
	return /^(https?:\/\/|\/\/|[\w+.-]+:)/i.test(url);
}

// 先把代码剥掉，否则示例代码里的 ![...] 会被当成真引用。
// 围栏块（``` / ~~~）和行内代码（反引号）直接删；
// 缩进块只在“前面是空行”的连续缩进行才算代码，免得把列表嵌套子项也误删。
function stripCode(md) {
	let out = md
		.replace(/```[\s\S]*?```/g, "")
		.replace(/~~~[\s\S]*?~~~/g, "")
		.replace(/`[^`\n]+`/g, "");

	const lines = out.split("\n");
	const kept = [];
	let i = 0;
	while (i < lines.length) {
		const line = lines[i];
		const indented = /^ {4,}|\t/.test(line);
		const prevBlank = i === 0 || lines[i - 1].trim() === "";
		if (indented && prevBlank) {
			while (i < lines.length && /^ {4,}|\t/.test(lines[i])) i++;
			continue;
		}
		kept.push(line);
		i++;
	}
	return kept.join("\n");
}

function walk(dir) {
	return fs.readdirSync(dir).flatMap((f) => {
		const p = path.join(dir, f);
		if (fs.statSync(p).isDirectory()) return walk(p);
		// 收全部 .md / .mdx（顶层文件 + 子目录里的 index.md 都算）
		return /\.mdx?$/.test(f) ? [p] : [];
	});
}

function hasMissingImage(file) {
	const raw = fs.readFileSync(file, "utf8");
	let data, content;
	try {
		({ data, content } = matter(raw));
	} catch (err) {
		// 某篇 frontmatter 写崩了（比如重复键）就隔离并告警，别让整轮跟着死
		console.warn(`⚠️ frontmatter 解析失败，将隔离: ${file}\n   ${err.message}`);
		return true;
	}

	const images = new Set();

	// "api" 是主题内置的随机封面，不是真路径，跳过；外链也跳过
	if (typeof data.image === "string" && data.image !== "api" && !isExternalUrl(data.image)) {
		images.add(data.image);
	}

	// 正文里的 ![alt](path)：剥完代码再提，URL 同样用 isExternalUrl 判内外
	const codeStripped = stripCode(content);
	const mdImages = [...codeStripped.matchAll(/!\[.*?\]\((.+?)\)/g)]
		.map((m) => m[1])
		.filter((p) => !isExternalUrl(p));

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
			// Windows 正反斜杠不一致，直接 replace 会失效、文件其实没挪走；用 relative + join 
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
