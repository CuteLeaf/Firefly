/** 仪表盘 */
import { api } from "../api.js";
import { escapeHtml, formatDate } from "../components/ui.js";
import { Router } from "../router.js";

export async function render(container) {
	const data = await api("/dashboard");
	const posts = await api("/posts?status=published");
	const recent = posts.posts.slice(0, 5);

	container.innerHTML = `
		<div class="page-head">
			<div>
				<h1 class="page-title">仪表盘</h1>
				<p class="page-desc">博客站点概览与快捷入口</p>
			</div>
			<a class="btn btn-primary" href="${Router.buildLink("/posts/edit")}">✏️ 写文章</a>
		</div>

		<div class="stat-grid">
			<div class="stat-card accent">
				<div class="stat-value">${data.posts.total}</div>
				<div class="stat-label">文章总数</div>
			</div>
			<div class="stat-card success">
				<div class="stat-value">${data.posts.published}</div>
				<div class="stat-label">已发布</div>
			</div>
			<div class="stat-card warning">
				<div class="stat-value">${data.posts.drafts}</div>
				<div class="stat-label">草稿</div>
			</div>
			<div class="stat-card">
				<div class="stat-value">${data.configs.saved}/${data.configs.total}</div>
				<div class="stat-label">已个性化配置模块</div>
			</div>
			<div class="stat-card">
				<div class="stat-value">${data.media.count}</div>
				<div class="stat-label">媒体文件</div>
			</div>
		</div>

		<div class="card">
			<h2 class="card-title">最近文章</h2>
			<p class="card-desc">按发布日期排序的最新 5 篇已发布文章</p>
			<div class="table-wrap">
				<table class="table">
					<thead><tr>
						<th>标题</th><th>分类</th><th>标签</th><th>发布日期</th><th></th>
					</tr></thead>
					<tbody>
						${
							recent
								.map(
									(p) => `
							<tr class="row-link" data-href="${Router.buildLink("/posts/edit", { id: p.id })}">
								<td><span class="cell-title">${escapeHtml(p.title)}</span>
									${p.pinned ? '<span class="badge badge-pinned">置顶</span>' : ""}
								</td>
								<td>${escapeHtml(p.category || "—")}</td>
								<td class="cell-tags">${p.tags
									.slice(0, 4)
									.map((t) => `<span class="badge">${escapeHtml(t)}</span>`)
									.join("")}</td>
								<td>${formatDate(p.published)}</td>
								<td class="cell-actions"><a class="btn btn-sm" href="${Router.buildLink("/posts/edit", { id: p.id })}">编辑</a></td>
							</tr>`,
								)
								.join("") ||
							'<tr><td colspan="5"><div class="empty-state"><span class="empty-icon">📝</span>还没有已发布的文章</div></td></tr>'
						}
					</tbody>
				</table>
			</div>
		</div>

		<div class="card">
			<h2 class="card-title">快捷入口</h2>
			<p class="card-desc">常用功能直达</p>
			<div class="flex gap-8">
				<a class="btn" href="#/posts">📚 文章管理</a>
				<a class="btn" href="#/settings">🎨 个性化设置</a>
				<a class="btn" href="#/media">🖼️ 媒体库</a>
				<a class="btn" href="#/site">🚀 构建部署</a>
			</div>
		</div>`;

	container.querySelectorAll("tr.row-link").forEach((row) => {
		row.addEventListener("click", () => {
			window.location.hash = row.dataset.href;
		});
	});
}
