import { setMaxListeners } from "node:events";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import swup from "@swup/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import katex from "katex";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeComponents from "rehype-components";
import rehypeKatex from "rehype-katex";
import "katex/dist/contrib/mhchem.mjs";
import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import { pluginCollapsible } from "expressive-code-collapsible";
import { pluginLanguageBadge } from "expressive-code-language-badge";
import rehypeCallouts from "rehype-callouts";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import remarkSectionize from "remark-sectionize";
import { expressiveCodeConfig, plantumlConfig, siteConfig } from "./src/config";
import I18nKey from "./src/i18n/i18nKey";
import { i18n } from "./src/i18n/translation";
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs";
import rehypeEmailProtection from "./src/plugins/rehype-email-protection.mjs";
import rehypeExternalLinks from "./src/plugins/rehype-external-links.mjs";
import rehypeFigure from "./src/plugins/rehype-figure.mjs";
import { rehypeMermaid } from "./src/plugins/rehype-mermaid.mjs";
import { rehypePlantuml } from "./src/plugins/rehype-plantuml.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { remarkExcerpt } from "./src/plugins/remark-excerpt.js";
import { remarkImageGrid } from "./src/plugins/remark-image-grid.js";
import { remarkMermaid } from "./src/plugins/remark-mermaid.js";
import { remarkPlantuml } from "./src/plugins/remark-plantuml.js";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";

if (process.env.NODE_ENV === "development") {
	setMaxListeners(20);
}

const adapter = process.env.CF_WORKERS
	? cloudflare({
			prerenderEnvironment: "node",
		})
	: undefined;

export default defineConfig({
	site: "https://www.zsso.net",
	base: "/",
	trailingSlash: "always",
	adapter,

	image: {
		layout: "constrained",
	},

	experimental: {
		rustCompiler: false,
		queuedRendering: { enabled: true },
	},

	integrations: [
		swup({
			theme: false,
			animationClass: "transition-swup-",
			containers: [
				"#banner-overlay-container",
				"#banner-dim-container",
				"#swup-container",
				"#left-sidebar-dynamic",
				"#right-sidebar-dynamic",
				"#floating-toc-wrapper",
			],
			smoothScrolling: false,
			cache: true,
			preload: true,
			accessibility: true,
			updateHead: true,
			updateBodyClass: false,
			globalInstance: true,
			resolveUrl: (url) => url,
			animateHistoryBrowsing: false,
			skipPopStateHandling: (event) => {
				return event.state?.url?.includes("#");
			},
		}),
		icon({
			include: {
				"material-symbols": ["*"],
				"fa7-brands": ["*"],
				"fa7-regular": ["*"],
				"fa7-solid": ["*"],
				"simple-icons": ["*"],
				mdi: ["*"],
				mingcute: ["*"],
			},
		}),
		expressiveCode({
			themes: [expressiveCodeConfig.darkTheme, expressiveCodeConfig.lightTheme],
			useDarkModeMediaQuery: false,
			themeCssSelector: (theme) => `[data-theme='${theme.name}']`,
			plugins: [
				...(expressiveCodeConfig.pluginLanguageBadge?.enable === true
					? [pluginLanguageBadge()]
					: []),
				pluginCollapsibleSections(),
				pluginLineNumbers(),
				...(expressiveCodeConfig.pluginCollapsible?.enable === true
					? [
							pluginCollapsible({
								lineThreshold: expressiveCodeConfig.pluginCollapsible.lineThreshold || 15,
								previewLines: expressiveCodeConfig.pluginCollapsible.previewLines || 8,
								defaultCollapsed: expressiveCodeConfig.pluginCollapsible.defaultCollapsed ?? true,
								expandButtonText: i18n(I18nKey.codeCollapsibleShowMore),
								collapseButtonText: i18n(I18nKey.codeCollapsibleShowLess),
								expandedAnnouncement: i18n(I18nKey.codeCollapsibleExpanded),
								collapsedAnnouncement: i18n(I18nKey.codeCollapsibleCollapsed),
							}),
						]
					: []),
			],
			defaultProps: {
				wrap: false,
				overridesByLang: {
					shellsession: { showLineNumbers: false },
				},
			},
			styleOverrides: {
				borderRadius: "0.75rem",
				codeFontSize: "0.875rem",
				codeFontFamily: "'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
				codeLineHeight: "1.5rem",
				textMarkers: { delHue: 0, insHue: 180, markHue: 250 },
				languageBadge: {
					fontSize: "0.75rem",
					fontWeight: "bold",
					borderRadius: "0.25rem",
					opacity: "1",
					borderWidth: "0px",
				},
			},
			frames: { showCopyToClipboardButton: true },
		}),
		svelte(),
		sitemap({
			filter: (page) => {
				const url = new URL(page);
				const p = url.pathname;
				if (p === "/friends/" && !siteConfig.pages.friends) return false;
				if (p === "/sponsor/" && !siteConfig.pages.sponsor) return false;
				if (p === "/guestbook/" && !siteConfig.pages.guestbook) return false;
				if (p === "/bangumi/" && !siteConfig.pages.bangumi) return false;
				if (p === "/gallery/" && !siteConfig.pages.gallery) return false;
				return true;
			},
		}),
		mdx(),
	],

	markdown: {},

	vite: {
		plugins: [tailwindcss()],
		server: { watch: { ignored: ["**/package/**", "**/Firefly-docs/**"] } },
		resolve: {
			alias: {
				"@rehype-callouts-theme": `rehype-callouts/theme/${siteConfig.rehypeCallouts.theme}`,
			},
		},
		build: {
			minify: "esbuild",
			esbuildOptions: { minify: true, drop: ["console", "debugger"] },
			rollupOptions: {
				onwarn(w, warn) {
					if (w.message.includes("dynamically imported by") && w.message.includes("statically imported")) return;
					warn(w);
				},
			},
			cssCodeSplit: true,
			cssMinify: "esbuild",
			assetsInlineLimit: 4096,
		},
	},
});
