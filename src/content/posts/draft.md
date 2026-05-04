---
title: 草稿示例
published: 1970-01-01
tags: [Markdown, 博客, 演示]
category: 文章示例
draft: true
---

## 🚀 快速开始



### 环境要求



- Node.js ≥ 22
- pnpm ≥ 9

### 本地开发部署



1. **克隆仓库：**

   ```
   git clone https://github.com/Cuteleaf/Firefly.git
   cd Firefly
   ```

   

   **先 [Fork](https://github.com/CuteLeaf/Firefly/fork) 到自己仓库在克隆（推荐），记得先点 Star 在 Fork 哦！**

   ```
   git clone https://github.com/you-github-name/Firefly.git
   cd Firefly
   ```

   

2. **安装依赖：**

   ```
   # 如果没有安装 pnpm，先安装
   npm install -g pnpm
   
   # 安装项目依赖
   pnpm install
   ```

   

3. **配置博客：**

   - 编辑 `src/config/` 目录下的配置文件自定义博客设置

4. **启动开发服务器：**

   ```
   pnpm dev
   ```

   

   博客将在 `http://localhost:4321` 可用

### 平台托管部署



- **参考[官方指南](https://docs.astro.build/zh-cn/guides/deploy/)将博客部署至 Vercel, Netlify, Cloudflare Pages, EdgeOne Pages 等。**

- **Vercel**、**Netlify** 等主流平台自动部署，会根据环境自动选择适配器。

  框架预设： `Astro`

  根目录： `./`

  输出目录： `dist`

  构建命令： `pnpm run build`

  安装命令： `pnpm install`

  [![Deploy with Vercel](https://camo.githubusercontent.com/7015516519ae874ab75537283bc75f86b3d46386ed994093a3790a1180913164/68747470733a2f2f76657263656c2e636f6d2f627574746f6e)](https://vercel.com/new/clone?repository-url=https://github.com/CuteLeaf/Firefly&project-name=Firefly&repository-name=Firefly) [![Deploy to Netlify](https://camo.githubusercontent.com/de47084e2d5a8948486a2238f1517e465560ec293c4a2cba80020472f8d5c80a/68747470733a2f2f7777772e6e65746c6966792e636f6d2f696d672f6465706c6f792f627574746f6e2e737667)](https://app.netlify.com/start/deploy?repository=https://github.com/CuteLeaf/Firefly)

## 📖 配置说明



> 📚 **详细配置文档**: 查看 [Firefly使用文档](https://docs-firefly.cuteleaf.cn/) 获取完整的配置指南

### 设置网站语言



要设置博客的默认语言，请编辑 `src/config/siteConfig.ts` 文件：

```
// 定义站点语言
const SITE_LANG = "zh_CN";
```



**支持的语言代码：**

- `zh_CN` - 简体中文
- `zh_TW` - 繁体中文
- `en` - 英文
- `ja` - 日文
- `ru` - 俄文

### 配置文件结构



```
src/
├── config/
│   ├── index.ts              # 配置索引文件
│   ├── siteConfig.ts         # 站点基础配置
│   ├── backgroundWallpaper.ts # 背景壁纸配置
│   ├── profileConfig.ts      # 用户资料配置
│   ├── commentConfig.ts      # 评论系统配置
│   ├── announcementConfig.ts # 公告配置
│   ├── licenseConfig.ts      # 许可证配置
│   ├── footerConfig.ts       # 页脚配置
│   ├── FooterConfig.html     # 页脚HTML内容
│   ├── expressiveCodeConfig.ts # 代码高亮配置
│   ├── sakuraConfig.ts       # 樱花特效配置
│   ├── fontConfig.ts         # 字体配置
│   ├── sidebarConfig.ts      # 侧边栏布局配置
│   ├── navBarConfig.ts       # 导航栏配置
│   ├── musicConfig.ts        # 音乐播放器配置
│   ├── pioConfig.ts          # 看板娘配置
│   ├── adConfig.ts           # 广告配置
│   ├── friendsConfig.ts      # 友链配置
│   ├── galleryConfig.ts      # 相册配置
│   ├── sponsorConfig.ts      # 赞助配置
│   └── coverImageConfig.ts  # 文章封面图配置
```



## ⚙️ 文章 Frontmatter



```
---
title: My First Blog Post
published: 2023-09-09
description: This is the first post of my new Astro blog.
image: ./cover.jpg  # 或使用 "api" 来启用随机封面图
tags: [Foo, Bar]
category: Front-end
draft: false
lang: zh-CN      # 仅当文章语言与 `siteConfig.ts` 中的网站语言不同时需要设置
pinned: false    # 置顶
comment: true    # 是否允许评论
---
```



## 🧩 Markdown 扩展语法



除了 Astro 默认支持的 [GitHub Flavored Markdown](https://github.github.com/gfm/) 之外，还包含了一些额外的 Markdown 功能：

- 提醒块（Admonitions） - 支持 GitHub, Obsidian, VitePress 三种风格主题配置 ([预览和用法](https://firefly.cuteleaf.cn/posts/markdown-extended/))
- GitHub 仓库卡片 ([预览和用法](https://firefly.cuteleaf.cn/posts/markdown-extended/))
- 基于 Expressive Code 的增强代码块 ([预览](http://firefly.cuteleaf.cn/posts/code-examples/) / [文档](https://expressive-code.com/))

## 🧞 指令



下列指令均需要在项目根目录执行：

| Command                    | Action                                 |
| -------------------------- | -------------------------------------- |
| `pnpm install`             | 安装依赖                               |
| `pnpm dev`                 | 在 `localhost:4321` 启动本地开发服务器 |
| `pnpm build`               | 构建网站至 `./dist/`                   |
| `pnpm preview`             | 本地预览已构建的网站                   |
| `pnpm check`               | 检查代码中的错误                       |
| `pnpm format`              | 使用Biome格式化您的代码                |
| `pnpm new-post <filename>` | 创建新文章                             |
| `pnpm astro ...`           | 执行 `astro add`, `astro check` 等指令 |
| `pnpm astro --help`        | 显示 Astro CLI 帮助                    |
