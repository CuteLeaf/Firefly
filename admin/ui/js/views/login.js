/** 登录页 */
import { api } from "../api.js";
import { toast } from "../components/ui.js";

export function renderLogin(root, onSuccess) {
	root.innerHTML = `
		<div class="login-wrap">
			<form class="login-card" id="login-form">
				<div class="login-logo">🪰</div>
				<h1 class="login-title">Firefly 管理后台</h1>
				<p class="login-sub">登录以管理你的博客</p>
				<div class="field">
					<label class="field-label" for="login-username">用户名</label>
					<input id="login-username" name="username" autocomplete="username" required />
				</div>
				<div class="field">
					<label class="field-label" for="login-password">密码</label>
					<input id="login-password" name="password" type="password" autocomplete="current-password" required />
				</div>
				<div class="field-error" id="login-error" hidden></div>
				<button class="btn btn-primary" type="submit" style="width:100%;justify-content:center" id="login-submit">登 录</button>
				<p class="login-hint">账号与密码只能在 <span class="kbd">admin/admin.config.ts</span> 中修改</p>
			</form>
		</div>`;

	const form = root.querySelector("#login-form");
	const errorEl = root.querySelector("#login-error");
	const submitBtn = root.querySelector("#login-submit");

	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		errorEl.hidden = true;
		submitBtn.disabled = true;
		submitBtn.innerHTML = '<span class="spinner"></span>';
		try {
			const result = await api("/auth/login", {
				method: "POST",
				body: {
					username: form.username.value.trim(),
					password: form.password.value,
				},
			});
			toast(`欢迎回来，${result.username}`, "success");
			onSuccess?.();
		} catch (err) {
			errorEl.hidden = false;
			errorEl.textContent = err.message;
			submitBtn.disabled = false;
			submitBtn.textContent = "登 录";
		}
	});
}
