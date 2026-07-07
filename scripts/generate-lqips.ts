// LQIP 方案来源: https://blog.cosine.ren/post/astro-lqip-implementation

import sharp from "sharp";
import { glob } from "glob";
import fs from "fs/promises";
import path from "path";

const SRC_DIR = "src";
const PUBLIC_DIR = "public";
const OUTPUT_FILE = "src/constants/lqips.json";
// 需要忽略的目录（相对于项目根目录）
const IGNORE_DIRS = [
	"public/favicon/**",
	"public/pio/**",
	"public/assets/images/effects/**",
	"public/assets/music/**",
];

type LqipMap = Record<string, string>;

async function processImage(imagePath: string): Promise<string | null> {
	try {
		const buffer = await sharp(imagePath)
			.resize(16, 16, { fit: "inside" })
			.jpeg({ quality: 15, mozjpeg: true })
			.toBuffer();
		return `data:image/jpeg;base64,${buffer.toString("base64")}`;
	} catch (error) {
		console.error(`Error processing ${imagePath}:`, error);
		return null;
	}
}

function filePathToKey(filePath: string): string {
	if (filePath.startsWith(PUBLIC_DIR)) {
		return `public:${path.relative(PUBLIC_DIR, filePath).replace(/\\/g, "/")}`;
	}
	return `src:${path.relative(SRC_DIR, filePath).replace(/\\/g, "/")}`;
}

async function main() {
	// 读取已有的 lqips.json
	let existingLqips: LqipMap = {};
	try {
		const content = await fs.readFile(OUTPUT_FILE, "utf-8");
		existingLqips = JSON.parse(content);
		console.log(
			`Loaded ${Object.keys(existingLqips).length} existing entries from ${OUTPUT_FILE}`,
		);
	} catch {
		console.log(`No existing ${OUTPUT_FILE} found, will create new.`);
	}

	const files = await glob("{src,public}/**/*.{png,jpg,jpeg,webp,avif}", {
		ignore: IGNORE_DIRS,
	});

	if (files.length === 0) {
		console.log("No image files found.");
		return;
	}

	// 移除已不存在的图片数据
	const currentKeys = new Set(files.map((file) => filePathToKey(file)));
	const removedKeys = Object.keys(existingLqips).filter(
		(key) => !currentKeys.has(key),
	);
	for (const key of removedKeys) {
		delete existingLqips[key];
	}
	if (removedKeys.length > 0) {
		console.log(
			`Removed ${removedKeys.length} stale entries: ${removedKeys.join(", ")}`,
		);
	}

	// 过滤掉已有数据的图片
	const newFiles = files.filter((file) => {
		const key = filePathToKey(file);
		return !(key in existingLqips);
	});

	console.log(
		`Found ${files.length} images, ${newFiles.length} new to process.`,
	);

	const lqips: LqipMap = { ...existingLqips };
	let processed = 0;

	if (newFiles.length > 0) {
		for (const file of newFiles) {
			const filePath = path.resolve(file);
			process.stdout.write(
				`\rProcessing ${processed + 1}/${newFiles.length}...`,
			);
			const compact = await processImage(filePath);
			if (compact !== null) {
				const key = filePathToKey(file);
				lqips[key] = compact;
				processed++;
			}
		}
	}

	const dir = path.dirname(OUTPUT_FILE);
	await fs.mkdir(dir, { recursive: true });
	await fs.writeFile(OUTPUT_FILE, JSON.stringify(lqips, null, 2), "utf-8");

	console.log(
		`\nDone! Processed ${processed}/${newFiles.length} new images. Total: ${Object.keys(lqips).length}. Output: ${OUTPUT_FILE}`,
	);
}

main();
