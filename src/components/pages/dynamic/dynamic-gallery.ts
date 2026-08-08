import * as FancyboxModule from "@fancyapps/ui";

type GalleryImage = {
	alt: string;
	element: HTMLImageElement;
	src: string;
};

export function registerDynamicGallery(): void {
	if (customElements.get("dynamic-gallery")) return;

	class DynamicGallery extends HTMLElement {
		private activeIndex = 0;
		private images: GalleryImage[] = [];

		connectedCallback() {
			if (this.dataset.ready) return;
			const source = this.dataset.sourceId
				? document.getElementById(this.dataset.sourceId)
				: null;
			if (!source) return;
			const elements = [...source.querySelectorAll<HTMLImageElement>("img")];
			if (elements.length === 0) return;
			this.images = elements.map((element) => ({
				alt: element.alt,
				element,
				src: element.currentSrc || element.src,
			}));
			this.buildGrid();
			this.buildThumbnails();
			this.bindControls();
			this.dataset.ready = "true";
			this.hidden = false;
			document.dispatchEvent(new CustomEvent("dynamic-gallery:ready"));
		}

		private buildGrid() {
			const grid = this.querySelector<HTMLElement>("[data-gallery-grid]");
			if (!grid) return;
			grid.dataset.count = String(Math.min(this.images.length, 6));
			grid.dataset.layout =
				this.images.length === 1
					? "single"
					: this.images.length <= 4
						? "two"
						: "three";
			this.images.slice(0, 6).forEach(({ element, alt }, index) => {
				const button = document.createElement("button");
				button.type = "button";
				button.className = "dynamic-gallery-grid-item";
				button.setAttribute(
					"aria-label",
					(this.dataset.viewImage || "View image {index}").replace(
						"{index}",
						String(index + 1),
					),
				);
				// 只有一张图时，点击直接打开大图查看
				if (this.images.length === 1) {
					button.addEventListener("click", () => this.openLightbox(0));
				} else {
					button.addEventListener("click", () => this.open(index));
				}
				const container =
					element.closest<HTMLElement>("center") ??
					element.closest<HTMLElement>("figure") ??
					element;
				element.alt = alt;
				button.append(element);
				if (index === 5 && this.images.length > 6) {
					const more = document.createElement("span");
					more.className = "dynamic-gallery-more";
					more.textContent = `+${this.images.length - 6}`;
					button.append(more);
				}
				grid.append(button);
				if (container !== element) container.remove();
			});
			for (const { element } of this.images.slice(6)) {
				(
					element.closest<HTMLElement>("center") ??
					element.closest<HTMLElement>("figure") ??
					element
				).remove();
			}
		}

		private buildThumbnails() {
			const thumbnails = this.querySelector<HTMLElement>(
				"[data-gallery-thumbnails]",
			);
			if (!thumbnails) return;
			this.images.forEach(({ element, alt }, index) => {
				const button = document.createElement("button");
				button.type = "button";
				button.className = "dynamic-gallery-thumbnail";
				button.dataset.index = String(index);
				button.setAttribute(
					"aria-label",
					(this.dataset.selectImage || "Select image {index}").replace(
						"{index}",
						String(index + 1),
					),
				);
				button.addEventListener("click", () => this.select(index));
				const thumbnail = element.cloneNode(true) as HTMLImageElement;
				thumbnail.alt = alt;
				thumbnail.removeAttribute("id");
				button.append(thumbnail);
				thumbnails.append(button);
			});
		}

		private bindControls() {
			this.querySelector("[data-gallery-collapse]")?.addEventListener(
				"click",
				() => this.collapse(),
			);
			this.querySelector("[data-gallery-prev]")?.addEventListener("click", () =>
				this.select(this.activeIndex - 1),
			);
			this.querySelector("[data-gallery-next]")?.addEventListener("click", () =>
				this.select(this.activeIndex + 1),
			);
			this.querySelector("[data-gallery-lightbox]")?.addEventListener(
				"click",
				(event) => {
					event.preventDefault();
					const Fancybox = FancyboxModule.Fancybox;
					Fancybox.show(
						this.images.map((image) => ({
							src: image.src,
							type: "image",
							caption: image.alt,
						})),
						{
							startIndex: this.activeIndex,
						},
					);
				},
			);
		}

		private open(index: number) {
			const grid = this.querySelector<HTMLElement>("[data-gallery-grid]");
			const viewer = this.querySelector<HTMLElement>("[data-gallery-viewer]");
			if (!grid || !viewer) return;
			grid.hidden = true;
			viewer.hidden = false;
			this.select(index);
		}

		private collapse() {
			const grid = this.querySelector<HTMLElement>("[data-gallery-grid]");
			const viewer = this.querySelector<HTMLElement>("[data-gallery-viewer]");
			if (!grid || !viewer) return;
			grid.hidden = false;
			viewer.hidden = true;
		}

		private openLightbox(index: number) {
			const Fancybox = FancyboxModule.Fancybox;
			Fancybox.show(
				this.images.map((image) => ({
					src: image.src,
					type: "image",
					caption: image.alt,
				})),
				{ startIndex: index },
			);
		}

		private select(index: number) {
			this.activeIndex = (index + this.images.length) % this.images.length;
			const image = this.images[this.activeIndex];
			const main = this.querySelector<HTMLImageElement>("[data-gallery-main]");
			if (!main) return;
			main.src = image.src;
			main.alt = image.alt;
			main.dataset.galleryIndex = String(this.activeIndex);
			const updateAspect = () => {
				if (main.naturalWidth === 0 || main.naturalHeight === 0) return;
				const stage = this.querySelector<HTMLElement>(".dynamic-gallery-stage");
				if (stage)
					stage.style.aspectRatio = `${main.naturalWidth} / ${main.naturalHeight}`;
			};
			if (main.complete && main.naturalWidth > 0) updateAspect();
			else main.addEventListener("load", updateAspect, { once: true });
			this.querySelector<HTMLElement>("[data-gallery-lightbox]")?.setAttribute(
				"data-src",
				image.src,
			);
			this.querySelectorAll<HTMLElement>(
				"[data-gallery-thumbnails] [data-index]",
			).forEach((thumbnail) => {
				thumbnail.dataset.active = String(
					Number(thumbnail.dataset.index) === this.activeIndex,
				);
			});
			this.querySelector<HTMLElement>(
				`[data-gallery-thumbnails] [data-index="${this.activeIndex}"]`,
			)?.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
				inline: "center",
			});
		}
	}

	customElements.define("dynamic-gallery", DynamicGallery);
}
