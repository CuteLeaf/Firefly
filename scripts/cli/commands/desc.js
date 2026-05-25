import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "../../..");

export default async function desc(args, flags) {
	const postsDir = path.join(PROJECT_ROOT, "src/content/posts");

	let targetSlug = args;
	if (!targetSlug) {
		const posts = findPosts(postsDir);
		if (!posts.length) {
			console.error("  No posts found.");
			return;
		}
		console.log("\n  Available posts:");
		posts.forEach((p, i) => console.log(`  [${i + 1}] ${p.relPath}`));
		const readline = await import("node:readline/promises");
		const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
		const idx = parseInt(await rl.question("  Select post: ")) || 1;
		rl.close();
		targetSlug = posts[idx - 1]?.fullPath;
		if (!targetSlug) return;
	} else {
		const posts = findPosts(postsDir);
		const match = posts.find((p) => p.relPath.includes(targetSlug) || p.stem === targetSlug);
		if (!match) {
			console.error(`  Post not found: ${targetSlug}`);
			return;
		}
		targetSlug = match.fullPath;
	}

	const content = fs.readFileSync(targetSlug, "utf-8");
	const body = content.replace(/^---[\s\S]*?---\n?/, "");

	const apiKey = process.env.AI_API_KEY;
	const apiBase = process.env.AI_API_BASE || "https://api.openai.com/v1";

	if (!apiKey) {
		console.warn("  AI_API_KEY not set. Generating template description.");
		const firstPara = body.split("\n\n").find((p) => p.trim() && !p.startsWith("#"));
		const template = firstPara?.slice(0, 150).trim() + "..." || "No description available.";
		updateFrontmatter(targetSlug, "description", template);
		console.log(`  Description: ${template}`);
		return;
	}

	console.log("  Generating description with AI...");
	const res = await fetch(`${apiBase}/chat/completions`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			model: flags.get("model") || "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content:
						"You are a blog assistant. Generate a concise 1-2 sentence summary (in Chinese) for the given article. Output ONLY the summary text, no quotes or prefix.",
				},
				{ role: "user", content: body.slice(0, 4000) },
			],
			max_tokens: 200,
		}),
	});

	if (!res.ok) throw new Error(`AI API error: ${res.status}`);
	const data = await res.json();
	const description = data.choices?.[0]?.message?.content?.trim();

	if (description) {
		updateFrontmatter(targetSlug, "description", description);
		console.log(`  Description: ${description}`);
	} else {
		console.error("  AI returned empty response.");
	}
}

function findPosts(dir) {
	const results = [];
	function walk(d) {
		for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
			const full = path.join(d, entry.name);
			if (entry.isDirectory()) walk(full);
			else if (/\.(md|mdx)$/i.test(entry.name)) {
				results.push({
					fullPath: full,
					relPath: path.relative(dir, full),
					stem: entry.name.replace(/\.(md|mdx)$/i, ""),
				});
			}
		}
	}
	walk(dir);
	return results;
}

function updateFrontmatter(filePath, key, value) {
	const content = fs.readFileSync(filePath, "utf-8");
	const updated = content.replace(new RegExp(`(${key}:).*`), `$1 ${JSON.stringify(value)}`);
	fs.writeFileSync(filePath, updated, "utf-8");
}
