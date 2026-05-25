#!/usr/bin/env node

import { parseArgs } from "./cli/utils/args.js";
import { showMenu } from "./cli/menu.js";

const COMMANDS = {
	new: () => import("./cli/commands/new.js"),
	media: () => import("./cli/commands/media.js"),
	music: () => import("./cli/commands/music.js"),
	lrc: () => import("./cli/commands/lrc.js"),
	desc: () => import("./cli/commands/desc.js"),
	dev: () => import("./cli/commands/dev.js"),
	build: () => import("./cli/commands/build.js"),
	sync: () => import("./cli/commands/sync.js"),
	deploy: () => import("./cli/commands/deploy.js"),
};

const HELP_TEXT = `
Firefly CLI - Unified Blog Toolbox

Usage: pnpm cli <command> [options]

Commands:
  new "title"          Create a new blog post
  media "name" [-y]    Download movie/anime cover + generate markdown
  music "name" [-y]    Download music + lyrics + cover
  lrc <path>           Extract lyrics from local M4A files
  desc [slug]          AI-generate article summary
  dev                  Start development server
  build                Build the site
  deploy [target]      Deploy (git/vercel/cloud)
  sync                 Sync notes
  help                 Show this help message

Run without arguments for the interactive menu.
`;

async function main() {
	const rawArgs = process.argv.slice(2);

	if (rawArgs.length === 0) {
		await showMenu();
		return;
	}

	const { command, args, flags } = parseArgs(rawArgs);

	if (command === "help" || command === "--help" || command === "-h") {
		console.log(HELP_TEXT);
		return;
	}

	if (!COMMANDS[command]) {
		console.error(`Unknown command: ${command}`);
		console.log(HELP_TEXT);
		process.exit(1);
	}

	const { default: handler } = await COMMANDS[command]();
	await handler(args, flags);
}

main().catch((err) => {
	console.error(err.message);
	process.exit(1);
});
