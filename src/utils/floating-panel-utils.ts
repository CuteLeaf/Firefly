const CLOSED_CLASS = "float-panel-closed";
const PANEL_SELECTOR = "[data-floating-panel]";
const FOCUS_RETURN_ATTRIBUTE = "data-floating-panel-focus-return";
export const FLOATING_PANEL_CLOSE_EVENT = "floating-panel:close";

const observedPanels = new WeakSet<HTMLElement>();
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

export function initializeFloatingPanels(root: ParentNode = document): void {
	const panels = Array.from(root.querySelectorAll<HTMLElement>(PANEL_SELECTOR));

	if (root instanceof HTMLElement && root.matches(PANEL_SELECTOR)) {
		panels.unshift(root);
	}

	for (const panel of panels) {
		syncFloatingPanelState(panel);

		if (observedPanels.has(panel)) continue;

		const observer = new MutationObserver(() => {
			syncFloatingPanelState(panel);
		});
		observer.observe(panel, {
			attributes: true,
			attributeFilter: ["class"],
		});
		observedPanels.add(panel);
	}

	if (!escapeListenerAttached) {
		document.addEventListener("keydown", handleEscape);
		escapeListenerAttached = true;
	}
}
