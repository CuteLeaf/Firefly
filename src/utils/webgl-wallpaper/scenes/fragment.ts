import type { WebGLWallpaperScene, WebGLWallpaperSceneContext } from "../types";

const VERTEX_SOURCE = `#version 300 es
layout(location=0) in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

/** Load a site-owned GLSL file without changing the wallpaper host or bundle. */
export default async function createFragmentScene({
	canvas,
	options,
	signal,
	onFirstFrame,
}: WebGLWallpaperSceneContext): Promise<WebGLWallpaperScene> {
	const url = options.url;
	if (typeof url !== "string" || !url) {
		throw new Error("WebGL fragment wallpaper requires options.url");
	}
	const response = await fetch(url, { signal });
	if (!response.ok)
		throw new Error(`Could not load shader: ${response.status}`);
	const fragmentSource = await response.text();
	if (fragmentSource.length > 100_000)
		throw new Error("Shader source is too large");
	if (signal.aborted)
		throw new DOMException("Wallpaper load cancelled", "AbortError");
	const speed =
		typeof options.speed === "number" && Number.isFinite(options.speed)
			? Math.max(0, Math.min(options.speed, 5))
			: 1;
	const renderScale =
		typeof options.resolution === "number" &&
		Number.isFinite(options.resolution)
			? Math.max(0.25, Math.min(options.resolution, 1))
			: 1;
	const gl = canvas.getContext("webgl2", { alpha: false, antialias: false });
	if (!gl) throw new Error("WebGL 2 is unavailable");

	let program: WebGLProgram | null = null;
	let buffer: WebGLBuffer | null = null;
	let animationFrame = 0;
	let lastTime = 0;
	let elapsed = 0;
	let disposed = false;
	let firstFrame = true;
	const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

	function compile(type: number, source: string): WebGLShader {
		const shader = gl!.createShader(type);
		if (!shader) throw new Error("Could not allocate WebGL shader");
		gl!.shaderSource(shader, source);
		gl!.compileShader(shader);
		if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
			const message =
				gl!.getShaderInfoLog(shader) ?? "Shader compilation failed";
			gl!.deleteShader(shader);
			throw new Error(message);
		}
		return shader;
	}

	function releaseGraphics(): void {
		cancelAnimationFrame(animationFrame);
		animationFrame = 0;
		if (program) gl!.deleteProgram(program);
		if (buffer) gl!.deleteBuffer(buffer);
		program = null;
		buffer = null;
	}

	function initializeGraphics(): void {
		const vertex = compile(gl!.VERTEX_SHADER, VERTEX_SOURCE);
		let fragment: WebGLShader | null = null;
		try {
			fragment = compile(gl!.FRAGMENT_SHADER, fragmentSource);
			program = gl!.createProgram();
			if (!program) throw new Error("Could not allocate WebGL program");
			gl!.attachShader(program, vertex);
			gl!.attachShader(program, fragment);
			gl!.linkProgram(program);
			if (!gl!.getProgramParameter(program, gl!.LINK_STATUS)) {
				throw new Error(gl!.getProgramInfoLog(program) ?? "Shader link failed");
			}
			buffer = gl!.createBuffer();
			if (!buffer) throw new Error("Could not allocate WebGL buffer");
			gl!.bindBuffer(gl!.ARRAY_BUFFER, buffer);
			gl!.bufferData(
				gl!.ARRAY_BUFFER,
				new Float32Array([-1, -1, 3, -1, -1, 3]),
				gl!.STATIC_DRAW,
			);
			gl!.enableVertexAttribArray(0);
			gl!.vertexAttribPointer(0, 2, gl!.FLOAT, false, 0, 0);
		} finally {
			gl!.deleteShader(vertex);
			if (fragment) gl!.deleteShader(fragment);
		}
	}

	function requestFrame(): void {
		if (!disposed && !animationFrame && !document.hidden && program) {
			animationFrame = requestAnimationFrame(draw);
		}
	}

	function draw(now: number): void {
		animationFrame = 0;
		if (!program || disposed) return;
		const rect = canvas.getBoundingClientRect();
		const dpr = Math.min(devicePixelRatio || 1, 1.5) * renderScale;
		const width = Math.max(1, Math.round(rect.width * dpr));
		const height = Math.max(1, Math.round(rect.height * dpr));
		if (canvas.width !== width || canvas.height !== height) {
			canvas.width = width;
			canvas.height = height;
		}
		const delta = Math.min((now - (lastTime || now)) / 1000, 0.05);
		lastTime = now;
		if (!reducedMotion.matches) elapsed += delta * speed;
		gl!.viewport(0, 0, width, height);
		gl!.useProgram(program);
		gl!.uniform3f(
			gl!.getUniformLocation(program, "iResolution"),
			width,
			height,
			1,
		);
		gl!.uniform1f(gl!.getUniformLocation(program, "iTime"), elapsed);
		gl!.drawArrays(gl!.TRIANGLES, 0, 3);
		if (firstFrame) {
			firstFrame = false;
			onFirstFrame();
		}
		if (speed > 0 && !reducedMotion.matches) requestFrame();
	}

	const resize = new ResizeObserver(requestFrame);
	const onVisibility = () => {
		lastTime = 0;
		requestFrame();
	};
	const onContextLost = (event: Event) => {
		event.preventDefault();
		releaseGraphics();
		canvas.closest("#wallpaper-wrapper")?.classList.remove("webgl-ready");
	};
	const onContextRestored = () => {
		try {
			initializeGraphics();
			firstFrame = true;
			requestFrame();
		} catch (error) {
			console.warn("WebGL wallpaper context could not be restored", error);
		}
	};
	const dispose = () => {
		if (disposed) return;
		disposed = true;
		resize.disconnect();
		document.removeEventListener("visibilitychange", onVisibility);
		reducedMotion.removeEventListener("change", requestFrame);
		canvas.removeEventListener("webglcontextlost", onContextLost);
		canvas.removeEventListener("webglcontextrestored", onContextRestored);
		signal.removeEventListener("abort", dispose);
		releaseGraphics();
	};
	try {
		initializeGraphics();
		resize.observe(canvas);
		document.addEventListener("visibilitychange", onVisibility);
		reducedMotion.addEventListener("change", requestFrame);
		canvas.addEventListener("webglcontextlost", onContextLost);
		canvas.addEventListener("webglcontextrestored", onContextRestored);
		signal.addEventListener("abort", dispose, { once: true });
		requestFrame();
		return { dispose };
	} catch (error) {
		dispose();
		throw error;
	}
}
