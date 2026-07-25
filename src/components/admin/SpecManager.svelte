<script lang="ts">
	import type { SpecMeta, SpecDetail } from "./types";
	import MarkdownEditor from "./MarkdownEditor.svelte";

	type Route = "dashboard" | "posts" | "posts-new" | "posts-edit" | "dynamic" | "dynamic-new" | "dynamic-edit" | "spec";

	let { slug: currentName, onNavigate, showToast }: {
		slug: string | undefined;
		onNavigate: (route: Route, s?: string) => void;
		showToast: (msg: string, type: "success" | "error" | "info") => void;
	} = $props();

	let specList = $state<SpecMeta[]>([]);
	let loading = $state(true);
	let detailLoading = $state(false);
	let saving = $state(false);
	let content = $state("");
	let selectedName = $state(currentName || "");
	let showBlogPreview = $state(false);

	function specUrl(name: string): string {
		const map: Record<string, string> = { about: "/about/", friends: "/friends/", guestbook: "/guestbook/" };
		return map[name] || `/${name}/`;
	}

	$effect(() => {
		fetchList();
	});

	$effect(() => {
		if (selectedName) {
			fetchDetail(selectedName);
		}
	});

	async function fetchList() {
		loading = true;
		try {
			const res = await fetch("/admin/api/spec/list.json");
			if (!res.ok) throw new Error("获取单页列表失败");
			specList = await res.json();
			// 如果没有选中且列表有数据，默认选中第一个
			if (!selectedName && specList.length > 0) {
				selectedName = specList[0].name;
			}
		} catch (err) {
			showToast(String(err), "error");
		} finally {
			loading = false;
		}
	}

	async function fetchDetail(name: string) {
		detailLoading = true;
		try {
			const res = await fetch(`/admin/api/spec/${name}.json`);
			if (!res.ok) throw new Error("获取详情失败");
			const data: SpecDetail = await res.json();
			content = data.content || "";
		} catch (err) {
			showToast(String(err), "error");
		} finally {
			detailLoading = false;
		}
	}

	async function handleSave() {
		saving = true;
		try {
			const res = await fetch(`/admin/api/spec/${selectedName}.json`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "保存失败");
			showToast("页面更新成功", "success");
		} catch (err) {
			showToast(String(err), "error");
		} finally {
			saving = false;
		}
	}
</script>

<div class="page">
	<div class="page-header">
		<h2>单页管理</h2>
	</div>

	{#if loading}
		<p class="loading">加载中...</p>
	{:else}
		<div class="spec-layout">
			<div class="spec-sidebar">
				{#each specList as spec}
					<button
						class="spec-item"
						class:active={selectedName === spec.name}
						onclick={() => { selectedName = spec.name; onNavigate("spec", spec.name); }}
					>
						{spec.name}
					</button>
				{/each}
			</div>

			<div class="spec-editor">
				{#if selectedName}
					<div class="editor-header">
						<h3>编辑: {selectedName}</h3>
						<div class="header-actions">
							<button class="btn-outline" onclick={() => showBlogPreview = !showBlogPreview}>
								{showBlogPreview ? "✏ 返回编辑" : "🌐 博客预览"}
							</button>
							<button class="btn btn-primary" onclick={handleSave} disabled={saving || detailLoading}>
								{saving ? "保存中..." : "💾 保存"}
							</button>
						</div>
					</div>

					{#if detailLoading}
						<p class="loading">加载中...</p>
					{:else if showBlogPreview}
						<div class="blog-preview">
							<iframe src={specUrl(selectedName)} title="博客预览" class="preview-iframe"></iframe>
						</div>
					{:else}
						{#if selectedName.endsWith(".mdx") || selectedName === "friends"}
							<div class="notice">
								⚠️ 此页面包含 MDX 组件，编辑时请保留组件语法
							</div>
						{/if}
						<MarkdownEditor value={content} onChange={(v) => content = v} />
					{/if}
				{:else}
					<p class="empty">请选择一个页面进行编辑</p>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.page { max-width: 1200px; }
	.page-header { margin-bottom: 20px; }
	.page-header h2 { font-size: 22px; font-weight: 700; }
	.spec-layout { display: grid; grid-template-columns: 200px 1fr; gap: 20px; align-items: start; }
	.spec-sidebar { background: var(--admin-surface); border: 1px solid var(--admin-border); border-radius: 8px; overflow: hidden; }
	.spec-item { display: block; width: 100%; padding: 10px 16px; border: none; background: transparent; text-align: left; font-size: 13px; cursor: pointer; border-bottom: 1px solid var(--admin-border); transition: background 0.15s; }
	.spec-item:last-child { border-bottom: none; }
	.spec-item:hover { background: #f1f5f9; }
	.spec-item.active { background: var(--admin-primary); color: #fff; font-weight: 500; }
	.spec-editor { min-width: 0; }
	.editor-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
	.editor-header h3 { font-size: 16px; font-weight: 600; }
	.header-actions { display: flex; gap: 6px; align-items: center; }
	.btn-outline { display: inline-flex; align-items: center; padding: 6px 12px; border: 1px solid #3b82f6; border-radius: 6px; font-size: 12px; color: #3b82f6; background: #fff; cursor: pointer; transition: all 0.15s; }
	.btn-outline:hover { background: #3b82f6; color: #fff; }
	.notice { background: #fef3c7; border: 1px solid #fde68a; border-radius: 6px; padding: 8px 12px; font-size: 13px; color: #92400e; margin-bottom: 12px; }
	.blog-preview { border: 1px solid var(--admin-border); border-radius: 8px; overflow: hidden; background: #fff; }
	.preview-iframe { width: 100%; height: calc(100vh - 280px); border: none; }
	.loading, .empty { color: var(--admin-text-secondary); padding: 20px; }
</style>
