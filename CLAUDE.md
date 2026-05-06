# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Purpose | Command |
|---|---|
| Dev server (localhost:4321) | `pnpm dev` |
| Build to `./dist/` | `pnpm build` (runs icons → astro build → pagefind) |
| Preview built site | `pnpm preview` |
| Type-check | `pnpm check` (astro check) or `pnpm type-check` (tsc --noEmit) |
| Format code | `pnpm format` (biome format --write ./src) |
| Lint + fix | `pnpm lint` (biome check --write ./src) |
| New blog post | `pnpm new-post <filename>` |
| Regenerate icons | `pnpm icons` |
| Any astro CLI | `pnpm astro ...` |

Use pnpm only (enforced by `preinstall` script). Node.js ≥ 22, pnpm ≥ 9 required.

## Architecture

**Stack**: Astro 6.x (SSG), Svelte 5, Tailwind CSS 4, TypeScript. Biome for formatting/linting. Swup for page transitions. Pagefind for client-side search.

### Content

Blog posts live in `src/content/posts/` as `.md`/`.mdx` files, loaded via Astro content collections (`src/content.config.ts`). Frontmatter schema: `title`, `published`, `draft`, `tags`, `category`, `pinned`, `comment`, `password`, etc. The `spec` collection in `src/content/spec/` is for special page content (about, friends, guestbook).

### Layout system

- `src/layouts/Layout.astro` — base layout: `<html>`, `<head>`, global styles, analytics, favicons, wallpaper setup, Swup containers.
- `src/layouts/MainGridLayout.astro` — extends Layout, adds the sidebar grid system with Navbar, SideBar, and responsive layout. This is what most pages use.

### Sidebar widget system

Configured entirely in `src/config/sidebarConfig.ts`. Supports `left` / `right` / `both` positions. Each sidebar has an ordered list of widget components (`profile`, `announcement`, `music`, `categories`, `tags`, `stats`, `calendar`, `sidebarToc`, `advertisement`). Each widget can be independently toggled and configured to show/hide on post pages vs non-post pages. There's also a separate `mobileBottomComponents` list for mobile (<768px).

Key widgets: `src/components/widget/` (sidebars), `src/components/layout/SideBar.astro` (renders them).

### Component organization

- `src/components/layout/` — structural: Navbar, Footer, SideBar, PostCard, PostPage, CategoryBar, DropdownMenu
- `src/components/widget/` — sidebar widgets: Profile, Announcement, Music, Calendar, Categories, Tags, SiteStats, Advertisement
- `src/components/features/` — optional features: Live2DWidget, SpineModel, MusicPlayer, SakuraEffect, EncryptedPost, TypewriterText
- `src/components/controls/` — interactive UI: Search, FloatingTOC, LightDarkSwitch, DisplaySettings, WallpaperSwitch, BackToTop
- `src/components/common/` — reusable: Pagination, CoverImage, WidgetLayout, FloatingButton, Icon
- `src/components/misc/` — License, RecommendedPost, SharePoster
- `src/components/analytics/` — GoogleAnalytics, UmamiAnalytics, MicrosoftClarity, La51Analytics
- `src/components/comment/` — comment system integrations

### Configuration

All config lives in `src/config/`. Import from `@/config` (the barrel `index.ts` re-exports everything). The main file is `siteConfig.ts` — it controls language (`SITE_LANG` at top), theme color, wallpaper mode, page switches, post list layout (list/grid/masonry), pagination, analytics, image optimization, fonts, etc.

After changing `rehypeCallouts.theme` or `plantumlConfig`, restart the dev server.

### Markdown plugin pipeline

Defined in `astro.config.mjs`. **Remark plugins** (parse phase, in order): remarkMath, remarkReadingTime, remarkImageGrid, remarkExcerpt, remarkDirective, remarkSectionize, parseDirectiveNode, remarkMermaid, remarkPlantuml. **Rehype plugins** (HTML transform phase): rehypeKatex, rehypeCallouts, rehypeSlug, rehypeMermaid, rehypePlantuml, rehypeFigure, rehypeExternalLinks, rehypeEmailProtection, rehypeComponents (for `::github` directive), rehypeAutolinkHeadings.

Custom plugins are in `src/plugins/`. Many handle directive parsing (`remark-directive-rehype.js` converts `::directive` nodes).

### i18n

Translation keys defined in `src/i18n/i18nKey.ts` (a const enum). Languages in `src/i18n/languages/` (zh_CN, zh_TW, en, ja, ru). Use `i18n(key)` from `src/i18n/translation.ts` — it reads `siteConfig.lang` and falls back to zh_CN then en.

### Styling

- Tailwind CSS v4 with `@tailwindcss/vite` plugin
- Global styles in `src/styles/main.css`, Stylus variables in `src/styles/variables.styl`
- PostCSS pipeline (`postcss.config.mjs`): postcss-import → postcss-nesting
- Theme color is set via CSS custom properties generated from `siteConfig.themeColor.hue` in `Layout.astro`

### Path aliases (tsconfig.json)

`@components/*` → `src/components/*`, `@assets/*` → `src/assets/*`, `@constants/*` → `src/constants/*`, `@utils/*` → `src/utils/*`, `@i18n/*` → `src/i18n/*`, `@layouts/*` → `src/layouts/*`, `@/*` → `src/*`

### Key utilities

- `src/utils/setting-utils.ts` — large (~29KB), manages display settings (theme, wallpaper, layout mode) persisted to localStorage
- `src/utils/toc-utils.ts` — table of contents generation (~11KB)
- `src/utils/responsive-utils.ts` — sidebar grid classes, responsive breakpoints
- `src/utils/content-utils.ts` — post sorting, filtering, pagination
- `src/utils/sakura-manager.ts` — cherry blossom animation lifecycle

### Swup (page transitions)

Swup is enabled with specific containers (`#swup-container`, `#left-sidebar-dynamic`, `#right-sidebar-dynamic`, `#floating-toc-wrapper`, etc.). It skips popstate handling for hash-anchor links. `animateHistoryBrowsing: false` — direct navigation from history won't animate.

### Build notes

- `pnpm build` runs three steps: icon generation script → `astro build` → `pagefind --site dist`
- Vite build drops `console` and `debugger` in production (esbuild `drop` option)
- Image optimization only works on images in `src/` — Astro cannot optimize images in `public/`
- `generateOgImages: true` is slow; kept off by default
