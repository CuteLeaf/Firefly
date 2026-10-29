/** 个性化设置：Schema 驱动的配置编辑器 */
import { api } from "../api.js";
import { createSchemaForm } from "../components/schema-form.js";
import { confirmDialog, escapeHtml, toast } from "../components/ui.js";

export async function render(container) {
	const groupsData = await api("/configs");

	container.innerHTML = `
		<div class="page-head">
			<div>
				<h1 class="page-title">个性化设置</h1>
				<p class="page-desc">以图形界面编辑 src/config 下的全部个性化配置；保存后写入 src/config/user-config.json 覆盖层，运行中的 dev 服务器会自动热更新。</p>
			</div>
		</div>
		<div class="settings-layout">
			<aside class="settings-side card" style="margin-bottom:0">
				<div id="settings-nav"></div>
			</aside>
			<section class="settings-main" id="settings-panel"></section>
		</div>`;

	const navEl = container.querySelector("#settings-nav");
	const panelEl = container.querySelector("#settings-panel");

	let activeKey = null;
	let activeForm = null;
	let dirty = false;

	function renderNav() {
		navEl.innerHTML = groupsData.groups
			.map(
				(g) => `
				<div class="settings-group-name">${escapeHtml(g.name)}</div>
				${g.sections
					.map(
						(s) => `
						<button class="settings-item${s.key === activeKey ? " active" : ""}" data-key="${s.key}">
							<span>${escapeHtml(s.title)}</span>
							${s.saved ? '<span class="dot" title="已保存个性化设置"></span>' : ""}
						</button>`,
					)
					.join("")}`,
			)
			.join("");
		navEl.querySelectorAll(".settings-item").forEach((btn) => {
			btn.addEventListener("click", () => loadSection(btn.dataset.key));
		});
	}

	async function loadSection(key) {
		if (dirty && key !== activeKey) {
			const ok = await confirmDialog({
				title: "放弃未保存的修改？",
				message: "当前模块有未保存的修改，切换后将丢失。",
				danger: true,
				confirmText: "放弃修改",
			});
			if (!ok) return;
		}
		activeKey = key;
		dirty = false;
		renderNav();
		panelEl.innerHTML = `<div class="loading">加载配置…</div>`;
		const data = await api(`/configs/${key}`);
		panelEl.innerHTML = `
			<div class="card">
				<h2 class="card-title">${escapeHtml(data.title)}</h2>
				<p class="card-desc">${escapeHtml(data.description || "")}${data.saved ? ' <span class="badge badge-saved">已保存个性化设置</span>' : ""}</p>
				${data.note ? `<div class="field-hint" style="margin-bottom:14px">💡 ${escapeHtml(data.note)}</div>` : ""}
				<div id="settings-form"></div>
				<div class="settings-actions">
					<button class="btn btn-primary" id="settings-save">💾 保存配置</button>
					<button class="btn" id="settings-reset">恢复默认值</button>
					<span class="settings-dirty" id="settings-dirty" hidden>● 有未保存的修改</span>
				</div>
			</div>`;
		activeForm = createSchemaForm({
			schema: data.schema,
			value: data.current,
			root: panelEl.querySelector("#settings-form"),
			onChange: () => {
				dirty = true;
				panelEl.querySelector("#settings-dirty").hidden = false;
			},
		});

		panelEl
			.querySelector("#settings-save")
			.addEventListener("click", async () => {
				const btn = panelEl.querySelector("#settings-save");
				btn.disabled = true;
				try {
					await api(`/configs/${key}`, {
						method: "PUT",
						body: activeForm.getValue(),
					});
					dirty = false;
					activeForm.markClean();
					panelEl.querySelector("#settings-dirty").hidden = true;
					// 更新侧栏 saved 标记
					for (const g of groupsData.groups) {
						for (const s of g.sections) if (s.key === key) s.saved = true;
					}
					renderNav();
					toast("配置已保存，运行中的站点将自动更新", "success");
				} catch (err) {
					toast(err.message, "error");
					if (err.details?.length) {
						toast(
							`校验失败：${err.details[0]}${err.details.length > 1 ? ` 等 ${err.details.length} 项` : ""}`,
							"error",
							5000,
						);
					}
				} finally {
					btn.disabled = false;
				}
			});

		panelEl
			.querySelector("#settings-reset")
			.addEventListener("click", async () => {
				const ok = await confirmDialog({
					title: "恢复默认值",
					message:
						"删除该模块在 user-config.json 中的全部个性化设置，恢复为 src/config 中的默认值。确定吗？",
					danger: true,
					confirmText: "恢复默认",
				});
				if (!ok) return;
				try {
					await api(`/configs/${key}`, { method: "DELETE" });
					for (const g of groupsData.groups) {
						for (const s of g.sections) if (s.key === key) s.saved = false;
					}
					renderNav();
					toast("已恢复默认值", "success");
					await loadSection(key);
				} catch (err) {
					toast(err.message, "error");
				}
			});
	}

	renderNav();
	// 默认打开第一个模块
	const first = groupsData.groups[0]?.sections[0];
	if (first) await loadSection(first.key);
}
