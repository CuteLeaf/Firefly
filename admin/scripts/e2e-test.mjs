/**
 * 管理后台 E2E 冒烟测试（开发工具，非运行依赖）。
 * 前提：后台已运行（pnpm admin），Chrome 可执行文件存在。
 * 用法：node admin/scripts/e2e-test.mjs
 *
 * 覆盖：登录、仪表盘、文章列表、新建文章→保存草稿→发布、个性化设置保存/重置闭环、
 * 条件显示、数组增删、媒体库、构建页。截图输出到 /tmp/admin-e2e/。
 */
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const ADMIN_URL = process.env.ADMIN_URL || "http://127.0.0.1:4001";
const USERNAME = process.env.ADMIN_USER || "admin";
const PASSWORD = process.env.ADMIN_PASS || "admin123";
const CHROME =
	process.env.CHROME ||
	"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const DEBUG_PORT = 9222;
const OUT_DIR = "/tmp/admin-e2e";
const USER_DATA = "/tmp/admin-e2e-chrome-profile";

let msgId = 0;
const pending = new Map();

function send(ws, method, params = {}) {
	return new Promise((resolve, reject) => {
		const id = ++msgId;
		pending.set(id, { resolve, reject });
		ws.send(JSON.stringify({ id, method, params }));
	});
}

async function evaluate(ws, expression) {
	const result = await send(ws, "Runtime.evaluate", {
		expression,
		awaitPromise: true,
		returnByValue: true,
	});
	if (result.exceptionDetails) {
		throw new Error(
			`页面脚本错误: ${JSON.stringify(
				result.exceptionDetails.exception?.description ||
					result.exceptionDetails.text,
			)}`,
		);
	}
	return result.result?.value;
}

async function screenshot(ws, name) {
	const shot = await send(ws, "Page.captureScreenshot", { format: "png" });
	await fs.writeFile(
		path.join(OUT_DIR, `${name}.png`),
		Buffer.from(shot.data, "base64"),
	);
	console.log(`  📸 ${name}.png`);
}

function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

async function waitFor(ws, expression, timeoutMs = 8000) {
	const start = Date.now();
	while (Date.now() - start < timeoutMs) {
		if (await evaluate(ws, expression)) return true;
		await sleep(200);
	}
	throw new Error(`等待超时：${expression}`);
}

async function click(ws, selector) {
	await evaluate(
		ws,
		`(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) throw new Error("找不到元素: " + ${JSON.stringify(selector)}); el.click(); })()`,
	);
}

async function setInput(ws, selector, value) {
	await evaluate(
		ws,
		`(() => {
		const el = document.querySelector(${JSON.stringify(selector)});
		if (!el) throw new Error("找不到元素: " + ${JSON.stringify(selector)});
		el.value = ${JSON.stringify(value)};
		el.dispatchEvent(new Event("input", { bubbles: true }));
	})()`,
	);
}

async function assert(cond, label) {
	if (!cond) throw new Error(`断言失败：${label}`);
	console.log(`  ✓ ${label}`);
}

function connect(wsUrl) {
	return new Promise((resolve, reject) => {
		const ws = new WebSocket(wsUrl);
		ws.addEventListener("open", () => resolve(ws));
		ws.addEventListener("error", () => reject(new Error("WebSocket 连接失败")));
		ws.addEventListener("message", (event) => {
			const msg = JSON.parse(event.data);
			if (msg.id && pending.has(msg.id)) {
				const { resolve, reject } = pending.get(msg.id);
				pending.delete(msg.id);
				if (msg.error) reject(new Error(msg.error.message));
				else resolve(msg.result);
			}
		});
	});
}

async function main() {
	const SEL_TITLE_INPUT = "[data-path='[\"title\"]'] input";
	const SEL_TYPE_SELECT = "[data-path='[\"type\"]'] select";
	const SEL_TWIKOO = "[data-path='[\"twikoo\"]']";
	const SEL_LEFT_ITEMS =
		"[data-path='[\"leftComponents\"]'] .schema-array-item";
	const SEL_LEFT_ADD = "[data-path='[\"leftComponents\"]'] .schema-array-add";

	await fs.rm(OUT_DIR, { recursive: true, force: true });
	await fs.rm(USER_DATA, { recursive: true, force: true });
	await fs.mkdir(OUT_DIR, { recursive: true });

	console.log("启动 headless Chrome…");
	const chrome = spawn(
		CHROME,
		[
			"--headless=new",
			"--no-sandbox",
			"--disable-gpu",
			"--no-first-run",
			"--no-default-browser-check",
			`--remote-debugging-port=${DEBUG_PORT}`,
			`--user-data-dir=${USER_DATA}`,
			"--window-size=1440,900",
			`${ADMIN_URL}/#/`,
		],
		{ stdio: "ignore" },
	);

	try {
		let targets = null;
		for (let i = 0; i < 40; i++) {
			try {
				const res = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`);
				targets = await res.json();
				if (targets.length > 0) break;
			} catch {
				/* 重试 */
			}
			await sleep(250);
		}
		if (!targets?.length) throw new Error("无法连接 Chrome 调试端口");
		const page = targets.find((t) => t.type === "page") ?? targets[0];
		const ws = await connect(page.webSocketDebuggerUrl);
		await send(ws, "Page.enable");
		await send(ws, "Runtime.enable");

		/* ① 登录 */
		console.log("\n① 登录");
		await waitFor(ws, `!!document.querySelector('.login-card')`);
		await assert(
			await evaluate(
				ws,
				`!!document.querySelector('#login-username') && !!document.querySelector('#login-password')`,
			),
			"登录表单字段存在",
		);
		await screenshot(ws, "01-login");
		await setInput(ws, "#login-username", USERNAME);
		await setInput(ws, "#login-password", PASSWORD);
		await click(ws, "#login-form button[type=submit]");
		await waitFor(ws, `!document.getElementById('app').hidden`);
		console.log("  ✓ 登录成功");
		await sleep(400);

		/* ② 仪表盘 */
		console.log("\n② 仪表盘");
		await waitFor(ws, `document.querySelectorAll('.stat-card').length >= 5`);
		await assert(
			Number(
				await evaluate(
					ws,
					`document.querySelector('.stat-card .stat-value').textContent`,
				),
			) > 0,
			"文章总数大于 0",
		);
		await screenshot(ws, "02-dashboard");

		/* ③ 文章列表 */
		console.log("\n③ 文章管理");
		await evaluate(ws, `location.hash = '#/posts'`);
		await waitFor(
			ws,
			`document.querySelectorAll('#post-list tr.row-link').length > 0`,
		);
		const rowCount = await evaluate(
			ws,
			`document.querySelectorAll('#post-list tr.row-link').length`,
		);
		await assert(rowCount > 0, `文章列表 ${rowCount} 行`);
		// 状态筛选
		await click(ws, '#status-tabs .tab[data-status="draft"]');
		await sleep(400);
		await assert(
			(await evaluate(
				ws,
				`document.querySelectorAll('#post-list .badge-draft').length`,
			)) >=
				(await evaluate(
					ws,
					`document.querySelectorAll('#post-list tr.row-link').length`,
				)),
			"草稿筛选生效",
		);
		await click(ws, '#status-tabs .tab[data-status="all"]');
		await sleep(400);
		await screenshot(ws, "03-posts");

		/* ④ 个性化设置：保存/重置闭环 + 条件显示 + 数组操作 */
		console.log("\n④ 个性化设置");
		await evaluate(ws, `location.hash = '#/settings'`);
		await waitFor(ws, `!!document.querySelector('#settings-form')`);
		const sectionCount = await evaluate(
			ws,
			`document.querySelectorAll('.settings-item').length`,
		);
		await assert(sectionCount === 26, `配置模块 ${sectionCount} 个`);
		await assert(
			await evaluate(
				ws,
				`!!document.querySelector(${JSON.stringify(SEL_TITLE_INPUT)})`,
			),
			"站点配置表单已渲染（title 字段）",
		);

		// 开关组件布局检测：label 必须保持 inline-flex、轨道宽度生效（防布局回归）
		const SEL_CARD_BORDER = '[data-path=\'["card","border"]\']';
		const switchCss = await evaluate(ws, `(() => {
			const q = ${JSON.stringify(SEL_CARD_BORDER)};
			const label = document.querySelector(q + ' label.switch');
			const track = document.querySelector(q + ' .switch-track');
			if (!label || !track) return { missing: true };
			return {
				display: getComputedStyle(label).display,
				trackWidth: getComputedStyle(track).width,
				labelWeight: getComputedStyle(label).fontWeight,
			};
		})()`);
		await assert(
			!switchCss.missing &&
				switchCss.display === "inline-flex" &&
				switchCss.trackWidth === "36px" &&
				switchCss.labelWeight !== "600",
			`开关布局正确（display=${switchCss.display}, track=${switchCss.trackWidth}, weight=${switchCss.labelWeight}）`,
		);

		// 修改标题 → 保存
		const newTitle = `后台E2E测试-${Date.now()}`;
		await setInput(ws, SEL_TITLE_INPUT, newTitle);
		await click(ws, "#settings-save");
		await waitFor(
			ws,
			`document.querySelector('.settings-item.active .dot') !== null`,
			10000,
		);
		console.log("  ✓ 保存成功，user-config.json 已写入覆盖层");
		// 校验侧栏已保存标记
		await assert(
			await evaluate(
				ws,
				`!!document.querySelector('.settings-item.active .dot')`,
			),
			"侧栏显示「已保存」标记",
		);
		await screenshot(ws, "04-settings-saved");

		// 恢复默认
		await click(ws, "#settings-reset");
		await waitFor(ws, `!!document.querySelector('.modal [data-act="ok"]')`);
		await click(ws, '.modal [data-act="ok"]');
		await waitFor(
			ws,
			`document.querySelector('.settings-item.active .dot') === null`,
			10000,
		);
		console.log("  ✓ 恢复默认值成功");

		// 条件显示：评论系统 type=none 时 twikoo 配置应隐藏
		await evaluate(
			ws,
			`[...document.querySelectorAll('.settings-item')].find(b => b.dataset.key === 'comment').click()`,
		);
		await waitFor(
			ws,
			`!!document.querySelector(${JSON.stringify(SEL_TYPE_SELECT)})`,
		);
		await assert(
			await evaluate(
				ws,
				`document.querySelector(${JSON.stringify(SEL_TWIKOO)}).classList.contains('cond-hidden')`,
			),
			"评论 type=none 时 twikoo 配置隐藏（x-if 生效）",
		);
		// 切换 type → twikoo 显示
		await evaluate(
			ws,
			`(() => {
			const s = document.querySelector(${JSON.stringify(SEL_TYPE_SELECT)});
			s.value = 'twikoo';
			s.dispatchEvent(new Event('input', { bubbles: true }));
			s.dispatchEvent(new Event('change', { bubbles: true }));
		})()`,
		);
		await assert(
			await evaluate(
				ws,
				`!document.querySelector(${JSON.stringify(SEL_TWIKOO)}).classList.contains('cond-hidden')`,
			),
			"切换 type=twikoo 后配置显示",
		);
		await screenshot(ws, "05-settings-comment");

		// 数组操作：侧边栏组件（当前表单 dirty，切换模块会弹确认，需先确认放弃）
		await evaluate(
			ws,
			`[...document.querySelectorAll('.settings-item')].find(b => b.dataset.key === 'sidebar').click()`,
		);
		await sleep(400);
		const modalOkVisible = await evaluate(
			ws,
			`!!document.querySelector('.modal [data-act="ok"]')`,
		);
		if (modalOkVisible) {
			await click(ws, '.modal [data-act="ok"]');
			await sleep(400);
		}
		await waitFor(
			ws,
			`!!document.querySelector(${JSON.stringify(SEL_LEFT_ADD)})`,
		);
		const before = await evaluate(
			ws,
			`document.querySelectorAll(${JSON.stringify(SEL_LEFT_ITEMS)}).length`,
		);
		await click(ws, SEL_LEFT_ADD);
		await sleep(300);
		const after = await evaluate(
			ws,
			`document.querySelectorAll(${JSON.stringify(SEL_LEFT_ITEMS)}).length`,
		);
		await assert(after === before + 1, `组件数组添加（${before} → ${after}）`);
		// 删除刚添加的
		await evaluate(
			ws,
			`(() => {
			const items = document.querySelectorAll(${JSON.stringify(SEL_LEFT_ITEMS)});
			const last = items[items.length - 1];
			last.querySelector('.move-btn:last-child').click();
		})()`,
		);
		await sleep(300);
		await assert(
			(await evaluate(
				ws,
				`document.querySelectorAll(${JSON.stringify(SEL_LEFT_ITEMS)}).length`,
			)) === before,
			"组件数组删除",
		);
		await screenshot(ws, "06-settings-sidebar");

		/* ⑤ 文章编辑器：新建 → 保存草稿 → 发布 */
		console.log("\n⑤ 文章编辑器");
		await evaluate(ws, `location.hash = '#/posts/edit'`);
		await waitFor(ws, `!!document.querySelector('#post-body')`);
		const testTitle = `E2E测试文章${Date.now()}`;
		await setInput(ws, SEL_TITLE_INPUT, testTitle);
		await setInput(
			ws,
			"#post-body",
			"# E2E 测试\n\n这是后台自动化测试创建的正文。",
		);
		await click(ws, "#post-save-draft");
		await waitFor(ws, `location.hash.includes('id=')`, 10000);
		const createdId = await evaluate(
			ws,
			`new URLSearchParams(location.hash.split('?')[1]).get('id')`,
		);
		await assert(Boolean(createdId), `草稿已创建：${createdId}`);
		await waitFor(
			ws,
			`document.querySelector('#post-path-info').textContent.includes('${createdId}')`,
		);
		await screenshot(ws, "07-post-created");
		// 发布
		await click(ws, "#post-publish");
		await sleep(1200);
		await assert(
			await evaluate(ws, `!document.querySelector('#settings-dirty')`),
			"发布按钮可用",
		);
		// 回列表确认
		await evaluate(ws, `location.hash = '#/posts'`);
		await waitFor(
			ws,
			`document.querySelectorAll('#post-list tr.row-link').length > 0`,
		);
		await setInput(ws, "#post-search", testTitle);
		await sleep(600);
		await assert(
			await evaluate(
				ws,
				`document.querySelectorAll('#post-list .badge-published').length >= 1`,
			),
			"列表中出现刚发布的文章",
		);
		await screenshot(ws, "08-post-published");

		/* ⑥ 媒体库 */
		console.log("\n⑥ 媒体库");
		await evaluate(ws, `location.hash = '#/media'`);
		await waitFor(ws, `!!document.querySelector('#media-drop')`);
		await screenshot(ws, "09-media");

		/* ⑦ 构建部署 */
		console.log("\n⑦ 构建部署");
		await evaluate(ws, `location.hash = '#/site'`);
		await waitFor(
			ws,
			`document.querySelectorAll('#site-stats .stat-card').length === 3`,
		);
		await assert(
			(await evaluate(
				ws,
				`document.querySelectorAll('#site-stats .stat-card').length`,
			)) === 3,
			"状态卡片 3 张",
		);
		await screenshot(ws, "10-site");

		// 清理测试文章（通过浏览器上下文，携带会话 cookie）
		const delStatus = await evaluate(
			ws,
			`fetch('/api/posts?id=${encodeURIComponent(createdId)}', { method: 'DELETE', headers: { 'x-admin-request': '1' } }).then(r => r.status)`,
		);
		console.log(`  ✓ 测试文章已清理（HTTP ${delStatus}）`);

		console.log("\n✅ E2E 冒烟测试全部通过，截图位于 " + OUT_DIR);
		ws.close();
	} finally {
		chrome.kill("SIGTERM");
	}
}

main().catch((err) => {
	console.error(`\n❌ ${err.message}`);
	process.exit(1);
});
