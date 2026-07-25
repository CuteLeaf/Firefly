<script lang="ts">
	import { EditorView, keymap, placeholder as placeholderExt } from "@codemirror/view";
	import { EditorState } from "@codemirror/state";
	import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
	import { oneDark } from "@codemirror/theme-one-dark";
	import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
	import { syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";
	import { closeBrackets } from "@codemirror/autocomplete";
	import { marked } from "marked";

	let { value, onChange, showToast }: {
		value: string;
		onChange: (val: string) => void;
		showToast?: (msg: string, type: "success" | "error" | "info") => void;
	} = $props();

	let editorRef = $state<HTMLDivElement | null>(null);
	let showPreview = $state(false);
	let previewHtml = $state("");
	let dragging = $state(false);
	let cmView: EditorView | null = null;

	// 创建/更新 CodeMirror
	$effect(() => {
		if (!editorRef) return;

		if (!cmView) {
			const startState = EditorState.create({
				doc: value || "",
				extensions: [
					markdown({ base: markdownLanguage }),
					oneDark,
					syntaxHighlighting(defaultHighlightStyle),
					history(),
					closeBrackets(),
					keymap.of([...defaultKeymap, ...historyKeymap]),
					placeholderExt("在此输入 Markdown 内容...（支持拖拽图片到此处上传）"),
					EditorView.updateListener.of((update) => {
						if (update.docChanged) {
							onChange(update.state.doc.toString());
						}
					}),
					EditorView.lineWrapping,
				],
			});

			cmView = new EditorView({
				state: startState,
				parent: editorRef,
			});
		} else if (cmView && value !== cmView.state.doc.toString()) {
			// 外部更新值
			cmView.dispatch({
				changes: { from: 0, to: cmView.state.doc.length, insert: value || "" },
			});
		}

		return () => {
			cmView?.destroy();
			cmView = null;
		};
	});

	// 预览渲染
	$effect(() => {
		if (showPreview) {
			renderPreview();
		}
	});

	// 更新预览内容
	$effect(() => {
		if (showPreview && value) {
			renderPreview();
		}
	});

	function renderPreview() {
		try {
			const processed = value.replace(
				/!\[([^\]]*)\]\((?!\/|https?:\/\/)([^)]+)\)/g,
				(_m, alt, src) =>
					`<div style="border:1px dashed #d1d5db;border-radius:6px;padding:16px;text-align:center;color:#9ca3af;font-size:13px;background:#f9fafb;margin:8px 0;">🖼 ${alt || "图片"}<br><span style="font-size:11px;">${src}</span><br><span style="font-size:11px;">（预览暂不支持相对路径）</span></div>`,
			);
			previewHtml = marked.parse(processed, {
				gfm: true,
				renderer: {
					space() { return ""; },
					text({ text }: { text: string }) { return text; },
					html({ text }: { text: string }) { return text; },
					br() { return "<br>"; },
					del({ text }: { text: string }) { return `<del style="text-decoration:line-through;">${text}</del>`; },
					checkbox({ checked }: { checked: boolean }) { return checked ? "☑ " : "☐ "; },
					heading({ text, depth }: { text: string; depth: number }) {
						const s = depth === 1 ? "26px" : depth === 2 ? "22px" : depth === 3 ? "18px" : "16px";
						const b = depth <= 2 ? `padding-bottom:${depth === 1 ? "6px" : "4px"};border-bottom:1px solid #e5e7eb` : "";
						return `<h${depth} style="font-size:${s};font-weight:${depth === 1 ? "700" : "600"};margin:${depth === 1 ? "20px 0 10px" : "16px 0 8px"};${b}">${text}</h${depth}>`;
					},
					paragraph({ text }: { text: string }) { return `<p style="margin:8px 0;line-height:1.7;">${text}</p>`; },
					code({ text, lang }: { text: string; lang?: string }) {
						return `<pre style="background:#1e293b;color:#e2e8f0;padding:14px;border-radius:8px;overflow-x:auto;margin:10px 0;font-size:13px;line-height:1.5;"><code style="font-family:'SF Mono','JetBrains Mono',monospace;">${text}</code></pre>`;
					},
					codespan({ text }: { text: string }) { return `<code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:13px;font-family:'SF Mono','JetBrains Mono',monospace;color:#1f2937;">${text}</code>`; },
					blockquote({ text }: { text: string }) { return `<blockquote style="border-left:4px solid #3b82f6;padding:8px 16px;color:#6b7280;margin:10px 0;background:#f9fafb;border-radius:0 6px 6px 0;">${text}</blockquote>`; },
					image({ href, text }: { href: string; text?: string }) { return `<img src="${href}" alt="${text || ""}" style="max-width:100%;height:auto;border-radius:6px;margin:10px 0;">`; },
					list({ ordered, body }: { ordered: boolean; body: string }) { const t = ordered ? "ol" : "ul"; return `<${t} style="padding-left:24px;margin:8px 0;">${body}</${t}>`; },
					listitem({ text }: { text: string }) { return `<li style="margin:4px 0;">${text}</li>`; },
					table({ header, body }: { header: string; body: string }) { return `<table style="border-collapse:collapse;width:100%;margin:10px 0;font-size:14px;"><thead>${header}</thead><tbody>${body}</tbody></table>`; },
					tablerow({ text }: { text: string }) { return `<tr>${text}</tr>`; },
					tablecell({ text, align, header }: { text: string; align?: string | null; header: boolean }) {
						const t = header ? "th" : "td";
						const s = `border:1px solid #d1d5db;padding:8px 12px;text-align:${align || "left"};${header ? "font-weight:600;background:#f9fafb" : ""}`;
						return `<${t} style="${s}">${text}</${t}>`;
					},
					strong({ text }: { text: string }) { return `<strong style="font-weight:700;">${text}</strong>`; },
					em({ text }: { text: string }) { return `<em style="font-style:italic;">${text}</em>`; },
					link({ href, text }: { href: string; text: string }) { return `<a href="${href}" style="color:#3b82f6;text-decoration:underline;">${text}</a>`; },
					hr() { return `<hr style="border:none;border-top:2px solid #e5e7eb;margin:20px 0;">`; },
				},
			});
		} catch {
			previewHtml = "<p style='color:red'>渲染失败</p>";
		}
	}

	// 在光标处插入文本
	function insertAtCursor(before: string, after = "") {
		if (!cmView) return;
		const sel = cmView.state.selection.main;
		const selected = cmView.state.sliceDoc(sel.from, sel.to);
		const newText = before + selected + after;
		cmView.dispatch({
			changes: { from: sel.from, to: sel.to, insert: newText },
			selection: { anchor: sel.from + before.length, head: sel.from + before.length + selected.length },
		});
		cmView.focus();
	}

	// 拖拽上传
	async function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragging = false;
		const files = e.dataTransfer?.files;
		if (!files || files.length === 0) return;
		for (const file of Array.from(files)) {
			if (!file.type.startsWith("image/")) continue;
			await uploadAndInsert(file);
		}
	}

	async function uploadAndInsert(file: File) {
		try {
			const fd = new FormData();
			fd.append("image", file);
			const res = await fetch("/admin/api/upload/image.json", { method: "POST", body: fd });
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "上传失败");
			const md = `![${data.fileName}](${data.url})`;
			if (cmView) {
				cmView.dispatch({ changes: { from: cmView.state.doc.length, insert: "\n\n" + md } });
				cmView.focus();
			}
			if (showToast) showToast("图片已上传", "success");
		} catch (err) {
			if (showToast) showToast(String(err), "error");
		}
	}

	function handleDragOver(e: DragEvent) { e.preventDefault(); dragging = true; }
	function handleDragLeave() { dragging = false; }
</script>

<div class="md-editor" class:dragging ondrop={handleDrop} ondragover={handleDragOver} ondragleave={handleDragLeave}>
	<div class="editor-toolbar">
		<button class="tb-btn" title="撤销" onclick={() => cmView && keymap.compute(cmView.state)?.some?.(k => k.key === "Mod-z")}>↩</button>
		<span class="tb-sep"></span>
		<button class="tb-btn" title="粗体" onclick={() => insertAtCursor("**", "**")}><b>B</b></button>
		<button class="tb-btn" title="斜体" onclick={() => insertAtCursor("*", "*")}><i>I</i></button>
		<button class="tb-btn" title="删除线" onclick={() => insertAtCursor("~~", "~~")}><s>S</s></button>
		<span class="tb-sep"></span>
		<button class="tb-btn" title="标题1" onclick={() => insertAtCursor("# ", "")}>H1</button>
		<button class="tb-btn" title="标题2" onclick={() => insertAtCursor("## ", "")}>H2</button>
		<button class="tb-btn" title="标题3" onclick={() => insertAtCursor("### ", "")}>H3</button>
		<span class="tb-sep"></span>
		<button class="tb-btn" title="链接" onclick={() => insertAtCursor("[", "](url)")}>🔗</button>
		<button class="tb-btn" title="图片" onclick={() => insertAtCursor("![alt](", ")")}>🖼</button>
		<button class="tb-btn" title="代码块" onclick={() => insertAtCursor("```\n", "\n```")}>&lt;/&gt;</button>
		<button class="tb-btn" title="引用" onclick={() => insertAtCursor("> ", "")}>❝</button>
		<button class="tb-btn" title="无序列表" onclick={() => insertAtCursor("- ", "")}>•</button>
		<button class="tb-btn" title="有序列表" onclick={() => insertAtCursor("1. ", "")}>1.</button>
		<button class="tb-btn" title="分割线" onclick={() => insertAtCursor("\n---\n", "")}>—</button>
		<span class="tb-sep"></span>
		<label class="tb-btn img-upload" title="上传图片">
			📤 上传
			<input type="file" accept="image/*" hidden onchange={(e) => {
				const f = (e.target as HTMLInputElement).files?.[0];
				if (f) uploadAndInsert(f);
				(e.target as HTMLInputElement).value = "";
			}} />
		</label>
		<span class="tb-spacer"></span>
		<button class="tb-btn tb-preview" onclick={() => { showPreview = !showPreview; }}>
			{showPreview ? "✏ 编辑" : "👁 预览"}
		</button>
	</div>

	<div class="editor-body">
		{#if showPreview}
			<div class="preview-pane">
				{#if previewHtml}
					{@html previewHtml}
				{:else}
					<p style="color:#9ca3af;padding:20px;text-align:center;">暂无内容</p>
				{/if}
			</div>
		{:else}
			<div bind:this={editorRef} class="cm-wrapper"></div>
		{/if}
	</div>

	{#if dragging}
		<div class="drop-overlay">📸 释放以上传图片</div>
	{/if}
</div>

<style>
	.md-editor {
		border: 1px solid var(--admin-border);
		border-radius: 8px;
		overflow: hidden;
		background: var(--admin-surface);
		position: relative;
	}
	.md-editor.dragging { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }

	.editor-toolbar {
		display: flex; align-items: center; padding: 4px 6px;
		border-bottom: 1px solid var(--admin-border); background: #f9fafb;
		gap: 1px; flex-wrap: wrap;
	}
	.tb-btn {
		padding: 3px 8px; border: none; background: transparent; cursor: pointer;
		border-radius: 4px; font-size: 12px; color: #374151; line-height: 1.5;
		transition: background 0.1s;
	}
	.tb-btn:hover { background: #e5e7eb; }
	.tb-btn s { text-decoration: line-through; }
	.tb-sep { width: 1px; height: 18px; background: #d1d5db; margin: 0 2px; }
	.tb-spacer { flex: 1; }
	.tb-preview { background: #e5e7eb; font-size: 12px; }
	.img-upload { display: inline-flex; align-items: center; }

	.editor-body { min-height: 400px; }
	.cm-wrapper { min-height: 400px; }
	.cm-wrapper :global(.cm-editor) { min-height: 400px; }
	.cm-wrapper :global(.cm-scroller) { font-family: 'SF Mono', 'JetBrains Mono', 'Fira Code', monospace; font-size: 14px; }
	.cm-wrapper :global(.cm-content) { padding: 12px 16px; }

	.preview-pane {
		padding: 16px; min-height: 400px; overflow-y: auto;
		background: #fff; color: #1f2937; font-size: 15px; line-height: 1.7;
	}

	.drop-overlay {
		position: absolute; inset: 0;
		display: flex; align-items: center; justify-content: center;
		background: rgba(59,130,246,0.1); backdrop-filter: blur(2px);
		font-size: 20px; font-weight: 600; color: #3b82f6;
		z-index: 10; pointer-events: none;
	}
</style>
