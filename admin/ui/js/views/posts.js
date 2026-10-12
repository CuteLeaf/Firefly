/** 文章管理：列表 / 搜索 / 状态筛选 / 发布切换 / 删除 */
import { api } from "../api.js";
import {
	confirmDialog,
	debounce,
	escapeHtml,
	formatDate,
	icon,
	toast,
} from "../components/ui.js";
import { Router } from "../router.js";

const STATUS_TABS = [
	{ key: "all", label: "全部" },
	{ key: "published", label: "已发布" },
	{ key: "draft", label: "草稿" },
];

export async function render(container) {
	container.innerHTML = `
		<div class="page-head">
			<div>
				<h1 class="page-title">文章管理</h1>
				<p class="page-desc">新建、编辑、发布与删除文章（文章文件位于 src/content/posts/）</p>
			</div>
			<a class="btn btn-primary" href="${Router.buildLink("/posts/edit")}">${icon("plus")} 新建文章</a>
		</div>
		<div class="toolbar">
			<div class="search">
				${icon("search")}
				<input type="text" id="post-search" placeholder="搜索标题 / 描述 / 标签 / 分类…" />
			</div>
			<div class="tabs" id="status-tabs">
				${STATUS_TABS.map(
					(t) =>
						`<button class="tab${t.key === "all" ? " active" : ""}" data-status="${t.key}">${t.label}</button>`,
				).join("")}
			</div>
			<span class="muted" id="post-count"></span>
		</div>
		<div id="post-list"></div>`;

	const listEl = container.querySelector("#post-list");
	const searchInput = container.querySelector("#post-search");
	const countEl = container.querySelector("#post-count");

	let status = "all";
	let q = "";

	async function load() {
		listEl.innerHTML = `<div class="loading">加载中…</div>`;
		try {
			const params = new URLSearchParams({ status });
			if (q) params.set("q", q);
			const data = await api(`/posts?${params.toString()}`);
			countEl.textContent = `共 ${data.posts.length} 篇`;
			renderList(data.posts);
		} catch (err) {
			listEl.innerHTML = `<div class="empty-state">加载失败：${escapeHtml(err.message)}</div>`;
		}
	}

	function renderList(posts) {
		if (posts.length === 0) {
			listEl.innerHTML = `<div class="card"><div class="empty-state"><span class="empty-icon">📝</span>没有符合条件的文章</div></div>`;
			return;
		}
		listEl.innerHTML = `
			<div class="table-wrap">
				<table class="table">
					<thead><tr>
						<th>标题</th><th>状态</th><th>分类</th><th>标签</th><th>系列</th><th>发布日期</th><th>更新</th><th style="text-align:right">操作</th>
					</tr></thead>
					<tbody>
						${posts
							.map(
								(p) => `
							<tr class="row-link" data-id="${escapeHtml(p.id)}">
								<td>
									<span class="cell-title">${escapeHtml(p.title)}</span>
									<div class="cell-sub">${escapeHtml(p.description).slice(0, 60)}${p.description.length > 60 ? "…" : ""}</div>
								</td>
								<td>
									${p.draft ? '<span class="badge badge-draft">草稿</span>' : '<span class="badge badge-published">已发布</span>'}
									${p.pinned ? '<span class="badge badge-pinned">置顶</span>' : ""}
									${p.encrypted ? '<span class="badge">🔒 加密</span>' : ""}
								</td>
								<td>${escapeHtml(p.category || "—")}</td>
								<td class="cell-tags">${p.tags
									.slice(0, 3)
									.map((t) => `<span class="badge">${escapeHtml(t)}</span>`)
									.join("")}</td>
								<td>${escapeHtml(p.series || "—")}</td>
								<td>${formatDate(p.published)}</td>
								<td>${formatDate(p.updated)}</td>
								<td class="cell-actions">
									<button class="btn btn-sm" data-action="edit" title="编辑">${icon("edit")} 编辑</button>
									<button class="btn btn-sm" data-action="toggle" title="${p.draft ? "发布" : "转为草稿"}">${p.draft ? "发布" : "下架"}</button>
									<button class="btn btn-sm btn-danger" data-action="delete" title="删除">${icon("trash")}</button>
								</td>
							</tr>`,
							)
							.join("")}
					</tbody>
				</table>
			</div>`;

		listEl.querySelectorAll("tr.row-link").forEach((row) => {
			const id = row.dataset.id;
			row.addEventListener("click", (e) => {
				if (e.target.closest("button")) return;
				window.location.hash = Router.buildLink("/posts/edit", { id });
			});
			row
				.querySelector('[data-action="edit"]')
				.addEventListener("click", () => {
					window.location.hash = Router.buildLink("/posts/edit", { id });
				});
			row
				.querySelector('[data-action="toggle"]')
				.addEventListener("click", async (e) => {
					e.stopPropagation();
					const btn = e.currentTarget;
					const isDraft = btn.textContent.trim() === "发布";
					btn.disabled = true;
					try {
						await api(`/posts/publish?id=${encodeURIComponent(id)}`, {
							method: "POST",
							body: { draft: isDraft },
						});
						toast(isDraft ? "文章已发布" : "文章已转为草稿", "success");
						load();
					} catch (err) {
						toast(err.message, "error");
						btn.disabled = false;
					}
				});
			row
				.querySelector('[data-action="delete"]')
				.addEventListener("click", async (e) => {
					e.stopPropagation();
					const ok = await confirmDialog({
						title: "删除文章",
						message: `确定删除「${row.querySelector(".cell-title").textContent}」吗？文件将移入 admin/trash/posts 回收站，可手动找回。`,
						danger: true,
						confirmText: "删除",
					});
					if (!ok) return;
					try {
						await api(`/posts?id=${encodeURIComponent(id)}`, {
							method: "DELETE",
						});
						toast("已移入回收站", "success");
						load();
					} catch (err) {
						toast(err.message, "error");
					}
				});
		});
	}

	container.querySelector("#status-tabs").addEventListener("click", (e) => {
		const btn = e.target.closest("[data-status]");
		if (!btn) return;
		status = btn.dataset.status;
		container
			.querySelectorAll("#status-tabs .tab")
			.forEach((t) => t.classList.toggle("active", t === btn));
		load();
	});
	searchInput.addEventListener(
		"input",
		debounce(() => {
			q = searchInput.value.trim();
			load();
		}, 250),
	);

	load();
}
