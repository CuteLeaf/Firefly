/**
 * AI 文章总结生成脚本
 *
 * 功能：扫描 src/content/posts/ 下的所有 .md/.mdx 文件，
 * 对缺少 ai 字段的文章调用 AI API 生成摘要，
 * 并将结果写入 Front-matter。
 *
 * 用法：
 *   pnpm ai-summary           # 仅生成缺失的总结
 *   pnpm ai-summary -- --force   # 强制重新生成所有总结
 *   pnpm ai-summary -- --dry-run # 预览模式，不实际调用 API
 */

import fs from "node:fs";
import path from "node:path";
import { glob } from "glob";
import matter from "gray-matter";

// ============================================================
// 加载 .env 文件
// ============================================================

const envPath = path.resolve(import.meta.dirname, "../.env");
if (fs.existsSync(envPath)) {
	const envContent = fs.readFileSync(envPath, "utf-8");
	for (const line of envContent.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const eqIdx = trimmed.indexOf("=");
		if (eqIdx === -1) continue;
		const key = trimmed.slice(0, eqIdx).trim();
		const value = trimmed.slice(eqIdx + 1).trim();
		if (!process.env[key]) {
			process.env[key] = value;
		}
	}
}

// ============================================================
// 配置
// ============================================================

const CONFIG = {
	// 文章目录
	postsDir: path.resolve(import.meta.dirname, "../src/content/posts"),

	// Front-matter 字段名
	aiField: "ai",

	// AI 模型
	model: process.env.AI_MODEL || "gpt-4o-mini",

	// AI API 地址
	baseUrl: (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, ""),

	// API Key
	apiKey: process.env.OPENAI_API_KEY || "",

	// 截取正文的最大字符数
	maxContentLength: Number.parseInt(process.env.AI_MAX_CONTENT_LENGTH || "4000", 10),

	// 生成总结的最大 token 数
	summaryMaxTokens: Number.parseInt(process.env.AI_SUMMARY_MAX_TOKENS || "300", 10),

	// 并发请求数
	concurrency: Number.parseInt(process.env.AI_CONCURRENCY || "3", 10),
};

// ============================================================
// 日志工具
// ============================================================

const log = {
	info: (msg) => console.log(`[INFO] ${msg}`),
	warn: (msg) => console.warn(`[WARN] ${msg}`),
	error: (msg) => console.error(`[ERROR] ${msg}`),
	success: (msg) => console.log(`[SUCCESS] ${msg}`),
	skip: (msg) => console.log(`[SKIP] ${msg}`),
};

// ============================================================
// 参数解析
// ============================================================

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const DRY_RUN = args.includes("--dry-run");

// ============================================================
// AI API 调用
// ============================================================

/**
 * 调用 AI API 生成文章总结
 * @param {string} content - 文章正文纯文本
 * @returns {Promise<string>} 生成的总结文本
 */
async function generateSummary(content) {
	if (!CONFIG.apiKey) {
		throw new Error("OPENAI_API_KEY 未设置");
	}

	const truncated =
		content.length > CONFIG.maxContentLength
			? content.slice(0, CONFIG.maxContentLength) + "\n\n...（内容已截断）"
			: content;

	const response = await fetch(`${CONFIG.baseUrl}/chat/completions`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${CONFIG.apiKey}`,
		},
		body: JSON.stringify({
			model: CONFIG.model,
			stream: false,
			messages: [
				{
					role: "system",
					content:
						"你是一个博客文章的总结助手。请用简洁的语言概括文章的核心内容，不超过100字。" +
						"请使用与文章正文相同的语言进行总结。直接输出总结内容，不要添加任何前缀或标记。",
				},
				{
					role: "user",
					content: `请总结以下博客文章的核心内容：\n\n${truncated}`,
				},
			],
			max_tokens: CONFIG.summaryMaxTokens,
			temperature: 0.3,
		}),
	});

	if (!response.ok) {
		const errorBody = await response.text().catch(() => "");
		throw new Error(`API 请求失败 (${response.status}): ${errorBody}`);
	}

	// 检查响应 content-type 是否为 text/event-stream (SSE/streaming)
	const contentType = response.headers.get("content-type") || "";
	if (contentType.includes("text/event-stream") || contentType.includes("stream")) {
		throw new Error("API 返回了流式响应（SSE），请确认 API 端点和参数正确");
	}

	const data = await response.json();
	const summary = data.choices?.[0]?.message?.content?.trim();

	if (!summary) {
		throw new Error("API 返回的总结内容为空");
	}

	return summary;
}

// ============================================================
// 文件处理
// ============================================================

/**
 * 从 Markdown 正文中提取纯文本（去除 Markdown 标记）
 * @param {string} raw - 原始 Markdown 内容
 * @returns {string} 纯文本
 */
function extractPlainText(raw) {
	return raw
		.replace(/^---[\s\S]*?---\n*/m, "") // 移除 front-matter
		.replace(/#{1,6}\s+/g, "") // 移除标题标记
		.replace(/(\*|_){1,3}/g, "") // 移除加粗/斜体
		.replace(/```[\s\S]*?```/g, "") // 移除代码块
		.replace(/`[^`]*`/g, "") // 移除行内代码
		.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // 移除链接，保留文本
		.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // 移除图片，保留alt文本
		.replace(/>\s*/g, "") // 移除引用标记
		.replace(/[-*+]\s+/g, "") // 移除列表标记
		.replace(/\n{3,}/g, "\n\n") // 压缩多余空行
		.replace(/^\s+|\s+$/g, "") // 首尾去空
		.trim();
}

/**
 * 处理单个文件：检查并生成 AI 总结
 * @param {string} filePath - 文件绝对路径
 * @returns {Promise<{file: string, status: 'skipped'|'generated'|'error', summary?: string, error?: string}>}
 */
async function processFile(filePath) {
	const relativePath = path.relative(CONFIG.postsDir, filePath);

	try {
		const rawContent = fs.readFileSync(filePath, "utf-8");
		const parsed = matter(rawContent);

		// 检查是否已有 ai 字段
		if (!FORCE && parsed.data[CONFIG.aiField]) {
			log.skip(`${relativePath} 已有 AI 总结，跳过`);
			return { file: relativePath, status: "skipped" };
		}

		// 提取正文纯文本
		const plainText = extractPlainText(rawContent);

		if (!plainText || plainText.length < 10) {
			log.warn(`${relativePath} 正文内容过短，跳过`);
			return { file: relativePath, status: "skipped" };
		}

		if (DRY_RUN) {
			log.info(`[DRY RUN] ${relativePath} 将生成 AI 总结`);
			return { file: relativePath, status: "generated", summary: "(dry-run)" };
		}

		// 调用 AI 生成总结
		log.info(`正在为 ${relativePath} 生成 AI 总结...`);
		const summary = await generateSummary(plainText);

		// 写入文件
		parsed.data[CONFIG.aiField] = summary;
		const newContent = matter.stringify(parsed.content, parsed.data);
		fs.writeFileSync(filePath, newContent, "utf-8");

		log.success(`${relativePath} AI 总结已生成`);
		return { file: relativePath, status: "generated", summary };
	} catch (err) {
		log.error(`${relativePath} 处理失败: ${err.message}`);
		return { file: relativePath, status: "error", error: err.message };
	}
}

/**
 * 并发控制器
 * @param {Array} items - 待处理项
 * @param {Function} fn - 处理函数
 * @param {number} concurrency - 并发数
 * @returns {Promise<Array>} 处理结果
 */
async function runConcurrent(items, fn, concurrency) {
	const results = [];
	const queue = [...items];

	async function worker() {
		while (queue.length > 0) {
			const item = queue.shift();
			results.push(await fn(item));
		}
	}

	const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
	await Promise.all(workers);

	return results;
}

// ============================================================
// 主流程
// ============================================================

async function main() {
	console.log("=".repeat(50));
	console.log("  AI 文章总结生成工具");
	console.log("=".repeat(50));
	console.log(`  文章目录: ${CONFIG.postsDir}`);
	console.log(`  AI 模型:  ${CONFIG.model}`);
	console.log(`  API 地址:  ${CONFIG.baseUrl}`);
	console.log(`  并发数:    ${CONFIG.concurrency}`);
	console.log(`  强制模式:  ${FORCE ? "是" : "否"}`);
	console.log(`  预览模式:  ${DRY_RUN ? "是" : "否"}`);
	console.log("-".repeat(50));

	if (!CONFIG.apiKey) {
		if (DRY_RUN) {
			log.warn("OPENAI_API_KEY 未设置，但当前为预览模式，继续执行...");
		} else {
			log.warn("OPENAI_API_KEY 未设置，跳过 AI 总结生成。");
			console.log("\n提示 - 以下两种方式任选其一：");
			console.log("  1. 在项目根目录创建 .env 文件：");
			console.log("     OPENAI_API_KEY=your-api-key-here");
			console.log("  2. 在部署平台（GitHub Actions / Cloudflare / Vercel 等）设置环境变量：");
			console.log("     OPENAI_API_KEY=your-api-key-here");
			console.log("     OPENAI_BASE_URL=https://api.openai.com/v1  # 可选");
			console.log("\n优先级：系统环境变量 > .env 文件");
			console.log("提示：不设置 API Key 不会影响构建，只是不会生成 AI 总结。\n");
			return;
		}
	}

	// 扫描文章文件
	const pattern = "**/*.{md,mdx}";
	const files = await glob(pattern, { cwd: CONFIG.postsDir, absolute: true });

	if (files.length === 0) {
		log.warn("未找到任何文章文件");
		return;
	}

	log.info(`找到 ${files.length} 篇文章`);

	// 处理文件
	const results = await runConcurrent(files, processFile, CONFIG.concurrency);

	// 汇总统计
	const generated = results.filter((r) => r.status === "generated").length;
	const skipped = results.filter((r) => r.status === "skipped").length;
	const errors = results.filter((r) => r.status === "error").length;

	console.log("-".repeat(50));
	console.log("  处理完成！");
	console.log(`  已生成: ${generated} 篇`);
	console.log(`  已跳过: ${skipped} 篇`);
	console.log(`  失败:   ${errors} 篇`);
	console.log("=".repeat(50));

	if (errors > 0) {
		console.log("\n失败的文件：");
		results
			.filter((r) => r.status === "error")
			.forEach((r) => console.log(`  - ${r.file}: ${r.error}`));
	}
}

main().catch((err) => {
	log.error(`脚本执行失败: ${err.message}`);
	process.exit(1);
});