<script lang="ts">
import { onMount } from "svelte";

interface Props {
	value: number;
	formatted?: boolean;
	suffix?: string;
	duration?: number;
	class?: string;
}

let {
	value,
	formatted = false,
	suffix = "",
	duration = 2000,
	class: className = "",
}: Props = $props();

let displayValue = $state(0);
let elementRef: HTMLSpanElement;
let hasAnimated = $state(false);

function formatNumber(num: number): string {
	if (formatted) {
		return num.toLocaleString();
	}
	return Math.round(num).toString();
}

function animateNumber(targetValue: number) {
	if (hasAnimated) return;
	hasAnimated = true;

	const startTime = performance.now();
	const startValue = 0;

	function update(currentTime: number) {
		const elapsed = currentTime - startTime;
		const progress = Math.min(elapsed / duration, 1);

		// Easing function (ease-out cubic)
		const eased = 1 - (1 - progress) ** 3;

		displayValue = Math.round(startValue + (targetValue - startValue) * eased);

		if (progress < 1) {
			requestAnimationFrame(update);
		}
	}

	requestAnimationFrame(update);
}

onMount(() => {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					animateNumber(value);
					observer.disconnect();
				}
			});
		},
		{ threshold: 0.1 },
	);

	if (elementRef) {
		observer.observe(elementRef);
	}

	return () => {
		observer.disconnect();
	};
});
</script>

<span
  bind:this={elementRef}
  class="inline-block tabular-nums tracking-wider {className}"
>
  {formatNumber(displayValue)}{suffix}
</span>
