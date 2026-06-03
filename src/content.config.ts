import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const postsCollection = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
	schema: z
		.object({
			title: z.string(),
			published: z.date().optional(),
			pubDate: z.date().optional(),
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
			comment: z.boolean().optional().default(true),
			password: z.string().optional().default(""),
			passwordHint: z.string().optional().default(""),

			/* For internal use */
			prevTitle: z.string().default(""),
			prevSlug: z.string().default(""),
			nextTitle: z.string().default(""),
			nextSlug: z.string().default(""),
		})
		.refine((data) => data.published || data.pubDate, {
			message: "Either published or pubDate is required.",
			path: ["published"],
		})
		.transform(({ pubDate, ...data }) => {
			const published = data.published ?? pubDate;
			if (!published) {
				throw new Error("Either published or pubDate is required.");
			}

			return {
				...data,
				published,
			};
		}),
});

const specCollection = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/spec" }),
	schema: z.object({}),
});

export const collections = {
	posts: postsCollection,
	spec: specCollection,
};
