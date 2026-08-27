import type { DisplaySettingsConfig } from "../types/displaySettingsConfig";
import { resolveDisplaySettingsConfig } from "../utils/display-settings-utils";

// 显示设置面板开关配置
// 集中管理设置面板中所有可切换项的开关
// 方便统一控制哪些设置项对用户可见
// 也方便进行调试预览效果

export const displaySettingsConfig: DisplaySettingsConfig =
	resolveDisplaySettingsConfig({
		// ── 总开关 (Master switch) ────────────────────────────

		// 视图设置面板总开关，关闭时下方所有设置项均不生效，前台将不显示设置面板
		// 开启后设置面板组件及其依赖（各设置项逻辑、图标等）会打进客户端产物，
		// 会导致构建体积变大、首屏多一份 JS 影响性能；关闭则完全不渲染面板，体积更小，
		// 壁纸模式切换开关，这一项是构建体积的大头
		// 壁纸模式切换开关设为 false 则不显示壁纸模式切换开关，始终使用 backgroundWallpaper 配置的默认壁纸模式
		// 壁纸模式切换开关设为 true 时，为了能在运行时切换，构建期必须把各壁纸模式所需的整套内容，导致构建体积大幅增加，大概+33 KB/页，首屏加载时间变长，性能下降

		// 除了改这里，也可以在部署平台（Vercel / Cloudflare 等）配置环境变量开启，
		// 无需改动本文件：PUBLIC_DISPLAY_SETTINGS=true
		// 环境变量优先级更高，未设置或取值无法识别时使用这里的值
		// 生产环境建议默认关闭，只在开发调试环境开启用来预览效果
		enable: false,

		// ── 外观 (Appearance) ──────────────────────────────────

		// 主题色选择器开关
		themeColorSwitchable: true,

		// 文章列表布局切换开关
		layoutSwitchable: true,

		// 卡片边框和阴影开关
		cardBorderSwitchable: true,

		// 卡片风格跟随主题色开关
		cardFollowThemeSwitchable: true,

		// ── 壁纸 (Wallpaper) ──────────────────────────────────

		// 壁纸模式切换开关
		wallpaperModeSwitchable: true,

		// 水波纹动画开关
		wavesSwitchable: true,

		// 渐变过渡效果开关
		gradientSwitchable: true,

		// 横幅标题显示开关
		bannerTitleSwitchable: true,

		// 壁纸轮播开关
		bannerCarouselSwitchable: true,

		// 全屏壁纸/透明覆盖模式参数调节开关
		// 设为 false 关闭所有滑块，或用对象形式单独控制每个滑块
		overlaySwitchable: {
			opacity: true,
			blur: true,
			cardOpacity: true,
		},

		// ── 特效 (Effects) ────────────────────────────────────

		// 樱花特效开关
		sakuraSwitchable: true,
	});
