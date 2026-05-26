import fs from "fs";
import path from "path";
import crc32 from "crc-32";

const POSTS_DIR = "./src/content/posts";

// 收集已有 abbrlink（用于冲突检测）
const usedAbbrlinks = new Set();

function walk(dir) {
  return fs.readdirSync(dir).flatMap(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      return walk(fullPath);
    }
    return fullPath.endsWith(".md") ? [fullPath] : [];
  });
}

const files = walk(POSTS_DIR);

// 先扫描所有已有 abbrlink
for (const file of files) {
  const content = fs.readFileSync(file, "utf-8");
  const match = content.match(/abbrlink:\s*(\S+)/);
  if (match) {
    usedAbbrlinks.add(match[1]);
  }
}

// 开始处理
for (const file of files) {
  const content = fs.readFileSync(file, "utf-8");

  if (content.includes("abbrlink:")) continue;

  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!match) {
    console.log(`⚠ 跳过无 frontmatter 文件: ${file}`);
    continue;
  }

  // 生成唯一 hash
  let salt = 0;
  let hash;
  let finalAbbr;

  do {
    const base = path.basename(file) + (salt || "");
    hash = (crc32.str(base) >>> 0).toString(16);
    finalAbbr = "p" + hash;
    salt++;
  } while (usedAbbrlinks.has(finalAbbr));

  usedAbbrlinks.add(finalAbbr);

  const newFrontmatter = `---\n${match[1].trimEnd()}\nabbrlink: ${finalAbbr}\n---`;

  const newContent = content.replace(match[0], newFrontmatter);

  fs.writeFileSync(file, newContent);

  console.log(`✓ Generated ${finalAbbr} for ${file}`);
}