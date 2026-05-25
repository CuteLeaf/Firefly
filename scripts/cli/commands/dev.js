import { runCommand } from "../utils/run.js";

export default async function dev() {
	await runCommand("pnpm", ["dev"]);
}
