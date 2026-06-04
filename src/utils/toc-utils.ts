/**
 * TOC (Table of Contents) 工具类
 * 用于 SidebarTOC 和 FloatingTOC 的共享逻辑
 */

import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";

export interface TOCConfig {
	contentId: string;
	indicatorId: string;
	maxLevel?: number;
	scrollOffset?: number;
}

export class TOCManager {
	private tocItems: HTMLElement[] = [];
	private observer: IntersectionObserver | null = null;
	private minDepth = 10;
	private maxLevel: number;
	private scrollTimeout: number | null = null;
	private contentId: string;
	private indicatorId: string;
	private scrollOffset: number;

	constructor(config: TOCConfig) {
		this.contentId = config.contentId;
		this.indicatorId = config.indicatorId;
		this.maxLevel = config.maxLevel || 5;
		this.scrollOffset = config.scrollOffset || 80;
	}

	/**
	 * 查找文章内容容器
	 */
	private getContentContainer(): Element | null {
		return (
			document.querySelector(".custom-md") ||
			document.querySelector(".prose") ||
			document.querySelector(".markdown-content")
		);
	}

	/**
	 * 查找所有标题
	 */
	private getAllHeadings(): HTMLElement[] {
		const contentContainer = this.getContentContainer();
		if (!contentContainer) {
			return [];
		}
		return Array.from(
			contentContainer.querySelectorAll("h1, h2, h3, h4, h5, h6"),
		);
	}

	/**
	 * 计算最小深度
	 */
	private calculateMinDepth(headings: HTMLElement[]): number {
		let minDepth = 10;
		headings.forEach((heading) => {
			const depth = Number.parseInt(heading.tagName.charAt(1), 10);
			minDepth = Math.min(minDepth, depth);
		});
		return minDepth;
	}

	/**
	 * 过滤标题
	 */
	private filterHeadings(headings: HTMLElement[]): HTMLElement[] {
		return Array.from(headings).filter((heading) => {
			const depth = Number.parseInt(heading.tagName.charAt(1), 10);
			return depth < this.minDepth + this.maxLevel;
		});
	}

	/**
	 * 获取标题的纯文本内容（排除 script/style 标签的文本）
	 */
	private getCleanTextContent(element: HTMLElement): string {
		const clone = element.cloneNode(true) as HTMLElement;
		for (const el of clone.querySelectorAll("script, style")) {
			el.remove();
		}
		return clone.textContent || "";
	}

	/**
	 * 转义 HTML 属性值，避免标题中的引号破坏属性
	 */
	private escapeHtmlAttr(value: string): string {
		return value
			.replace(/&/g, "&amp;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
	}

	/**
	 * 生成徽章内容
	 */
	private generateBadgeContent(depth: number, counts: number[]): string {
		const relativeDepth = depth - this.minDepth;

		// 构建编号：例如 depth=3, minDepth=1 → "1.2.3"
		const parts = counts.slice(0, relativeDepth + 1);
		return parts.join('.');
	}

	/**
	 * 空状态文案
	 */
	private getEmptyStateHTML(): string {
		return `<div class="text-center py-8 text-gray-500 dark:text-gray-400"><p>${i18n(I18nKey.tocEmpty)}</p></div>`;
	}

	/**
	 * 检查标题是否有子标题
	 */
	private headingHasChildren(heading: HTMLElement, allHeadings: HTMLElement[], currentIndex: number): boolean {
		const currentDepth = Number.parseInt(heading.tagName.charAt(1), 10);

		// 查找下一个标题
		for (let i = currentIndex + 1; i < allHeadings.length; i++) {
			const nextDepth = Number.parseInt(allHeadings[i].tagName.charAt(1), 10);

			// 如果遇到同级或更高级别的标题，说明没有子标题
			if (nextDepth <= currentDepth) {
				return false;
			}

			// 如果下一级是直接子级，说明有子标题
			if (nextDepth === currentDepth + 1) {
				return true;
			}
		}

		return false;
	}

	/**
	 * 生成TOC HTML
	 */
	public generateTOCHTML(): string {
		const headings = this.getAllHeadings();

		if (headings.length === 0) {
			return this.getEmptyStateHTML();
		}

		this.minDepth = this.calculateMinDepth(headings);
		const filteredHeadings = this.filterHeadings(headings);

		if (filteredHeadings.length === 0) {
			return this.getEmptyStateHTML();
		}

		let tocHTML = "";
		// 跟踪每个级别的计数器，索引0=一级，索引1=二级，依此类推
		const counts = [0, 0, 0, 0, 0, 0]; // 支持6级标题

		filteredHeadings.forEach((heading, index) => {
			const depth = Number.parseInt(heading.tagName.charAt(1), 10);
			const relativeDepth = depth - this.minDepth; // 相对于最小深度的级别（0=一级，1=二级...）

			// 更新计数器（即使没有id也要更新）
			if (relativeDepth >= 0 && relativeDepth < 6) {
				counts[relativeDepth]++;
				// 重置所有更深层级的计数器
				for (let i = relativeDepth + 1; i < 6; i++) {
					counts[i] = 0;
				}
			}

			if (!heading.id) {
				return;
			}

			const badgeContent = this.generateBadgeContent(depth, counts);

			let headingText = this.getCleanTextContent(heading)
				.replace(/#+\s*$/, "")
				.trim();

			// Fallback for empty text (e.g. dynamic subtitle)
			if (!headingText) {
				const dataSubtitles = heading.getAttribute("data-subtitles");
				if (dataSubtitles) {
					try {
						const subtitles = JSON.parse(dataSubtitles);
						headingText = Array.isArray(subtitles) ? subtitles[0] : subtitles;
					} catch {
						// ignore
					}
				}
			}

			if (!headingText) {
				headingText =
					heading.id === "banner-subtitle"
						? "Banner Subtitle"
						: heading.id || "Heading";
			}

			const escapedHeadingText = this.escapeHtmlAttr(headingText);

			// 使用 relativeDepth 作为层级（0=一级，1=二级，2=三级...）
			const tocLevel = relativeDepth;

			// 检查是否有子标题（通过预计算或简单判断）
			// 这里先添加 data-depth 属性，稍后在 bindClickEvents 中处理折叠
			const hasChildren = this.headingHasChildren(heading, filteredHeadings, index);

			tocHTML += `
        <a
          href="#${heading.id}"
			  class="toc-item toc-level-${tocLevel}"
          data-heading-id="${heading.id}"
		  data-depth="${relativeDepth}"
		  data-has-children="${hasChildren}"
		  aria-label="${escapedHeadingText}"
		  title="${escapedHeadingText}"
        >
			  <div class="toc-badge ${relativeDepth === 0 ? "toc-badge-index" : ""}">
            ${badgeContent}
          </div>
			  <div class="toc-label ${relativeDepth <= 1 ? "toc-label-primary" : "toc-label-secondary"}">${headingText}</div>
			  ${hasChildren ? '<svg class="toc-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>' : ''}
        </a>
      `;
		});

		tocHTML += `<div id="${this.indicatorId}" style="opacity: 0;" class="toc-active-indicator"></div>`;

		return tocHTML;
	}

	/**
	 * 更新TOC内容
	 */
	public updateTOCContent(): void {
		const tocContent = document.getElementById(this.contentId);
		if (!tocContent) return;

		tocContent.innerHTML = this.generateTOCHTML();
		this.tocItems = Array.from(
			document.querySelectorAll(`#${this.contentId} a`),
		);
	}

	/**
	 * 获取可见的标题ID
	 */
	private getVisibleHeadingIds(): string[] {
		const headings = this.getAllHeadings();
		const visibleHeadingIds: string[] = [];

		headings.forEach((heading) => {
			if (heading.id) {
				const rect = heading.getBoundingClientRect();
				const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

				if (isVisible) {
					visibleHeadingIds.push(heading.id);
				}
			}
		});

		// 如果没有可见标题，选择最接近屏幕顶部的标题
		if (visibleHeadingIds.length === 0 && headings.length > 0) {
			let closestHeading: string | null = null;
			let minDistance = Number.POSITIVE_INFINITY;

			headings.forEach((heading) => {
				if (heading.id) {
					const rect = heading.getBoundingClientRect();
					const distance = Math.abs(rect.top);

					if (distance < minDistance) {
						minDistance = distance;
						closestHeading = heading.id;
					}
				}
			});

			if (closestHeading) {
				visibleHeadingIds.push(closestHeading);
			}
		}

		return visibleHeadingIds;
	}

	/**
	 * 更新活动状态
	 */
	public updateActiveState(): void {
		if (!this.tocItems || this.tocItems.length === 0) return;

		// 移除所有活动状态
		this.tocItems.forEach((item) => {
			item.classList.remove("visible");
		});

		const visibleHeadingIds = this.getVisibleHeadingIds();

		// 找到对应的TOC项并添加活动状态
		const activeItems = this.tocItems.filter((item) => {
			const headingId = item.dataset.headingId;
			return headingId && visibleHeadingIds.includes(headingId);
		});

		// 添加活动状态
		activeItems.forEach((item) => {
			item.classList.add("visible");
		});

		// 更新活动指示器
		this.updateActiveIndicator(activeItems);
	}

	/**
	 * 更新活动指示器
	 */
	private updateActiveIndicator(activeItems: HTMLElement[]): void {
		const indicator = document.getElementById(this.indicatorId);
		if (!indicator || !this.tocItems.length) return;

		if (activeItems.length === 0) {
			indicator.style.opacity = "0";
			return;
		}

		const tocContent = document.getElementById(this.contentId);
		if (!tocContent) return;

		const contentRect = tocContent.getBoundingClientRect();
		const firstActive = activeItems[0];
		const lastActive = activeItems[activeItems.length - 1];

		const firstRect = firstActive.getBoundingClientRect();
		const lastRect = lastActive.getBoundingClientRect();

		const top = firstRect.top - contentRect.top;
		const height = lastRect.bottom - firstRect.top;

		indicator.style.top = `${top}px`;
		indicator.style.height = `${height}px`;
		indicator.style.opacity = "1";

		// 自动滚动到活动项
		if (firstActive) {
			this.scrollToActiveItem(firstActive);
		}
	}

	/**
	 * 滚动到活动项
	 */
	private scrollToActiveItem(activeItem: HTMLElement): void {
		if (!activeItem) return;

		const tocContainer = document
			.querySelector(`#${this.contentId}`)
			?.closest(".toc-scroll-container");
		if (!tocContainer) return;

		// 清除之前的定时器
		if (this.scrollTimeout) {
			clearTimeout(this.scrollTimeout);
		}

		// 使用节流机制
		this.scrollTimeout = window.setTimeout(() => {
			const containerRect = tocContainer.getBoundingClientRect();
			const itemRect = activeItem.getBoundingClientRect();

			// 只在元素不在可视区域时才滚动
			const isVisible =
				itemRect.top >= containerRect.top &&
				itemRect.bottom <= containerRect.bottom;

			if (!isVisible) {
				const itemOffsetTop = (activeItem as HTMLElement).offsetTop;
				const containerHeight = tocContainer.clientHeight;
				const itemHeight = activeItem.clientHeight;

				// 计算目标滚动位置，将元素居中显示
				const targetScroll =
					itemOffsetTop - containerHeight / 2 + itemHeight / 2;

				tocContainer.scrollTo({
					top: targetScroll,
					behavior: "smooth",
				});
			}
		}, 100);
	}

	/**
	 * 处理点击事件
	 */
	public handleClick(event: Event): void {
		event.preventDefault();
		const target = event.currentTarget as HTMLAnchorElement;
		const id = decodeURIComponent(
			target.getAttribute("href")?.substring(1) || "",
		);
		const targetElement = document.getElementById(id);

		if (targetElement) {
			const targetTop =
				targetElement.getBoundingClientRect().top +
				window.pageYOffset -
				this.scrollOffset;

			window.scrollTo({
				top: targetTop,
				behavior: "smooth",
			});
		}
	}

	/**
	 * 设置IntersectionObserver
	 */
	public setupObserver(): void {
		const headings = this.getAllHeadings();

		if (this.observer) {
			this.observer.disconnect();
		}

		this.observer = new IntersectionObserver(
			() => {
				this.updateActiveState();
			},
			{
				rootMargin: "0px 0px 0px 0px",
				threshold: 0,
			},
		);

		headings.forEach((heading) => {
			if (heading.id) {
				this.observer?.observe(heading);
			}
		});
	}

	/**
	 * 绑定点击事件
	 */
	public bindClickEvents(): void {
		this.tocItems.forEach((item) => {
			// 点击标题链接 - 滚动到对应位置
			item.addEventListener("click", (e) => {
				// 如果点击的是箭头，不滚动，只处理折叠
				if ((e.target as Element).closest('.toc-arrow')) {
					e.preventDefault();
					e.stopPropagation();
					this.toggleCollapse(item as HTMLElement);
					return;
				}
				this.handleClick(e);
			});
		});

		// 初始化折叠状态：默认折叠二级及以下标题
		this.initCollapseState();
	}

	/**
	 * 初始化折叠状态
	 */
	private initCollapseState(): void {
		this.tocItems.forEach((item) => {
			const depth = parseInt(item.getAttribute('data-depth') || '0');
			const hasChildren = item.getAttribute('data-has-children') === 'true';

			// 一级标题（depth=0）如果有子标题，默认展开
			// 二级及以下标题默认隐藏
			if (depth === 0 && hasChildren) {
				// 一级标题默认展开，不做处理
			} else if (depth >= 1) {
				// 检查父级是否折叠
				if (!this.isParentExpanded(item as HTMLElement)) {
					(item as HTMLElement).style.display = 'none';
				}
			}
		});
	}

	/**
	 * 检查父级是否展开
	 */
	private isParentExpanded(item: HTMLElement): boolean {
		const depth = parseInt(item.getAttribute('data-depth') || '0');
		if (depth === 0) return true;

		// 查找前一个同级或父级元素
		let prev = item.previousElementSibling as HTMLElement;
		while (prev) {
			const prevDepth = parseInt(prev.getAttribute('data-depth') || '0');
			if (prevDepth < depth) {
				// 找到父级，检查是否折叠
				return !prev.classList.contains('collapsed');
			}
			prev = prev.previousElementSibling as HTMLElement;
		}

		return true;
	}

	/**
	 * 切换折叠状态
	 */
	private toggleCollapse(item: HTMLElement): void {
		const depth = parseInt(item.getAttribute('data-depth') || '0');
		const hasChildren = item.getAttribute('data-has-children') === 'true';

		if (!hasChildren) return;

		const isCollapsed = item.classList.contains('collapsed');

		if (isCollapsed) {
			// 展开：显示所有直接子级
			item.classList.remove('collapsed');
			this.showChildren(item, depth);
		} else {
			// 折叠：隐藏所有子级
			item.classList.add('collapsed');
			this.hideChildren(item, depth);
		}
	}

	/**
	 * 显示子标题
	 */
	private showChildren(parentItem: HTMLElement, parentDepth: number): void {
		let next = parentItem.nextElementSibling as HTMLElement;
		while (next) {
			const nextDepth = parseInt(next.getAttribute('data-depth') || '0');

			// 如果遇到同级或更高级别的标题，停止
			if (nextDepth <= parentDepth) break;

			// 只显示直接子级（depth = parentDepth + 1）
			if (nextDepth === parentDepth + 1) {
				next.style.display = '';
				// 如果子级是展开状态，也显示它的子级
				if (!next.classList.contains('collapsed')) {
					this.showChildren(next, nextDepth);
				}
			}

			next = next.nextElementSibling as HTMLElement;
		}
	}

	/**
	 * 隐藏子标题
	 */
	private hideChildren(parentItem: HTMLElement, parentDepth: number): void {
		let next = parentItem.nextElementSibling as HTMLElement;
		while (next) {
			const nextDepth = parseInt(next.getAttribute('data-depth') || '0');

			// 如果遇到同级或更高级别的标题，停止
			if (nextDepth <= parentDepth) break;

			// 隐藏所有子级
			next.style.display = 'none';
			// 重置折叠状态
			next.classList.remove('collapsed');

			next = next.nextElementSibling as HTMLElement;
		}
	}

	/**
	 * 清理
	 */
	public cleanup(): void {
		if (this.observer) {
			this.observer.disconnect();
			this.observer = null;
		}
		if (this.scrollTimeout) {
			clearTimeout(this.scrollTimeout);
			this.scrollTimeout = null;
		}
	}

	/**
	 * 初始化
	 */
	public init(): void {
		this.updateTOCContent();
		this.bindClickEvents();
		this.setupObserver();
		this.updateActiveState();
	}
}

/**
 * 检查是否为文章页面
 */
export function isPostPage(): boolean {
	return window.location.pathname.includes("/posts/");
}
