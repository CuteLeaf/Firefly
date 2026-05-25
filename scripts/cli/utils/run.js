import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const PROJECT_ROOT = path.resolve(__dirname, "../../..");

/**
 * Run a Node.js script relative to the project root.
 */
export function runScript(scriptPath, args = []) {
	return new Promise((resolve, reject) => {
		const fullPath = path.join(PROJECT_ROOT, scriptPath);
		const child = spawn("node", [fullPath, ...args], {
			stdio: "inherit",
			cwd: PROJECT_ROOT,
		});
		child.on("close", (code) => {
			if (code !== 0) reject(new Error(`Script exited with code ${code}`));
			else resolve();
		});
		child.on("error", reject);
	});
}

/**
 * Run an arbitrary command. On Windows, uses shell to resolve .cmd files.
 */
export function runCommand(cmd, args = [], opts = {}) {
	return new Promise((resolve, reject) => {
		const isWin = process.platform === "win32";
		const child = spawn(cmd, args, {
			stdio: "inherit",
			cwd: PROJECT_ROOT,
			shell: isWin,
			...opts,
		});
		child.on("close", (code) => {
			if (code !== 0) reject(new Error(`Command "${cmd}" exited with code ${code}`));
			else resolve();
		});
		child.on("error", reject);
	});
}
