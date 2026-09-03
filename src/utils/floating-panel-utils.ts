const CLOSED_CLASS = "float-panel-closed";
const PANEL_SELECTOR = "[data-floating-panel]";
const FOCUS_RETURN_ATTRIBUTE = "data-floating-panel-focus-return";
export const FLOATING_PANEL_CLOSE_EVENT = "floating-panel:close";

const panelObservers = new Map<HTMLElement, MutationObserver>();
const panelOpenStates = new WeakMap<HTMLElement, boolean>();
let escapeListenerAttached = false;

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

function syncFloatingPanelState(panel: HTMLElement): void {
	const isOpen = !panel.classList.contains(CLOSED_CLASS);
	const wasOpen = panelOpenStates.get(panel);

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
		document.body.classList.toggle("menu-open", isOpen);
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
