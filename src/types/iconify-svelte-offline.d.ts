declare module "@iconify/svelte/offline" {
	import type { IconifyJSON } from "@iconify/types";
	import type { Component } from "svelte";

	interface IconProps {
		icon: string;
		class?: string;
		style?: string;
		width?: string | number;
		height?: string | number;
	}

	const Icon: Component<IconProps>;
	export default Icon;
	export function addCollection(data: IconifyJSON): void;
	export function addIcon(
		name: string,
		data: { body: string; width?: number; height?: number },
	): void;
}
