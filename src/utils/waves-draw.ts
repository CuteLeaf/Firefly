/**
 * 水波纹共享绘制逻辑
 *
 * 由 WavesEffect.astro 的主线程 Canvas 2D 管理器使用。
 * 所有常量逐字取自原有 SVG/CSS 实现(src/layouts/MainGridLayout.astro 的
 * gentle-wave 路径、src/styles/waves.css 的动画参数),以保证视觉完全一致。
 *
 * 关键结论:CSS 对 SVG `<use>` 的 translate3d(-90px) 中 px 按 viewBox 用户单位
 * 解释(非屏幕像素),因此下面的 offset 也是 viewBox 单位。
 */

// ---------------------------------------------------------------------------
// 常量(与原实现一一对应)
// ---------------------------------------------------------------------------

/** 原 SVG 的 viewBox 范围 */
export const VIEWBOX = { x: 0, y: 24, w: 150, h: 28 } as const;

/** gentle-wave 路径(Path2D 支持 SVG path 语法) */
export const WAVE_PATH_D =
	"M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v48h-352z";

/** 路径局部 x 最小值(path 起点 x = -160) */
export const WAVE_PATH_X_MIN: number = -160;
/** 路径局部 x 最大值(path 终点 v48h-352z 回到 -160,最大 x = 192) */
export const WAVE_PATH_X_MAX: number = 192;
/** `<use x="48">` 后波浪在全局(viewBox)坐标下的 x 范围 */
export const WAVE_X_MIN: number = WAVE_PATH_X_MIN + 48; // -112
export const WAVE_X_MAX: number = WAVE_PATH_X_MAX + 48; // 240
/** 条带宽度 = 波浪跨度(352 个 viewBox 单位) */
export const WAVE_STRIP_W: number = WAVE_X_MAX - WAVE_X_MIN;

/** 波浪层参数(透明度、垂直偏移、动画时长/延迟,与原 CSS 一致) */
export interface WavesLayer {
	/** `<use y>` 的 viewBox 垂直偏移 */
	y: number;
	/** 对应原 CSS 的 opacity-25/50/65/75 */
	alpha: number;
	/** animation-duration */
	duration: number;
	/**
	 * animation-delay:负数表示从循环中途开始。
	 * 取值使四层起始相位均匀铺开(0 / 0.25 / 0.5 / 0.75),首帧即呈交错排列。
	 * 时长取接近值(8/9/10/11s)以放慢相位漂移,让交错尽量保持更久;
	 * (差速视差与永久交错本质矛盾,接近时长是两者的折中)
	 */
	delay: number;
}

export const WAVE_LAYERS: readonly WavesLayer[] = [
	{ y: 0, alpha: 0.25, duration: 8, delay: 0 },
	{ y: 3, alpha: 0.5, duration: 9, delay: -2.25 },
	{ y: 5, alpha: 0.65, duration: 10, delay: -5 },
	{ y: 7, alpha: 0.75, duration: 11, delay: -8.25 },
];

/** @keyframes wave 的位移范围(viewBox 用户单位) */
export const TRANSLATE_FROM: number = -90;
export const TRANSLATE_TO: number = 85;
/** 动画缓动曲线,与原 CSS cubic-bezier(0.5, 0.5, 0.45, 0.5) 一致 */
export const EASE = [0.5, 0.5, 0.45, 0.5] as const;

// ---------------------------------------------------------------------------
// cubic-bezier 缓动采样
// ---------------------------------------------------------------------------

function sampleBezierX(u: number, x1: number, x2: number): number {
	return 3 * (1 - u) * (1 - u) * u * x1 + 3 * (1 - u) * u * u * x2 + u * u * u;
}

function sampleBezierY(u: number, y1: number, y2: number): number {
	return 3 * (1 - u) * (1 - u) * u * y1 + 3 * (1 - u) * u * u * y2 + u * u * u;
}

function sampleBezierDX(u: number, x1: number, x2: number): number {
	return (
		3 * (1 - u) * (1 - u) * x1 +
		6 * (1 - u) * u * (x2 - x1) +
		3 * u * u * (1 - x2)
	);
}

/** 解三次贝塞尔:给定 x=t 求 y(牛顿迭代 + 二分兜底) */
export function cubicBezier(
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	t: number,
): number {
	const clamped = Math.min(1, Math.max(0, t));

	// 牛顿迭代解 u 使 X(u) = clamped
	let u = clamped;
	for (let i = 0; i < 6; i++) {
		const x = sampleBezierX(u, x1, x2) - clamped;
		const dx = sampleBezierDX(u, x1, x2);
		if (Math.abs(x) < 1e-5 || Math.abs(dx) < 1e-6) break;
		u -= x / dx;
		u = Math.min(1, Math.max(0, u));
	}

	// 牛顿不收敛时二分兜底
	if (Math.abs(sampleBezierX(u, x1, x2) - clamped) > 1e-3) {
		let lo = 0;
		let hi = 1;
		for (let i = 0; i < 20; i++) {
			const mid = (lo + hi) / 2;
			if (sampleBezierX(mid, x1, x2) < clamped) {
				lo = mid;
			} else {
				hi = mid;
			}
		}
		u = (lo + hi) / 2;
	}

	return sampleBezierY(u, y1, y2);
}

/** 当前波浪动画的缓动函数 */
export function ease(t: number): number {
	return cubicBezier(...EASE, t);
}

// ---------------------------------------------------------------------------
// 波浪路径
// ---------------------------------------------------------------------------

let wavePath: Path2D | null | undefined;
function getWavePath(): Path2D | null {
	if (wavePath === undefined) {
		try {
			wavePath = new Path2D(WAVE_PATH_D);
		} catch {
			wavePath = null;
		}
	}
	return wavePath;
}

// ---------------------------------------------------------------------------
// WavesRenderer:预渲染条带 + 逐帧 blit
// ---------------------------------------------------------------------------

function createCanvas(w: number, h: number): HTMLCanvasElement {
	const c = document.createElement("canvas");
	c.width = w;
	c.height = h;
	return c;
}

/**
 * 把各波浪层预渲染成条带(颜色与透明度烘焙进条带),
 * 逐帧只需 drawImage 平移,避免每帧重新描边/填充路径。
 * 条带自身高度天然裁剪波身,对应原 SVG viewBox 在 y=52 处裁剪。
 */
export class WavesRenderer {
	private readonly ctx: CanvasRenderingContext2D;
	private strips: HTMLCanvasElement[] = [];
	private cssWidth: number;
	private cssHeight: number;
	private dpr: number;
	private fillColor: string;
	/** 每 CSS 像素对应的 viewBox 单位数(viewBox 非等比拉伸) */
	private sx = 1;
	private sy = 1;

	constructor(
		ctx: CanvasRenderingContext2D,
		cssWidth: number,
		cssHeight: number,
		dpr: number,
		fillColor: string,
	) {
		this.ctx = ctx;
		this.cssWidth = cssWidth;
		this.cssHeight = cssHeight;
		this.dpr = dpr;
		this.fillColor = fillColor;
		this.updateScale();
		this.buildStrips();
	}

	private updateScale(): void {
		this.sx = (this.cssWidth * this.dpr) / VIEWBOX.w;
		this.sy = (this.cssHeight * this.dpr) / VIEWBOX.h;
	}

	/** 尺寸/dpr 变化时更新比例并重建条带 */
	setSize(cssWidth: number, cssHeight: number, dpr: number): void {
		this.cssWidth = cssWidth;
		this.cssHeight = cssHeight;
		this.dpr = dpr;
		this.updateScale();
		this.buildStrips();
	}

	/** 主题色变化时仅重建条带(颜色烘焙进条带) */
	setFillColor(fillColor: string): void {
		this.fillColor = fillColor;
		this.buildStrips();
	}

	private buildStrips(): void {
		const w = Math.max(1, Math.ceil(WAVE_STRIP_W * this.sx));
		const h = Math.max(1, Math.ceil(this.cssHeight * this.dpr));
		const path = getWavePath();

		this.strips = WAVE_LAYERS.map((layer) => {
			const strip = createCanvas(w, h);
			const c = strip.getContext("2d");
			if (!c || !path) return strip;
			// 条带坐标:strip px x = (viewBox x + 160) * sx,strip px y = (viewBox y - 24) * sy
			c.setTransform(
				this.sx,
				0,
				0,
				this.sy,
				-WAVE_PATH_X_MIN * this.sx,
				(layer.y - VIEWBOX.y) * this.sy,
			);
			c.fillStyle = this.fillColor;
			c.globalAlpha = layer.alpha;
			c.fill(path);
			return strip;
		});
	}

	/**
	 * 绘制一帧。
	 * @param now performance.now() 时刻
	 * @param startTime 动画起点时刻
	 */
	draw(now: number, startTime: number): void {
		const w = Math.max(1, Math.ceil(this.cssWidth * this.dpr));
		const h = Math.max(1, Math.ceil(this.cssHeight * this.dpr));
		this.ctx.clearRect(0, 0, w, h);

		for (let i = 0; i < WAVE_LAYERS.length; i++) {
			const strip = this.strips[i];
			if (!strip) continue;
			const layer = WAVE_LAYERS[i];
			// t = τ - delay(与 CSS animation-delay 语义一致:负延迟 = 已播放 |delay| 秒)。
			// 四层起始相位均匀铺开(0/0.25/0.5/0.75),首帧即交错,与静态占位 SVG 逐像素一致。
			const t = (now - startTime) / 1000 - layer.delay;
			// 负时间也正确归一到 [0,1):phase = t/duration - floor(t/duration)
			const phase = t / layer.duration - Math.floor(t / layer.duration);
			const offset =
				TRANSLATE_FROM + (TRANSLATE_TO - TRANSLATE_FROM) * ease(phase);
			this.ctx.drawImage(strip, (offset + WAVE_X_MIN) * this.sx, 0);
		}
	}
}
