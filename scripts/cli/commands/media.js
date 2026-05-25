import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { downloadFile } from "../utils/download.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "../../..");

export default async function media(args, flags) {
	if (!args) {
		console.error('Usage: pnpm cli media "片名" [-y]');
		return;
	}

	const autoYes = flags.has("y") || flags.has("yes");
	const name = args.trim();

	console.log(`  Searching for: ${name}`);

	const apiKey = process.env.TMDB_API_KEY;
	if (!apiKey) {
		console.warn("  TMDB_API_KEY not set. Using name-only mode.");
		console.log("  Set TMDB_API_KEY in .env to enable search.");
	}

	let searchData = null;
	if (apiKey) {
		searchData = await searchTMDB(name, apiKey);
	}

	if (searchData) {
		console.log(`  Found: ${searchData.title} (${searchData.year})`);
		if (searchData.overview) {
			console.log(`  Overview: ${searchData.overview.slice(0, 100)}...`);
		}

		if (!autoYes) {
			const readline = await import("node:readline/promises");
			const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
			const answer = await rl.question("  Use this result? [Y/n] ");
			rl.close();
			if (answer.toLowerCase() === "n") return;
		}
	}

	const coverUrl = searchData?.poster_path
		? `https://image.tmdb.org/t/p/w500${searchData.poster_path}`
		: null;

	const safeName = name.replace(/[\/\\?%*:|"<>]/g, "-");
	const coverDir = path.join(PROJECT_ROOT, "public/gallery", safeName);

	if (coverUrl) {
		fs.mkdirSync(coverDir, { recursive: true });
		await downloadFile(coverUrl, path.join(coverDir, "cover.jpg"));
		console.log(`  Cover saved: public/gallery/${safeName}/cover.jpg`);
	}

	const postDir = path.join(PROJECT_ROOT, "src/content/posts");
	fs.mkdirSync(postDir, { recursive: true });
	const mdPath = path.join(postDir, `${safeName}.md`);

	if (fs.existsSync(mdPath)) {
		console.error(`  Post already exists: src/content/posts/${safeName}.md`);
		return;
	}

	const today = new Date().toISOString().split("T")[0];
	const frontmatter = [
		"---",
		`title: ${name}`,
		`published: ${today}`,
		`description: ${searchData?.overview || ""}`,
		`image: ${coverUrl ? `/gallery/${safeName}/cover.jpg` : ""}`,
		"tags: []",
		`category: ${searchData?.media_type === "tv" ? "TV" : "Movie"}`,
		"draft: true",
		"lang: zh_CN",
		"---",
		"",
		`# ${name}`,
		"",
	].join("\n");

	fs.writeFileSync(mdPath, frontmatter, "utf-8");
	console.log(`  Post created: src/content/posts/${safeName}.md`);
}

async function searchTMDB(query, apiKey) {
	const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=zh-CN`;
	const res = await fetch(url);
	if (!res.ok) return null;
	const data = await res.json();
	const result = data.results?.[0];
	if (!result) return null;
	return {
		title: result.title || result.name,
		year: (result.release_date || result.first_air_date || "").slice(0, 4),
		overview: result.overview,
		poster_path: result.poster_path,
		media_type: result.media_type,
	};
}
