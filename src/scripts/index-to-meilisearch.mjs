import { MeiliSearch } from 'meilisearch';
import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { navBarSearchConfig } from '../config/index';
const meiliSearchConfig = navBarSearchConfig.meiliSearchConfig;
const MEILI_HOST = meiliSearchConfig.MEILI_HOST;
const MEILI_MASTER_KEY = meiliSearchConfig.MEILI_MASTER_KEY;
const INDEX_NAME = meiliSearchConfig.INDEX_NAME;
const contentDir = meiliSearchConfig.CONTENT_DIR.endsWith('/') ? meiliSearchConfig.CONTENT_DIR.slice(0, -1) : meiliSearchConfig.CONTENT_DIR

console.log('Starting indexing process for MeiliSearch...');

const client = new MeiliSearch({
  host: MEILI_HOST,
  apiKey: MEILI_MASTER_KEY,
});

async function getDocuments() {
  // glob 模式以递归搜索所有子目录
  const files = await glob(`${contentDir}/**/*.{md,mdx}`);

  return await Promise.all(
    files.map(async (file, idx) => {
      const content = await fs.readFile(file, 'utf-8');
      const { data, content: body } = matter(content);

      // 获取文件相对于 'src/content/posts' 的路径
      const relativePath = path.relative(contentDir, file);

      // 解析路径，得到目录(dir)和文件名(name)
      const { dir, name } = path.parse(relativePath);

      // 根据 Astro 规则生成 slug:
      // - 如果文件名是 'index', slug 就是它的父目录路径。
      // - 否则, slug 是 目录路径 + 文件名。
      const slugPart = name === 'index' ? dir : path.join(dir, name);

      // 确保在 Windows 上也能正确生成 URL 路径（将 \ 替换为 /）
      const finalSlug = slugPart.replace(/\\/g, '/');

      const plainText = body
        .replace(/```[\s\S]*?```/g, '')
        .replace(/(^|\n)( {4,}|\t).*(\n|$)/g, '\n')
        .replace(/`[^`]*`/g, '')
        .replace(/---[\s\S]*?---/g, '')
        .replace(/<[^>]+>/g, '')
        .replace(/[#*_~\[\]()\-+=>|{}]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      return {
        id: idx, // 使用新的 finalSlug 生成 ID
        slug: `/posts/${finalSlug}/`, // 完整的 URL 路径
        title: data.title,
        description: data.description || '',
        content: plainText,
        pubDate: data.published ? new Date(data.published).getTime() : new Date().getTime(),
      };
    })
  );
}

async function main() {
  try {
    console.log(`Deleting index '${INDEX_NAME}' if it exists...`);
    // 删除旧索引
    await client.deleteIndexIfExists(INDEX_NAME);
    console.log(`Index '${INDEX_NAME}' deleted.`);

    const documents = await getDocuments();
    if (documents.length === 0) {
        console.log('No documents found to index.');
        return;
    }
    console.log(`Found ${documents.length} documents to index.`);

    // 创建新索引
    const index = client.index(INDEX_NAME);

    // 更新配置
    await index.updateSettings({
      searchableAttributes: ['title', 'content', 'description'],
      displayedAttributes: ['title', 'description', 'content', 'pubDate', 'slug'],
      sortableAttributes: ['pubDate'],
    });
    console.log('Index settings updated.');

    await index.addDocuments(documents, { primaryKey: 'id' });
    console.log('MeiliSearch indexing completed successfully!');
  } catch (error) {
    console.error('Error during indexing:', error);
    process.exit(1);
  }
}

main();
