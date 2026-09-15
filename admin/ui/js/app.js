/** 应用入口：会话检测、视图注册与路由分发 */
import { api } from "./api.js";
import { Router, renderView } from "./router.js";
import { toast } from "./components/ui.js";
import { renderLogin } from "./views/login.js";

/**
 * 视图注册表 —— 新增页面：在 js/views/ 下新建文件导出 render(container, params)，
 * 然后在这里登记一行（并在 index.html 侧边栏加导航项）。
 */
const viewRegistry = {
	"/": () => import("./views/dashboard.js"),
	"/posts": () => import("./views/posts.js"),
	"/posts/edit": () => import("./views/post-edit.js"),
	"/settings": () => import("./views/settings.js"),
	"/media": () => import("./views/media.js"),
	"/site": () => import("./views/site.js"),
};

const appEl = document.getElementById("app");
const viewEl = document.getElementById("view");
const navEl = document.getElementById("sidebar-nav");
let router = null;
let currentUser = null;
let viewCleanup = null;

function showApp(user) {
	currentUser = user;
	appEl.hidden = false;
	document.getElementById("user-name").textContent = user;
	document.getElementById("user-avatar").textContent =
		[...user][0]?.toUpperCase() ?? "A";
	const loginRoot = document.getElementById("login-root");
	loginRoot?.remove();
	if (!router) {
		router = new Router(onNavigate);
		router.start();
	} else {
		router.dispatch();
	}
}

function showLogin() {
	appEl.hidden = true;
	let loginRoot = document.getElementById("login-root");
	if (!loginRoot) {
		loginRoot = document.createElement("div");
		loginRoot.id = "login-root";
		document.body.appendChild(loginRoot);
	}
	renderLogin(loginRoot, () => boot());
}

async function onNavigate(path, query) {
	// 清理上一个视图（移除事件监听等）
	viewCleanup?.();
	viewCleanup = null;
	// 导航高亮
	for (const item of navEl.querySelectorAll("[data-nav]")) {
		const target = item.dataset.nav;
		item.classList.toggle(
			"active",
			target === "/" ? path === "/" : path.startsWith(target),
		);
	}
	const loader = viewRegistry[path];
	if (!loader) {
		viewEl.innerHTML = `<div class="empty-state"><span class="empty-icon">🧭</span>页面不存在</div>`;
		return;
	}
	viewEl.innerHTML = `<div class="loading">加载中…</div>`;
	const mod = await loader();
	viewEl.innerHTML = "";
	viewCleanup = (await renderView(mod.render, viewEl, query)) ?? null;
}

async function boot() {
	try {
		const session = await api("/auth/session");
		if (session.loggedIn) {
			showApp(session.username);
			return;
		}
	} catch {
		/* 未登录 */
	}
	showLogin();
}

/* ── 全局事件 ── */

window.addEventListener("admin:unauthorized", () => {
	toast("登录状态已失效，请重新登录", "warning");
	showLogin();
});

document.getElementById("logout-btn").addEventListener("click", async () => {
	try {
		await api("/auth/logout", { method: "POST" });
	} catch {
		/* 忽略 */
	}
	currentUser = null;
	showLogin();
});

boot();
