<script lang="ts">
	import type { PostMeta } from "./types";
	import ImageUploader from "./ImageUploader.svelte";

	type Route = "dashboard" | "posts" | "posts-new" | "posts-edit" | "dynamic" | "dynamic-new" | "dynamic-edit" | "spec";

	let { onNavigate, showToast }: {
		onNavigate: (route: Route, slug?: string) => void;
		showToast: (msg: string, type: "success" | "error" | "info") => void;
	} = $props();

	let posts = $state<PostMeta[]>([]);
	let filteredPosts = $state<PostMeta[]>([]);
	let loading = $state(true);
	let error = $state("");

	// 搜索筛选
	let searchQuery = $state("");
	let filterDraft = $state<"all" | "published" | "draft">("all");
	let filterCategory = $state("");
	let categories = $state<string[]>([]);

	let deleteConfirm = $state<string | null>(null);
	let importing = $state(false);
	let importDate = $state(new Date().toISOString().split("T")[0]);
	let showImportDialog = $state(false);
	let pendingFile = $state<File | null>(null);

	function triggerImport() {
		importDate = new Date().toISOString().split("T")[0];
		const el = document.createElement("input");
		el.type = "file";
		el.accept = ".md,.mdx";
		el.onchange = (e) => {
			const f = (e.target as HTMLInputElement).files?.[0];
			if (f) { pendingFile = f; showImportDialog = true; }
		};
		el.click();
	}

	async function doImport() {
		if (!pendingFile) return;
		importing = true;
		showImportDialog = false;
		try {
			const fd = new FormData();
			fd.append("file", pendingFile);
			fd.append("published", importDate);
			const res = await fetch("/admin/api/posts/import.json", { method: "POST", body: fd });
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "导入失败");
			showToast(`「${data.title}」导入成功`, "success");
			pendingFile = null;
			onNavigate("posts-edit", data.slug);
		} catch (err) {
			showToast(String(err), "error");
		} finally {
			importing = false;
		}
	}

	$effect(() => {
		fetchPosts();
	});

	$effect(() => {
		let result = [...posts];

		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			result = result.filter(
				(p) =>
					p.title.toLowerCase().includes(q) ||
					p.tags.some((t) => t.toLowerCase().includes(q)) ||
					p.category.toLowerCase().includes(q),
			);
		}

		if (filterDraft === "published") result = result.filter((p) => !p.draft);
		else if (filterDraft === "draft") result = result.filter((p) => p.draft);

		if (filterCategory) result = result.filter((p) => p.category === filterCategory);

		filteredPosts = result;
	});

	async function fetchPosts() {
		loading = true;
		error = "";
		try {
			const res = await fetch("/admin/api/posts/list.json");
			if (!res.ok) throw new Error("获取文章列表失败");
			const data: PostMeta[] = await res.json();
			posts = data;
			// 提取所有分类
			const cats = [...new Set(data.map((p) => p.category).filter(Boolean))];
			categories = cats.sort();
		} catch (err) {
			error = String(err);
		} finally {
			loading = false;
		}
	}

	async function handleDelete(slug: string) {
		try {
			const res = await fetch(`/admin/api/posts/${slug}.json`, { method: "DELETE" });
			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "删除失败");
			}
			showToast("文章已删除", "success");
			deleteConfirm = null;
			await fetchPosts();
		} catch (err) {
			showToast(String(err), "error");
		}
	}

	async function handleImport(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		importing = true;
		try {
			const fd = new FormData();
			fd.append("file", file);
			const res = await fetch("/admin/api/posts/import.json", { method: "POST", body: fd });
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "导入失败");
			showToast(`「${data.title}」导入成功`, "success");
			onNavigate("posts-edit", data.slug);
		} catch (err) {
			showToast(String(err), "error");
		} finally {
			importing = false;
			input.value = "";
		}
	}
</script>

<div class="page">
	<div class="page-header">
		<h2>文章管理</h2>
		<div class="header-actions">
			<ImageUploader {showToast} />
			<button class="btn btn-primary" onclick={triggerImport}>📥 导入 Markdown</button>
			<button class="btn btn-primary" onclick={() => onNavigate("posts-new")}>+ 新建文章</button>
		</div>
	</div>

	<div class="filters">
		<input
			type="text"
			class="search-input"
			placeholder="搜索标题、标签、分类..."
			bind:value={searchQuery}
		/>
		<select class="filter-select" bind:value={filterDraft}>
			<option value="all">全部状态</option>
			<option value="published">已发布</option>
			<option value="draft">草稿</option>
		</select>
		<select class="filter-select" bind:value={filterCategory}>
			<option value="">全部分类</option>
			{#each categories as cat}
				<option value={cat}>{cat}</option>
			{/each}
		</select>
	</div>

	{#if loading}
		<p class="loading">加载中...</p>
	{:else if error}
		<p class="error">{error}</p>
	{:else if filteredPosts.length === 0}
		<div class="empty-state">
			<div class="empty-icon">📝</div>
			{#if searchQuery || filterDraft !== "all" || filterCategory}
				<h3>没有匹配的文章</h3>
				<p>试试修改搜索条件或筛选器</p>
				<button class="btn btn-sm" onclick={() => { searchQuery = ""; filterDraft = "all"; filterCategory = ""; }}>清除所有筛选</button>
			{:else}
				<h3>还没有写过文章</h3>
				<p>点击「新建文章」开始你的第一篇博客吧！</p>
				<button class="btn btn-primary" onclick={() => onNavigate("posts-new")}>+ 新建文章</button>
			{/if}
		</div>
	{:else}
		<div class="post-table">
			<div class="table-header">
				<span class="col-title">标题</span>
				<span class="col-category">分类</span>
				<span class="col-tags">标签</span>
				<span class="col-date">发布日期</span>
				<span class="col-status">状态</span>
				<span class="col-actions">操作</span>
			</div>
			{#each filteredPosts as post (post.slug)}
				<div class="table-row">
					<span class="col-title">
						<span class="post-title">{post.title}</span>
						{#if post.pinned}<span class="badge pinned">置顶</span>{/if}
					</span>
					<span class="col-category">{post.category || "-"}</span>
					<span class="col-tags">
						{#each post.tags.slice(0, 3) as tag}
							<span class="tag">{tag}</span>
						{/each}
						{#if post.tags.length > 3}
							<span class="tag-more">+{post.tags.length - 3}</span>
						{/if}
					</span>
					<span class="col-date">{post.published}</span>
					<span class="col-status">
						<span class="badge" class:draft={post.draft} class:published={!post.draft}>
							{post.draft ? "草稿" : "已发布"}
						</span>
					</span>
					<span class="col-actions">
						<button class="btn btn-sm" onclick={() => onNavigate("posts-edit", post.slug)}>编辑</button>
						<button class="btn btn-sm btn-danger" onclick={() => deleteConfirm = post.slug}>删除</button>
					</span>
				</div>
			{/each}
		</div>

		<div class="post-count">
			共 {filteredPosts.length} 篇
			{#if filteredPosts.length !== posts.length}
				（全部 {posts.length} 篇）
			{/if}
		</div>
	{/if}
</div>

<!-- 删除确认弹窗 -->
{#if deleteConfirm}
	<div
		class="modal-overlay"
		role="presentation"
		onclick={() => deleteConfirm = null}
		onkeydown={(e) => { if (e.key === 'Escape') deleteConfirm = null; }}
	>
		<div class="modal" onclick={(e) => e.stopPropagation()}>
			<h3>确认删除</h3>
			<p>确定要删除这篇文章吗？此操作不可撤销。</p>
			<div class="modal-actions">
				<button class="btn" onclick={() => deleteConfirm = null}>取消</button>
				<button class="btn btn-danger" onclick={() => handleDelete(deleteConfirm!)}>确认删除</button>
			</div>
		</div>
	</div>
{/if}

<!-- 导入日期选择弹窗 -->
{#if showImportDialog}
	<div class="modal-overlay" role="presentation" onclick={() => { showImportDialog = false; pendingFile = null; }}>
		<div class="modal" onclick={(e) => e.stopPropagation()}>
			<h3>📥 导入 Markdown</h3>
			<p style="font-size:13px;color:#6b7280;margin-bottom:12px;">
				文件：{pendingFile?.name}（{((pendingFile?.size || 0) / 1024).toFixed(1)} KB）
			</p>
			<div class="form-group" style="margin-bottom:16px;">
				<label for="import-date" style="display:block;font-size:13px;font-weight:500;margin-bottom:4px;">选择发布时间</label>
				<input id="import-date" type="date" class="form-input" bind:value={importDate} style="width:100%;max-width:100%;padding:8px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:14px;" />
			</div>
			<div class="modal-actions">
				<button class="btn" onclick={() => { showImportDialog = false; pendingFile = null; }}>取消</button>
				<button class="btn btn-primary" onclick={doImport} disabled={importing}>
					{importing ? "导入中..." : "确认导入"}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.page { max-width: 1200px; }
	.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
	.page-header h2 { font-size: 22px; font-weight: 700; }
	.header-actions { display: flex; align-items: center; gap: 8px; }
	.filters { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
	.search-input { flex: 1; min-width: 200px; padding: 8px 12px; border: 1px solid var(--admin-border); border-radius: 6px; font-size: 13px; outline: none; }
	.search-input:focus { border-color: var(--admin-primary); }
	.filter-select { padding: 8px 12px; border: 1px solid var(--admin-border); border-radius: 6px; font-size: 13px; background: #fff; outline: none; }
	.filter-select:focus { border-color: var(--admin-primary); }

	.post-table { background: var(--admin-surface); border-radius: 8px; border: 1px solid var(--admin-border); overflow: hidden; }
	.table-header, .table-row { display: grid; grid-template-columns: 2fr 1fr 1.5fr 1.2fr 0.8fr 1fr; align-items: center; padding: 10px 16px; gap: 8px; }
	.table-header { background: #f9fafb; font-size: 12px; font-weight: 600; color: var(--admin-text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }
	.table-row { border-top: 1px solid var(--admin-border); font-size: 13px; transition: background 0.15s; }
	.table-row:hover { background: #f8fafc; }
	.post-title { font-weight: 500; color: var(--admin-text); }
	.badge { font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: 500; white-space: nowrap; }
	.pinned { background: #fef3c7; color: #92400e; margin-left: 6px; }
	.published { background: #dcfce7; color: #166534; }
	.draft { background: #fef3c7; color: #92400e; }
	.tag { display: inline-block; font-size: 11px; padding: 1px 6px; background: #f1f5f9; border-radius: 4px; margin-right: 4px; white-space: nowrap; }
	.tag-more { font-size: 11px; color: var(--admin-text-secondary); }
	.col-actions { display: flex; gap: 4px; }
	.post-count { margin-top: 12px; font-size: 13px; color: var(--admin-text-secondary); }

	.btn-import { display: inline-flex; align-items: center; padding: 6px 14px; border: 1px solid var(--admin-border); border-radius: 6px; font-size: 13px; background: #fff; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
	.btn-import:hover { background: #f1f5f9; }
	.btn-import.importing { opacity: 0.6; pointer-events: none; }

	.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
	.modal { background: #fff; border-radius: 12px; padding: 24px; max-width: 400px; width: 90%; }
	.modal h3 { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
	.modal p { font-size: 14px; color: var(--admin-text-secondary); margin-bottom: 20px; }
	.modal-actions { display: flex; justify-content: flex-end; gap: 8px; }

	.loading, .error, .empty { color: var(--admin-text-secondary); padding: 20px; text-align: center; }
	.error { color: var(--admin-danger); }

	.empty-state { text-align: center; padding: 60px 20px; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; margin: 20px 0; }
	.empty-state .empty-icon { font-size: 48px; margin-bottom: 12px; }
	.empty-state h3 { font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #374151; }
	.empty-state p { font-size: 14px; color: #9ca3af; margin-bottom: 16px; }
</style>
