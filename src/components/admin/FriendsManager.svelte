<script lang="ts">
	type Route = "dashboard" | "posts" | "posts-new" | "posts-edit" | "dynamic" | "dynamic-new" | "dynamic-edit" | "spec" | "settings";

	let { onNavigate, showToast }: {
		onNavigate: (route: Route, slug?: string) => void;
		showToast: (msg: string, type: "success" | "error" | "info") => void;
	} = $props();

	interface Friend {
		title: string;
		imgurl: string;
		desc: string;
		siteurl: string;
		tags: string[];
		weight: number;
		enabled: boolean;
	}

	let friends = $state<Friend[]>([]);
	let loading = $state(true);
	let saving = $state(false);
	let editingIndex = $state<number | null>(null);

	$effect(() => { fetchFriends(); });

	async function fetchFriends() {
		loading = true;
		try {
			const res = await fetch("/admin/api/friends.json");
			if (!res.ok) throw new Error("获取友链失败");
			const data = await res.json();
			friends = data.friends || [];
		} catch (err) {
			showToast(String(err), "error");
		} finally {
			loading = false;
		}
	}

	async function handleSave() {
		saving = true;
		try {
			const res = await fetch("/admin/api/friends.json", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ friends }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "保存失败");
			showToast("友链已更新", "success");
		} catch (err) {
			showToast(String(err), "error");
		} finally {
			saving = false;
		}
	}

	function addFriend() {
		friends = [...friends, {
			title: "",
			imgurl: "",
			desc: "",
			siteurl: "",
			tags: [],
			weight: 0,
			enabled: true,
		}];
		editingIndex = friends.length - 1;
	}

	function removeFriend(idx: number) {
		friends = friends.filter((_, i) => i !== idx);
		if (editingIndex === idx) editingIndex = null;
	}

	function moveUp(idx: number) {
		if (idx === 0) return;
		const arr = [...friends];
		[arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
		friends = arr;
	}

	function moveDown(idx: number) {
		if (idx === friends.length - 1) return;
		const arr = [...friends];
		[arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
		friends = arr;
	}

	function getTagsStr(idx: number): string {
		return friends[idx]?.tags?.join(", ") || "";
	}

	function setTagsStr(idx: number, str: string) {
		const arr = [...friends];
		arr[idx] = { ...arr[idx], tags: str.split(",").map((s) => s.trim()).filter(Boolean) };
		friends = arr;
	}

	function updateFriend(idx: number, key: keyof Friend, val: unknown) {
		const arr = [...friends];
		arr[idx] = { ...arr[idx], [key]: val };
		friends = arr;
	}
</script>

<div class="friends-mgr">
	<div class="mgr-header">
		<h3>友情链接管理</h3>
		<div class="mgr-actions">
			<button class="btn-primary" onclick={addFriend}>+ 添加友链</button>
			<button class="btn-save" onclick={handleSave} disabled={saving}>
				{saving ? "保存中..." : "💾 保存全部"}
			</button>
		</div>
	</div>

	{#if loading}
		<p class="loading">加载中...</p>
	{:else if friends.length === 0}
		<p class="empty">暂无友链，点击「添加友链」开始</p>
	{:else}
		<div class="friend-list">
			{#each friends as friend, idx (friend.siteurl + friend.title)}
				<div class="friend-card">
					<div class="card-header">
						<span class="card-index">#{idx + 1}</span>
						<label class="toggle-enabled">
							<input type="checkbox" checked={friend.enabled} onchange={(e) => updateFriend(idx, "enabled", e.currentTarget.checked)} />
							显示
						</label>
						<div class="card-order">
							<button class="order-btn" onclick={() => moveUp(idx)} disabled={idx === 0}>↑</button>
							<button class="order-btn" onclick={() => moveDown(idx)} disabled={idx === friends.length - 1}>↓</button>
						</div>
						<button class="btn-del" onclick={() => removeFriend(idx)}>✕</button>
					</div>
					<div class="card-fields">
						<div class="field-row">
							<div class="field">
								<label>名称 *</label>
								<input type="text" value={friend.title} oninput={(e) => updateFriend(idx, "title", e.currentTarget.value)} placeholder="站点名称" />
							</div>
							<div class="field">
								<label>权重</label>
								<input type="number" value={friend.weight} oninput={(e) => updateFriend(idx, "weight", Number(e.currentTarget.value) || 0)} style="width:80px;" />
							</div>
						</div>
						<div class="field">
							<label>网站地址</label>
							<input type="url" value={friend.siteurl} oninput={(e) => updateFriend(idx, "siteurl", e.currentTarget.value)} placeholder="https://example.com" />
						</div>
						<div class="field">
							<label>头像地址</label>
							<input type="url" value={friend.imgurl} oninput={(e) => updateFriend(idx, "imgurl", e.currentTarget.value)} placeholder="头像图片 URL" />
						</div>
						<div class="field">
							<label>描述</label>
							<input type="text" value={friend.desc} oninput={(e) => updateFriend(idx, "desc", e.currentTarget.value)} placeholder="站点简介" />
						</div>
						<div class="field">
							<label>标签（逗号分隔）</label>
							<input type="text" value={getTagsStr(idx)} oninput={(e) => setTagsStr(idx, e.currentTarget.value)} placeholder="Blog, Tech, 生活" />
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="mgr-footer">
			<button class="btn-primary" onclick={addFriend}>+ 添加友链</button>
			<button class="btn-save" onclick={handleSave} disabled={saving}>
				{saving ? "保存中..." : "💾 保存全部"}
			</button>
		</div>
	{/if}
</div>

<style>
	.friends-mgr { max-width: 700px; }
	.mgr-header, .mgr-footer { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 8px; }
	.mgr-footer { margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb; }
	.mgr-header h3 { font-size: 16px; font-weight: 600; }
	.mgr-actions { display: flex; gap: 8px; }
	.btn-primary { padding: 7px 16px; background: #3b82f6; color: #fff; border: none; border-radius: 6px; font-size: 13px; cursor: pointer; }
	.btn-primary:hover { background: #2563eb; }
	.btn-save { padding: 7px 16px; background: #22c55e; color: #fff; border: none; border-radius: 6px; font-size: 13px; cursor: pointer; }
	.btn-save:hover { background: #16a34a; }
	.btn-save:disabled { opacity: 0.5; cursor: default; }
	.loading, .empty { color: #6b7280; padding: 20px; text-align: center; }

	.friend-list { display: flex; flex-direction: column; gap: 12px; }
	.friend-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px; }
	.card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
	.card-index { font-weight: 700; font-size: 13px; color: #6b7280; min-width: 28px; }
	.toggle-enabled { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #6b7280; cursor: pointer; }
	.toggle-enabled input { width: 14px; height: 14px; }
	.card-order { display: flex; gap: 2px; margin-left: auto; }
	.order-btn { padding: 2px 8px; border: 1px solid #d1d5db; border-radius: 4px; background: #fff; cursor: pointer; font-size: 13px; }
	.order-btn:hover { background: #f1f5f9; }
	.order-btn:disabled { opacity: 0.3; cursor: default; }
	.btn-del { padding: 2px 8px; border: 1px solid #fca5a5; border-radius: 4px; background: #fff; color: #ef4444; cursor: pointer; font-size: 13px; }
	.btn-del:hover { background: #fef2f2; }

	.card-fields { display: flex; flex-direction: column; gap: 8px; }
	.field-row { display: flex; gap: 10px; flex-wrap: wrap; }
	.field { flex: 1; min-width: 150px; }
	.field label { display: block; font-size: 12px; font-weight: 500; margin-bottom: 3px; color: #6b7280; }
	.field input { width: 100%; padding: 6px 10px; border: 1px solid #d1d5db; border-radius: 5px; font-size: 13px; outline: none; }
	.field input:focus { border-color: #3b82f6; }
</style>
