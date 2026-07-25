<script lang="ts">
	let { showToast }: { showToast: (msg: string, type: "success" | "error" | "info") => void } = $props();

	let images = $state<Array<{ fileName: string; url: string; size: number; date: string }>>([]);
	let loading = $state(true);

	$effect(() => { fetchImages(); });

	async function fetchImages() {
		loading = true;
		try {
			const res = await fetch("/admin/api/media.json");
			if (!res.ok) throw new Error("获取媒体库失败");
			images = await res.json();
		} catch (err) {
			showToast(String(err), "error");
		} finally {
			loading = false;
		}
	}

	function formatSize(bytes: number): string {
		if (bytes < 1024) return bytes + " B";
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
		return (bytes / 1024 / 1024).toFixed(1) + " MB";
	}

	function formatDate(iso: string): string {
		return iso.slice(0, 10) + " " + iso.slice(11, 16);
	}

	async function copyUrl(url: string) {
		try {
			await navigator.clipboard.writeText(url);
			showToast("URL 已复制", "info");
		} catch {
			showToast("复制失败", "error");
		}
	}

	async function copyMd(url: string, name: string) {
		try {
			await navigator.clipboard.writeText(`![${name}](${url})`);
			showToast("Markdown 已复制", "info");
		} catch {
			showToast("复制失败", "error");
		}
	}

	async function deleteImage(url: string, name: string) {
		if (!confirm(`确定删除「${name}」？\n此操作不可撤销。`)) return;
		try {
			const res = await fetch("/admin/api/media-delete.json", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ url }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "删除失败");
			showToast("图片已删除", "success");
			await fetchImages();
		} catch (err) {
			showToast(String(err), "error");
		}
	}
</script>

<div class="media-page">
	<div class="media-header">
		<h3>📸 媒体库</h3>
		<p class="media-desc">所有通过管理面板上传的图片，点击即可复制 URL</p>
	</div>

	{#if loading}
		<p class="loading">加载中...</p>
	{:else if images.length === 0}
		<div class="empty-state">
			<div class="empty-icon">📸</div>
			<h3>还没有上传过图片</h3>
			<p>在文章编辑器中拖拽图片到编辑区，或使用「📤 上传图片」按钮上传</p>
		</div>
	{:else}
		<div class="media-grid">
			{#each images as img}
				<div class="media-item">
					<div class="media-img-wrap" onclick={() => copyUrl(img.url)}>
						<img src={img.url} alt={img.fileName} loading="lazy" />
					</div>
					<div class="media-info">
						<span class="media-name" title={img.fileName}>{img.fileName}</span>
						<span class="media-meta">{formatSize(img.size)} · {formatDate(img.date)}</span>
						<div class="media-actions">
							<button class="m-btn" onclick={() => copyUrl(img.url)} title="复制 URL">🔗 URL</button>
							<button class="m-btn" onclick={() => copyMd(img.url, img.fileName)} title="复制 Markdown">📝 MD</button>
							<button class="m-btn m-btn-del" onclick={() => deleteImage(img.url, img.fileName)} title="删除图片">🗑</button>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<p class="media-count">共 {images.length} 张图片</p>
	{/if}
</div>

<style>
	.media-page { max-width: 900px; }
	.media-header { margin-bottom: 20px; }
	.media-header h3 { font-size: 18px; font-weight: 600; }
	.media-desc { font-size: 13px; color: #6b7280; margin-top: 4px; }
	.loading { color: #6b7280; padding: 40px; text-align: center; }

	.empty-state { text-align: center; padding: 60px 20px; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; }
	.empty-icon { font-size: 48px; margin-bottom: 12px; }
	.empty-state h3 { font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #374151; }
	.empty-state p { font-size: 14px; color: #9ca3af; max-width: 400px; margin: 0 auto; line-height: 1.6; }

	.media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
	.media-item { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; transition: box-shadow 0.15s; }
	.media-item:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
	.media-img-wrap { aspect-ratio: 16/9; overflow: hidden; cursor: pointer; background: #f9fafb; display: flex; align-items: center; justify-content: center; }
	.media-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s; }
	.media-img-wrap:hover img { transform: scale(1.05); }
	.media-info { padding: 10px; }
	.media-name { display: block; font-size: 12px; color: #374151; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.media-meta { display: block; font-size: 11px; color: #9ca3af; margin-top: 2px; }
	.media-actions { display: flex; gap: 4px; margin-top: 6px; }
	.m-btn { padding: 3px 8px; border: 1px solid #d1d5db; border-radius: 4px; background: #fff; cursor: pointer; font-size: 11px; transition: all 0.1s; }
	.m-btn:hover { background: #f1f5f9; border-color: #3b82f6; color: #3b82f6; }
	.m-btn-del:hover { border-color: #ef4444; color: #ef4444; background: #fef2f2; }
	.media-count { margin-top: 12px; font-size: 13px; color: #6b7280; text-align: center; }

	@media (max-width: 600px) {
		.media-grid { grid-template-columns: repeat(2, 1fr); }
	}
</style>
