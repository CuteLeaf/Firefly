import { backgroundWallpaper } from "@/config";
import type { WebGLWallpaperScene, WebGLWallpaperSceneModule } from "./types";

// Build-time registry: adding scenes/<name>.ts makes it selectable by config.webgl.scene.
const sceneLoaders = import.meta.glob<WebGLWallpaperSceneModule>(
	"./scenes/*.ts",
);
let initialized = false;
let generation = 0;
let activeHost: HTMLElement | null = null;
let activeCanvas: HTMLCanvasElement | null = null;
let activeScene: WebGLWallpaperScene | null = null;
let activeLoad: AbortController | null = null;

function clearScene(): void {
	generation += 1;
	activeLoad?.abort();
	activeLoad = null;
	activeScene?.dispose();
	activeScene = null;
	activeCanvas?.remove();
	activeCanvas = null;
	activeHost?.closest("#wallpaper-wrapper")?.classList.remove("webgl-ready");
	activeHost = null;
}

function syncWebglWallpaper(force = false): void {
	const mode = document.documentElement.getAttribute("data-wallpaper-mode");
	const host = document.getElementById("webgl-wallpaper-host");
	if (mode !== "webgl" || !host) {
		clearScene();
		return;
	}
	if (!force && activeHost === host && activeCanvas) return;
	clearScene();
	activeHost = host;
	const canvas = document.createElement("canvas");
	canvas.setAttribute("aria-hidden", "true");
	host.append(canvas);
	activeCanvas = canvas;
	const currentGeneration = generation;
	const loadController = new AbortController();
	activeLoad = loadController;
	const sceneName = backgroundWallpaper.webgl?.scene ?? "cloud-train";
	const loadScene = sceneLoaders[`./scenes/${sceneName}.ts`];
	if (!loadScene) {
		console.warn(`Unknown WebGL wallpaper scene: ${sceneName}`);
		clearScene();
		return;
	}

	// Loading is lazy and bounded by generation so a late import cannot revive an old page.
	void loadScene()
		.then((module) =>
			module.default({
				canvas,
				options: backgroundWallpaper.webgl?.options ?? {},
				signal: loadController.signal,
				onFirstFrame: () => {
					if (generation === currentGeneration && activeCanvas === canvas) {
						host.closest("#wallpaper-wrapper")?.classList.add("webgl-ready");
					}
				},
			}),
		)
		.then((scene) => {
			if (generation !== currentGeneration || activeCanvas !== canvas) {
				scene.dispose();
				return;
			}
			activeScene = scene;
		})
		.catch((error: unknown) => {
			if (generation !== currentGeneration) return;
			console.warn(
				"WebGL wallpaper unavailable; keeping the image fallback.",
				error,
			);
			clearScene();
		});
}

/** Register once; Swup page replacements and runtime mode changes share one host. */
export function initWebglWallpaper(): void {
	if (initialized) return;
	initialized = true;
	window.addEventListener("wallpaperModeChange", () => syncWebglWallpaper());
	document.addEventListener("astro:page-load", () => syncWebglWallpaper());
	document.addEventListener("swup:contentReplaced", () => syncWebglWallpaper());
	window.addEventListener("pagehide", clearScene);
	syncWebglWallpaper();
}
