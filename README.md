
<div align="center">

<img src="public/favicon.png" alt="风绘笔记" />

# 风绘笔记 / HuiDev Notes

> 用代码构建，用文字记录

</div>

---

## 关于本站

风绘笔记是个人技术博客，基于 [Astro](https://astro.build) 静态站点框架构建，使用 [Firefly](https://github.com/CuteLeaf/Firefly) 主题（Fork 自 [saicaca/fuwari](https://github.com/saicaca/fuwari)）。

博客地址：[huidev.com](https://huidev.com)

## 功能特性

- 基于 Astro + Svelte + Tailwind CSS 的现代技术栈，超快加载速度
- 左右双侧边栏布局，支持单侧栏/双侧栏切换
- 文章列表/网格/瀑布流多种布局模式
- Swup 页面过渡动画，流畅浏览体验
- 亮色/暗色/跟随系统三种颜色模式
- 基于 Pagefind 的全文搜索
- Twikoo 评论系统
- Meting 音乐播放器
- 自定义壁纸背景（横幅/全屏/透明/纯色）
- 相册、追番（Bilibili）、友链、留言板等页面模块
- 分享海报、Mermaid/PlantUML 图表、数学公式支持
- 多语言 UI（中文 / English / 日本語 / 한국어 等）
- 响应式设计，适配移动端

## 本地开发

### 环境要求

- Node.js >= 22
- pnpm >= 9

### 启动

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

更多命令：

| 命令 | 说明 |
|:---|:---|
| `pnpm dev` | 启动开发服务器 (localhost:4321) |
| `pnpm build` | 构建网站至 `./dist/` |
| `pnpm preview` | 本地预览生产构建 |
| `pnpm check` | Astro 诊断检查 |
| `pnpm type-check` | TypeScript 类型检查 |
| `pnpm format` | 使用 Biome 格式化代码 |
| `pnpm lint` | Biome 代码检查 |
| `pnpm new-post` | 创建新文章 |

## 配置

博客的所有配置集中在 `src/config/` 目录下，按功能模块划分为独立的配置文件：

- `siteConfig.ts` - 站点基础设置（标题、URL、主题色、布局等）
- `profileConfig.ts` - 个人资料
- `sidebarConfig.ts` - 侧边栏布局
- `navBarConfig.ts` - 导航栏
- `commentConfig.ts` - 评论系统
- `friendsConfig.ts` - 友链
- `musicConfig.ts` - 音乐播放器
- `backgroundWallpaper.ts` - 背景壁纸
- `analyticsConfig.ts` - 统计分析
- 更多配置详见 `src/config/` 目录

## 部署

支持部署至 Vercel、Netlify、Cloudflare Pages、EdgeOne Pages 等平台，构建输出目录为 `dist`，构建命令为 `pnpm run build`。

## 许可协议

本项目基于 [MIT License](./LICENSE) 开源。

**版权声明：**
- Copyright (c) 2024 [saicaca](https://github.com/saicaca) - [fuwari](https://github.com/saicaca/fuwari)
- Copyright (c) 2025 [CuteLeaf](https://github.com/CuteLeaf) - [Firefly](https://github.com/CuteLeaf/Firefly)

## 致谢

感谢以下上游项目的贡献：

- [saicaca/fuwari](https://github.com/saicaca/fuwari) - 博客模板基础
- [CuteLeaf/Firefly](https://github.com/CuteLeaf/Firefly) - 主题功能扩展

### 技术栈

- [Astro](https://astro.build)
- [Svelte](https://svelte.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Iconify](https://iconify.design)
