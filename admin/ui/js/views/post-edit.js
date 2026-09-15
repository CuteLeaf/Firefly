/** 文章编辑器：frontmatter 表单 + Markdown 正文编辑/预览 + 保存/发布/删除 */
import { api } from "../api.js";
import { createSchemaForm } from "../components/schema-form.js";
import { renderMarkdown } from "../components/markdown.js";
import {
	confirmDialog,
	escapeHtml,
	icon,
	openModal,
	toast,
} from "../components/ui.js";
import { Router } from "../router.js";

export async function render(container, params) {
	const postId = params.id;
	const isEdit = Boolean(postId);

	const today = new Date().toISOString().slice(0, 10);

	let originalBody = "";
	let fileData = {};
	if (isEdit) {
		const detail = await api(`/posts/detail?id=${encodeURIComponent(postId)}`);
		fileData = detail.data ?? {};
		originalBody = detail.body ?? "";
	} else {
		fileData = { draft: true, published: today, comment: true, tags: [] };
	}

	const [schemaRes, options] = await Promise.all([
		fetch("/schemas/post.schema.json").then((r) => r.json()),
		api("/posts/options").catch(() => ({
			categories: [],
			tags: [],
			series: [],
		})),
	]);

	let body = originalBody;
	let slugValue = "";
	let dirty = false;
	let savedHash = `#/posts/edit${isEdit ? `?id=${encodeURIComponent(postId)}` : ""}`;

	/* ── 页面结构 ── */
	container.innerHTML = `
		<div class="page-head">
			<div>
				<h1 class="page-title">${isEdit ? "编辑文章" : "新建文章"}</h1>
				<p class="page-desc" id="post-path-info">${isEdit ? `文件：src/content/posts/${escapeHtml(postId)}.md` : "文件：src/content/posts/（保存后生成）"}</p>
			</div>
			<div class="flex gap-8">
				${isEdit ? '<button class="btn btn-danger" id="post-delete">' + icon("trash") + " 删除</button>" : ""}
				<button class="btn" id="post-save-draft">保存草稿</button>
				<button class="btn btn-primary" id="post-publish">${icon("rocket")} 发布</button>
			</div>
		</div>
		<div class="post-editor-layout">
			<div class="post-editor-form card" style="margin-bottom:0">
				<h2 class="card-title">文章信息</h2>
				<p class="card-desc">Frontmatter 元信息（对应 src/content.config.ts 的 posts schema）</p>
				${
					isEdit
						? ""
						: `
					<div class="field">
						<label class="field-label" for="post-slug">URL 别名（slug）</label>
						<input type="text" id="post-slug" placeholder="留空自动按标题生成拼音，如 hello-world" />
						<div class="field-hint">文章地址为 /posts/&lt;slug&gt;/。建议使用英文、数字与连字符；创建后不可修改文件名。</div>
					</div>`
				}
				<div id="post-form"></div>
			</div>
			<div class="post-editor-body">
				<div class="editor-tabs">
					<button class="editor-tab active" data-tab="edit">编辑</button>
					<button class="editor-tab" data-tab="preview">预览</button>
				</div>
				<textarea class="editor-body-input" id="post-body" placeholder="在此编写 Markdown 正文…"></textarea>
				<div class="editor-preview" id="post-preview" hidden></div>
				<div class="word-count" id="post-word-count" style="margin-top:8px"></div>
			</div>
		</div>
		<datalist id="dl-category">${options.categories.map((c) => `<option value="${escapeHtml(c)}">`).join("")}</datalist>
		<datalist id="dl-series">${options.series.map((s) => `<option value="${escapeHtml(s)}">`).join("")}</datalist>
		<datalist id="dl-tags">${options.tags.map((t) => `<option value="${escapeHtml(t)}">`).join("")}</datalist>`;

	/* ── Frontmatter 表单 ── */
	const form = createSchemaForm({
		schema: schemaRes.schema,
		value: fileData,
		root: container.querySelector("#post-form"),
		onChange: () => {
			dirty = true;
		},
	});

	// 分类/系列补全
	const categoryInput = container.querySelector(
		"#post-form [data-path='[\"category\"]'] input",
	);
	if (categoryInput) categoryInput.setAttribute("list", "dl-category");
	const seriesInput = container.querySelector(
		"#post-form [data-path='[\"series\"]'] input",
	);
	if (seriesInput) seriesInput.setAttribute("list", "dl-series");

	// 封面图媒体选择
	const imageField = container.querySelector(
		"#post-form [data-path='[\"image\"]']",
	);
	if (imageField) {
		const pickBtn = document.createElement("button");
		pickBtn.type = "button";
		pickBtn.className = "btn btn-sm";
		pickBtn.textContent = "从媒体库选择";
		pickBtn.style.marginTop = "6px";
		pickBtn.addEventListener("click", async () => {
			const picker = openModal({
				title: "选择封面图",
				className: "large",
			});
			picker.el.innerHTML = `<div class="loading">加载媒体库…</div>`;
			try {
				const media = await api("/media");
				const images = media.files.filter((f) =>
					/\.(png|jpe?g|webp|avif|gif|svg)$/i.test(f.name),
				);
				if (images.length === 0) {
					picker.el.innerHTML = `<div class="empty-state">媒体库为空，请先到「媒体库」页上传图片</div>`;
					return;
				}
				picker.el.innerHTML = `<div class="media-grid" style="margin-top:8px">${images
					.map(
						(f) => `
						<div class="media-card" data-url="${escapeHtml(f.url)}" style="cursor:pointer">
							<div class="media-thumb"><img src="${escapeHtml(f.url)}" loading="lazy" alt="" /></div>
							<div class="media-info"><div class="media-name">${escapeHtml(f.name)}</div></div>
						</div>`,
					)
					.join("")}</div>`;
				picker.el.querySelectorAll(".media-card").forEach((card) => {
					card.addEventListener("click", () => {
						form.setValue(["image"], card.dataset.url);
						picker.close();
						toast("封面图已设置", "success");
					});
				});
			} catch (err) {
				picker.el.innerHTML = `<div class="empty-state">${escapeHtml(err.message)}</div>`;
			}
		});
		imageField.appendChild(pickBtn);
	}

	/* ── 正文编辑 ── */
	const bodyInput = container.querySelector("#post-body");
	const previewEl = container.querySelector("#post-preview");
	bodyInput.value = originalBody;

	let previewRendered = false;
	let previewTimer = null;

	function updateWordCount() {
		const cjk = (bodyInput.value.match(/[\u3400-\u9fff\uf900-\ufaff]/g) || [])
			.length;
		const rest = bodyInput.value
			.replace(/[\u3400-\u9fff\uf900-\ufaff]/g, " ")
			.trim()
			.split(/\s+/)
			.filter(Boolean).length;
		container.querySelector("#post-word-count").textContent =
			`约 ${cjk + rest} 字`;
	}

	bodyInput.addEventListener("input", () => {
		dirty = true;
		updateWordCount();
		if (!previewEl.hidden) {
			clearTimeout(previewTimer);
			previewTimer = setTimeout(refreshPreview, 400);
		}
	});

	async function refreshPreview() {
		previewRendered = true;
		previewEl.innerHTML = await renderMarkdown(bodyInput.value);
	}

	container.querySelectorAll(".editor-tab").forEach((tab) => {
		tab.addEventListener("click", async () => {
			container
				.querySelectorAll(".editor-tab")
				.forEach((t) => t.classList.toggle("active", t === tab));
			const isPreview = tab.dataset.tab === "preview";
			previewEl.hidden = !isPreview;
			bodyInput.hidden = isPreview;
			if (isPreview && !previewRendered) await refreshPreview();
		});
	});
	updateWordCount();

	/* ── 保存 / 发布 / 删除 ── */
	async function save(draft) {
		const formValue = form.getValue();
		formValue.title = formValue.title || "未命名文章";
		formValue.draft = draft;
		const payload = {
			slug: slugValue,
			title: formValue.title,
			content: bodyInput.value,
			data: formValue,
		};
		let id = postId;
		if (isEdit) {
			await api(`/posts?id=${encodeURIComponent(postId)}`, {
				method: "PUT",
				body: { content: bodyInput.value, data: formValue },
			});
		} else {
			const created = await api("/posts", { method: "POST", body: payload });
			id = created.id;
		}
		dirty = false;
		savedHash = `#/posts/edit?id=${encodeURIComponent(id)}`;
		toast(draft ? "草稿已保存" : "文章已发布", "success");
		if (!isEdit) {
			window.location.hash = savedHash;
		}
	}

	container
		.querySelector("#post-save-draft")
		.addEventListener("click", () =>
			save(true).catch((e) => toast(e.message, "error")),
		);
	container
		.querySelector("#post-publish")
		.addEventListener("click", () =>
			save(false).catch((e) => toast(e.message, "error")),
		);

	if (isEdit) {
		container
			.querySelector("#post-delete")
			.addEventListener("click", async () => {
				const ok = await confirmDialog({
					title: "删除文章",
					message: "确定删除这篇文章吗？文件将移入 admin/trash/posts 回收站。",
					danger: true,
					confirmText: "删除",
				});
				if (!ok) return;
				try {
					await api(`/posts?id=${encodeURIComponent(postId)}`, {
						method: "DELETE",
					});
					dirty = false;
					toast("已移入回收站", "success");
					window.location.hash = "#/posts";
				} catch (err) {
					toast(err.message, "error");
				}
			});
	}

	/* ── 离开保护 ── */
	let restoring = false;
	const guard = () => {
		if (!dirty || restoring) return;
		if (!confirm("有未保存的修改，确定要离开吗？")) {
			restoring = true;
			window.location.hash = savedHash;
			setTimeout(() => (restoring = false), 0);
		}
	};
	window.addEventListener("hashchange", guard);
	window.addEventListener("beforeunload", (e) => {
		if (dirty) e.preventDefault();
	});

	return () => {
		window.removeEventListener("hashchange", guard);
		form.destroy();
	};
}
