import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const postsCollection = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
	schema: z.object({
		title: z.string(),
		// 使用 coerce 可以自动将 Hugo 的字符串日期转换为 JavaScript Date 对象
		date: z.coerce.date().optional(),
		lastmod: z.coerce.date().optional(),
		published: z.coerce.date().optional(),
		updated: z.coerce.date().optional(),

		// 支持 Hugo 的 slug，这样迁移后文章链接不会变
		slug: z.string().optional(),

		description: z.string().optional().default(""),
		author: z.string().optional().default(""),
		draft: z.boolean().optional().default(false),

		// 分类与标签
		categories: z.array(z.string()).optional().default([]),
		category: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),

		// 主题原有字段（设为可选以防报错）
		image: z.string().optional().default(""),
		pinned: z.boolean().optional().default(false),
		comment: z.boolean().optional().default(true),
	}).transform((data) => {
		// 映射逻辑
		const finalDate = data.date || data.published || new Date();
		const finalUpdated = data.lastmod || data.updated || finalDate;

		return {
			...data,
			// 确保主题能读到日期
			published: finalDate,
			updated: finalUpdated,
			// 确保主题能读到分类（取数组第一个）
			category: (data.category && data.category !== "")
				? data.category
				: (data.categories.length > 0 ? data.categories[0] : "Uncategorized"),
		};
	}),
});

export const collections = {
	posts: postsCollection,
};