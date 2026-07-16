import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import * as fs from "node:fs";
import type { APIContext, GetStaticPaths } from "astro";
import satori from "satori";
import { removeFileExtension } from "@/utils/url-utils";

import { profileConfig } from "../../config/profileConfig";
import { siteConfig } from "../../config/siteConfig";

type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

type FontStyle = "normal" | "italic";
interface FontOptions {
	data: Buffer | ArrayBuffer;
	name: string;
	weight?: Weight;
	style?: FontStyle;
	lang?: string;
}
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

let fontCache: { regular: Buffer | null; bold: Buffer | null } | null = null;

async function fetchNotoSansSCFonts() {
	if (fontCache) return fontCache;
	try {
		const cssResp = await fetch(
			"https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap",
		);
		if (!cssResp.ok) throw new Error("Failed to fetch Google Fonts CSS");
		const cssText = await cssResp.text();

		const getUrlForWeight = (weight: number) => {
			const blockRe = new RegExp(
				`@font-face\\s*{[^}]*font-weight:\\s*${weight}[^}]*}`,
				"g",
			);
			const match = cssText.match(blockRe);
			if (!match || match.length === 0) return null;
			const urlMatch = match[0].match(/url\((https:[^)]+)\)/);
			return urlMatch ? urlMatch[1] : null;
		};

		const regularUrl = getUrlForWeight(400);
		const boldUrl = getUrlForWeight(700);

		if (!regularUrl || !boldUrl) {
			console.warn(
				"Could not find font urls in Google Fonts CSS; falling back to no fonts.",
			);
			fontCache = { regular: null, bold: null };
			return { regular: null, bold: null };
		}

		const [rResp, bResp] = await Promise.all([
			fetch(regularUrl),
			fetch(boldUrl),
		]);
		if (!rResp.ok || !bResp.ok) {
			console.warn(
				"Failed to download font files from Google; falling back to no fonts.",
			);
			fontCache = { regular: null, bold: null };
			return { regular: null, bold: null };
		}

		const rBuf = Buffer.from(await rResp.arrayBuffer());
		const bBuf = Buffer.from(await bResp.arrayBuffer());
		fontCache = { regular: rBuf, bold: bBuf };
		return fontCache;
	} catch (err) {
		console.warn("Error fetching fonts:", err);
		fontCache = { regular: null, bold: null };
		return { regular: null, bold: null };
	}
}

// 缓存 sharp 模块，避免在每次 GET 调用中重复动态导入
let sharpPromise: Promise<typeof import("sharp")["default"]> | null = null;
function getSharp() {
	if (!sharpPromise) {
		sharpPromise = import("sharp").then((m) => m.default);
	}
	return sharpPromise;
}

/**
 * 获取 1×1 透明 PNG 的 base64 Data URL（兜底图片）。
 *
 * 当图片处理失败（如格式不被 sharp 支持）时，使用此透明占位图替代。
 * 通过 sharp 的 `create` API 生成，懒加载且仅生成一次，结果被缓存。
 *
 * @returns `data:image/png;base64,...` 格式的透明 PNG Data URL
 */
let transparentPngPromise: Promise<string> | null = null;
function getTransparentPngBase64(): Promise<string> {
	if (!transparentPngPromise) {
		transparentPngPromise = getSharp().then((sharp) =>
			sharp({
				create: {
					width: 1,
					height: 1,
					channels: 4,
					background: { r: 0, g: 0, b: 0, alpha: 0 },
				},
			})
				.png()
				.toBuffer()
				.then((buf) => `data:image/png;base64,${buf.toString("base64")}`),
		);
	}
	return transparentPngPromise;
}

// 已转换图片的缓存（按源路径），避免对同一文件（如头像、站点图标）重复进行 sharp 处理
const convertedImageCache = new Map<string, string>();

/**
 * 将图片 Buffer 转换为 PNG base64 Data URL，并缓存结果。
 *
 * 以源文件路径作为缓存键，避免对同一图片文件（如头像、站点图标）
 * 在多次 OG 图片生成中重复进行 sharp 处理。
 * 若 sharp 无法处理该图片格式，会输出警告并使用透明占位图代替。
 *
 * @param imageBuffer - 图片文件的原始 Buffer
 * @param sourcePath - 图片文件的磁盘路径，用作缓存键
 * @returns `data:image/png;base64,...` 格式的 PNG Data URL；处理失败时返回透明图
 */
async function imageToPngBase64(
	imageBuffer: Buffer,
	sourcePath: string,
): Promise<string> {
	const cached = convertedImageCache.get(sourcePath);
	if (cached) return cached;

	const sharp = await getSharp();
	try {
		const pngBuffer = await sharp(imageBuffer).png().toBuffer();
		const result = `data:image/png;base64,${pngBuffer.toString("base64")}`;
		convertedImageCache.set(sourcePath, result);
		return result;
	} catch (err) {
		console.warn(
			"\n \x1b[33m[OG Image] Warning \n" +
				`  无法处理图片 "${sourcePath}"，可能是不被 sharp 支持的图片格式。\n` +
				"  已使用透明图片替代，请将图片转换为 sharp 支持的格式（PNG/JPEG/WebP/AVIF/TIFF/SVG）。\n" +
				`  Failed to process image "${sourcePath}", possibly an unsupported image format for sharp.\n` +
				"  A transparent image was used instead. Please convert it to a sharp-supported format.\n" +
				`  Error: ${err instanceof Error ? err.message : String(err)}\x1b[0m`,
		);
		return getTransparentPngBase64();
	}
}

export async function GET({
	props,
}: APIContext<{ post: CollectionEntry<"posts"> }>) {
	const { post } = props;

	// Try to fetch fonts from Google Fonts (woff2) at runtime.
	const { regular: fontRegular, bold: fontBold } = await fetchNotoSansSCFonts();

	// 头像处理
	let avatarBase64: string;
	if (profileConfig.avatar?.startsWith("http")) {
		avatarBase64 = profileConfig.avatar;
	} else {
		const avatarPath = profileConfig.avatar?.startsWith("/")
			? `./public${profileConfig.avatar}`
			: `./src/${profileConfig.avatar}`;
		avatarBase64 = await imageToPngBase64(
			fs.readFileSync(avatarPath),
			avatarPath,
		);
	}

	// 站点图标处理：优先选择 png 格式的图标，回退到第一个 favicon
	let iconPath = "./public/favicon/favicon-dark-192.png";
	if (siteConfig.favicon.length > 0) {
		const pngFavicon = siteConfig.favicon.find((f) =>
			f.src.toLowerCase().endsWith(".png"),
		);
		iconPath = `./public${(pngFavicon ?? siteConfig.favicon[0]).src}`;
	}
	const iconBase64 = await imageToPngBase64(
		fs.readFileSync(iconPath),
		iconPath,
	);

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

	const template = {
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
									src: iconBase64,
									width: 48,
									height: 48,
									style: { borderRadius: "10px" },
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
												},
											},
										},
										{
											type: "div",
											props: {
												style: {
													fontSize: "72px",
													fontWeight: 700,
													lineHeight: 1.2,
													color: textColor,
													marginLeft: "25px",
													display: "-webkit-box",
													overflow: "hidden",
													textOverflow: "ellipsis",
													lineClamp: 3,
													WebkitLineClamp: 3,
													WebkitBoxOrient: "vertical",
												},
												children: post.data.title,
											},
										},
									],
								},
							},
							description && {
								type: "div",
								props: {
									style: {
										fontSize: "32px",
										lineHeight: 1.5,
										color: subtleTextColor,
										paddingLeft: "35px",
										display: "-webkit-box",
										overflow: "hidden",
										textOverflow: "ellipsis",
										lineClamp: 2,
										WebkitLineClamp: 2,
										WebkitBoxOrient: "vertical",
									},
									children: description,
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
												src: avatarBase64,
												width: 60,
												height: 60,
												style: { borderRadius: "50%" },
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
	};

	const fonts: FontOptions[] = [];
	if (fontRegular) {
		fonts.push({
			name: "Noto Sans SC",
			data: fontRegular,
			weight: 400,
			style: "normal",
		});
	}
	if (fontBold) {
		fonts.push({
			name: "Noto Sans SC",
			data: fontBold,
			weight: 700,
			style: "normal",
		});
	}

	const svg = await satori(template, {
		width: 1200,
		height: 630,
		fonts,
	});

	const sharp = await getSharp();
	const png = await sharp(Buffer.from(svg)).png().toBuffer();

	return new Response(new Uint8Array(png), {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
}
