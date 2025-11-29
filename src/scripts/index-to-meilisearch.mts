import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { glob } from "glob";
import matter from "gray-matter";
import { MeiliSearch } from "meilisearch";
import { navBarSearchConfig } from "../config/index.ts";

class MeiliSearchIndexer {
	private client: MeiliSearch;

	constructor(
		private MEILI_HOST: string,
		private MEILI_MASTER_KEY: string | undefined,
		private INDEX_NAME: string,
		private contentDir: string,
	) {
		if (!MEILI_HOST || !INDEX_NAME || !contentDir) {
			console.error(
				"Error: MeiliSearch configuration is incomplete. Please check your settings.",
			);
			process.exit(1);
		}
		if (!MEILI_MASTER_KEY) {
			console.error(
				"Error: MeiliSearch master key is missing. Please provide the MEILI_MASTER_KEY environment variable.",
			);
			process.exit(1);
		}
		this.client = new MeiliSearch({
			host: this.MEILI_HOST,
			apiKey: this.MEILI_MASTER_KEY,
		});
		console.log("Running MeiliSearch Indexer:", MEILI_HOST);
	}

	async getDocuments() {
		// glob 模式以递归搜索所有子目录
		const files = await glob(`${this.contentDir}/**/*.{md,mdx}`);

		return await Promise.all(
			files.map(async (file, idx) => {
				const content = await fs.readFile(file, "utf-8");
				const { data, content: body } = matter(content);

				// 获取文件相对于 'src/content/posts' 的路径
				const relativePath = path.relative(this.contentDir, file);

				// 解析路径，得到目录(dir)和文件名(name)
				const { dir, name } = path.parse(relativePath);

				// 根据 Astro 规则生成 slug:
				// - 如果文件名是 'index', slug 就是它的父目录路径。
				// - 否则, slug 是 目录路径 + 文件名。
				const slugPart = name === "index" ? dir : path.join(dir, name);

				// 确保在 Windows 上也能正确生成 URL 路径（将 \ 替换为 /）
				const finalSlug = slugPart.replace(/\\/g, "/");

				const plainText = body
					.replace(/```[\s\S]*?```/g, "")
					.replace(/(^|\n)( {4,}|\t).*(\n|$)/g, "\n")
					.replace(/`[^`]*`/g, "")
					.replace(/---[\s\S]*?---/g, "")
					.replace(/<[^>]+>/g, "")
					.replace(/[#*_~[\]()\-+=>|{}]/g, "")
					.replace(/\s+/g, " ")
					.trim();

				return {
					id: idx,
					slug: `/posts/${finalSlug}/`, // 完整的 URL 路径
					title: data.title,
					description: data.description || "",
					content: plainText,
					pubDate: data.published
						? new Date(data.published).getTime()
						: Date.now(),
				};
			}),
		);
	}

	async main() {
		try {
			// 删除旧索引
			await this.client.deleteIndexIfExists(this.INDEX_NAME);
			console.log(`Index '${this.INDEX_NAME}' deleted.`);

			const documents = await this.getDocuments();
			if (documents.length === 0) {
				console.log("No documents found to index.");
				return;
			}
			console.log(`Found ${documents.length} documents to index.`);

			// 创建新索引
			const index = this.client.index(this.INDEX_NAME);

			// 更新配置
			await index.updateSettings({
				searchableAttributes: ["title", "content", "description"],
				displayedAttributes: [
					"title",
					"description",
					"content",
					"pubDate",
					"slug",
				],
				sortableAttributes: ["pubDate"],
			});
			console.log("Index settings updated.");

			await index.addDocuments(documents, { primaryKey: "id" });
			console.log("MeiliSearch indexing completed successfully!");
		} catch (error) {
			console.error("Error during indexing:", error);
			process.exit(1);
		}
	}
}

const isMain = import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
	const { meiliSearchConfig } = navBarSearchConfig;
	if (!meiliSearchConfig) {
		console.error(
			"Error: MeiliSearch configuration is missing in navBarConfig.",
		);
		process.exit(1);
	}
	const MEILI_MASTER_KEY = process.env.MEILI_MASTER_KEY;
	const indexer = new MeiliSearchIndexer(
		meiliSearchConfig.MEILI_HOST,
		MEILI_MASTER_KEY,
		meiliSearchConfig.INDEX_NAME,
		meiliSearchConfig.CONTENT_DIR,
	);

	await indexer.main();
	console.log("Indexing completed successfully.");
}

export default MeiliSearchIndexer;
