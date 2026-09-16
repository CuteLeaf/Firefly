/** 构建部署：站点状态 + 一键构建 + 实时日志 */
import { api } from "../api.js";
import { escapeHtml, formatDate, icon, toast } from "../components/ui.js";

export async function render(container) {
	container.innerHTML = `
		<div class="page-head">
			<div>
				<h1 class="page-title">构建部署</h1>
				<p class="page-desc">查看开发服务器状态，一键执行 pnpm build 生成生产产物 dist/</p>
			</div>
			<div class="flex gap-8">
				<button class="btn" id="site-refresh">${icon("refresh")} 刷新状态</button>
				<button class="btn btn-primary" id="site-build">${icon("rocket")} 开始构建</button>
			</div>
		</div>

		<div class="stat-grid" id="site-stats"></div>

		<div class="card">
			<h2 class="card-title">构建日志</h2>
			<p class="card-desc" id="build-state-line">构建过程会实时显示在这里</p>
			<div class="build-log" id="build-log"><span class="muted">暂无日志，点击「开始构建」启动 pnpm build</span></div>
		</div>`;

	const statsEl = container.querySelector("#site-stats");
	const logEl = container.querySelector("#build-log");
	const stateLine = container.querySelector("#build-state-line");
	const buildBtn = container.querySelector("#site-build");

	let es = null;
	let running = false;

	function appendLine(text) {
		const span = document.createElement("span");
		span.textContent = text.endsWith("\n") ? text : `${text}\n`;
		logEl.appendChild(span);
		logEl.scrollTop = logEl.scrollHeight;
	}

	function closeStream() {
		es?.close();
		es = null;
	}

	async function refreshStatus() {
		const status = await api("/site/status");
		running = status.build.running;
		statsEl.innerHTML = `
			<div class="stat-card ${status.devServer ? "success" : ""}">
				<div class="stat-value"><span class="status-dot ${status.devServer ? "ok" : "off"}"></span> ${status.devServer ? "运行中" : "未启动"}</div>
				<div class="stat-label">开发服务器 ${status.devUrl ? `（<a href="${escapeHtml(status.devUrl)}" target="_blank" rel="noopener">${escapeHtml(status.devUrl)}</a>）` : "（pnpm dev）"}</div>
			</div>
			<div class="stat-card ${status.distExists ? "success" : ""}">
				<div class="stat-value"><span class="status-dot ${status.distExists ? "ok" : "off"}"></span> ${status.distExists ? "已生成" : "未构建"}</div>
				<div class="stat-label">生产产物 dist/${status.distTime ? `（上次构建 ${formatDate(status.distTime, true)}）` : ""}</div>
			</div>
			<div class="stat-card ${running ? "warning" : ""}">
				<div class="stat-value"><span class="status-dot ${running ? "busy" : "ok"}"></span> ${running ? "构建中" : "空闲"}</div>
				<div class="stat-label">构建状态</div>
			</div>`;
		buildBtn.disabled = running;
		buildBtn.innerHTML = running
			? '<span class="spinner"></span> 构建中…'
			: `${icon("rocket")} 开始构建`;
		if (running && !es) openStream();
		return status;
	}

	function openStream() {
		closeStream();
		es = new EventSource("/api/site/build/stream");
		es.addEventListener("log", (e) => appendLine(e.data));
		es.addEventListener("done", () => {
			closeStream();
			stateLine.textContent = "构建已结束";
			refreshStatus().then((s) => {
				if (s.build.exitCode === 0) toast("构建成功 🎉", "success");
				else toast(`构建失败（exit ${s.build.exitCode}）`, "error", 5000);
			});
		});
		es.onerror = () => {
			// 网络波动时 EventSource 会自动重连；done 事件才是结束标志
		};
	}

	buildBtn.addEventListener("click", async () => {
		try {
			await api("/site/build", { method: "POST" });
			toast("构建已开始", "success");
			logEl.innerHTML = "";
			stateLine.textContent = "正在构建…";
			openStream();
			await refreshStatus();
		} catch (err) {
			toast(err.message, "error");
		}
	});

	container.querySelector("#site-refresh").addEventListener("click", () => {
		refreshStatus().catch((e) => toast(e.message, "error"));
	});

	const status = await refreshStatus();
	if (status.build.logLines > 0) {
		logEl.innerHTML = "";
		openStream();
	}

	return () => closeStream();
}
