import { runCommand } from "../utils/run.js";

export default async function deploy(args, flags) {
	const target = args.trim() || "git";

	console.log(`\n  Deploying via ${target}...\n`);

	if (target === "vercel") {
		await runCommand("pnpm", ["build"]);
		await runCommand("npx", ["vercel", "--prod"]);
	} else if (target === "cloud") {
		await runCommand("pnpm", ["build"]);
		await runCommand("npx", ["wrangler", "deploy"]);
	} else {
		await runCommand("pnpm", ["build"]);
		await runCommand("git", ["add", "."]);
		await runCommand("git", ["commit", "-m", "update"]);
		await runCommand("git", ["push"]);
	}

	console.log("\n  Deploy done!");
}
