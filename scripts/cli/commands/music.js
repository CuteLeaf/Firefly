import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { downloadFile } from "../utils/download.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "../../..");

const DEFAULT_API = "https://api.i-meto.com/meting/api";
const DEFAULT_SERVER = "netease";

export default async function music(args, flags) {
	if (!args) {
		console.error('Usage: pnpm cli music "歌名" [-y]');
		return;
	}

	const name = args.trim();
	const server = flags.get("server") || DEFAULT_SERVER;
	const apiBase = flags.get("api") || DEFAULT_API;
	const autoYes = flags.has("y") || flags.has("yes");

	console.log(`  Searching: "${name}" on ${server}`);

	const searchUrl = `${apiBase}?server=${server}&type=search&id=${encodeURIComponent(name)}`;
	const res = await fetch(searchUrl);
	if (!res.ok) throw new Error(`Search failed: ${res.status}`);
	const results = await res.json();

	if (!results.length) {
		console.error("  No results found.");
		return;
	}

	const displayResults = results.slice(0, 5);
	console.log("\n  Results:");
	displayResults.forEach((r, i) => {
		const artist = r.artist || r.ar?.map((a) => a.name).join(", ") || "Unknown";
		console.log(`  [${i + 1}] ${r.name || r.title} - ${artist}`);
	});

	let selected;
	if (autoYes || displayResults.length === 1) {
		selected = displayResults[0];
	} else {
		const readline = await import("node:readline/promises");
		const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
		const idx = parseInt(await rl.question("  Select [1]: ")) || 1;
		rl.close();
		selected = displayResults[idx - 1];
		if (!selected) {
			console.error("  Invalid selection.");
			return;
		}
	}

	const songId = String(selected.id || selected.songid);
	const songName = selected.name || selected.title;
	const artistName = selected.artist || selected.ar?.map((a) => a.name).join(", ") || "";
	console.log(`\n  Selected: ${songName} - ${artistName}`);

	const urlRes = await fetch(`${apiBase}?server=${server}&type=url&id=${songId}`);
	const urlData = await urlRes.json();
	const songUrl = urlData.url;
	if (!songUrl) {
		console.error("  Could not get song URL.");
		return;
	}

	const lrcRes = await fetch(`${apiBase}?server=${server}&type=lrc&id=${songId}`);
	const lrcData = await lrcRes.json();
	const lrc = typeof lrcData === "string" ? lrcData : lrcData.lrc || "";

	const picRes = await fetch(`${apiBase}?server=${server}&type=pic&id=${songId}`);
	const picData = await picRes.json();
	const coverUrl = picData.pic || picData.url;

	const safeName = songName.replace(/[\/\\?%*:|"<>]/g, "-");
	const musicDir = path.join(PROJECT_ROOT, "public/assets/music");
	const coverDir = path.join(musicDir, "cover");

	fs.mkdirSync(coverDir, { recursive: true });

	const ext = songUrl.split(".").pop().split("?")[0] || "mp3";
	const musicPath = path.join(musicDir, `${safeName}.${ext}`);
	await downloadFile(songUrl, musicPath);
	console.log(`  Music: public/assets/music/${safeName}.${ext}`);

	let coverPath = "";
	if (coverUrl) {
		coverPath = path.join(coverDir, `${songId}.webp`);
		await downloadFile(coverUrl, coverPath);
		console.log(`  Cover: public/assets/music/cover/${songId}.webp`);
	}

	if (lrc) {
		const lrcPath = path.join(musicDir, `${safeName}.lrc`);
		fs.writeFileSync(lrcPath, lrc, "utf-8");
		console.log(`  Lyrics: public/assets/music/${safeName}.lrc`);
	}

	console.log("\n  Add to musicConfig.ts local.playlist:");
	const snippet = {
		name: songName,
		artist: artistName,
		url: `/assets/music/${safeName}.${ext}`,
		cover: coverUrl ? `/assets/music/cover/${songId}.webp` : "",
		lrc: lrc ? "[00:00.00]Lyrics file saved separately" : "",
	};
	console.log("  " + JSON.stringify(snippet, null, 2).split("\n").join("\n  "));
}
