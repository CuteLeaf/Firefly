/// <reference lib="webworker" />
/**
 * 樱花特效 Worker
 *
 * 在 Dedicated Worker 线程内运行樱花绘制循环,通过 OffscreenCanvas 绘制,
 * 完全脱离主线程,避免页面切换(Swup)时主线程阻塞导致樱花掉帧。
 *
 * 通信协议见 src/types/sakura-worker.ts
 */
import type { SakuraConfig } from "@/types/effectsConfig";
import type { SakuraWorkerInboundMessage } from "@/types/sakura-worker";

// ---------------------------------------------------------------------------
// 模块状态
// ---------------------------------------------------------------------------
let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let sakuraList: SakuraList | null = null;
let animationId: number | null = null;
let img: ImageBitmap | null = null;
let config: SakuraConfig | null = null;
let windowWidth = 0;
let windowHeight = 0;
let isRunning = false;
let isHidden = false; // 页面可见性,隐藏时暂停动画

// ---------------------------------------------------------------------------
// 工具:getRandom(逻辑与原 SakuraEffect.astro 完全一致)
// ---------------------------------------------------------------------------
function getRandom(
	option: "x" | "y" | "s" | "r" | "a",
	cfg: SakuraConfig,
): number;
function getRandom(
	option: "fnx" | "fny",
	cfg: SakuraConfig,
): (x: number, y: number) => number;
function getRandom(option: "fnr", cfg: SakuraConfig): (r: number) => number;
function getRandom(option: "fna", cfg: SakuraConfig): (a: number) => number;
function getRandom(option: string, cfg: SakuraConfig): unknown {
	switch (option) {
		case "x":
			return Math.random() * windowWidth;
		case "y":
			return Math.random() * windowHeight;
		case "s":
			return cfg.size.min + Math.random() * (cfg.size.max - cfg.size.min);
		case "r":
			return Math.random() * 6;
		case "a":
			return (
				cfg.opacity.min + Math.random() * (cfg.opacity.max - cfg.opacity.min)
			);
		case "fnx": {
			const random =
				cfg.speed.horizontal.min +
				Math.random() * (cfg.speed.horizontal.max - cfg.speed.horizontal.min);
			return (x: number, _y: number) => x + random;
		}
		case "fny": {
			const random =
				cfg.speed.vertical.min +
				Math.random() * (cfg.speed.vertical.max - cfg.speed.vertical.min);
			return (_x: number, y: number) => y + random;
		}
		case "fnr":
			return (r: number) => r + cfg.speed.rotation;
		case "fna":
			return (alpha: number) => alpha - cfg.speed.fadeSpeed * 0.01;
		default:
			return undefined;
	}
}

// ---------------------------------------------------------------------------
// Sakura 单片樱花
// ---------------------------------------------------------------------------
interface SakuraFns {
	x: (x: number, y: number) => number;
	y: (x: number, y: number) => number;
	r: (r: number) => number;
	a: (a: number) => number;
}

class Sakura {
	x: number;
	y: number;
	s: number;
	r: number;
	a: number;
	fn: SakuraFns;
	idx: number;
	img: ImageBitmap;
	limitArray: number[];
	config: SakuraConfig;

	constructor(
		x: number,
		y: number,
		s: number,
		r: number,
		a: number,
		fn: SakuraFns,
		idx: number,
		image: ImageBitmap,
		limitArray: number[],
		cfg: SakuraConfig,
	) {
		this.x = x;
		this.y = y;
		this.s = s;
		this.r = r;
		this.a = a;
		this.fn = fn;
		this.idx = idx;
		this.img = image;
		this.limitArray = limitArray;
		this.config = cfg;
	}

	draw(cxt: OffscreenCanvasRenderingContext2D) {
		cxt.save();
		cxt.translate(this.x, this.y);
		cxt.rotate(this.r);
		cxt.globalAlpha = this.a;
		cxt.drawImage(this.img, 0, 0, 40 * this.s, 40 * this.s);
		cxt.restore();
	}

	update() {
		this.x = this.fn.x(this.x, this.y);
		// 修复原实现笔误:第二参数应为 this.x(原 fuwari 写法)
		this.y = this.fn.y(this.x, this.y);
		this.r = this.fn.r(this.r);
		this.a = this.fn.a(this.a);
		// 越界则重新调整位置
		if (
			this.x > windowWidth ||
			this.x < 0 ||
			this.y > windowHeight ||
			this.y < 0 ||
			this.a <= 0
		) {
			if (this.limitArray[this.idx] === -1) {
				this.resetPosition();
			} else if (this.limitArray[this.idx] > 0) {
				this.resetPosition();
				this.limitArray[this.idx]--;
			}
		}
	}

	resetPosition() {
		if (Math.random() > 0.4) {
			this.x = getRandom("x", this.config);
			this.y = 0;
			this.s = getRandom("s", this.config);
			this.r = getRandom("r", this.config);
			this.a = getRandom("a", this.config);
		} else {
			this.x = windowWidth;
			this.y = getRandom("y", this.config);
			this.s = getRandom("s", this.config);
			this.r = getRandom("r", this.config);
			this.a = getRandom("a", this.config);
		}
	}
}

// ---------------------------------------------------------------------------
// SakuraList 樱花列表
// ---------------------------------------------------------------------------
class SakuraList {
	list: Sakura[] = [];

	push(sakura: Sakura) {
		this.list.push(sakura);
	}

	update() {
		for (let i = 0, len = this.list.length; i < len; i++) {
			this.list[i].update();
		}
	}

	draw(cxt: OffscreenCanvasRenderingContext2D) {
		for (let i = 0, len = this.list.length; i < len; i++) {
			this.list[i].draw(cxt);
		}
	}
}

// ---------------------------------------------------------------------------
// 核心逻辑
// ---------------------------------------------------------------------------
async function loadImage(): Promise<ImageBitmap> {
	const response = await fetch("/assets/images/effects/sakura.png");
	if (!response.ok) {
		throw new Error(
			`Failed to load sakura image: ${response.status} ${response.statusText}`,
		);
	}
	const blob = await response.blob();
	return createImageBitmap(blob);
}

function createSakuraList(cfg: SakuraConfig, image: ImageBitmap): SakuraList {
	// 用局部变量锁定 ctx,避免在循环中反复访问可空的模块级变量
	const context = ctx;
	if (!context) {
		throw new Error("Canvas 2D context not initialized");
	}
	const list = new SakuraList();
	const limitArray = new Array(cfg.sakuraNum).fill(cfg.limitTimes);

	for (let i = 0; i < cfg.sakuraNum; i++) {
		const sakura = new Sakura(
			getRandom("x", cfg),
			getRandom("y", cfg),
			getRandom("s", cfg),
			getRandom("r", cfg),
			getRandom("a", cfg),
			{
				x: getRandom("fnx", cfg),
				y: getRandom("fny", cfg),
				r: getRandom("fnr", cfg),
				a: getRandom("fna", cfg),
			},
			i,
			image,
			limitArray,
			cfg,
		);
		sakura.draw(context);
		list.push(sakura);
	}
	return list;
}

function startAnimation() {
	if (!ctx || !canvas || !sakuraList) return;

	const animate = () => {
		if (!ctx || !canvas || !sakuraList) return;
		try {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			sakuraList.update();
			sakuraList.draw(ctx);
			animationId = requestAnimationFrame(animate);
		} catch (err) {
			reportError("animate loop", err);
			cancelAnimation();
		}
	};

	animationId = requestAnimationFrame(animate);
}

function cancelAnimation() {
	if (animationId !== null) {
		cancelAnimationFrame(animationId);
		animationId = null;
	}
}

function clearCanvas() {
	if (ctx && canvas) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
}

/**
 * 清理 worker 持有的所有资源。
 *
 * 注意:主线程 stop() 会 worker.terminate(),本函数主要服务于:
 *  - init 失败时回滚已分配资源(避免残留状态干扰后续消息)
 *  - 收到 stop 消息时的显式清理(防御性,即使 terminate 抢先也不泄漏)
 * ImageBitmap 持有位图/GPU 资源,需显式 close() 释放,不能仅靠 GC。
 */
function cleanup() {
	cancelAnimation();
	clearCanvas();
	if (img) {
		try {
			img.close();
		} catch {
			// close 可能因重复调用或已释放而抛错,忽略
		}
		img = null;
	}
	sakuraList = null;
	ctx = null;
	canvas = null;
	config = null;
	isRunning = false;
}

// ---------------------------------------------------------------------------
// 错误上报:回传主线程
// ---------------------------------------------------------------------------
function reportError(scope: string, err: unknown) {
	const message =
		err instanceof Error
			? `${scope}: ${err.message}`
			: `${scope}: ${String(err)}`;
	const stack = err instanceof Error ? err.stack : undefined;
	self.postMessage({ type: "error", message, stack });
}

// ---------------------------------------------------------------------------
// 消息处理
// ---------------------------------------------------------------------------
async function handleMessage(msg: SakuraWorkerInboundMessage) {
	switch (msg.type) {
		case "init": {
			try {
				config = msg.config;
				canvas = msg.canvas;
				windowWidth = msg.width;
				windowHeight = msg.height;
				canvas.width = windowWidth;
				canvas.height = windowHeight;
				ctx = canvas.getContext("2d");

				img = await loadImage();
				sakuraList = createSakuraList(config, img);
				isRunning = true;
				// init 完成后自动启动动画(除非页面当前隐藏)
				if (!isHidden) {
					startAnimation();
				}
				self.postMessage({ type: "ready" });
			} catch (err) {
				reportError("init", err);
				// 清理已分配的资源(尤其是 ImageBitmap),避免失败后残留;
				// 主线程收到 error 后会调用 stop() terminate worker,但此处先自清理
				cleanup();
			}
			break;
		}
		case "start": {
			try {
				if (!isRunning || isHidden) return;
				startAnimation();
			} catch (err) {
				reportError("start", err);
			}
			break;
		}
		case "stop": {
			try {
				cleanup();
			} catch (err) {
				reportError("stop", err);
			}
			break;
		}
		case "resize": {
			try {
				windowWidth = msg.width;
				windowHeight = msg.height;
				if (canvas) {
					canvas.width = windowWidth;
					canvas.height = windowHeight;
				}
			} catch (err) {
				reportError("resize", err);
			}
			break;
		}
		case "visibilitychange": {
			try {
				isHidden = msg.hidden;
				if (isHidden) {
					cancelAnimation();
				} else if (isRunning && animationId === null) {
					startAnimation();
				}
			} catch (err) {
				reportError("visibilitychange", err);
			}
			break;
		}
		default: {
			// 未知消息类型,忽略
		}
	}
}

self.onmessage = (e: MessageEvent<SakuraWorkerInboundMessage>) => {
	try {
		void handleMessage(e.data);
	} catch (err) {
		reportError("onmessage", err);
	}
};

// 捕获未处理错误与消息反序列化错误,回传主线程
self.onerror = (
	message: Event | string,
	_source?: string,
	_lineno?: number,
	_colno?: number,
	error?: Error,
) => {
	self.postMessage({
		type: "error",
		message: String(message),
		stack: error?.stack,
	});
	return true; // 阻止默认行为,避免污染控制台
};

self.onmessageerror = (e: MessageEvent) => {
	self.postMessage({
		type: "messageError",
		message: `message deserialization error: ${String(e)}`,
	});
};
