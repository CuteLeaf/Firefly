
<img src="./images/1131.png" width = "350" height = "500" alt="Firefly" align=right />

<div align="center">

# Firefly
> 一款清新美觀的 Astro 靜態博客主題模板
> 
> ![Node.js >= 22](https://img.shields.io/badge/node.js-%3E%3D22-brightgreen) 
![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue)
![Astro](https://img.shields.io/badge/Astro-5.17.2-orange)
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
[![愛發電贊助](https://img.shields.io/badge/愛發電-贊助作者-ff69b4.svg)](https://afdian.com/a/cuteleaf)

</div>


---
📖 README：
**[简体中文](../README.zh.md)** | **[繁體中文](README.zh-TW.md)** | **[English](../README.md)** | **[日本語](README.ja.md)** | **[Русский](README.ru.md)**

🚀 快速指南：
[**🖥️線上預覽**](https://firefly.cuteleaf.cn/) /
[**📝使用文檔**](https://docs-firefly.cuteleaf.cn/) /
[**🍀我的部落格**](https://blog.cuteleaf.cn) 

⚡ 靜態站點生成: 基於Astro的超快載入速度和SEO優化

🎨 現代化設計: 簡潔美觀的介面，支援自訂主題色

📱 行動裝置友善: 完美的響應式體驗，行動端專項優化

🔧 高度可配置: 大部分功能模組均可透過配置檔案自訂

<img alt="firefly" src="./images/1.webp" />
<img alt="Lighthouse" src="./images/Lighthouse.png" />

>[!TIP]
>Firefly 是一款基於 Astro 框架和 Fuwari 模板開發的清新美觀且現代化個人部落格主題模板，專為技術愛好者和內容創作者設計。該主題融合了現代 Web 技術棧，提供了豐富的功能模組和高度可定制的界面，讓您能夠輕鬆打造出專業且美觀的個人部落格網站。
>
>在重要的版面配置上，Firefly 創新性地增加了左右雙側邊欄、文章網格(多列)版面配置、瀑布流配置，增加了站點統計、日曆元件、文章目錄等小元件，讓側邊欄更加豐富，同時也保留了原版 fuwari 的版面配置，可根據自己的喜好在配置檔案中自由切換。
>
>**更多版面配置及示範請查看：[Firefly 版面配置系統詳解](https://firefly.cuteleaf.cn/posts/firefly-layout-system/)**
>
>Firefly 支援 i18n 多語言切換，但除了簡體中文，其他語言均為 AI 翻譯轉換，如有錯誤，歡迎提交 [Pull Request](https://github.com/CuteLeaf/Firefly/pulls) 修正。

## ✨ 功能特性

### 核心功能

- [x] **Astro + Tailwind CSS** - 基於現代技術堆疊的超快靜態站點生成
- [x] **流暢動畫** - Swup 頁面過渡動畫，提供絲滑的瀏覽體驗
- [x] **響應式設計** - 完美適配桌面端、平板和行動裝置
- [x] **多語言支援** - i18n 國際化，支援簡體中文、繁體中文、英文、日文、俄語
- [x] **全文搜尋** - 基於 Pagefind 的客戶端搜尋，支援文章內容索引。

### 個性化
- [x] **動態側邊欄** - 支援配置單側邊欄、雙側邊欄
- [x] **文章版面配置** - 支援配置(單列)列表、網格(多列/瀑布流)版面配置
- [x] **字型管理** - 支援自訂字型，豐富的字型選擇器
- [x] **頁尾配置** - HTML 內容注入，完全自訂
- [x] **亮暗色模式** - 支援亮色/暗色/跟隨系統三種模式
- [x] **導覽列自訂** - Logo、標題、連結全面自訂
- [x] **桌布模式切換** - 橫幅桌布、全螢幕桌布、純色背景
- [x] **主題色自訂** - 360° 色相調節


如果你有好用的功能和優化，請提交 [Pull Request](https://github.com/CuteLeaf/Firefly/pulls)

## 🚀 快速開始

### 環境要求

- Node.js ≤ 22
- pnpm ≤ 9

### 本地開發部署

1. **克隆儲存庫：**
   ```bash
   git clone https://github.com/Cuteleaf/Firefly.git
   cd Firefly
   ```
   
   **先 [Fork](https://github.com/CuteLeaf/Firefly/fork) 到自己儲存庫再克隆（推薦），記得先點 Star 再 Fork 哦！**

   ```bash
   git clone https://github.com/you-github-name/Firefly.git
   cd Firefly
   ```
3. **安裝依賴：**
   ```bash
   # 如果沒有安裝 pnpm，先安裝
   npm install -g pnpm
   
   # 安裝專案依賴
   pnpm install
   ```

4. **配置部落格：**
   - 編輯 `src/config/` 目錄下的配置檔案自訂部落格設定

5. **啟動開發伺服器：**
   ```bash
   pnpm dev
   ```
   部落格將在 `http://localhost:4321` 可用

### 平台託管部署
- **參考[官方指南](https://docs.astro.build/zh-cn/guides/deploy/)將部落格部署至 Vercel, Netlify, GitHub Pages, Cloudflare Pages, EdgeOne Pages 等。**

   框架預設： `Astro`

   根目錄： `./`

   輸出目錄： `dist`

   建置命令： `pnpm run build`

   安裝命令： `pnpm install`

## 📖 配置說明

> 📚 **詳細配置文檔**: 查看 [Firefly使用文檔](https://docs-firefly.cuteleaf.cn/) 獲取完整的配置指南

### 設定網站語言

要設定部落格的預設語言，請編輯 `src/config/siteConfig.ts` 檔案：

```typescript
// 定義站點語言
const SITE_LANG = "zh_CN";
```

**支援的語言代碼：**
- `zh_CN` - 簡體中文
- `zh_TW` - 繁體中文
- `en` - 英文
- `ja` - 日文
- `ru` - 俄文

### 配置檔案結構

```
src/
├── config/
│   ├── index.ts              # 配置索引檔案
│   ├── siteConfig.ts         # 站點基礎配置
│   ├── backgroundWallpaper.ts # 背景桌布配置
│   ├── profileConfig.ts      # 使用者資料配置
│   ├── commentConfig.ts      # 留言系統配置
│   ├── announcementConfig.ts # 公告配置
│   ├── licenseConfig.ts      # 授權配置
│   ├── footerConfig.ts       # 頁尾配置
│   ├── FooterConfig.html     # 頁尾HTML內容
│   ├── expressiveCodeConfig.ts # 程式碼高亮配置
│   ├── sakuraConfig.ts       # 櫻花特效配置
│   ├── fontConfig.ts         # 字型配置
│   ├── sidebarConfig.ts      # 側邊欄版面配置配置
│   ├── navBarConfig.ts       # 導覽列配置
│   ├── musicConfig.ts        # 音樂播放器配置
│   ├── pioConfig.ts          # 看板娘配置
│   ├── adConfig.ts           # 廣告配置
│   ├── friendsConfig.ts      # 友鏈配置
│   ├── galleryConfig.ts      # 相簿配置
│   ├── sponsorConfig.ts      # 贊助配置
│   └── coverImageConfig.ts   # 文章隨機封面圖配置
```


## ⚙️ 文章 Frontmatter

```yaml
---
title: My First Blog Post
published: 2023-09-09
description: This is the first post of my new Astro blog.
image: ./cover.jpg  # 或使用 "api" 來啟用隨機封面圖
tags: [Foo, Bar]
category: Front-end
draft: false
lang: zh-CN      # 僅當文章語言與 `siteConfig.ts` 中的網站語言不同時需要設定
pinned: false    # 置頂
comment: true    # 是否允許留言
---
```
## 🧩 Markdown 擴充語法

除了 Astro 預設支援的 [GitHub Flavored Markdown](https://github.github.com/gfm/) 之外，還包含了一些額外的 Markdown 功能：

- 提醒塊（Admonitions） - 支援 GitHub, Obsidian, VitePress 三種風格主題配置 ([預覽和用法](https://firefly.cuteleaf.cn/posts/markdown-extended/))
- GitHub 儲存庫卡片 ([預覽和用法](https://firefly.cuteleaf.cn/posts/markdown-extended/))
- 基於 Expressive Code 的增強程式碼區塊 ([預覽](http://firefly.cuteleaf.cn/posts/code-examples/) / [文檔](https://expressive-code.com/))
## 🧞 指令

下列指令均需要在專案根目錄執行：

| Command                    | Action                                              |
|:---------------------------|:----------------------------------------------------|
| `pnpm install`             | 安裝依賴                                            |
| `pnpm dev`                 | 在 `localhost:4321` 啟動本地開發伺服器              |
| `pnpm build`               | 建置網站至 `./dist/`                                |
| `pnpm preview`             | 本地預覽已建置的網站                                |
| `pnpm check`               | 檢查程式碼中的錯誤                                  |
| `pnpm format`              | 使用 Biome 格式化您的程式碼                         |
| `pnpm new-post <filename>` | 建立新文章                                          |
| `pnpm astro ...`           | 執行 `astro add`, `astro check` 等指令              |
| `pnpm astro --help`        | 顯示 Astro CLI 說明                                 |

## 🙏 致謝

非常感謝 [saicaca](https://github.com/saicaca) 開發的 [fuwari](https://github.com/saicaca/fuwari) 範本，Firefly 就是基於這個範本二次開發

流螢部分相關圖片素材版權歸遊戲 [《崩壞：星穹鐵道》](https://sr.mihoyo.com/) 開發商 [米哈遊](https://www.mihoyo.com/) 所有

### 技術棧

- [Astro](https://astro.build) 
- [Tailwind CSS](https://tailwindcss.com) 
- [Iconify](https://iconify.design)

### 靈感專案

- [fuwari](https://github.com/saicaca/fuwari)
- [hexo-theme-shoka](https://github.com/amehime/hexo-theme-shoka)
- [astro-koharu](https://github.com/cosZone/astro-koharu)
- [Mizuki](https://github.com/matsuzaka-yuki/Mizuki)

### 其他參考
- 部落客`霞葉`的 [Bangumi 收藏](https://kasuha.com/posts/fuwari-enhance-ep2/) 頁面元件
- 嗶哩嗶哩up主 `公公的日常` 的Q版 [流螢看板娘Spine切片資料](https://www.bilibili.com/video/BV1fuVzzdE5y)

## 📝 許可協議

本專案遵循 [MIT license](https://mit-license.org/) 開源協議，詳細查看 [LICENSE](../LICENSE) 文件

最初 Fork 自 [saicaca/fuwari](https://github.com/saicaca/fuwari)，感謝原作者的貢獻

**版權聲明：**
- Copyright (c) 2024 [saicaca](https://github.com/saicaca) - [fuwari](https://github.com/saicaca/fuwari)
- Copyright (c) 2025 [CuteLeaf](https://github.com/CuteLeaf) - [Firefly](https://github.com/CuteLeaf/Firefly)

根據 MIT 開源協議，你可以自由使用、修改、分發程式碼，但需保留上述版權聲明。

## 🍀 貢獻者

感謝以下貢獻者對本專案做出的貢獻，如有問題或建議，請提交 [Issue](https://github.com/CuteLeaf/Firefly/issues) 或 [Pull Request](https://github.com/CuteLeaf/Firefly/pulls)。

><a href="https://github.com/CuteLeaf/Firefly/graphs/contributors">
>  <img src="https://contrib.rocks/image?repo=CuteLeaf/Firefly" />
></a>

感謝以下貢獻者對原專案 [fuwari](https://github.com/saicaca/fuwari) 做出的貢獻，為本專案奠定了基礎。

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
