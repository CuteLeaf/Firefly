/** Markdown 渲染（marked 由服务端 /vendor/marked.js 提供） */

let markedPromise = null;

export function loadMarked() {
	if (!markedPromise) {
		markedPromise = import("/vendor/marked.js").then((mod) => mod.marked);
	}
	return markedPromise;
}

export async function renderMarkdown(md) {
	const marked = await loadMarked();
	try {
		return marked.parse(md ?? "", { breaks: true, gfm: true });
	} catch {
		return `<pre>${escapeHtml(md ?? "")}</pre>`;
	}
}

function escapeHtml(str) {
	return String(str ?? "")
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");
}
