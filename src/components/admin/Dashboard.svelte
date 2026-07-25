<script lang="ts">
	import type { DashboardStats } from "./types";

	type Route = "dashboard" | "posts" | "posts-new" | "posts-edit" | "dynamic" | "dynamic-new" | "dynamic-edit" | "spec";

	let { onNavigate }: {
		onNavigate: (route: Route, slug?: string) => void;
	} = $props();

	let stats = $state<DashboardStats | null>(null);
	let loading = $state(true);
	let error = $state("");

	$effect(() => {
		fetchStats();
	});

	async function fetchStats() {
		loading = true;
		error = "";
		try {
			const res = await fetch("/admin/api/dashboard.json");
			if (!res.ok) throw new Error("获取数据失败");
			stats = await res.json();
		} catch (err) {
			error = String(err);
		} finally {
			loading = false;
		}
	}
</script>

<div class="page">
	<div class="page-header">
		<h2>仪表盘</h2>
		<button class="btn btn-sm" onclick={fetchStats}>刷新</button>
	</div>

	{#if loading}
		<p class="loading">加载中...</p>
	{:else if error}
		<p class="error">{error}</p>
	{:else if stats}
		<div class="stats-grid">
			<div class="stat-card" onclick={() => onNavigate("posts")}>
				<div class="stat-value">{stats.totalPosts}</div>
				<div class="stat-label">文章总数</div>
				<div class="stat-detail">
					<span class="text-green">已发布 {stats.publishedPosts}</span>
					<span class="text-yellow">草稿 {stats.draftPosts}</span>
				</div>
			</div>
			<div class="stat-card" onclick={() => onNavigate("dynamic")}>
				<div class="stat-value">{stats.totalDynamics}</div>
				<div class="stat-label">动态总数</div>
			</div>
			<div class="stat-card" onclick={() => onNavigate("spec")}>
				<div class="stat-value">{stats.totalSpecs}</div>
				<div class="stat-label">单页数量</div>
			</div>
			<div class="stat-card">
				<div class="stat-value">{stats.totalTags}</div>
				<div class="stat-label">标签数</div>
			</div>
		</div>

		<div class="section">
			<h3>最近文章</h3>
			{#if stats.recentPosts.length === 0}
				<p class="empty">暂无文章</p>
			{:else}
				<div class="recent-list">
					{#each stats.recentPosts as post}
						<div
							class="recent-item"
							onclick={() => onNavigate("posts-edit", post.slug)}
						>
							<span class="recent-title">{post.title}</span>
							<span class="recent-meta">
								{#if post.draft}
									<span class="badge draft">草稿</span>
								{/if}
								{post.published}
							</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.page { max-width: 960px; }
	.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
	.page-header h2 { font-size: 22px; font-weight: 700; }
	.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
	.stat-card { background: var(--admin-surface); border-radius: 12px; padding: 20px; border: 1px solid var(--admin-border); cursor: pointer; transition: box-shadow 0.2s; }
	.stat-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
	.stat-value { font-size: 32px; font-weight: 700; color: var(--admin-primary); }
	.stat-label { font-size: 13px; color: var(--admin-text-secondary); margin-top: 4px; }
	.stat-detail { font-size: 12px; margin-top: 8px; display: flex; gap: 12px; }
	.text-green { color: #16a34a; }
	.text-yellow { color: #ca8a04; }
	.section { margin-bottom: 24px; }
	.section h3 { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
	.recent-list { background: var(--admin-surface); border-radius: 8px; border: 1px solid var(--admin-border); overflow: hidden; }
	.recent-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid var(--admin-border); }
	.recent-item:last-child { border-bottom: none; }
	.recent-item:hover { background: #f1f5f9; }
	.recent-title { font-size: 14px; font-weight: 500; }
	.recent-meta { font-size: 12px; color: var(--admin-text-secondary); display: flex; align-items: center; gap: 8px; }
	.badge { font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: 500; }
	.draft { background: #fef3c7; color: #92400e; }
	.loading, .error, .empty { color: var(--admin-text-secondary); padding: 20px; }
	.error { color: var(--admin-danger); }
</style>
