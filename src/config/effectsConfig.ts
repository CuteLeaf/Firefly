import type {
	AmbientParticleConfig,
	SakuraConfig,
} from "../types/effectsConfig";

// 特效配置 - 集中管理所有动画特效

export const sakuraConfig: SakuraConfig = {
	// 是否启用樱花特效
	enable: true,

	// 樱花数量
	sakuraNum: 21,

	// 樱花越界限制次数，-1为无限循环
	limitTimes: -1,

	// 樱花尺寸
	size: {
		// 樱花最小尺寸倍数
		min: 0.5,
		// 樱花最大尺寸倍数
		max: 0.8,
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

// 正文背景星尘：密集小星点、轻微闪烁与偶发细长流星
export const ambientParticleConfig: AmbientParticleConfig = {
	enable: true,
	count: {
		desktop: 220,
		mobile: 72,
	},
	colors: {
		moonlight: "#59b2f7",
		gold: "#f4ca5f",
		goldRatio: 0.18,
	},
	size: {
		min: 1,
		max: 3,
	},
	opacity: {
		min: 0.5,
		max: 0.78,
	},
	speed: {
		min: 0.1,
		max: 0.3,
	},
	glow: {
		radius: 0.5,
		opacity: 0.5,
	},
	meteors: {
		enable: true,
		mobileEnable: true,
		// 同屏流星数量上限：这里控制桌面端和手机端最多显示多少条
		maxActive: {
			desktop: 2,
			mobile: 1,
		},
		// 每轮生成数量：提高 max 会让流星雨更加密集
		burst: {
			min: 1,
			max: 4,
		},
		// 生成间隔（毫秒）：数值越小，流星越多
		interval: {
			min: 4500,
			max: 9000,
		},
		duration: {
			min: 1100,
			max: 1750,
		},
		// 流星尾巴长度（像素）：这里控制视觉大小
		length: {
			min: 120,
			max: 230,
		},
		opacity: 0.48,
	},
	dprLimit: 1.75,
};
