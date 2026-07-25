/**
 * Memos API 客户端适配器
 * 直接从 Memos API 获取数据并转换为动态系统格式
 * @author: CuteLeaf <xiaye@msn.com>
 */

interface MemoAttachment {
	name: string;
	filename: string;
	type: string;
	externalLink: string;
}

interface MemoLocation {
	placeholder?: string;
}

interface Memo {
	name: string;
	state: string;
	creator: string;
	createTime: string;
	updateTime: string;
	content: string;
	visibility: string;
	pinned: boolean;
	attachments: MemoAttachment[];
	location?: MemoLocation;
}

interface MemosApiResponse {
	memos: Memo[];
	nextPageToken: string;
}

export interface DynamicImage {
	alt: string;
	src: string;
	title?: string;
}

export interface DynamicEntry {
	id: string;
	published: number;
	html: string;
	images: DynamicImage[];
	searchText: string;
	pinned?: boolean;
	location?: string;
}

/**
 * 将 Markdown 内容转换为简单的 HTML
 */
function markdownToHtml(markdown: string): string {
	let html = markdown
		// 图片（已在后续提取，这里替换为空）
		.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "")
		// 链接
		.replace(
			/\[([^\]]+)\]\(([^)]+)\)/g,
			'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
		)
		// 加粗
		.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
		// 斜体
		.replace(/\*(.+?)\*/g, "<em>$1</em>")
		// 行内代码
		.replace(/`([^`]+)`/g, "<code>$1</code>")
		// 标题
		.replace(/^### (.+)$/gm, "<h3>$1</h3>")
		.replace(/^## (.+)$/gm, "<h2>$1</h2>")
		.replace(/^# (.+)$/gm, "<h1>$1</h1>")
		// 无序列表
		.replace(/^\s*[-*] (.+)$/gm, "<li>$1</li>")
		// 引用
		.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
		// 分割线
		.replace(/^---$/gm, "<hr>")
		// 任务列表
		.replace(
			/^- \[x\] (.+)$/gm,
			'<li><input type="checkbox" checked disabled> $1</li>',
		)
		.replace(
			/^- \[ \] (.+)$/gm,
			'<li><input type="checkbox" disabled> $1</li>',
		);

	// 换行转换为 <br>，但保留段落分隔
	const paragraphs = html.split(/\n\n+/);
	html = paragraphs
		.map((p) => {
			const trimmed = p.trim();
			if (!trimmed) return "";
			// 如果已经是块级元素，不包裹 <p>
			if (/^<[a-z]/.test(trimmed)) return trimmed;
			return `<p>${trimmed.replace(/\n/g, "<br>")}</p>`;
		})
		.filter(Boolean)
		.join("\n");

	return html;
}

/**
 * 从内容中提取纯文本用于搜索
 */
function extractPlainText(content: string): string {
	return content
		.replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		.replace(/<[^>]+>/g, " ")
		.replace(/[#>*_`~[\]()-]/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

/**
 * 从 Memos 内容中提取图片
 */
function extractImages(memo: Memo, memosApiUrl: string): DynamicImage[] {
	const images: DynamicImage[] = [];

	// 从 Markdown 内容中提取图片
	const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
	let match: RegExpExecArray | null;
	match = imagePattern.exec(memo.content);
	while (match !== null) {
		let src = match[2];
		// 处理相对路径
		if (!src.startsWith("http") && !src.startsWith("//")) {
			src = `${memosApiUrl}${src.startsWith("/") ? "" : "/"}${src}`;
		}
		images.push({
			alt: match[1] || "",
			src,
		});
		match = imagePattern.exec(memo.content);
	}

	// 从 Memos 附件中提取图片
	if (memo.attachments) {
		for (const attachment of memo.attachments) {
			if (attachment.type.startsWith("image/")) {
				// Memos 文件服务路径: /file/attachments/{id}/{filename}
				const attachmentId = attachment.name.split("/").pop() || "";
				const src =
					attachment.externalLink ||
					`${memosApiUrl}/file/attachments/${attachmentId}/${attachment.filename}`;
				images.push({
					alt: attachment.filename,
					src,
					title: attachment.filename,
				});
			}
		}
	}

	return images;
}

// 请求去重缓存，避免同页面多个组件重复请求
const pendingRequests = new Map<string, Promise<DynamicEntry[]>>();

/**
 * 从 Memos API 获取数据并转换为动态格式
 */
export async function fetchMemos(
	memosApiUrl: string,
	options?: { pageSize?: number; maxPages?: number; parent?: string },
): Promise<DynamicEntry[]> {
	const cacheKey = `${memosApiUrl}:${options?.parent || ""}`;
	const pending = pendingRequests.get(cacheKey);
	if (pending) return pending;

	const promise = fetchMemosInternal(memosApiUrl, options);
	pendingRequests.set(cacheKey, promise);
	promise.finally(() => pendingRequests.delete(cacheKey));
	return promise;
}

async function fetchMemosInternal(
	memosApiUrl: string,
	options?: { pageSize?: number; maxPages?: number; parent?: string },
): Promise<DynamicEntry[]> {
	const pageSize = options?.pageSize || 10000;
	const maxPages = options?.maxPages || 10;
	const parent = options?.parent || "";
	const allMemos: Memo[] = [];
	let pageToken = "";

	for (let page = 0; page < maxPages; page++) {
		const url = new URL(`${memosApiUrl}/api/v1/memos`);
		url.searchParams.set("pageSize", String(pageSize));
		if (parent) {
			url.searchParams.set("parent", parent);
		}
		if (pageToken) {
			url.searchParams.set("pageToken", pageToken);
		}

		const response = await fetch(url.toString(), {
			headers: { Accept: "application/json" },
		});

		if (!response.ok) {
			const errorText = await response.text().catch(() => "");
			console.error(`[Memos API] ${response.status}: ${errorText}`);
			throw new Error(`Memos API error: ${response.status}`);
		}

		const data: MemosApiResponse = await response.json();
		allMemos.push(...(data.memos || []));

		if (!data.nextPageToken) break;
		pageToken = data.nextPageToken;
	}

	return allMemos
		.filter((memo) => memo.state === "NORMAL")
		.map((memo) => {
			const id = memo.name.split("/").pop() || "";
			const published = new Date(memo.createTime).getTime();
			const html = markdownToHtml(memo.content);
			const images = extractImages(memo, memosApiUrl);
			const location = memo.location?.placeholder?.trim() || "";
			const searchText = [extractPlainText(memo.content), location]
				.filter(Boolean)
				.join(" ")
				.toLocaleLowerCase();
			const pinned = memo.pinned || false;

			return {
				id,
				published,
				html,
				images,
				searchText,
				pinned,
				location,
			};
		})
		.sort((a, b) => {
			// 置顶优先，然后按发布时间降序
			if (a.pinned && !b.pinned) return -1;
			if (!a.pinned && b.pinned) return 1;
			return b.published - a.published;
		});
}
