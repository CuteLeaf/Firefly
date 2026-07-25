<script lang="ts">
	import MarkdownEditor from "./MarkdownEditor.svelte";

	type Route = "dashboard" | "posts" | "posts-new" | "posts-edit" | "dynamic" | "dynamic-new" | "dynamic-edit" | "spec";

	let { slug, onNavigate, showToast }: {
		slug: string | undefined;
		onNavigate: (route: Route, s?: string) => void;
		showToast: (msg: string, type: "success" | "error" | "info") => void;
	} = $props();

	const isEditing = slug !== undefined;

	let content = $state("");
	let published = $state("");
	let pinned = $state(false);
	let loading = $state(isEditing);
	let saving = $state(false);
	let showBlogPreview = $state(false);

	$effect(() => {
		if (isEditing) {
			fetchDynamic();
		} else {
			published = new Date().toISOString().replace("T", " ").slice(0, 19);
		}
	});

	async function fetchDynamic() {
		loading = true;
		try {
			const res = await fetch(`/admin/api/dynamic/${slug}.json`);
			if (!res.ok) throw new Error("获取动态失败");
			const data = await res.json();
			content = data.content || "";
			published = data.published || "";
			pinned = data.pinned || false;
		} catch (err) {
			showToast(String(err), "error");
		} finally {
			loading = false;
		}
	}

	async function handleSave() {
		if (!content.trim()) {
			showToast("内容不能为空", "error");
			return;
		}

		saving = true;
		try {
			const body = { content, published, pinned };

			let res: Response;
			if (isEditing) {
				res = await fetch(`/admin/api/dynamic/${slug}.json`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(body),
				});
			} else {
				res = await fetch("/admin/api/dynamic/create.json", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(body),
				});
			}

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "保存失败");

			showToast(isEditing ? "动态更新成功" : "动态创建成功", "success");
			onNavigate("dynamic");
		} catch (err) {
			showToast(String(err), "error");
		} finally {
			saving = false;
		}
	}
</script>

<div class="page">
	<div class="page-header">
		<h2>{isEditing ? "编辑动态" : "新建动态"}</h2>
		<div class="header-actions">
			{#if isEditing}
				<button class="btn-outline" onclick={() => showBlogPreview = !showBlogPreview}>
					{showBlogPreview ? "✏ 返回编辑" : "🌐 博客预览"}
				</button>
			{/if}
			<button class="btn" onclick={() => onNavigate("dynamic")}>← 返回列表</button>
			<button class="btn btn-primary" onclick={handleSave} disabled={saving}>
				{saving ? "保存中..." : "💾 保存"}
			</button>
		</div>
	</div>

	{#if loading}
		<p class="loading">加载中...</p>
	{:else if showBlogPreview}
		<div class="blog-preview">
			<iframe src="/dynamic/" title="博客预览" class="preview-iframe"></iframe>
		</div>
	{:else}
		<div class="form-group">
			<label for="dynamic-published">发布时间</label>
			<input id="dynamic-published" type="text" class="form-input" bind:value={published} placeholder="YYYY-MM-DD HH:mm:ss" />
		</div>
		<div class="form-check">
			<input type="checkbox" id="pinned" bind:checked={pinned} />
			<label for="pinned">置顶</label>
		</div>

		<div class="editor-wrapper">
			<MarkdownEditor value={content} onChange={(v) => content = v} {showToast} />
		</div>
	{/if}
</div>

<style>
	.page { max-width: 900px; }
	.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
	.page-header h2 { font-size: 22px; font-weight: 700; }
	.header-actions { display: flex; gap: 8px; }
	.form-group { margin-bottom: 12px; }
	.form-group label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 4px; }
	.form-input { width: 100%; max-width: 300px; padding: 8px 12px; border: 1px solid var(--admin-border); border-radius: 6px; font-size: 13px; outline: none; background: #fff; }
	.form-input:focus { border-color: var(--admin-primary); }
	.form-check { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
	.form-check input[type="checkbox"] { width: 16px; height: 16px; }
	.form-check label { font-size: 13px; cursor: pointer; }
	.editor-wrapper { margin-top: 8px; }
	.loading { color: var(--admin-text-secondary); padding: 20px; }

	.btn-outline { display: inline-flex; align-items: center; padding: 6px 12px; border: 1px solid var(--admin-primary); border-radius: 6px; font-size: 13px; color: var(--admin-primary); background: #fff; text-decoration: none; cursor: pointer; transition: all 0.15s; }
	.btn-outline:hover { background: var(--admin-primary); color: #fff; }

	.blog-preview { border: 1px solid var(--admin-border); border-radius: 8px; overflow: hidden; background: #fff; margin-top: 12px; }
	.preview-iframe { width: 100%; height: calc(100vh - 250px); border: none; }
</style>
