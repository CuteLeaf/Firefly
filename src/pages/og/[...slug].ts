import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import * as fs from "node:fs";
import type { APIContext, GetStaticPaths } from "astro";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import { profileConfig } from "@/config/profileConfig";
import { siteConfig } from "@/config/siteConfig";
import { removeFileExtension } from "@/utils/url-utils";

export const prerender = true;

export const getStaticPaths: GetStaticPaths = async () => {
	if (!siteConfig.post.generateOgImages) {
		return [];
	}

	const allPosts = await getCollection("posts");
	const publishedPosts = allPosts.filter((post) => !post.data.draft);

	return publishedPosts.map((post) => {
		// 将 id 转换为 slug（移除扩展名）以匹配路由参数
		const slug = removeFileExtension(post.id);
		return {
			params: { slug: `${slug}.png` },
			props: { post },
		};
	});
};

const fontCache = new Map<string, Promise<string>>(); //new Map();

// Detect image format from magic bytes, returns mime type or null if unknown
const detectImageFormat = (buffer: Buffer): string | null => {
	if (buffer.length < 12) return null;

	// PNG: 89 50 4E 47 0D 0A 1A 0A
	if (
		buffer[0] === 0x89 &&
		buffer[1] === 0x50 &&
		buffer[2] === 0x4e &&
		buffer[3] === 0x47 &&
		buffer[4] === 0x0d &&
		buffer[5] === 0x0a &&
		buffer[6] === 0x1a &&
		buffer[7] === 0x0a
	)
		return "image/png";

	// JPEG: FF D8 FF
	if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff)
		return "image/jpeg";

	// GIF: GIF87a or GIF89a
	if (
		buffer[0] === 0x47 &&
		buffer[1] === 0x49 &&
		buffer[2] === 0x46 &&
		buffer[3] === 0x38 &&
		(buffer[4] === 0x37 || buffer[4] === 0x39) &&
		buffer[5] === 0x61
	)
		return "image/gif";

	// WebP: RIFF ???? WEBP
	if (
		buffer[0] === 0x52 &&
		buffer[1] === 0x49 &&
		buffer[2] === 0x46 &&
		buffer[3] === 0x46 &&
		buffer[8] === 0x57 &&
		buffer[9] === 0x45 &&
		buffer[10] === 0x42 &&
		buffer[11] === 0x50
	)
		return "image/webp";

	return null;
};

// Formats natively supported — no conversion needed
const SUPPORTED_FORMATS = new Set([
	"image/png",
	"image/jpeg",
	"image/gif",
	"image/webp",
]);

// 缓存 sharp 模块，避免重复动态导入
let sharpPromise: Promise<typeof import("sharp")["default"]> | null = null;
function getSharp() {
	if (!sharpPromise) {
		sharpPromise = import("sharp").then((m) => m.default);
	}
	return sharpPromise;
}

// Minimal 1×1 transparent PNG, hardcoded — no sharp call needed for fallback,
// so it still works even if sharp itself failed to load.
const TRANSPARENT_PNG_BASE64 =
	"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

let transparentPngBuffer: ArrayBuffer | null = null;
function getTransparentPngArrayBuffer(): ArrayBuffer {
	if (!transparentPngBuffer) {
		const buf = Buffer.from(TRANSPARENT_PNG_BASE64, "base64");
		transparentPngBuffer = buf.buffer.slice(
			buf.byteOffset,
			buf.byteOffset + buf.byteLength,
		) as ArrayBuffer;
	}
	return transparentPngBuffer;
}

// Log a warning and fall back to a transparent PNG
const warnAndFallback = (imagePath: string, detail: string): ArrayBuffer => {
	console.warn(
		"\n \x1b[33m[OG Image] Warning \n" +
			` 无法加载或处理图片 "${imagePath}"，可能是文件缺失、网络错误或不被支持的格式。\n` +
			" 已使用透明图片替代。\n" +
			` Failed to load or process image "${imagePath}", possibly missing file, network error, or unsupported format.\n` +
			" A transparent image was used instead.\n" +
			` ${detail}\x1b[0m`,
	);
	return getTransparentPngArrayBuffer();
};

// Helper to load avatar/favicon with caching
const loadImageAsArrayBuffer = async (
	imagePath: string,
): Promise<ArrayBuffer> => {
	try {
		let buffer: Buffer;

		if (imagePath.startsWith("http")) {
			const res = await fetch(imagePath);
			if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
			buffer = Buffer.from(await res.arrayBuffer());
		} else {
			const normalized = imagePath.replace(/^\.\//, "");

			// Try resolving the file in order: src/ -> public/ -> path as-is
			const candidatePaths = [`./src/${normalized}`, `./public/${normalized}`];

			const foundPath = candidatePaths.find((p) => fs.existsSync(p));

			if (!foundPath) {
				return warnAndFallback(
					imagePath,
					`Tried paths: ${candidatePaths.join(", ")}`,
				);
			}

			buffer = fs.readFileSync(foundPath);
		}

		const detectedFormat = detectImageFormat(buffer);

		if (!detectedFormat || !SUPPORTED_FORMATS.has(detectedFormat)) {
			const sharp = await getSharp();
			buffer = Buffer.from(
				await sharp(buffer as Buffer)
					.png()
					.toBuffer(),
			);
		}

		return buffer.buffer.slice(
			buffer.byteOffset,
			buffer.byteOffset + buffer.byteLength,
		) as ArrayBuffer;
	} catch (err) {
		return warnAndFallback(
			imagePath,
			`Error: ${err instanceof Error ? err.message : String(err)}`,
		);
	}
};

export async function GET({
	props,
}: APIContext<{ post: CollectionEntry<"posts"> }>): Promise<Response> {
	const { post } = props;

	// Load and get static assets
	let iconPath = "/favicon/favicon-dark-192.png";
	if (siteConfig.favicon.length > 0) {
		const pngFavicon = siteConfig.favicon.find((f) =>
			f.src.toLowerCase().endsWith(".png"),
		);
		iconPath = (pngFavicon ?? siteConfig.favicon[0]).src;
	}

	const hue = siteConfig.themeColor.hue;
	const primaryColor = `hsl(${hue}, 90%, 65%)`;
	const textColor = "hsl(0, 0%, 95%)";
	const subtleTextColor = `hsl(${hue}, 10%, 75%)`;
	const backgroundColor = `hsl(${hue}, 15%, 12%)`;

	const pubDate = post.data.published.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	const description = post.data.description;

	return new ImageResponse(
		{
			type: "div",
			props: {
				style: {
					height: "100%",
					width: "100%",
					display: "flex",
					flexDirection: "column",
					backgroundColor: backgroundColor,
					fontFamily:
						'"Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
					padding: "60px",
				},
				children: [
					{
						type: "div",
						props: {
							style: {
								width: "100%",
								display: "flex",
								alignItems: "center",
								gap: "20px",
							},
							children: [
								{
									type: "img",
									props: {
										src: "og-icon",
										width: 48,
										height: 48,
										style: {
											borderRadius: "10px",
											width: 48,
											height: 48,
											objectFit: "cover",
										},
									},
								},
								{
									type: "div",
									props: {
										style: {
											fontSize: "36px",
											fontWeight: 600,
											color: subtleTextColor,
										},
										children: siteConfig.title,
									},
								},
							],
						},
					},

					{
						type: "div",
						props: {
							style: {
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								flexGrow: 1,
								gap: "20px",
							},
							children: [
								{
									type: "div",
									props: {
										style: {
											display: "flex",
											alignItems: "flex-start",
										},
										children: [
											{
												type: "div",
												props: {
													style: {
														width: "10px",
														height: "68px",
														backgroundColor: primaryColor,
														borderRadius: "6px",
														marginTop: "14px",
														flexShrink: 0,
													},
												},
											},
											{
												type: "div",
												props: {
													style: {
														fontSize: "72px",
														fontWeight: 700,
														color: textColor,
														marginLeft: "25px",
														overflow: "hidden",
														textOverflow: "ellipsis",
														lineClamp: 3,
														WebkitLineClamp: 3,
														WebkitBoxOrient: "vertical",
														"text-fit": "grow per-line-all",
														display: "flex",
														flexDirection: "column",
													},
													children: post.data.title,
												},
											},
										],
									},
								},
								...(description
									? [
											{
												type: "div",
												props: {
													style: {
														fontSize: "32px",
														color: subtleTextColor,
														paddingLeft: "35px",
														overflow: "hidden",
														textOverflow: "ellipsis",
														lineClamp: 2,
														WebkitLineClamp: 2,
														WebkitBoxOrient: "vertical",
														"text-fit": "grow per-line-all",
														display: "flex",
														flexDirection: "column",
													},
													children: description,
												},
											},
										]
									: []),
							],
						},
					},
					{
						type: "div",
						props: {
							style: {
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								width: "100%",
							},
							children: [
								{
									type: "div",
									props: {
										style: {
											display: "flex",
											alignItems: "center",
											gap: "20px",
										},
										children: [
											{
												type: "img",
												props: {
													src: "og-avatar",
													width: 60,
													height: 60,
													style: {
														borderRadius: "50%",
														width: 60,
														height: 60,
														objectFit: "cover",
													},
												},
											},
											{
												type: "div",
												props: {
													style: {
														fontSize: "28px",
														fontWeight: 600,
														color: textColor,
													},
													children: profileConfig.name,
												},
											},
										],
									},
								},
								{
									type: "div",
									props: {
										style: { fontSize: "28px", color: subtleTextColor },
										children: pubDate,
									},
								},
							],
						},
					},
				],
			},
		},
		{
			width: 1200,
			height: 630,
			format: "png",
			images: {
				cache: "auto",
				sources: [
					{
						src: "og-avatar",
						data: () => loadImageAsArrayBuffer(profileConfig.avatar ?? ""),
					},
					{
						src: "og-icon",
						data: () => loadImageAsArrayBuffer(iconPath),
					},
				],
			},
			fonts: googleFonts({
				families: [
					{
						name: "Noto Sans SC",
						weight: "100..900",
						style: "normal",
					},
				],
				cache: fontCache,
			}),
			headers: {
				"Content-Type": "image/png",
				"Cache-Control": "public, max-age=31536000, immutable",
			},
		},
	);
}
