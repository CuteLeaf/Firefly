<script lang="ts">
	let { showToast, onUpload }: {
		showToast?: (msg: string, type: "success" | "error" | "info") => void;
		onUpload?: (url: string, fileName: string) => void;
	} = $props();

	let uploading = $state(false);
	let uploadResult = $state<{ url: string; fileName: string } | null>(null);

	async function handleUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		uploading = true;
		uploadResult = null;

		try {
			const formData = new FormData();
			formData.append("image", file);

			const res = await fetch("/admin/api/upload/image.json", {
				method: "POST",
				body: formData,
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "上传失败");

			uploadResult = data;
			if (showToast) showToast(`上传成功: ${data.url}`, "success");
			if (onUpload) onUpload(data.url, data.fileName);
		} catch (err) {
			if (showToast) showToast(String(err), "error");
		} finally {
			uploading = false;
			input.value = "";
		}
	}

	function copyUrl(url: string) {
		navigator.clipboard.writeText(url).then(() => {
			if (showToast) showToast("URL 已复制到剪贴板", "info");
		});
	}
</script>

<div class="uploader">
	<label class="upload-btn" class:uploading>
		{uploading ? "上传中..." : "📤 上传图片"}
		<input type="file" accept="image/*" hidden onchange={handleUpload} disabled={uploading} />
	</label>

	{#if uploadResult}
		<div class="upload-result">
			<div class="result-row">
				<code class="url-text">{uploadResult.url}</code>
				<button class="copy-btn" onclick={() => copyUrl(uploadResult!.url)}>复制</button>
			</div>
			<div class="result-formats">
				<button class="copy-btn" onclick={() => copyUrl(`![${uploadResult!.fileName}](${uploadResult!.url})`)}>
					复制 Markdown
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.uploader {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}

	.upload-btn {
		display: inline-block;
		padding: 4px 10px;
		background: var(--admin-surface);
		border: 1px solid var(--admin-border);
		border-radius: 4px;
		cursor: pointer;
		font-size: 12px;
		transition: all 0.15s;
		white-space: nowrap;
	}

	.upload-btn:hover {
		background: #f1f5f9;
	}

	.upload-btn.uploading {
		opacity: 0.6;
		pointer-events: none;
	}

	.upload-result {
		background: var(--admin-surface);
		border: 1px solid var(--admin-border);
		border-radius: 6px;
		padding: 6px 10px;
		font-size: 12px;
		width: 100%;
	}

	.result-row {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.url-text {
		font-size: 11px;
		color: var(--admin-primary);
		word-break: break-all;
		flex: 1;
	}

	.copy-btn {
		padding: 2px 8px;
		border: 1px solid var(--admin-border);
		border-radius: 4px;
		background: #fff;
		cursor: pointer;
		font-size: 11px;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.copy-btn:hover {
		background: #f1f5f9;
	}

	.result-formats {
		margin-top: 4px;
	}
</style>
