/** 极简 hash 路由器 */
import { ApiError } from "./api.js";

export class Router {
	constructor(onNavigate) {
		this.onNavigate = onNavigate;
		this.current = null;
		window.addEventListener("hashchange", () => this.dispatch());
	}

	/** 解析 #/path?query → { path, query } */
	static parse(hash) {
		const raw = hash.replace(/^#\/?/, "");
		const [pathPart, queryPart] = raw.split("?");
		const path = `/${pathPart || ""}`.replace(/\/+$/, "") || "/";
		const query = {};
		if (queryPart) {
			for (const pair of queryPart.split("&")) {
				const [k, v] = pair.split("=");
				if (k) query[decodeURIComponent(k)] = decodeURIComponent(v ?? "");
			}
		}
		return { path, query };
	}

	dispatch() {
		const { path, query } = Router.parse(window.location.hash || "#/");
		this.current = { path, query };
		this.onNavigate(path, query);
	}

	start() {
		this.dispatch();
	}

	navigate(path, query = {}) {
		const qs = Object.entries(query)
			.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
			.join("&");
		window.location.hash = qs ? `#${path}?${qs}` : `#${path}`;
	}

	static buildLink(path, query = {}) {
		const qs = Object.entries(query)
			.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
			.join("&");
		return qs ? `#${path}?${qs}` : `#${path}`;
	}
}

/** 视图渲染包装：统一捕获 401 → 跳登录；返回视图的 cleanup（若有） */
export async function renderView(renderFn, container, params) {
	try {
		return await renderFn(container, params);
	} catch (err) {
		if (err instanceof ApiError && err.status === 401) {
			window.dispatchEvent(new CustomEvent("admin:unauthorized"));
			return null;
		}
		container.innerHTML = `
			<div class="empty-state">
				<span class="empty-icon">😵</span>
				加载失败：${escapeHtml(err.message)}
				<br /><br />
				<button class="btn" onclick="location.reload()">重试</button>
			</div>`;
		return null;
	}
}

function escapeHtml(str) {
	return String(str ?? "")
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");
}
