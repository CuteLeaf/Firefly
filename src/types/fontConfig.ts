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
