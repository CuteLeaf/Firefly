import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const postsCollection = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().nullable().default(""),
		lang: z.string().optional().default(""),
		pinned: z.boolean().optional().default(false),
		author: z.string().optional().default(""),
		sourceLink: z.string().optional().default(""),
		licenseName: z.string().optional().default(""),
		licenseUrl: z.string().optional().default(""),

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});

const specCollection = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/spec" }),
	schema: z.object({}),
});

// 添加 minecraft 集合
const minecraftCollection = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/minecraft" }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional().default(""),
		date: z.date(),
		type: z.enum(['news', 'update', 'event']).default('news'),
	}),
});

// 只保留一个 export collections，合并所有集合
export const collections = {
	posts: postsCollection,
	spec: specCollection,
	minecraft: minecraftCollection, // 添加这一行
};