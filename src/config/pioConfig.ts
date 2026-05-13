import type { Live2DModelConfig, SpineModelConfig } from "../types/config";

export const spineModelConfig: SpineModelConfig = {
	enable: false,
	model: {
		path: "/pio/models/spine/firefly/1310.json",
		scale: 1.0,
		x: 0,
		y: 0,
	},
	position: {
		corner: "bottom-left",
		offsetX: 0,
		offsetY: 0,
	},
	size: {
		width: 135,
		height: 165,
	},
	interactive: {
		enabled: true,
		clickAnimations: [
			"emoji_0",
			"emoji_1",
			"emoji_2",
			"emoji_3",
			"emoji_4",
			"emoji_5",
		],
		clickMessages: [
			"你好呀！我是流萤~",
			"今天也要加油哦！✨",
			"想要一起去看星空吗？🌟",
			"记得要好好休息呢~",
			"有什么想对我说的吗？💫",
			"让我们一起探索未知的世界吧！🚀",
			"每一颗星星都有自己的故事~⭐",
			"希望能带给你温暖和快乐！💖",
		],
		messageDisplayTime: 3000,
		idleAnimations: ["idle", "emoji_0", "emoji_1", "emoji_3", "emoji_4"],
		idleInterval: 8000,
	},
	responsive: {
		hideOnMobile: true,
		mobileBreakpoint: 768,
	},
	zIndex: 1000,
	opacity: 1.0,
};

export const live2dModelConfig: Live2DModelConfig = {
	enable: false,
	model: {
		path: "/pio/models/live2d/snow_miku/model.json",
	},
	position: {
		corner: "bottom-left",
		offsetX: 0,
		offsetY: 0,
	},
	size: {
		width: 135,
		height: 165,
	},
	interactive: {
		enabled: true,
		clickMessages: [
			"你好！我是Miku~",
			"有什么需要帮助的吗？",
			"今天天气真不错呢！",
			"要不要一起玩游戏？",
			"记得按时休息哦！",
		],
		messageDisplayTime: 3000,
	},
	responsive: {
		hideOnMobile: true,
		mobileBreakpoint: 768,
	},
};
