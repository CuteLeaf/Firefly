/**
 * 字体工具函数
 *
 * 提供字体配置相关的共享逻辑，用于 astro.config.mjs 和 scripts/subset-fonts.ts。
 */

import type { FontSelectionConfig } from "@/types/fontConfig";

/**
 * 从 fontConfig 中收集所有实际使用的字体 CSS 变量名。
 *
 * 包括：
 * - selected 中的非 "system" 值
 * - bannerTitleFont / bannerSubtitleFont / navbarTitleFont 区域覆盖
 * - codeFont 代码块字体
 *
 * @returns 去重后的 CSS 变量名集合（如 "--font-inter"）
 */
export function collectUsedFontCssVars(
	config: FontSelectionConfig,
): Set<string> {
	const used = new Set<string>();

	const sel = config.selected;
	if (Array.isArray(sel)) {
		for (const v of sel) {
			if (v !== "system") used.add(v);
		}
	} else if (sel !== "system") {
		used.add(sel);
	}

	if (config.bannerTitleFont) used.add(config.bannerTitleFont);
	if (config.bannerSubtitleFont) used.add(config.bannerSubtitleFont);
	if (config.navbarTitleFont) used.add(config.navbarTitleFont);
	if (config.codeFont) used.add(config.codeFont);

	return used;
}

/**
 * 将本地字体的 src 路径（如 "./public/assets/fonts/MyFont.woff2"）
 * 转换为 public 目录下的访问路径（如 "/assets/fonts/MyFont.woff2"）。
 *
 * 支持的输入格式：
 * - "./public/..."  → "/..."
 * - "public/..."    → "/..."
 * - "/public/..."   → "/..."
 * - "/..."          → "/"（已是绝对路径，直接返回）
 *
 * @throws {Error} 如果路径不是以 public/ 开头或已是绝对路径
 */
export function toPublicPath(rawSrc: string): string {
	// 已是绝对路径（非 public 前缀）
	if (rawSrc.startsWith("/") && !rawSrc.startsWith("/public/")) {
		return rawSrc;
	}

	// 匹配 public/ 前缀的各种写法
	const match = rawSrc.match(/^\.?\/?public\/(.+)$/);
	if (match) {
		return `/${match[1]}`;
	}

	throw new Error(
		`[fontHelper] Unexpected font src path format: "${rawSrc}". ` +
			`Expected a path starting with "public/" or an absolute path starting with "/".`,
	);
}
