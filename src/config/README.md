# 配置文件说明

本目录包含 Firefly 主题的所有配置文件，采用模块化设计，每个文件负责特定的功能模块。

## 📁 配置文件结构

```
src/config/
├── index.ts                  # 配置索引文件 - 统一导出
├── siteConfig.ts             # 站点基础配置
├── analyticsConfig.ts        # 统计分析配置（Google Analytics、Umami、51la 等）
├── announcementConfig.ts     # 公告配置
├── backgroundWallpaper.ts    # 背景壁纸配置
├── commentConfig.ts          # 评论系统配置
├── coverImageConfig.ts       # 封面图配置
├── displaySettingsConfig.ts  # 设置面板配置
├── dynamicConfig.ts          # 动态页面配置
├── effectsConfig.ts          # 动画特效配置（樱花等）
├── expressiveCodeConfig.ts   # 代码高亮配置
├── fontConfig.ts             # 字体配置
├── footerConfig.ts           # 页脚配置
├── friendsConfig.ts          # 友链配置
├── galleryConfig.ts          # 相册配置
├── licenseConfig.ts          # 许可证配置
├── musicConfig.ts            # 音乐播放器配置
├── navBarConfig.ts           # 导航栏配置（含 LinkPresets 链接预设）
├── pioConfig.ts              # 看板娘配置（Spine、Live2D）
├── mermaidConfig.ts          # Mermaid 图表配置
├── plantumlConfig.ts         # PlantUML 图表配置
├── profileConfig.ts          # 用户资料配置
├── sidebarConfig.ts          # 侧边栏布局配置
├── sponsorConfig.ts          # 打赏配置
└── README.md                 # 本文件
```

## 🚀 使用方式

### 推荐：使用配置索引（统一导入）
```typescript
import { siteConfig, profileConfig } from "@/config";
```

### 直接导入单个配置
```typescript
import { siteConfig } from "@/config/siteConfig";
import { profileConfig } from "@/config/profileConfig";
```

## 📋 配置文件列表

| 文件 | 说明 |
|------|------|
| `siteConfig.ts` | 站点基础配置（标题、描述、主题色、页面宽度、文章内容页配置等） |
| `analyticsConfig.ts` | 统计分析配置（Google Analytics、Microsoft Clarity、Umami、51la） |
| `announcementConfig.ts` | 公告配置（标题、内容、类型、链接等） |
| `backgroundWallpaper.ts` | 背景壁纸配置（壁纸模式、图片、横幅文字、水波纹等） |
| `commentConfig.ts` | 评论系统配置（Twikoo、Waline、Artalk、Giscus、Disqus） |
| `coverImageConfig.ts` | 封面图配置（文章封面图、随机封面图 API） |
| `dynamicConfig.ts` | 动态页面配置（页面标题、描述、评论开关和每页显示数量） |
| `effectsConfig.ts` | 动画特效配置（樱花数量、速度、尺寸等） |
| `expressiveCodeConfig.ts` | 代码高亮配置（亮色/暗色主题、折叠、语言徽章） |
| `fontConfig.ts` | 字体配置（字体列表、回退、预加载） |
| `footerConfig.ts` | 页脚配置（自定义 HTML 注入，如备案号） |
| `friendsConfig.ts` | 友链配置（友链列表、页面设置） |
| `galleryConfig.ts` | 相册配置（相册列表、瀑布流列宽） |
| `licenseConfig.ts` | 许可证配置（CC 协议等） |
| `musicConfig.ts` | 音乐播放器配置（Meting API / 本地音乐、导航栏和侧边栏开关） |
| `navBarConfig.ts` | 导航栏配置（动态链接、LinkPresets 链接预设、搜索配置） |
| `pioConfig.ts` | 看板娘配置（Spine 模型、Live2D 模型） |
| `plantumlConfig.ts` | PlantUML 图表渲染配置 |
| `profileConfig.ts` | 用户资料配置（头像、姓名、社交链接） |
| `sidebarConfig.ts` | 侧边栏布局配置（左侧/右侧/移动端组件列表） |
| `sponsorConfig.ts` | 打赏配置（打赏方式、打赏者列表） |

## 📝 说明

- 所有配置文件均可通过 `index.ts` 统一导入
- 每个配置文件对应 `types/` 目录下的独立类型定义文件
- `siteConfig.ts` 只保留站点核心信息，不聚合其他模块配置
- `navBarConfig.ts` 底部的 `LinkPresets` 可自由自定义导航栏链接的名称、图标和 URL
