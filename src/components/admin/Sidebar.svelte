<script lang="ts">
	type Route = "dashboard" | "posts" | "posts-new" | "posts-edit" | "dynamic" | "dynamic-new" | "dynamic-edit" | "spec" | "settings";

	let { currentRoute, onNavigate }: {
		currentRoute: Route;
		onNavigate: (route: Route, slug?: string) => void;
	} = $props();

	const navItems = [
		{ id: "dashboard" as Route, label: "📊 仪表盘", icon: "◆" },
		{ id: "posts" as Route, label: "📝 文章管理", icon: "📄" },
		{ id: "dynamic" as Route, label: "💬 动态管理", icon: "✏" },
		{ id: "spec" as Route, label: "📄 单页管理", icon: "📋" },
		{ id: "settings" as Route, label: "⚙️ 网站设置", icon: "⚙" },
	];

	function isActive(id: Route): boolean {
		if (id === "posts" && (currentRoute === "posts" || currentRoute === "posts-new" || currentRoute === "posts-edit")) return true;
		if (id === "dynamic" && (currentRoute === "dynamic" || currentRoute === "dynamic-new" || currentRoute === "dynamic-edit")) return true;
		if (id === "spec" && currentRoute === "spec") return true;
		if (id === "settings" && currentRoute === "settings") return true;
		return currentRoute === id;
	}
</script>

<aside class="sidebar">
	<div class="sidebar-header">
		<h1 class="logo">Firefly</h1>
		<p class="subtitle">管理面板</p>
	</div>

	<nav class="nav">
		{#each navItems as item}
			<button
				class="nav-item"
				class:active={isActive(item.id)}
				onclick={() => onNavigate(item.id)}
			>
				<span class="nav-icon">{item.icon}</span>
				<span class="nav-label">{item.label}</span>
			</button>
		{/each}
	</nav>

	<div class="sidebar-footer">
		<a href="/" target="_blank" class="back-link">← 返回博客</a>
	</div>
</aside>

<style>
	.sidebar {
		width: 220px;
		min-width: 220px;
		background: var(--admin-sidebar-bg);
		color: var(--admin-sidebar-text);
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	.sidebar-header {
		padding: 20px 16px 12px;
		border-bottom: 1px solid rgba(255,255,255,0.1);
	}

	.logo {
		font-size: 20px;
		font-weight: 700;
		color: #fff;
		letter-spacing: 0.5px;
	}

	.subtitle {
		font-size: 12px;
		color: rgba(255,255,255,0.5);
		margin-top: 2px;
	}

	.nav {
		flex: 1;
		padding: 12px 8px;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 12px;
		border: none;
		background: transparent;
		color: var(--admin-sidebar-text);
		font-size: 14px;
		cursor: pointer;
		border-radius: 8px;
		transition: all 0.15s;
		text-align: left;
		width: 100%;
	}

	.nav-item:hover {
		background: var(--admin-sidebar-hover);
	}

	.nav-item.active {
		background: var(--admin-sidebar-active);
		color: #fff;
		font-weight: 500;
	}

	.nav-icon {
		font-size: 16px;
		width: 24px;
		text-align: center;
	}

	.nav-label {
		flex: 1;
	}

	.sidebar-footer {
		padding: 12px 8px;
		border-top: 1px solid rgba(255,255,255,0.1);
	}

	.back-link {
		display: block;
		padding: 8px 12px;
		color: rgba(255,255,255,0.6);
		text-decoration: none;
		font-size: 13px;
		border-radius: 6px;
		transition: all 0.15s;
	}

	.back-link:hover {
		color: #fff;
		background: var(--admin-sidebar-hover);
	}
</style>
