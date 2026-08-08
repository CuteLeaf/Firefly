export function registerDynamicInlineComments(): void {
	if (customElements.get("dynamic-inline-comments")) return;

	class DynamicInlineComments extends HTMLElement {
		private frame?: HTMLIFrameElement;

		connectedCallback() {
			if (this.dataset.ready) return;
			this.querySelector("[data-comment-toggle]")?.addEventListener(
				"click",
				() => this.toggle(),
			);
			window.addEventListener("message", this.handleMessage);
			window.addEventListener("dynamic-theme-change", this.syncTheme);
			DynamicInlineComments.observeTheme();
			this.dataset.ready = "true";
		}

		disconnectedCallback() {
			window.removeEventListener("message", this.handleMessage);
			window.removeEventListener("dynamic-theme-change", this.syncTheme);
		}

		private static observeTheme() {
			if (document.documentElement.dataset.dynamicThemeObserver) return;
			new MutationObserver(() => {
				window.dispatchEvent(new Event("dynamic-theme-change"));
			}).observe(document.documentElement, {
				attributes: true,
				attributeFilter: ["class"],
			});
			document.documentElement.dataset.dynamicThemeObserver = "true";
		}

		private syncTheme = () => {
			this.frame?.contentWindow?.postMessage(
				{
					type: "dynamic-comment-theme",
					dark: document.documentElement.classList.contains("dark"),
				},
				window.location.origin,
			);
		};

		private handleMessage = (event: MessageEvent) => {
			if (
				event.origin !== window.location.origin ||
				event.source !== this.frame?.contentWindow ||
				event.data?.type !== "dynamic-comment-height"
			)
				return;
			if (this.frame) {
				this.frame.style.height = `${Math.max(240, Number(event.data.height))}px`;
			}
		};

		private toggle() {
			const panel = this.querySelector<HTMLElement>("[data-comment-panel]");
			if (!panel) return;
			const willOpen = panel.hidden;
			panel.hidden = !willOpen;
			this.dataset.expanded = String(willOpen);
			if (willOpen && !this.frame) this.load(panel);
		}

		private load(panel: HTMLElement) {
			const frame = document.createElement("iframe");
			frame.className = "dynamic-comment-frame";
			frame.src = this.dataset.src || "";
			frame.title =
				this.querySelector<HTMLElement>("[data-comment-toggle] span")
					?.textContent || "Comments";
			frame.loading = "lazy";
			frame.addEventListener("load", this.syncTheme);
			panel.append(frame);
			this.frame = frame;
		}
	}

	customElements.define("dynamic-inline-comments", DynamicInlineComments);
}
