---
title: Firefly 布局系统详解
published: 1970-01-03
description: 深入了解 Firefly 的布局系统，包括侧边栏布局（左侧/双侧）和文章列表布局（列表/网格），以及自适应网格列数。
image: ./images/firefly1.avif
tags: [Firefly, 布局, 博客, 使用指南]
category: 博客指南
draft: false
---

## 📖 概述

Firefly 提供了灵活的布局系统，允许您根据内容需求和个人喜好自定义博客的视觉呈现方式。布局系统主要包括**侧边栏布局**和**文章列表布局**两个维度，它们相互配合，共同决定了页面的整体结构。

本文将详细介绍 Firefly 的各种布局模式、它们的特点、使用场景，以及不同布局组合的效果。

---

[grid]
![左侧边栏+列表布局](./images/left-list.avif)
![右侧边栏+网格布局](./images/right-grid2.avif)
![左侧边栏+三列网格布局](./images/left-grid3.avif)
[/grid]

[grid]
![双侧边栏+列表布局](./images/both-list.avif)
![双侧边栏+网格布局](./images/both-grid.avif)
![双侧边栏+网格瀑布流布局](./images/masonry.avif)
[/grid]


## 一、侧边栏布局系统

侧边栏是博客页面的重要组成部分，用于展示导航、分类、标签、统计信息等辅助内容。Firefly 支持两种侧边栏布局模式。

### 1.1 单侧边栏模式

#### 1.1.1 左侧边栏 (position: "left")

![左侧边栏布局](./images/left-list.avif)

#### 1.1.2 右侧边栏 (position: "right")

![右侧边栏布局](./images/right-grid2.avif)

#### 特点

- 侧边栏固定在页面其中一侧
- 文章阅读区域体验更佳，更宽敞
- 更加简约，没有那么紧凑

#### 适用场景

- 传统博客风格
- 强调导航和分类的博客
- 需要突出用户资料的个人博客
- 内容为主，辅助信息次之的场景

:::tip
可以通过showBothSidebarsOnPostPage配置是否在文章详情页显示双侧边栏

当position为left或right时开启此项后，文章详情页将显示双侧边栏，主页等其他页面保持单侧边栏

适用在只想用单侧栏，但在文章详情页想用对侧栏的目录等组件的场景
:::


#### 配置示例

```typescript
// src/config/sidebarConfig.ts
export const sidebarLayoutConfig: SidebarLayoutConfig = {
  enable: true,
  position: "left", // 左侧边栏
  showBothSidebarsOnPostPage: true, // 是否在文章详情页显示双侧边栏
};
```

---

### 1.2 双侧边栏模式 (position: "both")

#### 特点

- 左右两侧同时存在侧边栏
- 主内容区域位于中间
- 最大化利用屏幕空间
- 可以展示更多辅助信息
- 适合宽屏显示器

#### 布局结构

![双侧边栏+列表布局](./images/both-list.avif)

![双侧边栏+网格布局](./images/both-grid.avif)
#### 适用场景

- 宽屏桌面端浏览
- 信息密集型博客
- 需要展示大量辅助内容
- 专业性强的技术博客


#### 配置示例

```typescript
// src/config/sidebarConfig.ts
export const sidebarLayoutConfig: SidebarLayoutConfig = {
  enable: true,
  position: "both", // 双侧边栏
```

---

## 二、文章列表布局系统

文章列表是博客首页和归档页的核心内容，Firefly 提供两种展示方式，并支持多种网格配置。

### 2.1 列表模式 (defaultMode: "list")

#### 特点

- 单列纵向排列
- 显示文章封面图
- 展示更多文章摘要
- 适合深度阅读

#### 列表布局结构

![列表模式布局](./images/left-list.avif)

#### 优点

- ✅ 视觉冲击力强，封面图吸引眼球
- ✅ 可以展示更多文章信息（摘要、标签等）
- ✅ 适合图片内容丰富的博客
- ✅ 移动端友好，单列更易阅读
- ✅ 兼容所有侧边栏配置（单侧、双侧）

#### 配置示例

```typescript
// src/config/siteConfig.ts
export const siteConfig: SiteConfig = {
  postListLayout: {
    defaultMode: "list", // 列表模式
    allowSwitch: true,   // 允许用户切换
  },
};
```

---

### 2.2 网格模式 (defaultMode: "grid")

#### 特点

- 自适应列数，根据浏览器宽度自动调整
- 紧凑布局，信息密度高
- 适合快速浏览

#### 自适应网格

网格模式通过 `columnWidth` 配置卡片的最小宽度（单位 px），浏览器会根据容器可用宽度自动计算能容纳多少列。

![网格布局](./images/left-grid3.avif)

#### 配置示例

```typescript
// src/config/siteConfig.ts
export const siteConfig: SiteConfig = {
  postListLayout: {
    defaultMode: "grid",
    allowSwitch: true,
    grid: {
      masonry: true,      // 开启瀑布流
      columnWidth: 320,   // 卡片最小宽度(px)，浏览器自动计算列数
    },
  },
};
```

---

### 2.3 瀑布流布局 (Masonry)

Firefly 的网格模式内置了智能瀑布流布局支持，解决了网格布局中因图文混合文章导致的卡片高度不一致导致的空白问题。

![瀑布流布局](./images/masonry.avif)

- **智能排版**：自动将卡片放置到最短的列，最大化利用垂直空间。
- **消除空白**：通过绝对定位精确计算每个卡片的位置，让卡片紧贴上方卡片，消除垂直方向的空白间隙。
- **自适应列数**：瀑布流同样根据 `columnWidth` 和容器宽度动态计算列数，无需固定配置。
- **配置灵活**：您可以在 `siteConfig.ts` 中通过 `postListLayout.grid.masonry` 选项自由开启或关闭此功能。

---

## 三、布局组合指南

Firefly 允许您自由组合侧边栏和文章列表布局。以下是各种组合的效果说明。

### 3.1 布局选择建议

| 侧边栏模式 | 文章列表模式 | 推荐度 | 适用场景 |
|-----------|------------|--------|---------|
| 单侧边栏   | 列表模式    | ⭐⭐⭐⭐⭐ | 摄影、设计、生活类博客，强调图片和沉浸感 |
| 单侧边栏   | 网格模式    | ⭐⭐⭐⭐⭐ | 技术、笔记类博客，平衡阅读与检索效率 |
| 双侧边栏   | 列表模式    | ⭐⭐⭐⭐⭐ | 需要展示大量侧边栏信息的站点 |
| 双侧边栏   | 网格模式    | ⭐⭐⭐⭐⭐ | 极客风格，追求最高信息密度 |

---

## 四、响应式布局行为

Firefly 的布局系统具有智能的响应式设计，会根据屏幕尺寸自动调整。

### 4.1 智能降级规则

为了保证最佳阅读体验，系统会在屏幕变窄时自动调整布局：

1. **网格列数自动减少**：网格模式的列数由 `columnWidth` 和容器宽度自动决定，屏幕越窄列数越少。
2. **网格模式 -> 列表模式**：当屏幕宽度小于 1200px（平板和手机）时，网格模式会自动切换为单列列表模式，以保证卡片内容的可读性。
3. **双侧边栏 -> 单侧边栏**：当屏幕宽度小于 1280px 时，会根据`tabletSidebar`配置显示单侧边栏，隐藏其中一个侧边栏，文章目录导航会切换成浮动目录导航。

---

## 五、常见问题

### Q1: 为什么在手机上看不到网格效果？

**A**: 为了保证阅读体验，Firefly 在屏幕宽度小于 1200px 时会自动强制切换为列表模式。手机屏幕太窄，不适合展示多列网格。

### Q2: 布局切换按钮在哪里？

**A**: 布局切换按钮位于导航栏右侧。它仅在屏幕宽度 ≥ 1200px 时显示，因为在小屏幕上系统强制使用列表模式，无需切换。

### Q3: 如何调整网格列数？

**A**: 通过 `columnWidth` 配置卡片最小宽度即可。值越小，同等宽度下列数越多；值越大，列数越少。浏览器会自动根据可用宽度计算最佳列数。

---

## 六、总结

Firefly 的布局系统给予了您更大的自由度，您都可以通过简单的配置实现。

我们建议您根据自己的内容类型和目标读者的设备偏好，尝试不同的组合，找到最适合您的博客形态。

---

## 相关链接

- 📚 [侧边栏配置文档](https://docs-firefly.cuteleaf.cn/config/sidebarConfig-usage/)
- 📚 [站点配置文档](https://docs-firefly.cuteleaf.cn/config/siteConfig-usage/)
- 🏠 [Firefly 官方文档](https://docs-firefly.cuteleaf.cn/)
- ⭐ [Firefly GitHub](https://github.com/CuteLeaf/Firefly)
