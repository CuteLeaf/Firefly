
<img src="./docs/images/1131.png" width = "350" height = "500" alt="Firefly" align=right />

<div align="center">

# Firefly
> A Fresh and Beautiful Astro Static Blog Theme Template
> 
> ![Node.js >= 22](https://img.shields.io/badge/node.js-%3E%3D22-brightgreen) 
![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue)
![Astro](https://img.shields.io/badge/Astro-6.3.1-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)
>
> [![Stars](https://img.shields.io/github/stars/CuteLeaf/Firefly?style=social)](https://github.com/CuteLeaf/Firefly/stargazers)
[![Forks](https://img.shields.io/github/forks/CuteLeaf/Firefly?style=social)](https://github.com/CuteLeaf/Firefly/network/members)
[![Issues](https://img.shields.io/github/issues/CuteLeaf/Firefly)](https://github.com/CuteLeaf/Firefly/issues)
> 
> [![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Z8Z41NQALY)
>
> **QQ交流群：[1087127207](https://qm.qq.com/q/ZGsFa8qX2G)**
> 
> ![GitHub License](https://img.shields.io/github/license/CuteLeaf/Firefly)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/CuteLeaf/Firefly)
[![Afdian Sponsor](https://img.shields.io/badge/Afdian-Sponsor%20Author-ff69b4.svg)](https://ifdian.net/a/cuteleaf)
</div>


---
📖 README:
**[简体中文](README.md)** | **[繁體中文](docs/README.zh-TW.md)** | **[English](README.en.md)** | **[日本語](docs/README.ja.md)** | **[Русский](docs/README.ru.md)** 

🚀 Quick Guide:
[**🖥️Live Demo**](https://firefly.cuteleaf.cn/) /
[**📝Documentation**](https://docs-firefly.cuteleaf.cn/) /
[**🍀My Blog**](https://blog.cuteleaf.cn)

⚡ Static Site Generation: Ultra-fast loading speed and SEO optimization based on Astro

🎨 Modern Design: Clean and beautiful interface with customizable theme colors

📱 Mobile-Friendly: Perfect responsive experience with mobile-specific optimizations

🔧 Highly Configurable: Most features can be customized through configuration files

<img alt="firefly" src="./docs/images/1.webp" />
<img alt="Lighthouse" src="./docs/images/Lighthouse.png" />

>[!TIP]
>
>Firefly is a fresh, beautiful, and modern personal blog theme template based on the Astro framework and the Fuwari template, designed for tech enthusiasts and content creators. It integrates a modern web tech stack, offering rich feature modules and a highly customizable interface so you can easily build a professional and visually appealing personal blog.
>
>In terms of key layouts, Firefly innovatively adds dual sidebars, an article grid (multi-column) layout, and a masonry layout.
>
>It also adds widgets such as site statistics, calendar, table of contents, music player, and quick category navigation, making both the sidebar and the overall page layout richer.
>
>At the same time, it also adds components such as share posters, related post recommendations, and random posts, making article pages more content-rich.
>
>**If you reference or use the component designs and related code above from Firefly, please credit Firefly.**
>
>Firefly also preserves the original fuwari layout, which can be freely switched in the configuration file according to your preferences.
>
>**For more layout configurations and demos, please see: [Firefly Layout System Details](https://firefly.cuteleaf.cn/posts/firefly-layout-system/)**
>
>Firefly supports i18n multilingual UI, but except for Simplified Chinese, other languages are AI-translated. If you find any errors, feel free to submit a [Pull Request](https://github.com/CuteLeaf/Firefly/pulls) to help improve them.

## ✨ Features

### Core Features

- [x] **Astro + Tailwind CSS** - Ultra-fast static site generation based on modern tech stack
- [x] **Smooth Animations** - Swup page transition animations for silky smooth browsing experience
- [x] **Responsive Design** - Perfect adaptation for desktop, tablet and mobile devices
- [x] **Multi-language Support** - i18n internationalization ui, supports Simplified Chinese, Traditional Chinese, English, Japanese, Russian
- [x] **Full-text Search** - Client-side search based on Pagefind, supports article content indexing.

### Personalization
- [x] **Dynamic Sidebar** - Supports single sidebar, dual sidebar configuration
- [x] **Article Layout** - Supports list (single column) and grid (multi-column/masonry) layout
- [x] **Font Management** - Custom font support with rich font selector
- [x] **Footer Configuration** - HTML content injection, fully customizable
- [x] **Light/Dark Mode** - Supports light/dark/system three modes
- [x] **Navbar Customization** - Logo, title, links fully customizable
- [x] **Wallpaper Mode Switching** - Banner wallpaper, fullscreen wallpaper, fullscreen transparent wallpaper, solid background
- [x] **Theme Color Customization** - 360° hue adjustment


If you have useful features and optimizations, please submit a [Pull Request](https://github.com/CuteLeaf/Firefly/pulls)

## 🚀 Quick Start

### Requirements

- Node.js ≥ 22
- pnpm ≥ 9

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Cuteleaf/Firefly.git
   cd Firefly
   ```
   
   **First [Fork](https://github.com/CuteLeaf/Firefly/fork) to your own repository then clone (recommended). Don't forget to Star before Fork!**

   ```bash
   git clone https://github.com/you-github-name/Firefly.git
   cd Firefly
   ```
3. **Install dependencies:**
   ```bash
   # Install pnpm if not installed
   npm install -g pnpm
   
   # Install project dependencies
   pnpm install
   ```

4. **Configure blog:**
   - Edit configuration files in `src/config/` directory to customize blog settings

5. **Start development server:**
   ```bash
   pnpm dev
   ```
   Blog will be available at `http://localhost:4321`

### Platform Hosting Deployment
- **Refer to the [official guide](https://docs.astro.build/en/guides/deploy/) to deploy your blog to Vercel, Netlify, Cloudflare Pages, EdgeOne Pages, etc.**
- **Vercel**, **Netlify** and other major platforms auto-deploy, automatically selecting the appropriate adapter based on the environment.

   Framework Preset: `Astro`

   Root Directory: `./`

   Output Directory: `dist`

   Build Command: `pnpm run build`

   Install Command: `pnpm install`

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/CuteLeaf/Firefly&project-name=Firefly&repository-name=Firefly)
   [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/CuteLeaf/Firefly)

## 📖 Configuration

> 📚 **Detailed Configuration Documentation**: Check [Firefly Documentation](https://docs-firefly.cuteleaf.cn/) for complete configuration guide

### Setting Website Language

To set the default language for your blog, edit the `src/config/siteConfig.ts` file:

```typescript
// Define site language
const SITE_LANG = "zh_CN";
```

**Supported language codes:**
- `zh_CN` - Simplified Chinese
- `zh_TW` - Traditional Chinese
- `en` - English
- `ja` - Japanese
- `ru` - Russian

### Configuration File Structure

```
src/
├── config/
│   ├── index.ts              # Configuration index file
│   ├── siteConfig.ts         # Site basic configuration
│   ├── backgroundWallpaper.ts # Background wallpaper configuration
│   ├── profileConfig.ts      # User profile configuration
│   ├── commentConfig.ts      # Comment system configuration
│   ├── announcementConfig.ts # Announcement configuration
│   ├── licenseConfig.ts      # License configuration
│   ├── footerConfig.ts       # Footer configuration
│   ├── FooterConfig.html     # Footer HTML content
│   ├── expressiveCodeConfig.ts # Code highlighting configuration
│   ├── effectsConfig.ts      # Animation effects config (sakura, etc.)
│   ├── fontConfig.ts         # Font configuration
│   ├── sidebarConfig.ts      # Sidebar layout configuration
│   ├── navBarConfig.ts       # Navbar configuration
│   ├── musicConfig.ts        # Music player configuration
│   ├── pioConfig.ts          # Mascot configuration
│   ├── adConfig.ts           # Ad configuration
│   ├── friendsConfig.ts      # Friend links configuration
│   ├── galleryConfig.ts      # Gallery configuration
│   ├── sponsorConfig.ts      # Sponsor configuration
│   └── coverImageConfig.ts   # Article cover image configuration
```


## ⚙️ Article Frontmatter

```yaml
---
title: My First Blog Post
published: 2023-09-09
description: This is the first post of my new Astro blog.
image: ./cover.jpg  # Or use "api" to enable random cover images
tags: [Foo, Bar]
category: Front-end
draft: false
lang: zh-CN      # Only set when article language differs from site language in `siteConfig.ts`
pinned: false    # Pin article
comment: true    # Enable comments
---
```

## 📖 Markdown Extensions

In addition to the default [GitHub Flavored Markdown](https://github.github.com/gfm/) support in Astro, there are some additional Markdown features:

- Admonitions - Supports configuration for GitHub, Obsidian, and VitePress themes ([Preview and Usage](https://firefly.cuteleaf.cn/posts/markdown-extended/))
- GitHub Repository Cards ([Preview and Usage](https://firefly.cuteleaf.cn/posts/markdown-extended/))
- Enhanced Code Blocks based on Expressive Code ([Preview](http://firefly.cuteleaf.cn/posts/code-examples/) / [Documentation](https://expressive-code.com/))

## 🧞 Commands

All commands need to be executed in the project root directory:

| Command                    | Action                                              |
|:---------------------------|:----------------------------------------------------|
| `pnpm install`             | Install dependencies                                |
| `pnpm dev`                 | Start local development server at `localhost:4321`  |
| `pnpm build`               | Build site to `./dist/`                             |
| `pnpm preview`             | Preview built site locally                          |
| `pnpm check`               | Check for errors in code                            |
| `pnpm format`              | Format your code using Biome                        |
| `pnpm new-post <filename>` | Create new article                                  |
| `pnpm astro ...`           | Execute `astro add`, `astro check` and other commands |
| `pnpm astro --help`        | Display Astro CLI help                              |

## 🙏 Acknowledgments

Special thanks to [saicaca](https://github.com/saicaca) for developing the [fuwari](https://github.com/saicaca/fuwari) template, which Firefly is based on for secondary development.

The copyright of Firefly-related image assets belongs to [miHoYo](https://www.mihoyo.com/), the developer of the game ["Honkai: Star Rail"](https://sr.mihoyo.com/).

### Tech Stack

- [Astro](https://astro.build) 
- [Tailwind CSS](https://tailwindcss.com) 
- [Iconify](https://iconify.design)

### Inspiration Projects

- [fuwari](https://github.com/saicaca/fuwari)
- [hexo-theme-shoka](https://github.com/amehime/hexo-theme-shoka)
- [astro-koharu](https://github.com/cosZone/astro-koharu)
- [Mizuki](https://github.com/matsuzaka-yuki/Mizuki)

### Other References
- Blogger `霞葉` [Bangumi Collection](https://kasuha.com/posts/fuwari-enhance-ep2/) page component
- Bilibili creator `公公的日常` Q-version [Firefly Mascot Spine Model](https://www.bilibili.com/video/BV1fuVzzdE5y)

## 📝 License

This project is licensed under the [MIT license](https://mit-license.org/). See the [LICENSE](./LICENSE) file for details.

Originally forked from [saicaca/fuwari](https://github.com/saicaca/fuwari). Thanks to the original author for their contributions. 

**Copyright Notice:**
- Copyright (c) 2024 [saicaca](https://github.com/saicaca) - [fuwari](https://github.com/saicaca/fuwari)
- Copyright (c) 2025 [CuteLeaf](https://github.com/CuteLeaf) - [Firefly](https://github.com/CuteLeaf/Firefly)

Under the MIT license, you are free to use, modify, and distribute the code, but you must retain the above copyright notice.

## 🍀 Contributors

Thanks to the following contributors for their contributions to this project. If you have any questions or suggestions, please submit an [Issue](https://github.com/CuteLeaf/Firefly/issues) or [Pull Request](https://github.com/CuteLeaf/Firefly/pulls).

><a href="https://github.com/CuteLeaf/Firefly/graphs/contributors">
>  <img src="https://contrib.rocks/image?repo=CuteLeaf/Firefly" />
></a>

Thanks to the following contributors for their contributions to the original project [fuwari](https://github.com/saicaca/fuwari), which laid the foundation for this project.

><a href="https://github.com/saicaca/fuwari/graphs/contributors">
>  <img src="https://contrib.rocks/image?repo=saicaca/fuwari" />
></a>

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=CuteLeaf/Firefly&type=Date)](https://star-history.com/#CuteLeaf/Firefly&Date)


<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
