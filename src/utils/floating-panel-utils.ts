const CLOSED_CLASS = "float-panel-closed";
const PANEL_SELECTOR = "[data-floating-panel]";
const FOCUS_RETURN_ATTRIBUTE = "data-floating-panel-focus-return";
export const FLOATING_PANEL_CLOSE_EVENT = "floating-panel:close";

const panelObservers = new Map<HTMLElement, MutationObserver>();
const panelOpenStates = new WeakMap<HTMLElement, boolean>();
let escapeListenerAttached = false;
const mobileMenuViewports = new WeakMap<HTMLElement, { width: number; scale: number; orientation: string }>();
const scrollUnlockCleanup = new WeakMap<HTMLElement, () => void>();

function getPanelTriggers(panel: HTMLElement): HTMLElement[] {
	const triggerIds = panel.dataset.floatingPanelTrigger
		?.split(/\s+/)
		.filter(Boolean);

	if (!triggerIds) return [];

	return triggerIds
		.map((id) => document.getElementById(id))
		.filter((trigger): trigger is HTMLElement => trigger !== null);
}

function isVisible(element: HTMLElement): boolean {
	const style = window.getComputedStyle(element);
	return (
		style.display !== "none" &&
		style.visibility !== "hidden" &&
		element.getClientRects().length > 0
	);
}

// 文档定位绕过 Safari 对 fixed 图层在浮动工具栏上方的裁剪。
// 打开时测量；移动端忽略浏览器工具栏引起的纯高度变化，旋转/缩放仍重新测量。
function updateMobileMenuBounds(panel: HTMLElement, force = false): void {
	if (panel.id !== "nav-menu-panel") return;
	const viewport = window.visualViewport;
	const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
	const bounds = {
		width: window.innerWidth,
		scale: viewport?.scale ?? 1,
		orientation: window.screen.orientation?.type ?? `${window.screen.width}x${window.screen.height}`,
	};
	const previous = mobileMenuViewports.get(panel);
	if (!force && coarsePointer && previous && previous.width === bounds.width &&
		previous.scale === bounds.scale && previous.orientation === bounds.orientation) return;
	mobileMenuViewports.set(panel, bounds);
	const visibleHeight = viewport?.height ?? window.innerHeight;
	const paintHeight = coarsePointer
		? Math.max(window.screen.height, window.innerHeight, visibleHeight)
		: Math.max(window.innerHeight, visibleHeight);
	panel.style.setProperty("--mobile-menu-document-top", `${window.scrollY + (viewport?.offsetTop ?? 0)}px`);
	panel.style.setProperty("--mobile-menu-paint-height", `${paintHeight}px`);
	panel.style.setProperty("--mobile-menu-visible-height", `${visibleHeight}px`);
}

function syncFloatingPanelState(panel: HTMLElement): void {
	const isOpen = !panel.classList.contains(CLOSED_CLASS);
	const wasOpen = panelOpenStates.get(panel);
	if (isOpen && wasOpen !== true) updateMobileMenuBounds(panel, true);

	panel.inert = !isOpen;
	panel.setAttribute("aria-hidden", String(!isOpen));

	for (const trigger of getPanelTriggers(panel)) {
		if (panel.id) trigger.setAttribute("aria-controls", panel.id);
		if (!trigger.hasAttribute("data-floating-panel-no-expanded")) {
			trigger.setAttribute("aria-expanded", String(isOpen));
		}
	}

	panelOpenStates.set(panel, isOpen);
	if (wasOpen === true && !isOpen) {
		panel.dispatchEvent(new Event(FLOATING_PANEL_CLOSE_EVENT));
	}

	// 带 data-floating-panel-scroll-lock 的面板打开时锁定背景滚动（app drawer 行为）；
	// 该函数在初始化/class 变化/Swup 重扫时都会跑，各类关闭路径都会同步滚动锁。
	if (panel.hasAttribute("data-floating-panel-scroll-lock")) {
		const cancelUnlock = scrollUnlockCleanup.get(panel);
		if (isOpen) {
			cancelUnlock?.();
			scrollUnlockCleanup.delete(panel);
			document.body.classList.add("menu-open");
		} else if (wasOpen === true) {
			// 保持关闭动画期间视口稳定，避免 iOS 滚动解锁触发工具栏/布局跳动。
			const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
				? 0
				: Number(panel.dataset.floatingPanelCloseDelay) || 0;
			const unlock = () => {
				scrollUnlockCleanup.get(panel)?.();
				scrollUnlockCleanup.delete(panel);
				const anotherOpen = document.querySelector(
					"[data-floating-panel-scroll-lock]:not(.float-panel-closed)",
				);
				if (!anotherOpen) document.body.classList.remove("menu-open");
				panel.style.removeProperty("--mobile-menu-document-top");
			};
			if (delay > 0) {
				// 以真正绘制结束为准；计时器仅在 transitionend 未触发时兜底。
				let firstFrame = 0;
				let secondFrame = 0;
				const afterHiddenPaint = () => {
					if (firstFrame || secondFrame) return;
					// 先让隐藏态绘制一帧，再解锁；Safari 底栏变化不再重排仍可见的玻璃。
					firstFrame = requestAnimationFrame(() => {
						secondFrame = requestAnimationFrame(unlock);
					});
				};
				const onEnd = (event: TransitionEvent) => {
					if (event.target === panel && event.propertyName === "visibility") afterHiddenPaint();
				};
				const timer = setTimeout(afterHiddenPaint, delay + 100);
				panel.addEventListener("transitionend", onEnd);
				scrollUnlockCleanup.set(panel, () => {
					clearTimeout(timer);
					cancelAnimationFrame(firstFrame);
					cancelAnimationFrame(secondFrame);
					panel.removeEventListener("transitionend", onEnd);
				});
			} else unlock();
		}
	}
}

function setFloatingPanelOpen(panel: HTMLElement, isOpen: boolean): void {
	panel.classList.toggle(CLOSED_CLASS, !isOpen);
	syncFloatingPanelState(panel);
}

function handleEscape(event: KeyboardEvent): void {
	if (event.key !== "Escape") return;

	const target = event.target instanceof Node ? event.target : null;
	const openPanels = Array.from(
		document.querySelectorAll<HTMLElement>(PANEL_SELECTOR),
	).filter((panel) => !panel.classList.contains(CLOSED_CLASS));

	const activePanel = openPanels.find((panel) => {
		if (!target) return false;
		return (
			panel.contains(target) ||
			getPanelTriggers(panel).some((trigger) => trigger.contains(target))
		);
	});

	if (!activePanel) return;

	event.preventDefault();
	setFloatingPanelOpen(activePanel, false);

	const triggers = getPanelTriggers(activePanel);
	const trigger = triggers.find(isVisible) ?? triggers[0];
	if (!trigger) return;

	try {
		trigger.setAttribute(FOCUS_RETURN_ATTRIBUTE, "");
		trigger.focus();
	} finally {
		trigger.removeAttribute(FOCUS_RETURN_ATTRIBUTE);
	}
}

function disconnectRemovedPanelObservers(): void {
	for (const [panel, observer] of panelObservers) {
		if (panel.isConnected) continue;

		observer.disconnect();
		panelObservers.delete(panel);
		panelOpenStates.delete(panel);
	}
}

export function initializeFloatingPanels(root: ParentNode = document): void {
	disconnectRemovedPanelObservers();

	const panels = Array.from(root.querySelectorAll<HTMLElement>(PANEL_SELECTOR));

	if (root instanceof HTMLElement && root.matches(PANEL_SELECTOR)) {
		panels.unshift(root);
	}

	for (const panel of panels) {
		syncFloatingPanelState(panel);

		if (panelObservers.has(panel)) continue;

		const observer = new MutationObserver(() => {
			syncFloatingPanelState(panel);
		});
		observer.observe(panel, {
			attributes: true,
			attributeFilter: ["class"],
		});
		panelObservers.set(panel, observer);
	}

	if (!escapeListenerAttached) {
		document.addEventListener("keydown", handleEscape);
		const updateOpenMenu = () => {
			const panel = document.getElementById("nav-menu-panel");
			if (panel && !panel.classList.contains(CLOSED_CLASS)) updateMobileMenuBounds(panel);
		};
		window.addEventListener("resize", updateOpenMenu, { passive: true });
		window.visualViewport?.addEventListener("resize", updateOpenMenu, { passive: true });
		escapeListenerAttached = true;
	}
}

/** 点击指定面板及其忽略元素之外时，将其关闭（从 Layout.astro 迁出） */
export function setClickOutsideToClose(panel: string, ignores: string[]): void {
	document.addEventListener("click", (event) => {
		const panelDom = document.getElementById(panel);
		if (!panelDom) return;
		const tDom = event.target;
		if (!(tDom instanceof Node)) return; // Ensure the event target is an HTML Node
		for (const ig of ignores) {
			const ie = document.getElementById(ig);
			if (ie === tDom || ie?.contains(tDom)) {
				return;
			}
		}
		panelDom.classList.add("float-panel-closed");
	});
}
