/** A scene owns its WebGL context, animation loop, resize handling, and GPU cleanup. */
export interface WebGLWallpaperScene {
	dispose(): void;
}

export interface WebGLWallpaperSceneContext {
	canvas: HTMLCanvasElement;
	options: Record<string, unknown>;
	signal: AbortSignal;
	// Call only after a successful frame so the fallback image stays visible on failure.
	onFirstFrame(): void;
}

export interface WebGLWallpaperSceneModule {
	default: (
		context: WebGLWallpaperSceneContext,
	) => WebGLWallpaperScene | Promise<WebGLWallpaperScene>;
}
