// check-images.js
// 运行：node check-images.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('========== 图片路径诊断 ==========\n');

// 1. 读取 CMS 配置（config.yml.js）
const cmsConfigPath = path.join(__dirname, 'functions', 'admin', 'config.yml.js');
let cmsConfig = {};
try {
  const content = fs.readFileSync(cmsConfigPath, 'utf-8');
  const mediaFolder = content.match(/media_folder:\s*"([^"]+)"/)?.[1] || '未找到';
  const publicFolder = content.match(/public_folder:\s*"([^"]+)"/)?.[1] || '未找到';
  cmsConfig = { mediaFolder, publicFolder };
} catch {
  cmsConfig = { mediaFolder: '文件不存在', publicFolder: '文件不存在' };
}
console.log('📁 CMS配置 (config.yml.js):');
console.log('   media_folder:', cmsConfig.mediaFolder);
console.log('   public_folder:', cmsConfig.publicFolder);
console.log('   → 上传图片实际保存位置:', path.join('项目根目录', cmsConfig.mediaFolder || ''));
console.log('   → 文章中图片引用前缀:', cmsConfig.publicFolder || '');

// 2. 检查实际存在的图片目录
const possibleDirs = [
  'public/images/posts',
  'public/assets/images/posts',
  'src/assets/images/posts',
  'public/images',
  'public/assets',
];
console.log('\n📂 实际存在的图片目录:');
possibleDirs.forEach(dir => {
  const full = path.join(__dirname, dir);
  if (fs.existsSync(full)) {
    const files = fs.readdirSync(full).filter(f => /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(f));
    console.log(`   ✅ ${dir}  (${files.length} 个图片文件)`);
    if (files.length > 0) {
      console.log(`      示例文件: ${files.slice(0, 3).join(', ')}`);
    }
  } else {
    console.log(`   ❌ ${dir}  (不存在)`);
  }
});

// 3. 检查文章 Frontmatter 中的 image 字段
const postsDir = path.join(__dirname, 'src', 'content', 'posts');
let sampleImages = [];
if (fs.existsSync(postsDir)) {
  const files = fs.readdirSync(postsDir).filter(f => /\.mdx?$/.test(f));
  files.slice(0, 5).forEach(file => {
    const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (match) {
      const fm = match[1];
      const imageMatch = fm.match(/image:\s*(.+)/);
      if (imageMatch) {
        sampleImages.push({ file, image: imageMatch[1].trim() });
      }
    }
  });
}
console.log('\n📝 文章中的 image 字段样例:');
if (sampleImages.length === 0) {
  console.log('   (未找到任何 image 字段)');
} else {
  sampleImages.forEach(({ file, image }) => {
    console.log(`   ${file}  →  image: "${image}"`);
  });
}

// 4. 主题配置中的封面图路径（coverImageConfig.ts）
const coverConfigPath = path.join(__dirname, 'src', 'config', 'coverImageConfig.ts');
let coverConfig = {};
try {
  const content = fs.readFileSync(coverConfigPath, 'utf-8');
  const fallback = content.match(/fallback:\s*"([^"]+)"/)?.[1] || '未配置';
  coverConfig = { fallback };
} catch {
  coverConfig = { fallback: '文件不存在' };
}
console.log('\n🎨 主题封面图配置 (coverImageConfig.ts):');
console.log('   fallback图片:', coverConfig.fallback);

// 5. 构建后图片访问映射（根据 Astro 的 public 目录规则）
console.log('\n🌐 图片访问URL映射规则:');
console.log('   - 存放在 public/ 下的文件，URL 直接对应路径，例如:');
console.log('     public/images/posts/1.jpg  →  /images/posts/1.jpg');
console.log('     public/assets/images/posts/2.jpg  →  /assets/images/posts/2.jpg');
console.log('   - 如果你的文章中 image 为 "my.jpg"，且 public_folder 是 "/images/posts"，');
console.log('     则完整URL为 /images/posts/my.jpg');
console.log('   - 检查浏览器控制台 Network 面板，查看实际请求的 URL 和响应状态');

console.log('\n========== 诊断结束 ==========');
console.log('请根据以上输出，手动检查图片是否存在于对应的目录，');
console.log('以及文章中的 image 路径是否与 URL 映射一致。');