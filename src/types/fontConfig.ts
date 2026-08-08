/** 内置字体提供商名称 */
export type BuiltinFontProvider =
	| "google"
	| "fontsource"
	| "local"
	| "bunny"
	| "fontshare"
	| "npm";

/**
 * 自定义字体提供商接口
 *
 * 当内置提供商无法满足需求时，可通过实现此接口来创建自定义 provider。
 * @see https://docs.astro.build/en/reference/font-provider-reference/
 */
export interface CustomFontProvider {
	/** 提供商标识名称 */
	name: string;
	/** 可序列化的配置对象，用于标识和缓存 */
	config?: Record<string, unknown>;
}

/**
 * 字体定义（Astro Font API 配置项）
 *
 * 适用于 Astro Font API 的字体配置，支持自动下载、缓存和优化加载。
 * 支持的 provider：google, fontsource, local, bunny, fontshare, npm 或自定义 provider
 */
export type FontDefinition = {
	/** 字体名称 */
	name: string;
	/** 对应的 CSS 变量名（如 "--font-inter"） */
	cssVariable: string;
	/** 字体提供商（内置名称或自定义 provider 对象） */
	provider: BuiltinFontProvider | CustomFontProvider;
	/** 字重列表 */
	weights?: Array<string | number>;
	/** 字体样式 */
	styles?: Array<"normal" | "italic" | "oblique">;
	/** 字符子集 */
	subsets?: string[];
	/** 回退字体列表 */
	fallbacks?: string[];
	/** 字体显示策略 */
	display?: "auto" | "optional" | "fallback" | "block" | "swap";
	/** 本地字体的额外选项（如 variants 定义） */
	options?: {
		variants?: Array<{
			src: string[];
			weight?: string | number;
			style?: string;
		}>;
		[key: string]: unknown;
	};
};

export type FontSelectionConfig = {
	/** 是否启用自定义字体功能 */
	enable: boolean;
	/**
	 * 当前选择的字体 CSS 变量名，支持多个字体组合。
	 * 填写 fontConfig.ts fonts 中定义的 cssVariable 值。
	 * 使用 "system" 表示系统字体（不加载任何自定义字体）。
	 */
	selected: string | string[];
	/** 各区域独立字体 CSS 变量名（留空则使用全局 selected 字体） */
	bannerTitleFont?: string;
	bannerSubtitleFont?: string;
	navbarTitleFont?: string;
	/** 代码块字体 CSS 变量名（用于代码高亮和等宽字体场景） */
	codeFont?: string;
	/**
	 * 本地字体子集化配置（构建时由 scripts/subset-fonts.ts 处理）
	 * key 为 fonts 数组中对应的 cssVariable，value 为子集化选项。
	 * 仅对 fontProviders.local() 的字体有效。
	 */
	subsetFonts?: Record<
		string,
		{
			/** 额外包含的字符（覆盖评论、Bangumi 等动态内容） */
			extraChars?: string;
		}
	>;
};
