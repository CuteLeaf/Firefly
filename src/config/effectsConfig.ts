import type {
	AmbientParticleConfig,
	SakuraConfig,
} from "../types/effectsConfig";

// 特效配置 - 集中管理所有动画特效

export const sakuraConfig: SakuraConfig = {
	// 是否启用樱花特效
	enable: false,

	// 樱花数量
	sakuraNum: 21,

	// 樱花越界限制次数，-1为无限循环
	limitTimes: -1,

	// 樱花尺寸
	size: {
		// 樱花最小尺寸倍数
		min: 0.5,
		// 樱花最大尺寸倍数
		max: 1.1,
	},

	// 樱花不透明度
	opacity: {
		// 樱花最小不透明度
		min: 0.3,
		// 樱花最大不透明度
		max: 0.9,
	},

	// 樱花移动速度
	speed: {
		// 水平移动
		horizontal: {
			// 水平移动速度最小值
			min: -1.7,
			// 水平移动速度最大值
			max: -1.2,
		},
		// 垂直移动
		vertical: {
			// 垂直移动速度最小值
			min: 1.5,
			// 垂直移动速度最大值
			max: 2.2,
		},
		// 旋转速度
		rotation: 0.03,
		// 消失速度，不应大于最小不透明度
		fadeSpeed: 0.03,
	},

	// 层级，确保樱花在合适的层级显示
	zIndex: 100,
};

// 正文背景星尘：低密度、低亮度，不遮挡卡片与交互元素
export const ambientParticleConfig: AmbientParticleConfig = {
	enable: true,
	count: {
		desktop: 36,
		mobile: 14,
	},
	colors: {
		moonlight: "#8FAFC8",
		gold: "#C6AE78",
		goldRatio: 0.25,
	},
	size: {
		min: 0.7,
		max: 1.8,
	},
	opacity: {
		min: 0.16,
		max: 0.48,
	},
	speed: {
		min: 0.03,
		max: 0.12,
	},
	dprLimit: 1.75,
};
