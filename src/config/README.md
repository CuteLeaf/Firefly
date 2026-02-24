# 配置文件说明

本目录包含 Firefly 主题的所有配置文件，采用模块化设计，每个文件负责特定的功能模块。

## 📁 配置文件结构

```
src/config/
├── index.ts              # 配置索引文件 - 统一导出
├── siteConfig.ts         # 站点基础配置
├── backgroundWallpaper.ts # 背景壁纸配置
├── profileConfig.ts      # 用户资料配置
├── musicConfig.ts        # 音乐播放器配置
├── sakuraConfig.ts       # 樱花特效配置
├── commentConfig.ts      # 评论系统配置
├── announcementConfig.ts # 公告配置
├── licenseConfig.ts      # 许可证配置
├── footerConfig.ts       # 页脚配置
├── expressiveCodeConfig.ts # 代码高亮配置
├── fontConfig.ts         # 字体配置
├── sidebarConfig.ts      # 侧边栏配置
├── navBarConfig.ts       # 导航栏配置
├── pioConfig.ts          # Pio 模型配置
├── adConfig.ts           # 广告配置
├── friendsConfig.ts      # 友链配置
├── galleryConfig.ts      # 相册配置
├── sponsorConfig.ts      # 赞助配置
├── coverImageConfig.ts   # 封面图配置
└── README.md             # 本文件
```

## 🚀 使用方式

### 推荐：使用配置索引（统一导入）
```typescript
import { siteConfig, profileConfig } from '../config';
```

### 直接导入单个配置
```typescript
import { siteConfig } from '../config/siteConfig';
import { profileConfig } from '../config/profileConfig';
```

## 📋 配置文件列表

- `siteConfig.ts` - 站点基础配置（标题、描述、主题色等）
- `backgroundWallpaper.ts` - 背景壁纸配置（壁纸模式、图片、横幅文字等）
- `profileConfig.ts` - 用户资料配置（头像、姓名、社交链接等）
- `musicConfig.ts` - 音乐播放器配置（支持本地音乐和 Meting API）
- `sakuraConfig.ts` - 樱花特效配置（数量、速度、尺寸等）
- `commentConfig.ts` - 评论系统配置（Twikoo 评论和文章访问量统计）
- `announcementConfig.ts` - 公告配置（标题、内容、链接等）
- `licenseConfig.ts` - 许可证配置（CC 协议等）
- `footerConfig.ts` - 页脚配置（HTML 注入等）
- `expressiveCodeConfig.ts` - 代码高亮配置（主题等）
- `fontConfig.ts` - 字体配置（字体族、大小等）
- `sidebarConfig.ts` - 侧边栏配置（组件布局等）
- `navBarConfig.ts` - 导航栏配置（链接、样式等）
- `pioConfig.ts` - Pio 模型配置（Spine、Live2D 等）
- `adConfig.ts` - 广告配置（广告位设置等）
- `friendsConfig.ts` - 友链配置（友链列表等）
- `sponsorConfig.ts` - 赞助配置（赞助方式、二维码等）
- `coverImageConfig.ts` - 封面图配置（随机封面图列表等）


```
