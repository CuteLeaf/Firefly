import type { CssVariable } from "astro:assets";

/**
 * Font ID → Astro Font API CSS variable name mapping.
 *
 * Each entry here MUST have a corresponding `fonts` entry in astro.config.mjs
 * using `fontApiCssVariables.<key>` as the `cssVariable` value.
 * Both files reference this map, so renaming a key here will cause a build error there.
 *
 * Adding a new entry requires updating BOTH this file AND astro.config.mjs.
 */
export const fontApiCssVariables = {
	inter: "--font-inter" as CssVariable,
	"zen-maru-gothic": "--font-zen-maru-gothic" as CssVariable,
	"jetbrains-mono": "--font-code" as CssVariable,
} as const;
