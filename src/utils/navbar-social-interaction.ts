export type Rect = {
	top: number;
	right: number;
	bottom: number;
	left: number;
	width: number;
	height: number;
};

export type Size = {
	width: number;
	height: number;
};

export type QrPopoverPlacement = {
	placement: "top" | "bottom";
	top: number;
	left: number;
};

export type DelayedLinkOptions = {
	copyText: string;
	href: string;
	openDelayMs: number;
};

export type DelayedLinkNotification =
	| { kind: "success"; copyText: string; openDelayMs: number; secondsRemaining: number }
	| { kind: "failure"; copyText: string }
	| { kind: "complete"; copyText: string; openDelayMs: number };

export type DelayedLinkDependencies = {
	copy: (text: string) => Promise<boolean>;
	notify: (notification: DelayedLinkNotification) => void;
	open: (href: string) => void;
	setTimeout: (callback: () => void, delay: number) => number;
	clearTimeout: (id: number) => void;
	setInterval: (callback: () => void, delay: number) => number;
	clearInterval: (id: number) => void;
};

export type DelayedLinkController = {
	activate: (options: DelayedLinkOptions) => Promise<void>;
	cancel: () => void;
};

export function calculateQrPopoverPosition(
	trigger: Rect,
	popover: Size,
	viewport: Size,
	gap = 8,
	margin = 12,
): QrPopoverPlacement {
	const spaceBelow = viewport.height - trigger.bottom;
	const spaceAbove = trigger.top;
	const placement =
		spaceBelow < popover.height + gap && spaceAbove > spaceBelow
			? "top"
			: "bottom";
	const top =
		placement === "top"
			? trigger.top - popover.height - gap
			: trigger.bottom + gap;
	const centeredLeft = trigger.left + (trigger.width - popover.width) / 2;
	const maxLeft = Math.max(margin, viewport.width - popover.width - margin);
	const left = Math.min(Math.max(centeredLeft, margin), maxLeft);

	return { placement, top, left };
}

export async function copyWithFallback(
	primary: (() => Promise<void>) | undefined,
	fallback: () => boolean,
): Promise<boolean> {
	if (primary) {
		try {
			await primary();
			return true;
		} catch {
			// Continue with legacy clipboard fallback.
		}
	}

	try {
		return fallback();
	} catch {
		return false;
	}
}

export function createDelayedLinkController(
	dependencies: DelayedLinkDependencies,
): DelayedLinkController {
	let timeoutId: number | undefined;
	let intervalId: number | undefined;
	let activationId = 0;

	function clearTimers(): void {
		if (timeoutId !== undefined) {
			dependencies.clearTimeout(timeoutId);
			timeoutId = undefined;
		}
		if (intervalId !== undefined) {
			dependencies.clearInterval(intervalId);
			intervalId = undefined;
		}
	}

	function cancel(): void {
		activationId += 1;
		clearTimers();
	}

	async function activate(options: DelayedLinkOptions): Promise<void> {
		activationId += 1;
		const currentActivation = activationId;
		clearTimers();

		const copied = await dependencies.copy(options.copyText);
		if (currentActivation !== activationId) return;

		if (!copied) {
			dependencies.notify({ kind: "failure", copyText: options.copyText });
			return;
		}

		if (options.openDelayMs <= 0) {
			dependencies.notify({
				kind: "complete",
				copyText: options.copyText,
				openDelayMs: 0,
			});
			dependencies.open(options.href);
			return;
		}

		let secondsRemaining = Math.max(1, Math.ceil(options.openDelayMs / 1000));
		dependencies.notify({
			kind: "success",
			copyText: options.copyText,
			openDelayMs: options.openDelayMs,
			secondsRemaining,
		});

		intervalId = dependencies.setInterval(() => {
			if (secondsRemaining <= 0) return;
			secondsRemaining -= 1;
			if (secondsRemaining > 0) {
				dependencies.notify({
					kind: "success",
					copyText: options.copyText,
					openDelayMs: options.openDelayMs,
					secondsRemaining,
				});
			}
		}, 1000);

		timeoutId = dependencies.setTimeout(() => {
			clearTimers();
			dependencies.notify({
				kind: "complete",
				copyText: options.copyText,
				openDelayMs: options.openDelayMs,
			});
			dependencies.open(options.href);
		}, options.openDelayMs);
	}

	return { activate, cancel };
}
