<script lang="ts">
	import FriendsManager from "./FriendsManager.svelte";
	import MediaLibrary from "./MediaLibrary.svelte";

	type Route = "dashboard" | "posts" | "posts-new" | "posts-edit" | "dynamic" | "dynamic-new" | "dynamic-edit" | "spec" | "settings";

	let { onNavigate, showToast }: {
		onNavigate: (route: Route, slug?: string) => void;
		showToast: (msg: string, type: "success" | "error" | "info") => void;
	} = $props();

	const configTabs = [
		{ id: "profile", label: "👤 个人资料" },
		{ id: "navbar", label: "🧭 导航栏" },
		{ id: "friends", label: "🔗 友情链接" },
		{ id: "announcement", label: "📢 公告" },
		{ id: "music", label: "🎵 音乐" },
		{ id: "comment", label: "💬 评论" },
		{ id: "analytics", label: "📊 统计" },
		{ id: "media", label: "📸 媒体库" },
	];

	let activeTab = $state("profile");
	let configFields = $state<Record<string, { label: string; type: string; comment?: string }> | null>(null);
	let configValues = $state<Record<string, unknown>>({});
	let loading = $state(false);
	let saving = $state(false);
	let navItems = $state<Array<{ key: string; name: string; url: string; icon: string; pageKey?: string }>>([]);
	let navLoading = $state(false);

	$effect(() => {
		if (activeTab === "navbar") fetchNavbar();
		else if (activeTab === "friends" || activeTab === "media") { configFields = null; loading = false; }
		else fetchConfig();
	});

	async function fetchConfig() {
		loading = true;
		try {
			const res = await fetch(`/admin/api/config/${activeTab}.json`);
			if (!res.ok) throw new Error("获取配置失败");
			const data = await res.json();
			configFields = data.fields;
			configValues = data.values || {};
		} catch (err) {
			showToast(String(err), "error");
		} finally {
			loading = false;
		}
	}

	async function handleSaveConfig() {
		saving = true;
		try {
			const res = await fetch(`/admin/api/config/${activeTab}.json`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ values: configValues }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "保存失败");
			showToast(data.message || "保存成功", "success");
		} catch (err) {
			showToast(String(err), "error");
		} finally {
			saving = false;
		}
	}

	function updateValue(key: string, value: unknown) {
		configValues = { ...configValues, [key]: value };
	}

	async function fetchNavbar() {
		navLoading = true;
		try {
			const res = await fetch("/admin/api/navbar-presets.json");
			if (!res.ok) throw new Error("获取导航栏配置失败");
			const data = await res.json();
			navItems = data.items || [];
		} catch (err) {
			showToast(String(err), "error");
		} finally {
			navLoading = false;
		}
	}

	async function handleSaveNavItem(key: string) {
		const item = navItems.find((i) => i.key === key);
		if (!item) return;
		try {
			const res = await fetch("/admin/api/navbar-presets.json", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ key, name: item.name, url: item.url }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "保存失败");
			showToast(`「${item.name}」已更新`, "success");
		} catch (err) {
			showToast(String(err), "error");
		}
	}

	function updateNavItem(key: string, field: "name" | "url", value: string) {
		navItems = navItems.map((i) => (i.key === key ? { ...i, [field]: value } : i));
	}
</script>

<div class="page">
	<div class="page-header"><h2>⚙️ 网站设置</h2></div>
	<div class="settings-layout">
		<div class="tabs">
			{#each configTabs as tab}
				<button class="tab-item" class:active={activeTab === tab.id} onclick={() => activeTab = tab.id}>
					{tab.label}
				</button>
			{/each}
		</div>
		<div class="tab-content">
			{#if activeTab === "navbar"}
				<div class="tab-header">
					<h3>导航栏链接预设</h3>
					<p class="tab-desc">修改各导航菜单项的名称和链接地址。图标需要手动编辑 navBarConfig.ts。</p>
				</div>
				{#if navLoading}
					<p class="loading">加载中...</p>
				{:else}
					<div class="nav-list">
						{#each navItems as item (item.key)}
							<div class="nav-item-card">
								<div class="nav-item-header">
									<span class="nav-item-key">{item.key}</span>
									{#if item.icon}<code class="nav-icon-badge">{item.icon}</code>{/if}
									{#if item.pageKey}<span class="nav-page-badge">{item.pageKey}</span>{/if}
								</div>
								<div class="nav-item-fields">
									<div class="nav-field">
										<label for="nav-name-{item.key}">名称</label>
										<input id="nav-name-{item.key}" type="text" class="form-input" value={item.name} oninput={(e) => updateNavItem(item.key, "name", e.currentTarget.value)} />
									</div>
									<div class="nav-field">
										<label for="nav-url-{item.key}">链接</label>
										<input id="nav-url-{item.key}" type="text" class="form-input" value={item.url} oninput={(e) => updateNavItem(item.key, "url", e.currentTarget.value)} />
									</div>
									<button class="btn btn-sm btn-primary" onclick={() => handleSaveNavItem(item.key)}>保存</button>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			{:else if activeTab === "friends"}
				<FriendsManager {onNavigate} {showToast} />
			{:else if activeTab === "media"}
				<MediaLibrary {showToast} />
			{:else}
				{#if loading}
					<p class="loading">加载中...</p>
				{:else if configFields}
					<div class="config-form">
						{#each Object.entries(configFields) as [key, field]}
							<div class="form-group">
								<label for={key}>{field.label}
									{#if field.comment}<span class="help-tip" title={field.comment}>?</span>{/if}
								</label>
								{#if field.type === "boolean"}
									<button id={key} class="toggle-btn" class:on={configValues[key] === true} onclick={() => updateValue(key, !configValues[key])}>
										{configValues[key] === true ? "✅ 启用" : "⛔ 关闭"}
									</button>
								{:else if field.type === "text"}
									<textarea id={key} class="form-textarea" value={String(configValues[key] || "")} oninput={(e) => updateValue(key, e.currentTarget.value)} rows="3"></textarea>
								{:else if field.type === "number"}
									<input id={key} type="number" class="form-input" value={Number(configValues[key] || 0)} oninput={(e) => updateValue(key, Number(e.currentTarget.value))} />
								{:else}
									<input id={key} type="text" class="form-input" value={String(configValues[key] || "")} oninput={(e) => updateValue(key, e.currentTarget.value)} />
								{/if}
							</div>
						{/each}
						<div class="form-actions">
							<button class="btn btn-primary" onclick={handleSaveConfig} disabled={saving}>{saving ? "保存中..." : "💾 保存配置"}</button>
							<button class="btn" onclick={fetchConfig}>↻ 重置</button>
						</div>
					</div>
				{/if}
			{/if}
		</div>
	</div>
</div>

<style>
	.page { max-width: 900px; }
	.page-header { margin-bottom: 20px; }
	.page-header h2 { font-size: 22px; font-weight: 700; }
	.settings-layout { background: var(--admin-surface); border: 1px solid var(--admin-border); border-radius: 10px; overflow: hidden; }
	.tabs { display: flex; border-bottom: 1px solid var(--admin-border); background: #f9fafb; flex-wrap: wrap; }
	.tab-item { padding: 12px 16px; border: none; background: transparent; cursor: pointer; font-size: 13px; border-bottom: 2px solid transparent; transition: all 0.15s; color: var(--admin-text-secondary); white-space: nowrap; }
	.tab-item:hover { color: var(--admin-text); background: #f1f5f9; }
	.tab-item.active { color: var(--admin-primary); border-bottom-color: var(--admin-primary); font-weight: 600; background: #fff; }
	.tab-content { padding: 24px; }
	.tab-header { margin-bottom: 16px; }
	.tab-header h3 { font-size: 16px; font-weight: 600; }
	.tab-desc { font-size: 13px; color: var(--admin-text-secondary); margin-top: 4px; }
	.config-form { display: flex; flex-direction: column; gap: 20px; }
	.form-group label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 4px; }
	.help-tip { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; border-radius: 50%; background: #e5e7eb; color: #6b7280; font-size: 10px; font-weight: 700; cursor: help; margin-left: 4px; vertical-align: middle; }
	.help-tip:hover { background: #d1d5db; }
	.form-input { width: 100%; max-width: 400px; padding: 8px 12px; border: 1px solid var(--admin-border); border-radius: 6px; font-size: 14px; outline: none; background: #fff; }
	.form-input:focus { border-color: var(--admin-primary); }
	.form-textarea { width: 100%; max-width: 600px; padding: 8px 12px; border: 1px solid var(--admin-border); border-radius: 6px; font-size: 14px; outline: none; resize: vertical; font-family: inherit; }
	.form-textarea:focus { border-color: var(--admin-primary); }
	.toggle-btn { padding: 6px 16px; border: 1px solid var(--admin-border); border-radius: 6px; cursor: pointer; font-size: 13px; background: #fff; transition: all 0.15s; }
	.toggle-btn.on { background: #dcfce7; border-color: #86efac; color: #166534; }
	.toggle-btn:hover { opacity: 0.8; }
	.form-actions { display: flex; gap: 8px; padding-top: 8px; border-top: 1px solid var(--admin-border); }
	.nav-list { display: flex; flex-direction: column; gap: 12px; }
	.nav-item-card { border: 1px solid var(--admin-border); border-radius: 8px; padding: 14px; background: #fff; }
	.nav-item-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
	.nav-item-key { font-weight: 700; font-size: 14px; min-width: 80px; }
	.nav-icon-badge { font-size: 11px; background: #f1f5f9; padding: 2px 8px; border-radius: 4px; color: var(--admin-text-secondary); }
	.nav-page-badge { font-size: 11px; background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; }
	.nav-item-fields { display: flex; gap: 10px; align-items: flex-end; flex-wrap: wrap; }
	.nav-field { flex: 1; min-width: 150px; }
	.nav-field label { display: block; font-size: 12px; font-weight: 500; margin-bottom: 3px; color: var(--admin-text-secondary); }
	.nav-field .form-input { max-width: 100%; }
	.loading { color: var(--admin-text-secondary); padding: 20px; text-align: center; }
</style>
