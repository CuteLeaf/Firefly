<script lang="ts">
	import type { DynamicMeta } from "./types";

	type Route = "dashboard" | "posts" | "posts-new" | "posts-edit" | "dynamic" | "dynamic-new" | "dynamic-edit" | "spec";

	let { onNavigate, showToast }: {
		onNavigate: (route: Route, slug?: string) => void;
		showToast: (msg: string, type: "success" | "error" | "info") => void;
	} = $props();

	let items = $state<DynamicMeta[]>([]);
	let loading = $state(true);
	let error = $state("");
	let deleteConfirm = $state<string | null>(null);

	$effect(() => {
		fetchItems();
	});

	async function fetchItems() {
		loading = true;
		error = "";
		try {
			const res = await fetch("/admin/api/dynamic/list.json");
			if (!res.ok) throw new Error("获取动态列表失败");
			items = await res.json();
		} catch (err) {
			error = String(err);
		} finally {
			loading = false;
		}
	}

	async function handleDelete(slug: string) {
		try {
			const res = await fetch(`/admin/api/dynamic/${slug}.json`, { method: "DELETE" });
			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "删除失败");
			}
			showToast("动态已删除", "success");
			deleteConfirm = null;
			await fetchItems();
		} catch (err) {
			showToast(String(err), "error");
		}
	}
</script>

<div class="page">
	<div class="page-header">
		<h2>动态管理</h2>
		<button class="btn btn-primary" onclick={() => onNavigate("dynamic-new")}>+ 新建动态</button>
	</div>

	{#if loading}
		<p class="loading">加载中...</p>
	{:else if error}
		<p class="error">{error}</p>
	{:else if items.length === 0}
		<p class="empty">暂无动态，点击「新建动态」开始发布</p>
	{:else}
		<div class="dynamic-list">
			{#each items as item (item.slug)}
				<div class="dynamic-card">
					<div class="dynamic-info">
						<span class="dynamic-date">{item.published}</span>
						{#if item.pinned}
							<span class="badge pinned">置顶</span>
						{/if}
					</div>
					<div class="dynamic-actions">
						<button class="btn btn-sm" onclick={() => onNavigate("dynamic-edit", item.slug)}>编辑</button>
						<button class="btn btn-sm btn-danger" onclick={() => deleteConfirm = item.slug}>删除</button>
					</div>
				</div>
			{/each}
		</div>

		<div class="item-count">共 {items.length} 条动态</div>
	{/if}
</div>

<!-- 删除确认 -->
{#if deleteConfirm}
	<div
		class="modal-overlay"
		role="presentation"
		onclick={() => deleteConfirm = null}
		onkeydown={(e) => { if (e.key === 'Escape') deleteConfirm = null; }}
	>
		<div class="modal" onclick={(e) => e.stopPropagation()}>
			<h3>确认删除</h3>
			<p>确定要删除这条动态吗？此操作不可撤销。</p>
			<div class="modal-actions">
				<button class="btn" onclick={() => deleteConfirm = null}>取消</button>
				<button class="btn btn-danger" onclick={() => handleDelete(deleteConfirm!)}>确认删除</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.page { max-width: 800px; }
	.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
	.page-header h2 { font-size: 22px; font-weight: 700; }

	.dynamic-list { display: flex; flex-direction: column; gap: 8px; }
	.dynamic-card { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; background: var(--admin-surface); border: 1px solid var(--admin-border); border-radius: 8px; transition: box-shadow 0.15s; }
	.dynamic-card:hover { box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
	.dynamic-info { display: flex; align-items: center; gap: 8px; }
	.dynamic-date { font-size: 14px; font-weight: 500; }
	.dynamic-actions { display: flex; gap: 4px; }
	.badge { font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: 500; }
	.pinned { background: #fef3c7; color: #92400e; }
	.item-count { margin-top: 12px; font-size: 13px; color: var(--admin-text-secondary); }

	.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
	.modal { background: #fff; border-radius: 12px; padding: 24px; max-width: 400px; width: 90%; }
	.modal h3 { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
	.modal p { font-size: 14px; color: var(--admin-text-secondary); margin-bottom: 20px; }
	.modal-actions { display: flex; justify-content: flex-end; gap: 8px; }

	.loading, .error, .empty { color: var(--admin-text-secondary); padding: 20px; text-align: center; }
	.error { color: var(--admin-danger); }
</style>
