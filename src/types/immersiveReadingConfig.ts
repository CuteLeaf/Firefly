/**
 * 沉浸阅读（Immersive Reading）配置（挂在 siteConfig.post 下）
 */
export interface ImmersiveReadingConfig {
	/** 总开关，false 则不渲染按钮 */
	enable: boolean;
	/** 进入文章页是否默认开启沉浸阅读（默认 false） */
	defaultOn: boolean;
	/** 沉浸阅读中是否显示目录栏 */
	tocEnabled: boolean;
	/** 目录栏位置："left" | "right" */
	tocPosition: "left" | "right";
}
