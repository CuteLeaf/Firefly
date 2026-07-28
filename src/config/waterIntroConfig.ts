import type { WaterIntroConfig } from "@/types/waterIntroConfig";

/**
 * 首页水幕开场动画配置。
 *
 * `playOncePerSession` 为 true 时，同一浏览器会话只播放一次；
 * 关闭浏览器后 sessionStorage 会自动清除，下次会话将重新播放。
 */
export const waterIntroConfig: WaterIntroConfig = {
	enable: true,
	playOncePerSession: true,
	sessionStorageKey: "firefly:water-intro:played",
	startDelayMs: 500,
	durationMs: 3200,
	zIndex: 100000,
	waterColor: "#469ce5",
	skipButtonLabel: "跳过",
};
