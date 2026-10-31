import {
	getFcircleDatePresentation,
	getFcircleRelativeDays,
} from "./fcircle-date-utils";

const STORAGE_KEY = "fcircle_preferred_view";

const TODAY_MARKER_CLASSES = [
	"border-(--primary)",
	"bg-(--primary)",
	"text-white",
	"shadow-md",
	"shadow-(--primary)/20",
	"ring-4",
	"ring-(--primary)/15",
];
const YESTERDAY_MARKER_CLASSES = [
	"border-(--primary)",
	"bg-(--card-bg)",
	"text-(--primary)",
	"shadow-sm",
	"ring-2",
	"ring-(--primary)/10",
];
const DEFAULT_MARKER_CLASSES = [
	"border-(--line-divider)",
	"bg-(--card-bg)",
	"text-neutral-500",
	"dark:text-neutral-400",
	"hover:border-(--primary)",
];
const ALL_MARKER_CLASSES = [
	...TODAY_MARKER_CLASSES,
	...YESTERDAY_MARKER_CLASSES,
	...DEFAULT_MARKER_CLASSES,
];

function applyMarkerState(marker: HTMLElement, relativeDays: number) {
	marker.classList.remove(...ALL_MARKER_CLASSES);
	const classes =
		relativeDays === 0
			? TODAY_MARKER_CLASSES
			: relativeDays === 1
				? YESTERDAY_MARKER_CLASSES
				: DEFAULT_MARKER_CLASSES;
	marker.classList.add(...classes);

	marker
		.querySelector(".fcircle-date-today-icon")
		?.classList.toggle("hidden", relativeDays !== 0);
	marker
		.querySelector(".fcircle-date-calendar-icon")
		?.classList.toggle("hidden", relativeDays === 0);
}

function updateTodayStatStyle(todayCount: number) {
	const card = document.getElementById("fcircle-today-stat-card");
	const icon = document.getElementById("fcircle-today-stat-icon");
	const count = document.getElementById("fcircle-today-count");
	if (!card || !icon || !count) return;

	const active = todayCount > 0;

	card.classList.toggle("border-(--primary)/30", active);
	card.classList.toggle("bg-(--primary)/5", active);
	card.classList.toggle("hover:border-(--primary)", active);
	card.classList.toggle("border-(--line-divider)", !active);
	card.classList.toggle("hover:border-(--primary)/40", !active);

	icon.classList.toggle("bg-(--primary)", active);
	icon.classList.toggle("text-white", active);
	icon.classList.toggle("shadow-xs", active);
	icon.classList.toggle("bg-(--primary)/10", !active);
	icon.classList.toggle("text-(--primary)", !active);

	count.classList.toggle("text-(--primary)", active);
	count.classList.toggle("text-neutral-800", !active);
	count.classList.toggle("dark:text-neutral-200", !active);
}

/** 刷新时间线中各日期组的相对标签（今天/昨天）与今日统计 */
export function refreshFcircleRelativeDates(): void {
	const root = document.getElementById("fcircle-root");
	if (!root) return;

	const timeZone = root.dataset.timeZone || "UTC";
	const lang = document.documentElement.lang || "zh-CN";
	const now = new Date();

	root
		.querySelectorAll<HTMLElement>(".fcircle-date-group[data-date-iso]")
		.forEach((group) => {
			const dateIso = group.dataset.dateIso;
			if (!dateIso) return;

			const presentation = getFcircleDatePresentation(
				dateIso,
				now,
				timeZone,
				lang,
			);
			const label = group.querySelector<HTMLElement>(".fcircle-date-label");
			const subLabel = group.querySelector<HTMLElement>(
				".fcircle-date-sublabel",
			);
			const marker = group.querySelector<HTMLElement>(".fcircle-date-marker");

			if (label) label.textContent = presentation.displayDate;
			if (subLabel) subLabel.textContent = presentation.subLabel;
			if (marker) applyMarkerState(marker, presentation.relativeDays);
		});

	let todayCount = 0;
	let weekCount = 0;

	root
		.querySelectorAll<HTMLElement>(
			"#timeline-view .fcircle-timeline-card[data-pub-date]",
		)
		.forEach((card) => {
			const dateIso = card.dataset.pubDate;
			if (!dateIso) return;

			const relativeDays = getFcircleRelativeDays(dateIso, now, timeZone);
			if (relativeDays === 0) todayCount++;
			if (relativeDays >= 0 && relativeDays <= 6) weekCount++;
		});

	const todayCountElement = document.getElementById("fcircle-today-count");
	const weekCountElement = document.getElementById("fcircle-week-count");
	if (todayCountElement) todayCountElement.textContent = String(todayCount);
	if (weekCountElement) weekCountElement.textContent = String(weekCount);
	updateTodayStatStyle(todayCount);
}

/** 应用时间线或平铺视图 */
export function switchFcircleView(mode: "timeline" | "grid"): void {
	const timelineView = document.getElementById("timeline-view");
	const gridView = document.getElementById("grid-view");
	if (!timelineView && !gridView) return;

	const isTimeline = mode === "timeline";

	if (timelineView) timelineView.classList.toggle("hidden", !isTimeline);
	if (gridView) gridView.classList.toggle("hidden", isTimeline);

	const btnTimeline = document.getElementById("view-timeline");
	const btnGrid = document.getElementById("view-grid");

	if (btnTimeline) {
		btnTimeline.classList.toggle("bg-(--primary)", isTimeline);
		btnTimeline.classList.toggle("text-white", isTimeline);
		btnTimeline.classList.toggle("font-medium", isTimeline);
		btnTimeline.classList.toggle("opacity-60", !isTimeline);
		btnTimeline.setAttribute("aria-selected", isTimeline ? "true" : "false");
	}

	if (btnGrid) {
		btnGrid.classList.toggle("bg-(--primary)", !isTimeline);
		btnGrid.classList.toggle("text-white", !isTimeline);
		btnGrid.classList.toggle("font-medium", !isTimeline);
		btnGrid.classList.toggle("opacity-60", isTimeline);
		btnGrid.setAttribute("aria-selected", !isTimeline ? "true" : "false");
	}

	try {
		localStorage.setItem(STORAGE_KEY, mode);
	} catch {
		// 忽略隐私模式等存储受限异常
	}
}

/** 恢复当前保存的偏好视图 */
export function applySavedFcircleView(): void {
	const root = document.getElementById("fcircle-root");
	if (!root) return;

	let saved: "timeline" | "grid" = "timeline";
	try {
		const val = localStorage.getItem(STORAGE_KEY);
		if (val === "grid" || val === "timeline") {
			saved = val;
		}
	} catch {
		// 忽略隐私模式等存储受限异常
	}

	switchFcircleView(saved);
	refreshFcircleRelativeDates();
}

/** 全局初始化友链朋友圈控制器（随全站布局常驻监听） */
export function initFcircleManager(): void {
	const fcircleWindow = window as Window & {
		__fcircleManagerInitialized?: boolean;
	};

	if (fcircleWindow.__fcircleManagerInitialized) {
		applySavedFcircleView();
		return;
	}
	fcircleWindow.__fcircleManagerInitialized = true;

	// 全局事件委托：捕获视图切换按钮点击
	document.addEventListener("click", (e) => {
		const target = e.target as HTMLElement | null;
		const btn = target?.closest<HTMLElement>(
			"#view-timeline, #view-grid, .fcircle-view-btn",
		);
		if (!btn) return;

		const isTimeline =
			btn.id === "view-timeline" || btn.dataset.view === "timeline";
		switchFcircleView(isTimeline ? "timeline" : "grid");
	});

	// 监听 Swup / Astro 切页完成
	document.addEventListener("astro:page-load", applySavedFcircleView);
	document.addEventListener("swup:content:replace", applySavedFcircleView);
	document.addEventListener("swup:contentReplaced", applySavedFcircleView);

	// 页面可见性变化时刷新
	document.addEventListener("visibilitychange", () => {
		if (!document.hidden) refreshFcircleRelativeDates();
	});

	// 定时刷新相对日期
	window.setInterval(refreshFcircleRelativeDates, 60_000);

	// 初始触发一次
	applySavedFcircleView();
}
