/**
 * 隔离引用了不存在图片的文章
 * 把这些文章移到 src/content/posts/_quarantine/
 * Astro 不会构建 _quarantine 里的文章
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const POSTS_DIR = 'src/content/posts';
const QUARANTINE_DIR = 'src/content/_quarantine';

if (!fs.existsSync(QUARANTINE_DIR)) {
  fs.mkdirSync(QUARANTINE_DIR, { recursive: true });
}

function walk(dir) {
  return fs.readdirSync(dir).flatMap(f => {
    const p = path.join(dir, f);
    return fs.statSync(p).isDirectory()
      ? walk(p)
      : f === 'index.md' ? [p] : [];
  });
}

function hasMissingImage(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(raw);

  const images = new Set();

  // frontmatter 里的 image
  if (typeof data.image === 'string') {
    images.add(data.image);
  }

  // markdown 里的 ![alt](path)
  const mdImages = [...content.matchAll(/!\[.*?\]\((.+?)\)/g)]
    .map(m => m[1])
    .filter(p => !p.startsWith('http'));

  mdImages.forEach(p => images.add(p));

  return [...images].some(img => {
    const abs = img.startsWith('/')
      ? path.join('public', img)
      : path.resolve(path.dirname(file), img);

    return !fs.existsSync(abs);
  });
}

function main() {
  const files = walk(POSTS_DIR);
  let moved = 0;

  for (const file of files) {
    if (hasMissingImage(file)) {
      const target = file.replace(POSTS_DIR, QUARANTINE_DIR);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.renameSync(file, target);
      console.log(`🚫 Quarantined: ${file}`);
      moved++;
    }
  }

  console.log(`\n✅ Done. Quarantined ${moved} broken posts.`);
}

main();
