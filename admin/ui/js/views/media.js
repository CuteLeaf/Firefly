/** 媒体库：上传 / 浏览 / 复制引用路径 / 删除 */
import { api } from "../api.js";
import {
	confirmDialog,
	escapeHtml,
	formatBytes,
	icon,
	toast,
} from "../components/ui.js";

export async function render(container) {
	container.innerHTML = `
		<div class="page-head">
			<div>
				<h1 class="page-title">媒体库</h1>
				<p class="page-desc">上传图片/音频到 public/images/admin/，上传后复制「/images/admin/…」路径即可在文章封面、背景壁纸等处引用</p>
			</div>
			<button class="btn" id="media-refresh">${icon("refresh")} 刷新</button>
		</div>
		<div class="card">
			<div class="media-upload" id="media-drop">
				<div style="font-size:28px">⬆️</div>
				<div>点击选择文件或拖拽到这里上传（支持 png / jpg / webp / avif / gif / svg / mp3 / mp4 / lrc，单文件 ≤ 20MB）</div>
				<div class="field" style="max-width:320px;margin:14px auto 0">
					<input type="text" id="media-dir" placeholder="子目录（可选），如 covers / banner" style="text-align:center" />
				</div>
			</div>
			<input type="file" id="media-file" multiple hidden />
		</div>
		<div id="media-grid" class="media-grid"></div>`;

	const dropEl = container.querySelector("#media-drop");
	const fileInput = container.querySelector("#media-file");
	const dirInput = container.querySelector("#media-dir");
	const gridEl = container.querySelector("#media-grid");

	dropEl.addEventListener("click", () => fileInput.click());
	fileInput.addEventListener("change", () => {
		[...fileInput.files].forEach((f) => upload(f));
		fileInput.value = "";
	});
	["dragover", "dragleave", "drop"].forEach((evt) => {
		dropEl.addEventListener(evt, (e) => {
			e.preventDefault();
			dropEl.classList.toggle("dragover", evt === "dragover");
			if (evt === "drop") {
				[...e.dataTransfer.files].forEach((f) => upload(f));
			}
		});
	});

	async function upload(file) {
		const fd = new FormData();
		fd.append("file", file);
		const dir = dirInput.value.trim();
		if (dir) fd.append("dir", dir);
		try {
			const result = await api("/media/upload", {
				method: "POST",
				formData: fd,
			});
			toast(`已上传：${result.url}`, "success");
			load();
		} catch (err) {
			toast(err.message, "error", 4000);
		}
	}

	async function load() {
		gridEl.innerHTML = `<div class="loading" style="grid-column:1/-1">加载中…</div>`;
		try {
			const data = await api("/media");
			if (data.files.length === 0) {
				gridEl.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><span class="empty-icon">🖼️</span>媒体库为空，上传第一张图片吧</div>`;
				return;
			}
			gridEl.innerHTML = data.files
				.map((f) => {
					const isImage = /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(f.name);
					return `
					<div class="media-card">
						<div class="media-thumb">${isImage ? `<img src="${escapeHtml(f.url)}" loading="lazy" alt="" />` : "🎵"}</div>
						<div class="media-info">
							<div class="media-name" title="${escapeHtml(f.rel)}">${escapeHtml(f.name)}</div>
							<div class="media-meta">${formatBytes(f.size)} · ${escapeHtml(f.rel)}</div>
						</div>
						<div class="media-actions">
							<button class="btn btn-sm" data-action="copy" data-url="${escapeHtml(f.url)}" title="复制引用路径">${icon("copy")} 复制路径</button>
							<button class="btn btn-sm btn-danger" data-action="delete" data-rel="${escapeHtml(f.rel)}" title="删除">${icon("trash")}</button>
						</div>
					</div>`;
				})
				.join("");

			gridEl.querySelectorAll('[data-action="copy"]').forEach((btn) => {
				btn.addEventListener("click", async () => {
					try {
						await navigator.clipboard.writeText(btn.dataset.url);
						toast(`已复制：${btn.dataset.url}`, "success");
					} catch {
						toast(`手动复制：${btn.dataset.url}`, "warning", 5000);
					}
				});
			});
			gridEl.querySelectorAll('[data-action="delete"]').forEach((btn) => {
				btn.addEventListener("click", async () => {
					const ok = await confirmDialog({
						title: "删除文件",
						message: `确定删除 ${btn.dataset.rel} 吗？此操作不可恢复。`,
						danger: true,
						confirmText: "删除",
					});
					if (!ok) return;
					try {
						await api(`/media?path=${encodeURIComponent(btn.dataset.rel)}`, {
							method: "DELETE",
						});
						toast("已删除", "success");
						load();
					} catch (err) {
						toast(err.message, "error");
					}
				});
			});
		} catch (err) {
			gridEl.innerHTML = `<div class="empty-state" style="grid-column:1/-1">${escapeHtml(err.message)}</div>`;
		}
	}

	container.querySelector("#media-refresh").addEventListener("click", load);
	load();
}
