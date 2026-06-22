---
title: Astro框架Firefly主题博客部署到Github Actions方法
published: 2026-06-21
pinned: false
description: Astro框架Firefly主题部署到Github Actions的详细方法，记录自己踩过的坑。
tags: [Astro, Firefly,Github Actions]
category: 网上那些事
draft: false
image: https://cdn.jsdelivr.net/gh/Yutong2333/imges-bed/Astro-firefly-push.avif
---

## 前言
好久没玩博客了，前段时间了解到现在流行[Astro](https://astro.build/)框架搭建博客，反而是前几年的hexo更新滞后了，就花了些时间琢磨了一下这个框架怎么部署，还看了一些主题，最后决定用[Firefly](https://docs-firefly.cuteleaf.cn/zh/)来部署我的新博客，期间踩了不少坑，下面分享我部署成功的步骤。

### 本地安装所需要的工具
1.[nodejs](https://nodejs.org/zh-cn)<br>
2.[Git](https://git-scm.com/)<br>
*注意*：nodejs有三种安装方法，选择自己会的其中一种安装即可，Git的安装过程如果有add path选项的话记得勾选
![截图1](https://cdn.jsdelivr.net/gh/Yutong2333/imges-bed/Astro-firefly-push3.png)

### 开始从Firefly的仓库部署到本地
创建一个名为“blog”的文件夹（取别的名也行，自己记得住就好），并在文件夹里面点鼠标右键，选择“Open Git Bash here”
![截图2](https://cdn.jsdelivr.net/gh/Yutong2333/imges-bed/Astro-firefly-push4.avif)
点击了“Open Git Bash here”将会出现这个页面：
![截图3](https://cdn.jsdelivr.net/gh/Yutong2333/imges-bed/Astro-firefly-push5.avif)
**安装**<br>
