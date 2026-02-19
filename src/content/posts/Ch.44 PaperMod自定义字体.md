---
title: PaperMod自定义字体
description: PaperMod自定义字体
author: Beiyuan
draft: false
showLastMod: true
slug: papermod-custom-fonts
categories:
  - Hugo
tags:
  - Papermod
  - 字体
  - 美化
date: 2025-11-02T23:32:28+08:00
lastmod: 2025-12-04T11:15:27+08:00
---
### 1 . 在 `layouts/partials/extend_head.html` 中引入 `CDN`
```html
<!-- 霞鹜字体 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-web/style.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@callmebill/lxgw-wenkai-web@latest/style.css" />
```

### 2 . 在 `assets/css/extended/custome.css` 中添加字体样式：
```css
/* 正文字体 */
.post-content {
    font-family: LXGW WenKai Light, LXGW WenKai Screen, sans-serif;
}

body {
    font-size: 18px;
    line-height: 1.6;
    font-family: LXGW WenKai Light, LXGW WenKai Screen, sans-serif;
}
```

### 3 . 在 `assets/css/extended/admonition.css` 处修改 `admonition` 注释框中的字体。
```css
/* admonition注释框字体 */
body,
.admonition {
    font-family: LXGW WenKai Light, LXGW WenKai Screen, sans-serif;
}
```