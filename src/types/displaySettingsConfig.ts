// 显示设置面板开关配置类型

export type OverlaySwitchable =
	| boolean
	| {
			opacity?: boolean; // 壁纸透明度调节开关
			blur?: boolean; // 背景模糊度调节开关
			cardOpacity?: boolean; // 卡片透明度调节开关
	  };

export type DisplaySettingsConfig = {
	// ── 外观 (Appearance) ──────────────────────────────────

	// 主题色选择器开关
	themeColorSwitchable: boolean;

	// 文章列表布局切换开关
	layoutSwitchable: boolean;

	// 卡片边框和阴影开关
	cardBorderSwitchable: boolean;

	// 卡片风格跟随主题色开关
	cardFollowThemeSwitchable: boolean;

	// ── 壁纸 (Wallpaper) ──────────────────────────────────

	// 壁纸模式切换开关
	wallpaperModeSwitchable: boolean;

	// 水波纹动画开关
	wavesSwitchable: boolean;

	// 渐变过渡效果开关
	gradientSwitchable: boolean;

	// 横幅标题显示开关（需同时启用 homeText.enable）
	bannerTitleSwitchable: boolean;

	// 壁纸轮播开关
	bannerCarouselSwitchable: boolean;

	// 全屏透明模式参数调节开关
	// 设为 false 关闭所有滑块，或用对象形式单独控制每个滑块
	overlaySwitchable: OverlaySwitchable;

	// ── 特效 (Effects) ────────────────────────────────────

	// 樱花特效开关
	sakuraSwitchable: boolean;
};
