import type { LicenseConfig } from "../types/licenseConfig";

export const licenseConfig: LicenseConfig = {
	// 是否启用文章顶部许可证信息显示
	enable: true,

	// 许可证名称及链接
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",

	// 可选：自定义许可证图标（iconify 图标名）
	// 留空时根据许可证名称自动匹配，匹配规则如下：
	//   CC BY / CC BY-SA / CC BY-NC / CC BY-NC-SA / CC BY-ND / CC BY-NC-ND 等 CC 系列
	//   → fa7-brands:creative-commons
	//   CC0 1.0
	//   → fa7-brands:creative-commons-zero
	//   Public Domain / 公共领域
	//   → fa7-brands:creative-commons-pd
	//   MIT / Apache / BSD / ISC / MPL / GPL / LGPL / AGPL / MulanPSL / Unlicense
	//   → fa7-brands:osi
	//   其余未匹配的许可证（如 All Rights Reserved、WTFPL 等）
	//   → fa7-regular:copyright
	icon: "",
};
