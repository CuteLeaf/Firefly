/** 通用 UI 组件：toast / 确认弹窗 / 工具函数 */

/** 弹出轻提示 */
export function toast(message, type = "info", duration = 2600) {
	const root = document.getElementById("toast-root");
	if (!root) return;
	const el = document.createElement("div");
	el.className = `toast ${type}`;
	el.textContent = message;
	root.appendChild(el);
	setTimeout(() => {
		el.style.opacity = "0";
		el.style.transition = "opacity .25s";
		setTimeout(() => el.remove(), 260);
	}, duration);
}

/** 确认弹窗，返回 Promise<boolean> */
export function confirmDialog({
	title = "确认操作",
	message = "确定要继续吗？",
	danger = false,
	confirmText = "确定",
	cancelText = "取消",
} = {}) {
	return new Promise((resolve) => {
		const root = document.getElementById("modal-root");
		const backdrop = document.createElement("div");
		backdrop.className = "modal-backdrop";
		backdrop.innerHTML = `
			<div class="modal" role="dialog">
				<h3 class="modal-title">${escapeHtml(title)}</h3>
				<p class="modal-body">${escapeHtml(message)}</p>
				<div class="modal-actions">
					<button class="btn" data-act="cancel">${escapeHtml(cancelText)}</button>
					<button class="btn ${danger ? "btn-danger" : "btn-primary"}" data-act="ok">${escapeHtml(confirmText)}</button>
				</div>
			</div>`;
		const close = (result) => {
			backdrop.remove();
			resolve(result);
		};
		backdrop.addEventListener("click", (e) => {
			if (e.target === backdrop) close(false);
			if (e.target.dataset.act === "ok") close(true);
			if (e.target.dataset.act === "cancel") close(false);
		});
		root.appendChild(backdrop);
		backdrop.querySelector('[data-act="ok"]').focus();
	});
}

/** 通用弹窗（自定义内容），返回 { close } */
export function openModal({ title, content, className = "", onClose } = {}) {
	const root = document.getElementById("modal-root");
	const backdrop = document.createElement("div");
	backdrop.className = "modal-backdrop";
	const modal = document.createElement("div");
	modal.className = `modal ${className}`;
	if (title) {
		const h = document.createElement("h3");
		h.className = "modal-title";
		h.textContent = title;
		modal.appendChild(h);
	}
	const bodyEl = document.createElement("div");
	bodyEl.className = "modal-scroll";
	modal.appendChild(bodyEl);
	backdrop.appendChild(modal);
	root.appendChild(backdrop);
	backdrop.addEventListener("click", (e) => {
		if (e.target === backdrop) close();
	});
	let closed = false;
	function close() {
		if (closed) return;
		closed = true;
		backdrop.remove();
		onClose?.();
	}
	if (typeof content === "string") bodyEl.innerHTML = content;
	else bodyEl.appendChild(content);
	return { el: bodyEl, close };
}

export function escapeHtml(str) {
	return String(str ?? "")
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

export function formatBytes(bytes) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function formatDate(input, withTime = false) {
	if (!input) return "—";
	const d = new Date(input);
	if (Number.isNaN(d.getTime())) return String(input);
	const pad = (n) => String(n).padStart(2, "0");
	const base = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
	return withTime
		? `${base} ${pad(d.getHours())}:${pad(d.getMinutes())}`
		: base;
}

/** 图标库（Material 风格 path） */
export const icons = {
	plus: '<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>',
	trash:
		'<path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>',
	edit: '<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>',
	eye: '<path d="M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>',
	eyeOff:
		'<path d="M12 7c2.8 0 5.1 1.7 6.4 4.2.3.5.3 1.1 0 1.6-.5.8-1.1 1.6-1.9 2.2l2.8 2.8-1.4 1.4-2.8-2.8c-1 .5-2 .8-3.1.8-4.9 0-9.3-3.1-11-7.5.5-1.3 1.2-2.5 2.1-3.5L1.4 4.5l1.4-1.4 2.8 2.8C6.6 5.4 8.3 5 10 5h2zM5.6 7.9c-.5.6-.9 1.3-1.2 2.1 1.7 3.4 4.5 5 7.6 5 .6 0 1.2-.1 1.7-.2L5.6 7.9z"/>',
	search:
		'<path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"/>',
	copy: '<path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/>',
	upload: '<path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/>',
	refresh:
		'<path d="M17.65 6.35A8 8 0 1 0 20 12h-2a6 6 0 1 1-1.76-4.24L13 11h7V4l-2.35 2.35z"/>',
	link: '<path d="M3.9 12a3 3 0 0 1 0-4.2l2.1-2.1a3 3 0 0 1 4.2 0l1.1 1.1-1.4 1.4-1.1-1.1a1 1 0 0 0-1.4 0l-2.1 2.1a1 1 0 0 0 0 1.4l1.1 1.1-1.4 1.4-1.1-1.1a3 3 0 0 1 0-4.2zM9.3 14.7l1.1-1.1 4.2-4.2 1.4-1.4 1.1 1.1a3 3 0 0 1 0 4.2l-2.1 2.1a3 3 0 0 1-4.2 0l-1.1-1.1 1.4-1.4 1.1 1.1a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4l-1.1-1.1-4.2 4.2-1.4 1.4z"/>',
	rocket: '<path d="M13 2 3 14h7v8l10-12h-7V2z"/>',
	arrowUp: '<path d="M12 8l-6 6 1.4 1.4L12 10.8l4.6 4.6L18 14l-6-6z"/>',
	arrowDown: '<path d="M12 16l6-6-1.4-1.4L12 13.2 7.4 8.6 6 10l6 6z"/>',
	close:
		'<path d="M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z"/>',
	image:
		'<path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>',
	external:
		'<path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>',
};

export function icon(name, cls = "") {
	return `<svg class="${cls}" viewBox="0 0 24 24">${icons[name] || ""}</svg>`;
}

/** 简易防抖 */
export function debounce(fn, ms = 300) {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => fn(...args), ms);
	};
}
