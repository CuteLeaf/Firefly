import type { SakuraConfig } from "../types/config";

// 特效配置 - 集中管理所有动画特效

export const sakuraConfig: SakuraConfig = {
	enable: false,
	switchable: true,
	sakuraNum: 21,
	limitTimes: -1,
	size: {
		min: 0.5,
		max: 1.1,
	},
	opacity: {
		min: 0.3,
		max: 0.9,
	},
	speed: {
		horizontal: {
			min: -1.7,
			max: -1.2,
		},
		vertical: {
			min: 1.5,
			max: 2.2,
		},
		rotation: 0.03,
		// fadeSpeed 不应大于 opacity.min，否则樱花可能会立即消失
		fadeSpeed: 0.03,
	},
	zIndex: 100,
};
