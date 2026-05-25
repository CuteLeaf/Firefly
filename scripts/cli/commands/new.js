import { runScript } from "../utils/run.js";

export default async function newPost(args, _flags) {
	if (!args) {
		console.error('Usage: pnpm cli new "文章名"');
		return;
	}
	await runScript("scripts/new-post.js", [args]);
}
