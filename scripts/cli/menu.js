import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

const MENU_ITEMS = [
	{ cmd: "new", label: "New Post", desc: "Create a new blog post" },
	{ cmd: "media", label: "Media", desc: "Download movie/anime cover" },
	{ cmd: "music", label: "Music", desc: "Download music + lyrics" },
	{ cmd: "lrc", label: "Extract Lyrics", desc: "Extract M4A lyrics & cover" },
	{ cmd: "desc", label: "AI Description", desc: "Generate article summary" },
	{ cmd: "sync", label: "Sync Notes", desc: "Sync external notes" },
	{ cmd: "dev", label: "Dev Server", desc: "Start dev server" },
	{ cmd: "build", label: "Build Site", desc: "Build production site" },
	{ cmd: "deploy", label: "Deploy", desc: "Deploy (git/vercel/cloud)" },
];

function detectInputType(input) {
	const trimmed = input.trim();

	const cmdNames = MENU_ITEMS.map((m) => m.cmd);
	const firstWord = trimmed.split(/\s+/)[0];
	if (cmdNames.includes(firstWord)) {
		return { type: "command", command: firstWord, rest: trimmed.slice(firstWord.length).trim() };
	}

	if (/\.(m4a|mp3|flac|wav)$/i.test(trimmed) || trimmed.startsWith("./") || trimmed.startsWith("/")) {
		return { type: "lrc", args: trimmed };
	}

	return { type: "media", args: trimmed };
}

export async function showMenu() {
	const rl = readline.createInterface({ input: stdin, output: stdout });

	console.log("\n  ╔══════════════════════════════════╗");
	console.log("  ║       Firefly CLI Toolbox        ║");
	console.log("  ╚══════════════════════════════════╝\n");

	for (const item of MENU_ITEMS) {
		console.log(`  ${item.cmd.padEnd(16)} ${item.desc}`);
	}
	console.log(`  ${"help".padEnd(16)} Show help`);
	console.log(`  ${"exit".padEnd(16)} Quit\n`);

	while (true) {
		const input = await rl.question("  > ");
		const trimmed = input.trim();

		if (!trimmed || trimmed === "exit" || trimmed === "quit") {
			console.log("Bye!");
			rl.close();
			return;
		}

		if (trimmed === "help") {
			for (const item of MENU_ITEMS) {
				console.log(`  ${item.cmd.padEnd(16)} ${item.desc}`);
			}
			continue;
		}

		const detected = detectInputType(trimmed);

		try {
			if (detected.type === "command") {
				const mod = await import(`./commands/${detected.command}.js`);
				await mod.default(detected.rest, new Map());
			} else if (detected.type === "lrc") {
				const mod = await import("./commands/lrc.js");
				await mod.default(detected.args, new Map());
			} else {
				const mod = await import("./commands/media.js");
				await mod.default(detected.args, new Map());
			}
		} catch (err) {
			console.error(`  Error: ${err.message}`);
		}

		console.log("");
	}
}
