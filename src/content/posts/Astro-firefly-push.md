---
title: Astro框架Firefly主题博客部署到Github Actions方法
published: 2026-06-21
pinned: false
description: Astro框架Firefly主题部署到Github Actions的详细方法，记录自己踩过的坑。
tags: [Astro,Firefly,Github Actions]
category: 网上那些事
draft: false
image: ./images/Astro-firefly-push.avif
---

## 前言

好久没玩博客了，前段时间了解到现在流行[Astro](https://astro.build/)框架搭建博客，反而是前几年的hexo更新滞后了，就花了些时间琢磨了一下这个框架怎么部署，还看了一些主题，最后决定用[Firefly](https://docs-firefly.cuteleaf.cn/zh/)主题来部署我的新博客，期间踩了不少坑，下面分享我部署成功的步骤。

### 本地安装所需要的工具（Windows系统）

1.[nodejs](https://nodejs.org/zh-cn)<br>
2.[Git](https://git-scm.com/)<br>
*注意*：nodejs有三种安装方法，选择自己会的其中一种安装即可
![nodejs选择其中一种方法](./images/Astro-firefly-push1.avif)
git安装过程不再展示，一路下一步看到add path记得勾上就行

### 开始从Firefly的仓库部署到本地

创建一个名为“blog”的文件夹（取别的名也行，自己记得住就好），并在文件夹里面点鼠标右键，选择“Open Git Bash here”
![创建文件夹](./images/Astro-firefly-push4.avif)
点击了“Open Git Bash here”将会出现这个页面：
![Git的界面](./images/Astro-firefly-push5.avif)
安装[pnpm管理包](https://pnpm.io/zh/)：在git的界面里粘贴以下指令并回车：
```bash
npx pnpm@latest-11 dlx @pnpm/exe@latest-11 setup
```

**克隆仓库**<br>
1.克隆Firefly仓库
```bash
git clone https://github.com/CuteLeaf/Firefly.git
cd Firefly
```
*克隆下载速度慢的话可以尝试找镜像网站解析，以下是我解析到的目前为止能用的链接，如果不能用了请自己找一个*<br>
```bash
git clone https://v4.gh-proxy.org/https://github.com/CuteLeaf/Firefly.git
cd Firefly
```
下载完成：
![克隆下载完成](./images/Astro-firefly-push3.avif)
2.安装依赖
```bash
pnpm install
```
3.启动本地的开发服务器
```bash
pnpm dev
```
加载完成后将会提示“[http://localhost:4321/](/posts/astro-firefly-push/)”，复制到浏览器能直接打开的话本地部署的工作算是完成了。
输入“pnpm buid”将会构建静态的可直接访问的html文件，会在Firefly文件夹里生成一个dist文件夹，最简单的是上传到服务器就能访问了.

如果你还想要部署成像我这样：本地写文章后输入指令让它自动上传部署到服务器，可以参考我以下的方法

### 修改文件

因为国内访问github经常会失败，建议下面的操作先下载[Watt Toolkit](https://steampp.net/)（这工具原本叫Steam++），来给github免费加速

**在GitHub Actions上部署并发布到GitHub Pages上**<br>
把.github\workflows\deploy.yml里的文件内容全部改成：
```
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: pnpm build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
### 推送文件

创建一个仓库，名字格式为：用户名/用户名.github.io
![只起仓库名，其他不用管](./images/Astro-firefly-push2.avif)
更改Git仓库里的关联链接和分支：
```bash
git remote set-url origin https://github.com/用户名/用户名.github.io.git
git branch -M main
```

倘若你写好了文章，就可以开始把整个本地仓库的内容开始推送到github你创建的仓库了：<br>
先网页登录github的帐号，然后：
```bash
git add .
git commit -m“更新博客”
git push -u origin main
```
Git上选择关联github帐号：
![选择关联](./images/Astro-firefly-push6.avif)
推送成功界面：
![推送成功了](./images/Astro-firefly-push7.avif)
打开github仓库的用户名/用户名.github.io，里面有和本地文件夹一样的文件就可以开始下一步了

### 设置GitHub Actions

1.
![选择Settings](./images/Astro-firefly-push8.avif)
2.
![选择Pages](./images/Astro-firefly-push9.avif)
3.
![选择GitHub Actions](./images/Astro-firefly-push66.avif)

最后，每次更新文章或者修改博客任何内容，操作一遍就能自动推送上github
```bash
git add .
git commit -m“更新博客”
git push
```
推送之后GitHub Actions会自动构建并部署到GitHub Pages上，这里查看部署进度：
![Actions上查看进度](./images/Astro-firefly-push12.avif)
Actions部署完成可以输入github送的二级域名（用户名.github.io）查看你的网站啦