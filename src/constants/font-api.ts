import type { CssVariable } from "astro:assets";

/**
 * Font ID → Astro Font API CSS variable name mapping.
 *
 * Each entry here corresponds to a font configured with fontProviders in astro.config.mjs.
 * The `fonts` array in astro.config.mjs MUST reference these values via `fontApiCssVariables.*`.
 */
export const fontApiCssVariables: Record<string, CssVariable> = {
	inter: "--font-inter",
	"zen-maru-gothic": "--font-zen-maru-gothic",
	"jetbrains-mono": "--font-code",
};
