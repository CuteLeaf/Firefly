<script lang="ts">
	let { message, type, onClose }: {
		message: string;
		type: "success" | "error" | "info";
		onClose: () => void;
	} = $props();

	let visible = $state(false);

	$effect(() => {
		if (message) {
			visible = true;
			const timer = setTimeout(() => {
				visible = false;
				setTimeout(onClose, 300);
			}, 3000);
			return () => clearTimeout(timer);
		}
	});
</script>

{#if message}
	<div class="toast" class:visible class:success={type === "success"} class:error={type === "error"} class:info={type === "info"}>
		<span class="toast-icon">
			{#if type === "success"}✓{:else if type === "error"}✕{:else}ℹ{/if}
		</span>
		<span class="toast-message">{message}</span>
		<button class="toast-close" onclick={onClose}>✕</button>
	</div>
{/if}

<style>
	.toast {
		position: fixed;
		top: 20px;
		right: 20px;
		padding: 12px 20px;
		border-radius: 8px;
		font-size: 14px;
		display: flex;
		align-items: center;
		gap: 10px;
		z-index: 9999;
		box-shadow: 0 4px 12px rgba(0,0,0,0.15);
		opacity: 0;
		transform: translateY(-10px);
		transition: all 0.3s;
		max-width: 400px;
	}

	.toast.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.success {
		background: #dcfce7;
		color: #166534;
		border: 1px solid #bbf7d0;
	}

	.error {
		background: #fef2f2;
		color: #991b1b;
		border: 1px solid #fecaca;
	}

	.info {
		background: #eff6ff;
		color: #1e40af;
		border: 1px solid #bfdbfe;
	}

	.toast-icon {
		font-weight: bold;
		font-size: 16px;
	}

	.toast-message {
		flex: 1;
	}

	.toast-close {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 14px;
		opacity: 0.6;
		padding: 2px;
	}

	.toast-close:hover {
		opacity: 1;
	}
</style>
