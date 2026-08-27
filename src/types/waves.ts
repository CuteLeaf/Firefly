/**
 * 水波纹特效管理器接口契约
 *
 * WavesEffect.astro 中的主线程 Canvas 2D 管理器实现该接口,
 * 使初始化逻辑与具体实现解耦。
 */
export interface WavesManagerLike {
	isRunning: boolean;
	/** 挂载在 #header-waves 内的 canvas(供 Swup 切页后的防御性重校验使用) */
	canvas?: HTMLCanvasElement | null;
	init: () => Promise<void>;
	stop: () => void;
	getIsRunning: () => boolean;
}
