import type { DisplaySettingsConfig } from "@/types/displaySettingsConfig";

// 视图设置面板总开关的解析工具
// 把「环境变量覆盖」和「总开关关闭时强制关闭所有子项」的逻辑收敛在这里，
// 让 displaySettingsConfig.ts 保持纯配置，不掺杂判断代码

const TRUTHY_VALUES = ["true", "1", "on", "yes", "enable", "enabled"];
const FALSY_VALUES = ["false", "0", "off", "no", "disable", "disabled"];

// 解析布尔类型的环境变量，返回 undefined 表示未设置或取值无法识别
function parseBooleanEnv(raw: unknown): boolean | undefined {
	if (typeof raw !== "string") return undefined;
	const value = raw.trim().toLowerCase();
	if (TRUTHY_VALUES.includes(value)) return true;
	if (FALSY_VALUES.includes(value)) return false;
	return undefined;
}

// 总开关关闭时的配置：所有设置项强制关闭
// 导航栏入口与设置面板都不渲染，壁纸模式等运行时逻辑直接使用配置的默认值
const DISABLED_SETTINGS: DisplaySettingsConfig = {
	enable: false,
	themeColorSwitchable: false,
	layoutSwitchable: false,
	cardBorderSwitchable: false,
	cardFollowThemeSwitchable: false,
	wallpaperModeSwitchable: false,
	fullscreenLayoutSwitchable: false,
	wavesSwitchable: false,
	gradientSwitchable: false,
	bannerTitleSwitchable: false,
	bannerCarouselSwitchable: false,
	overlaySwitchable: false,
	sakuraSwitchable: false,
};

// 读取总开关环境变量
// 页面与浏览器端代码走 Vite/Astro，import.meta.env 会被静态替换成具体值；
// 构建脚本（scripts/*.ts 用 tsx 在 Node 里跑）没有 import.meta.env，回退读 process.env
function readEnableEnv(): unknown {
	try {
		return import.meta.env.PUBLIC_DISPLAY_SETTINGS;
	} catch {
		return typeof process === "undefined"
			? undefined
			: process.env.PUBLIC_DISPLAY_SETTINGS;
	}
}

// 应用总开关：环境变量 PUBLIC_DISPLAY_SETTINGS 优先于配置文件里的 enable
// 这样在部署平台（Vercel / Cloudflare 等）配置环境变量即可开启面板，无需修改配置文件
// 变量名必须带 PUBLIC_ 前缀，否则不会注入到浏览器端的设置面板代码中
export function resolveDisplaySettingsConfig(
	config: DisplaySettingsConfig,
): DisplaySettingsConfig {
	const enable = parseBooleanEnv(readEnableEnv()) ?? config.enable;
	return enable ? { ...config, enable: true } : DISABLED_SETTINGS;
}
