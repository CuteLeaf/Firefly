import { getImage } from "astro:assets";
import type { RSSFeedItem } from "@astrojs/rss";
import rss from "@astrojs/rss";
import type { APIContext, ImageMetadata } from "astro";
import { parse as htmlParser } from "node-html-parser";
import { getSortedPosts } from "@/utils/content-utils";
import { siteConfig } from "../config";

// Regex pattern for control characters (except \t \n \r) - using RegExp constructor to avoid lint warning
// biome-ignore lint/suspicious/noControlCharactersInRegex: Intentionally matching control characters to remove them from XML
const CONTROL_CHARS_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

// Function to sanitize XML content by removing invalid characters
function sanitizeXmlContent(content: string): string {
	return content
		.replace(CONTROL_CHARS_REGEX, "") // Remove control characters except \t, \n, \r
		.replace(/&(?!amp;|lt;|gt;|quot;|apos;)/g, "&amp;") // Escape unescaped ampersands
		.replace(/</g, "&lt;") // Escape <
		.replace(/>/g, "&gt;") // Escape >
		.replace(/"/g, "&quot;") // Escape "
		.replace(/'/g, "&apos;"); // Escape '
}

// Function to sanitize HTML content for XML (removes invalid chars but preserves HTML)
function sanitizeHtmlForXml(content: string): string {
	return content
		.replace(CONTROL_CHARS_REGEX, "") // Remove control characters except \t, \n, \r
		.replace(/&(?!amp;|lt;|gt;|quot;|apos;)/g, "&amp;"); // Only escape unescaped ampersands
}

// Constants
const CONTENT_POSTS_PATH = "/src/content/posts";
const CONTENT_PATH = "/src/content";

// Dynamic imports will be done inside the GET function

// get dynamic import of images as a map collection
const imagesGlob = import.meta.glob<{ default: ImageMetadata }>(
	"/src/content/**/*.{jpeg,jpg,png,gif,webp}", // include posts and assets
);

// Helper function to extract post directory
function getPostDirectory(postId: string): string {
	return postId.includes("/") ? postId.split("/")[0] : "";
}

// Helper function to build image import path
function buildImageImportPath(src: string, postId: string): string | null {
	if (src.startsWith("./")) {
		const prefixRemoved = src.slice(2);
		const postDir = getPostDirectory(postId);
		return postDir
			? `${CONTENT_POSTS_PATH}/${postDir}/${prefixRemoved}`
			: `${CONTENT_POSTS_PATH}/${prefixRemoved}`;
	}
	if (src.startsWith("../")) {
		const cleaned = src.replace(/^\.\.\//, "");
		return `${CONTENT_PATH}/${cleaned}`;
	}
	// Handle direct filename (no ./ prefix)
	const postDir = getPostDirectory(postId);
	return postDir
		? `${CONTENT_POSTS_PATH}/${postDir}/${src}`
		: `${CONTENT_POSTS_PATH}/${src}`;
}

export async function GET(context: APIContext) {
	if (!context.site) {
		throw new Error("site not set");
	}

	// Dynamic imports with proper type handling
	const markdownItModule = await import("markdown-it");
	const sanitizeHtmlModule = await import("sanitize-html");

	// Handle both CommonJS and ES module exports with proper typing
	const MarkdownIt =
		(markdownItModule as { default?: any }).default || markdownItModule;
	const sanitizeHtml =
		(sanitizeHtmlModule as { default?: any }).default || sanitizeHtmlModule;
	const markdownParser = new MarkdownIt();

	// Use the same ordering as site listing (pinned first, then by published desc)
	const posts = await getSortedPosts();
	const feed: RSSFeedItem[] = [];

	// Process posts in parallel for better performance
	const processedPosts = await Promise.all(
		posts.map(async (post) => {
			// convert markdown to html string
			const body = markdownParser.render(post.body);
			// convert html string to DOM-like structure
			const html = htmlParser.parse(body);
			// hold all img tags in variable images
			const images = html.querySelectorAll("img");

			// Process images in parallel
			await Promise.all(
				images.map(async (img) => {
					const src = img.getAttribute("src");
					if (!src) return;

					// Handle content-relative images and convert them to built _astro paths
					if (
						src.startsWith("./") ||
						src.startsWith("../") ||
						(!src.startsWith("http") && !src.startsWith("/"))
					) {
						const importPath = buildImageImportPath(src, post.id);
						if (!importPath) return;

						try {
							const imageMod = await imagesGlob[importPath]?.()?.then(
								(res) => res.default,
							);
							if (imageMod) {
								const optimizedImg = await getImage({ src: imageMod });
								img.setAttribute(
									"src",
									new URL(optimizedImg.src, context.site).href,
								);
							} else {
								// Only log in development mode
								if (import.meta.env.DEV) {
									console.warn(
										`Failed to load image: ${importPath} for post: ${post.id}`,
									);
								}
							}
						} catch (error) {
							// Handle image loading errors gracefully
							if (import.meta.env.DEV) {
								console.error(
									`Error loading image ${importPath} for post ${post.id}:`,
									error,
								);
							}
						}
					} else if (src.startsWith("/")) {
						// images starting with `/` are in public dir
						img.setAttribute("src", new URL(src, context.site).href);
					}
				}),
			);

			return {
				post,
				html,
			};
		}),
	);

	for (const { post, html } of processedPosts) {
		feed.push({
			title: sanitizeXmlContent(post.data.title),
			description: sanitizeXmlContent(post.data.description || ""),
			pubDate: post.data.published,
			link: `/posts/${post.id}/`,
			// content:encoded should contain HTML but must be XML-safe
			content: sanitizeHtmlForXml(
				sanitizeHtml(html.toString(), {
					allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
				}),
			),
		});
	}

	return rss({
		title:
			sanitizeXmlContent(siteConfig.title) +
			" - " +
			sanitizeXmlContent(siteConfig.subtitle),
		description: sanitizeXmlContent(
			siteConfig.description || siteConfig.subtitle || "No description",
		),
		site: context.site,
		items: feed,
		customData: `<language>${sanitizeXmlContent(siteConfig.lang)}</language>`,
	});
}
