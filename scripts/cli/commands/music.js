import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { downloadFile } from "../utils/download.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "../../..");

const NCM_HEADERS = {
	"User-Agent":
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
	Referer: "https://music.163.com",
};

async function safeFetch(url, opts = {}) {
	try {
		const res = await fetch(url, {
			headers: NCM_HEADERS,
			signal: AbortSignal.timeout(15000),
			...opts,
		});
		return res;
	} catch {
		return null;
	}
}

// NetEase search + lyrics (free, no auth)
// Cover from QQ Music CDN (free, no auth)
// Audio: user downloads manually, then pnpm cli lrc extracts everything

export default async function music(args, flags) {
	if (!args) {
		console.error('Usage: pnpm cli music "歌名" [-y]');
		return;
	}

	const name = args.trim();
	const autoYes = flags.has("y") || flags.has("yes");

	// Step 1: Search on NetEase
	console.log(`  Searching: "${name}" on netease`);
	const searchUrl = `https://music.163.com/api/search/get?s=${encodeURIComponent(name)}&type=1&limit=10`;
	const searchRes = await safeFetch(searchUrl);
	if (!searchRes) {
		console.error("  Search failed (network error)");
		return;
	}
	const searchData = await searchRes.json();
	const songs = searchData.result?.songs || [];

	if (!songs.length) {
		console.error("  No results found.");
		return;
	}

	const displayResults = songs.slice(0, 5);
	console.log("\n  Results:");
	displayResults.forEach((s, i) => {
		const artist = s.artists?.map((a) => a.name).join(", ") || "Unknown";
		console.log(`  [${i + 1}] ${s.name} - ${artist}`);
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

	const songId = selected.id;
	const songName = selected.name;
	const artistName = selected.artists?.map((a) => a.name).join(", ") || "";
	const albumName = selected.album?.name || "";
	console.log(`\n  Selected: ${songName} - ${artistName}`);

	const safeName = songName.replace(/[\/\\?%*:|"<>]/g, "-").replace(/\s+/g, "");
	const musicDir = path.join(PROJECT_ROOT, "public/assets/music");
	const coverDir = path.join(musicDir, "cover");
	fs.mkdirSync(coverDir, { recursive: true });

	// Step 2: Get lyrics (free)
	let lrc = "";
	try {
		const lrcUrl = `https://music.163.com/api/song/lyric?id=${songId}&lv=1`;
		const lrcRes = await safeFetch(lrcUrl);
		if (lrcRes) {
			const lrcData = await lrcRes.json();
			lrc = lrcData.lrc?.lyric || "";
		}
	} catch {
		// ignore
	}

	if (lrc) {
		const lrcPath = path.join(musicDir, `${safeName}.lrc`);
		fs.writeFileSync(lrcPath, lrc, "utf-8");
		console.log(`  Lyrics: public/assets/music/${safeName}.lrc`);
	} else {
		console.log("  [!] Lyrics not available");
	}

	// Step 3: Try to get song URL (may fail for VIP songs)
	let downloadedFile = "";
	try {
		const urlUrl = `https://music.163.com/api/song/enhance/player/url?ids=[${songId}]&br=320000`;
		const urlRes = await safeFetch(urlUrl);
		if (urlRes) {
			const urlData = await urlRes.json();
			const songUrl = urlData.data?.[0]?.url;
			if (songUrl) {
				const ext = songUrl.split(".").pop().split("?")[0] || "mp3";
				const musicPath = path.join(musicDir, `${safeName}.${ext}`);
				await downloadFile(songUrl, musicPath);
				downloadedFile = `${safeName}.${ext}`;
				console.log(`  Music: public/assets/music/${downloadedFile}`);
			}
		}
	} catch {
		// ignore
	}

	// Step 4: Print instructions
	console.log("\n  ─────────────────────────────────────────");
	if (!downloadedFile) {
		console.log("  Audio download: requires VIP or manual download");
		console.log("  1. Open https://music.163.com/#/search/m/?s=" + encodeURIComponent(songName));
		console.log("  2. Download the M4A/MP3 file");
		console.log(`  3. Place it in public/assets/music/${safeName}.m4a`);
		console.log(`  4. Run: pnpm cli lrc public/assets/music/${safeName}.m4a`);
		console.log("     (extracts cover + lyrics from M4A)");
	} else {
		console.log("  All files downloaded!");
		console.log("  To add to musicConfig.ts local.playlist:");
		const snippet = {
			name: songName,
			artist: artistName,
			url: `/assets/music/${downloadedFile}`,
			cover: "", // will be filled by pnpm cli lrc if M4A has embedded cover
			lrc: "",
		};
		console.log("  " + JSON.stringify(snippet, null, 2).split("\n").join("\n  "));
	}
	console.log("  ─────────────────────────────────────────");
}
