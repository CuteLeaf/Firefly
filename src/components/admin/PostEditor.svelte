<script lang="ts">
	import MarkdownEditor from "./MarkdownEditor.svelte";

	type Route = "dashboard" | "posts" | "posts-new" | "posts-edit" | "dynamic" | "dynamic-new" | "dynamic-edit" | "spec";

	let { slug, onNavigate, showToast }: {
		slug: string | undefined;
		onNavigate: (route: Route, slug?: string) => void;
		showToast: (msg: string, type: "success" | "error" | "info") => void;
	} = $props();

	const isEditing = slug !== undefined;

	// 表单数据
	let title = $state("");
	let published = $state("");
	let description = $state("");
	let image = $state("");
	let tagsStr = $state("");
	let category = $state("");
	let draft = $state(true);
	let pinned = $state(false);
	let lang = $state("zh_CN");
	let author = $state("");
	let password = $state("");
	let comment = $state(true);
	let content = $state("");

	let loading = $state(true);
	let saving = $state(false);
	let showBlogPreview = $state(false);
	let hasUnsaved = $state(false);

	let savedTitle = $state("");
	let savedContent = $state("");

	function markSaved() { savedTitle = title; savedContent = content; hasUnsaved = false; }

	// 检测是否有未保存更改
	$effect(() => { hasUnsaved = (title !== savedTitle || content !== savedContent); });

	// 页面关闭提醒
	$effect(() => {
		const handler = (e: BeforeUnloadEvent) => {
			if (hasUnsaved) { e.preventDefault(); e.returnValue = ""; }
		};
		window.addEventListener("beforeunload", handler);
		return () => window.removeEventListener("beforeunload", handler);
	});

	$effect(() => {
		if (isEditing) {
			fetchPost();
		} else {
			loading = false;
			// 默认今天的日期
			published = new Date().toISOString().split("T")[0];
		}
	});

	async function fetchPost() {
		loading = true;
		try {
			const res = await fetch(`/admin/api/posts/${slug}.json`);
			if (!res.ok) throw new Error("获取文章失败");
			const data = await res.json();
			title = data.title || "";
			published = data.published || "";
			description = data.description || "";
			image = data.image || "";
			tagsStr = (data.tags || []).join(", ");
			category = data.category || "";
			draft = data.draft ?? true;
			pinned = data.pinned ?? false;
			lang = data.lang || "zh_CN";
			author = data.author || "";
			password = data.password || "";
			comment = data.comment ?? true;
			content = data.content || "";
			markSaved();
		} catch (err) {
			showToast(String(err), "error");
		} finally {
			loading = false;
		}
	}

	async function handleSave() {
		if (!title.trim()) {
			showToast("标题不能为空", "error");
			markSaved();
			return;
		}

		saving = true;
		try {
			const tags = tagsStr
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean);

			const body = {
				title: title.trim(),
				published,
				description: description.trim(),
				image: image.trim(),
				tags,
				category: category.trim(),
				draft,
				pinned,
				lang: lang.trim(),
				author: author.trim(),
				password,
				comment,
				content,
			};

			let res: Response;
			if (isEditing) {
				res = await fetch(`/admin/api/posts/${slug}.json`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(body),
				});
			} else {
				res = await fetch("/admin/api/posts/create.json", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(body),
				});
			}

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "保存失败");

			showToast(isEditing ? "文章更新成功" : "文章创建成功", "success");
			if (!isEditing) {
				onNavigate("posts-edit", data.slug);
			}
		} catch (err) {
			showToast(String(err), "error");
		} finally {
			saving = false;
		}
	}

	async function handleInsertImage(url: string, alt: string) {
		const mdImg = `![${alt}](${url})`;
		content += (content ? "\n\n" : "") + mdImg;
	}

	async function uploadCover(file: File) {
		try {
			const formData = new FormData();
			formData.append("image", file);
			const res = await fetch("/admin/api/upload/image.json", { method: "POST", body: formData });
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "上传失败");
			image = data.url;
			showToast("封面图片已上传", "success");
		} catch (err) {
			showToast(String(err), "error");
		}
	}
</script>

<div class="page">
	<div class="page-header">
		<h2>{isEditing ? "编辑文章" : "新建文章"}
			{#if hasUnsaved}<span class="unsaved-badge">未保存</span>{/if}
		</h2>
		<div class="header-actions">
			{#if isEditing}
				<button class="btn btn-outline" onclick={() => showBlogPreview = !showBlogPreview}>
					{showBlogPreview ? "✏ 返回编辑" : "🌐 博客预览"}
				</button>
			{/if}
			<button class="btn" onclick={() => onNavigate("posts")}>← 返回列表</button>
			<button class="btn btn-primary" onclick={handleSave} disabled={saving}>
				{saving ? "保存中..." : "💾 保存"}
			</button>
		</div>
	</div>

	{#if loading}
		<p class="loading">加载中...</p>
	{:else if showBlogPreview}
		<div class="blog-preview">
			<iframe src="/posts/{slug}/" title="博客预览" class="preview-iframe"></iframe>
		</div>
	{:else}
		<div class="editor-layout">
			<div class="editor-main">
				<div class="form-group">
					<label for="post-title">标题 *</label>
					<input id="post-title" type="text" class="form-input title-input" bind:value={title} placeholder="文章标题" />
				</div>

				<MarkdownEditor value={content} onChange={(v) => content = v} {showToast} />

				<div class="form-row">
					<div class="form-group">
						<label for="post-desc">描述</label>
						<textarea id="post-desc" class="form-textarea" bind:value={description} placeholder="文章简介（用于列表和SEO）" rows="2"></textarea>
					</div>
				</div>
			</div>

			<div class="editor-sidebar">
				<div class="meta-card">
					<h4>发布设置</h4>
					<div class="form-group">
						<label for="post-date">发布日期</label>
						<input id="post-date" type="date" class="form-input" bind:value={published} />
					</div>
					{#if isEditing}
						<div class="form-group">
							<label for="post-slug">
								URL 别名（slug）
								<span class="help-tip" title="文章网址的最后一段，如 /posts/此值/。改后原链接可能失效">?</span>
							</label>
							<div class="slug-field">
								<span class="slug-prefix">/posts/</span>
								<input id="post-slug" type="text" class="form-input slug-input" value={slug || ""} disabled placeholder="自动生成" />
								<span class="slug-suffix">/</span>
							</div>
						</div>
					{/if}
					<div class="form-check">
						<input type="checkbox" id="draft" bind:checked={draft} />
						<label for="draft">草稿（不对外发布）</label>
					</div>
					<div class="form-check">
						<input type="checkbox" id="pinned" bind:checked={pinned} />
						<label for="pinned">置顶</label>
					</div>
					<div class="form-check">
						<input type="checkbox" id="comment" bind:checked={comment} />
						<label for="comment">允许评论</label>
					</div>
				</div>

				<div class="meta-card">
					<h4>分类与标签</h4>
					<div class="form-group">
						<label for="post-category">分类</label>
						<input id="post-category" type="text" class="form-input" bind:value={category} placeholder="如：技术、生活" />
					</div>
					<div class="form-group">
						<label for="post-tags">标签（用逗号分隔）</label>
						<input id="post-tags" type="text" class="form-input" bind:value={tagsStr} placeholder="Astro, Svelte, TypeScript" />
					</div>
				</div>

				<div class="meta-card">
					<h4>高级设置</h4>
					<div class="form-group">
						<label for="post-image">封面图片</label>
						<div
							class="drop-image-input"
							ondrop={(e) => { e.preventDefault(); const f=e.dataTransfer?.files[0]; if(f && f.type.startsWith('image/')) uploadCover(f); }}
							ondragover={(e) => e.preventDefault()}
						>
							<input id="post-image" type="text" class="form-input" bind:value={image} placeholder="./images/cover.webp 或上传图片" />
							<span class="drop-hint">或拖拽图片到此</span>
						</div>
					</div>
					<div class="form-group">
						<label for="post-lang">语言</label>
						<input id="post-lang" type="text" class="form-input" bind:value={lang} placeholder="zh_CN" />
					</div>
					<div class="form-group">
						<label for="post-author">作者</label>
						<input id="post-author" type="text" class="form-input" bind:value={author} placeholder="作者名" />
					</div>
					<div class="form-group">
						<label for="post-password">密码保护</label>
						<input id="post-password" type="text" class="form-input" bind:value={password} placeholder="留空则不加密" />
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.page { max-width: 1400px; }
	.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
	.page-header h2 { font-size: 22px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
	.unsaved-badge { font-size: 11px; background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 10px; font-weight: 500; }
	.header-actions { display: flex; gap: 8px; }
	.editor-layout { display: grid; grid-template-columns: 1fr 320px; gap: 20px; align-items: start; }
	.editor-main { min-width: 0; }
	.editor-sidebar { display: flex; flex-direction: column; gap: 16px; }

	.form-group { margin-bottom: 12px; }
	.form-group label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 4px; color: var(--admin-text); }
	.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--admin-border); border-radius: 6px; font-size: 13px; outline: none; background: #fff; }
	.form-input:focus { border-color: var(--admin-primary); }
	.title-input { font-size: 18px; font-weight: 600; padding: 10px 14px; }
	.form-textarea { width: 100%; padding: 8px 12px; border: 1px solid var(--admin-border); border-radius: 6px; font-size: 13px; outline: none; resize: vertical; font-family: inherit; }
	.form-textarea:focus { border-color: var(--admin-primary); }
	.form-row { margin-top: 16px; }
	.form-check { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
	.form-check input[type="checkbox"] { width: 16px; height: 16px; }
	.form-check label { font-size: 13px; cursor: pointer; }

	.help-tip { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; border-radius: 50%; background: #e5e7eb; color: #6b7280; font-size: 10px; font-weight: 700; cursor: help; margin-left: 4px; vertical-align: middle; }
	.help-tip:hover { background: #d1d5db; }

	.slug-field { display: flex; align-items: center; gap: 0; }
	.slug-prefix, .slug-suffix { font-size: 12px; color: #9ca3af; padding: 0 4px; background: #f9fafb; border: 1px solid #e5e7eb; line-height: 32px; }
	.slug-prefix { border-radius: 6px 0 0 6px; border-right: none; }
	.slug-suffix { border-radius: 0 6px 6px 0; border-left: none; }
	.slug-input { border-radius: 0 !important; }

	.meta-card { background: var(--admin-surface); border: 1px solid var(--admin-border); border-radius: 8px; padding: 16px; }
	.meta-card h4 { font-size: 13px; font-weight: 600; margin-bottom: 12px; color: var(--admin-text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }

	.btn-outline { display: inline-flex; align-items: center; padding: 8px 14px; border: 1px solid var(--admin-primary); border-radius: 6px; font-size: 13px; color: var(--admin-primary); background: #fff; text-decoration: none; cursor: pointer; transition: all 0.15s; }
	.btn-outline:hover { background: var(--admin-primary); color: #fff; }

	.blog-preview { border: 1px solid var(--admin-border); border-radius: 8px; overflow: hidden; background: #fff; }
	.preview-iframe { width: 100%; height: calc(100vh - 200px); border: none; }

	.drop-image-input { display: flex; align-items: center; gap: 6px; }
	.drop-image-input .form-input { flex: 1; }
	.drop-hint { font-size: 11px; color: var(--admin-text-secondary); white-space: nowrap; cursor: default; }

	.loading { color: var(--admin-text-secondary); padding: 20px; }

	@media (max-width: 900px) {
		.editor-layout { grid-template-columns: 1fr; }
	}
</style>
