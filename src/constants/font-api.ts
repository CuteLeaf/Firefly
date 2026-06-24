/**
 * Font ID → Astro Font API CSS variable name mapping.
 *
 * MUST stay in sync with the `fonts` array in astro.config.mjs.
 * Each entry here corresponds to a font configured with fontProviders in Astro config.
 */
export const fontApiCssVariables: Record<string, string> = {
	inter: "--font-inter",
	"zen-maru-gothic": "--font-zen-maru-gothic",
	"jetbrains-mono": "--font-code",
};
