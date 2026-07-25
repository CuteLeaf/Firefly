<script lang="ts">
	import Sidebar from "./Sidebar.svelte";
	import Dashboard from "./Dashboard.svelte";
	import PostList from "./PostList.svelte";
	import PostEditor from "./PostEditor.svelte";
	import DynamicList from "./DynamicList.svelte";
	import DynamicEditor from "./DynamicEditor.svelte";
	import SpecManager from "./SpecManager.svelte";
	import Toast from "./Toast.svelte";
	import SettingsPage from "./SettingsPage.svelte";

	type Route = "dashboard" | "posts" | "posts-new" | "posts-edit" | "dynamic" | "dynamic-new" | "dynamic-edit" | "spec" | "settings";

	let ui = $state({ route: "dashboard" as Route, slug: undefined as string | undefined });
	let currentRoute = $derived(ui.route);
	let currentSlug = $derived(ui.slug);
	let toastMessage = $state("");
	let toastType: "success" | "error" | "info" = $state("info");

	function showToast(message: string, type: "success" | "error" | "info" = "info") {
		toastMessage = message;
		toastType = type;
	}

	function navigate(route: Route, slug?: string) {
		console.log("[Admin] navigate:", route, slug);
		ui.route = route;
		ui.slug = slug;
		// 同步更新 URL hash（不触发事件，仅用于刷新/bookmark）
		const hash = route === "posts-edit" && slug ? `posts/edit/${slug}`
			: route === "posts-new" ? "posts/new"
			: route === "dynamic-edit" && slug ? `dynamic/edit/${slug}`
			: route === "dynamic-new" ? "dynamic/new"
			: route === "spec" && slug ? `spec/${slug}`
			: route;
		history.replaceState(null, "", `#${hash}`);
	}

	function initRouteFromHash() {
		const raw = window.location.hash.replace("#", "");
		if (!raw || raw === "dashboard") { ui.route = "dashboard"; ui.slug = undefined; return; }
		const parts = raw.split("/");
		if (parts[0] === "posts") {
			if (parts[1] === "new") { ui.route = "posts-new"; ui.slug = undefined; }
			else if (parts[1] === "edit" && parts[2]) { ui.route = "posts-edit"; ui.slug = parts.slice(2).join("/"); }
			else { ui.route = "posts"; ui.slug = undefined; }
		} else if (parts[0] === "dynamic") {
			if (parts[1] === "new") { ui.route = "dynamic-new"; ui.slug = undefined; }
			else if (parts[1] === "edit" && parts[2]) { ui.route = "dynamic-edit"; ui.slug = parts[2]; }
			else { ui.route = "dynamic"; ui.slug = undefined; }
		} else if (parts[0] === "spec") { ui.route = "spec"; ui.slug = parts[1]; }
		else if (parts[0] === "settings") { ui.route = "settings"; ui.slug = undefined; }
		else { ui.route = "dashboard"; ui.slug = undefined; }
	}

	$effect(() => {
		initRouteFromHash();
	});
</script>

<div class="admin-layout">
	<Sidebar currentRoute={ui.route} onNavigate={navigate} />

	<main class="main-content">
		{#if ui.route === "dashboard"}
			<Dashboard onNavigate={navigate} />
		{:else if ui.route === "posts"}
			<PostList onNavigate={navigate} {showToast} />
		{:else if ui.route === "posts-new" || ui.route === "posts-edit"}
			<PostEditor
				slug={ui.route === "posts-edit" ? ui.slug : undefined}
				onNavigate={navigate}
				{showToast}
			/>
		{:else if ui.route === "dynamic"}
			<DynamicList onNavigate={navigate} {showToast} />
		{:else if ui.route === "dynamic-new" || ui.route === "dynamic-edit"}
			<DynamicEditor
				slug={ui.route === "dynamic-edit" ? ui.slug : undefined}
				onNavigate={navigate}
				{showToast}
			/>
		{:else if ui.route === "spec"}
			<SpecManager slug={ui.slug} onNavigate={navigate} {showToast} />
		{:else if ui.route === "settings"}
			<SettingsPage onNavigate={navigate} showToast={showToast} />
		{/if}
	</main>
</div>

<Toast message={toastMessage} type={toastType} onClose={() => toastMessage = ""} />

<style>
	.admin-layout {
		display: flex;
		width: 100%;
		height: 100vh;
		overflow: hidden;
	}

	.main-content {
		flex: 1;
		overflow-y: auto;
		padding: 24px;
	}
</style>
