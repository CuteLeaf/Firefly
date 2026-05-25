import { runCommand } from "../utils/run.js";

export default async function build() {
	await runCommand("pnpm", ["build"]);
}
