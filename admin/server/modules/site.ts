import fs from "node:fs/promises";
import path from "node:path";
import { spawn, execFile } from "node:child_process";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { adminServer } from "../../admin.config";
import { REPO_ROOT } from "../lib/paths";

/**
 * 站点模块：查看开发服务器/构建产物状态，一键触发 pnpm build 并通过 SSE 实时推送日志。
 */

interface BuildState {
	running: boolean;
	startedAt: number | null;
	exitCode: number | null;
	logs: string[];
}

const MAX_LOGS = 500;
const buildState: BuildState = {
	running: false,
	startedAt: null,
	exitCode: null,
	logs: [],
};
const listeners = new Set<(line: string) => void>();

function emit(line: string): void {
	buildState.logs.push(line);
	if (buildState.logs.length > MAX_LOGS) buildState.logs.shift();
	for (const listener of listeners) listener(line);
}

/** 构建命令：优先使用 PATH 中的 pnpm，否则退回 npx 拉取项目锁定的 pnpm 版本 */
function resolveBuildCommand(): Promise<string[]> {
	if (adminServer.buildCommand && adminServer.buildCommand.length > 0) {
		return Promise.resolve([...adminServer.buildCommand]);
	}
	return new Promise((resolve) => {
		execFile(
			"pnpm",
			["--version"],
			{ cwd: REPO_ROOT, timeout: 3000 },
			(err) => {
				resolve(
					err ? ["npx", "--yes", "pnpm@11.22.0", "build"] : ["pnpm", "build"],
				);
			},
		);
	});
}

function startBuild(): void {
	buildState.running = true;
	buildState.startedAt = Date.now();
	buildState.exitCode = null;
	buildState.logs = [];

	void resolveBuildCommand().then((cmd) => {
		emit(`$ ${cmd.join(" ")}\n\n`);
		const child = spawn(cmd[0], cmd.slice(1), {
			cwd: REPO_ROOT,
			env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1", FORCE_COLOR: "0" },
		});
		const onData = (buf: Buffer) => emit(buf.toString());
		child.stdout.on("data", onData);
		child.stderr.on("data", onData);
		child.on("close", (code) => {
			buildState.running = false;
			buildState.exitCode = code ?? 0;
			emit(
				`\n[构建结束] ${buildState.exitCode === 0 ? "✅ 成功" : `❌ 失败（exit code ${buildState.exitCode}）`}\n`,
			);
		});
		child.on("error", (err) => {
			buildState.running = false;
			buildState.exitCode = -1;
			emit(`\n[构建失败] ${err.message}\n`);
		});
	});
}

export function createSiteModule(): Hono {
	const app = new Hono();

	app.get("/status", async (c) => {
		let devServer = false;
		try {
			const res = await fetch("http://localhost:4321/", {
				signal: AbortSignal.timeout(1500),
			});
			devServer = res.ok;
		} catch {
			devServer = false;
		}
		let distExists = false;
		let distTime: number | null = null;
		try {
			const stat = await fs.stat(path.join(REPO_ROOT, "dist", "index.html"));
			distExists = true;
			distTime = stat.mtimeMs;
		} catch {
			/* 未构建 */
		}
		return c.json({
			devServer,
			devUrl: devServer ? "http://localhost:4321" : null,
			distExists,
			distTime,
			build: {
				running: buildState.running,
				startedAt: buildState.startedAt,
				exitCode: buildState.exitCode,
				logLines: buildState.logs.length,
			},
		});
	});

	app.post("/build", (c) => {
		if (!adminServer.enableBuildModule) {
			return c.json(
				{ error: "构建模块未启用（admin.config.ts 中 enableBuildModule）" },
				403,
			);
		}
		if (buildState.running) return c.json({ error: "构建正在进行中" }, 409);
		startBuild();
		return c.json({ ok: true });
	});

	app.get("/build/stream", (c) => {
		if (!adminServer.enableBuildModule) {
			return c.json({ error: "构建模块未启用" }, 403);
		}
		return streamSSE(c, async (stream) => {
			// 先回放历史日志
			for (const line of buildState.logs) {
				await stream.writeSSE({ data: line, event: "log" });
			}
			const listener = (line: string) => {
				void stream.writeSSE({ data: line, event: "log" });
			};
			listeners.add(listener);

			// 构建结束后通知客户端关闭
			const poller = setInterval(() => {
				if (!buildState.running) {
					void stream.writeSSE({ data: "1", event: "done" });
					clearInterval(poller);
					listeners.delete(listener);
					void stream.close();
				}
			}, 400);

			stream.onAbort(() => {
				clearInterval(poller);
				listeners.delete(listener);
			});

			// 保持连接
			while (buildState.running) {
				await stream.sleep(1000);
			}
		});
	});

	return app;
}
