/**
 * TOC 共享逻辑（无 DOM 依赖，服务端/客户端通用）
 *
 * 服务端：SidebarTOC.astro / FloatingTOC.astro 用 Astro 的 headings 计算目录项。
 * 客户端：TOCManager 用 DOM 遍历得到的 headings 计算目录项。
 * 两端都调用 computeTocItems，保证结构完全一致。
 */

export interface TocInput {
	/** 标题层级（h1=1, h2=2, ...） */
	depth: number;
	/** 标题锚点 id（等于渲染后 heading 的 id） */
	slug: string;
	/** 标题纯文本 */
	text: string;
}

export interface TocItem {
	headingId: string;
	href: string;
	/** 0=最浅层, 1=次层, 2=更深层，对应 .toc-level-* */
	depthLevel: 0 | 1 | 2;
	/** index=编号徽章, dot=圆点, dot-sm=小圆点 */
	badgeKind: "index" | "dot" | "dot-sm";
	/** badgeKind 为 index 时的编号（从 1 递增） */
	badgeIndex?: number;
	text: string;
	labelPrimary: boolean;
}

/**
 * 根据标题列表计算目录项。
 * 复刻 TOCManager 里的 calculateMinDepth + filterHeadings + 深度/徽章逻辑。
 */
export function computeTocItems(
	headings: TocInput[],
	opts: { maxLevel: number },
): TocItem[] {
	if (!headings || headings.length === 0) return [];

	// 计算最小深度
	let minDepth = 10;
	for (const h of headings) {
		minDepth = Math.min(minDepth, h.depth);
	}

	// 过滤：depth < minDepth + maxLevel
	const filtered = headings.filter((h) => h.depth < minDepth + opts.maxLevel);

	const items: TocItem[] = [];
	let indexCount = 1;

	for (const h of filtered) {
		// 跳过没有锚点的标题
		if (!h.slug) continue;

		const depth = h.depth;
		const depthLevel: 0 | 1 | 2 =
			depth === minDepth ? 0 : depth === minDepth + 1 ? 1 : 2;

		let badgeKind: "index" | "dot" | "dot-sm";
		let badgeIndex: number | undefined;
		if (depth === minDepth) {
			badgeKind = "index";
			badgeIndex = indexCount;
			indexCount++;
		} else if (depth === minDepth + 1) {
			badgeKind = "dot";
		} else {
			badgeKind = "dot-sm";
		}

		// 空文本回退成 slug；去掉 rehypeAutolinkHeadings 追加的尾部 "#"
		const text = (h.text || "").replace(/#+\s*$/, "").trim() || h.slug;

		items.push({
			headingId: h.slug,
			href: `#${h.slug}`,
			depthLevel,
			badgeKind,
			badgeIndex,
			text,
			labelPrimary: depth <= minDepth + 1,
		});
	}

	return items;
}

/**
 * 转义 HTML 属性值，避免标题中的引号破坏属性
 */
export function escapeHtmlAttr(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

/**
 * 徽章内部 HTML（客户端字符串拼接用）
 */
export function renderBadgeInnerHTML(item: TocItem): string {
	if (item.badgeKind === "index") return String(item.badgeIndex ?? "");
	if (item.badgeKind === "dot") return '<span class="toc-badge-dot"></span>';
	return '<span class="toc-badge-dot toc-badge-dot-sm"></span>';
}

/**
 * 生成单个目录项 HTML（客户端 fallback 路径用）。
 * 结构与 SidebarTOC.astro / FloatingTOC.astro 的 SSR 输出保持一致。
 */
export function renderTocItemHTML(item: TocItem): string {
	const escaped = escapeHtmlAttr(item.text);
	return `
        <a
          href="${item.href}"
		  class="toc-item toc-level-${item.depthLevel}"
          data-heading-id="${item.headingId}"
		  aria-label="${escaped}"
		  title="${escaped}"
        >
			  <div class="toc-badge ${item.badgeKind === "index" ? "toc-badge-index" : ""}">
            ${renderBadgeInnerHTML(item)}
          </div>
			  <div class="toc-label ${item.labelPrimary ? "toc-label-primary" : "toc-label-secondary"}">${item.text}</div>
        </a>
      `;
}
