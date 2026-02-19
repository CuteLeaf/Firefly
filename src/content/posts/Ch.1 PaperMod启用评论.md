---
title: PaperMod启用评论
description: PaperMod启用评论
author: Beiyuan
draft: false
showLastMod: true
slug: papermod-enable-comments
categories:
  - Hugo
tags:
  - Papermod
  - giscus
  - 美化
date: 2025-05-15T20:11:00+08:00
lastmod: 2025-12-04T11:15:02+08:00
---
### 1. 创建仓库
该仓库是公开的，否则访客将无法查看 Discussion
### 2 启用讨论
（1）单击设置
（2）向下滚动到 Features 部分 –> 勾选讨论 –> 点击 Set up Discussions
（3）滚动到下方，点击 Start discussions
### 3 安装 giscus APP
（1）访问 [giscus 配置页](https://github.com/apps/giscus)
（2）点击 Configure ，填写 Github 登录密码
（3）在 Repository access 部分添加在（1）中创建的仓库，然后保存
### 4. 获取 Giscus 配置信息
（1）访问 [Giscus](https://giscus.app/zh-CN)
（2）往下滚动到 “配置” 部分，填写仓库名称
（3）“页面 <–> discussion 映射关系” 勾选 Discussion 的标题包含页面的 pathname
（4）Discussion 分类选择 Announcements
（5）特性部分勾选启用主帖子上的反应（reaction） 和将评论框放在评论上方
（6）拷贝这部分信息，待会需要在 hugo.yaml 填写配置信息，关注这 4 个信息项即可：`data-repo`、`data-repo-id`、`data-category`、`data-category-id`
### 5. 在 `/layouts/partials/` 添加 `comments.html`
```html
{{/* 只有标题可以被 Hugo 解析 */}}
<div class="comments-title" id="tw-comment-title">
  <p class="x-comments-title">{{ .Site.Params.giscus.discussionTitle }}</p>
  <p style="font-size: 1rem">{{ .Site.Params.giscus.discussionSubtitle }}</p>
</div>
<div id="tw-comment"></div>

{{/* 下面这行至关重要！告诉 Hugo 不要动下面的 JS */}}
{{- /* safeJS */ -}}
<script>
  (() => {
    const config = {
      repo: "{{ .Site.Params.giscus.repo }}",
      repoId: "{{ .Site.Params.giscus.repoId }}",
      category: "{{ .Site.Params.giscus.category | default "" }}",
      categoryId: "{{ .Site.Params.giscus.categoryId | default "" }}",
      mapping: "{{ .Site.Params.giscus.mapping | default "pathname" }}",
      strict: "{{ .Site.Params.giscus.strict | default "0" }}",
      reactionsEnabled: "{{ .Site.Params.giscus.reactionsEnabled | default "1" }}",
      emitMetadata: "{{ .Site.Params.giscus.emitMetadata | default "0" }}",
      inputPosition: "{{ .Site.Params.giscus.inputPosition | default "bottom" }}",
      lang: "{{ .Site.Params.giscus.lang | default "en" }}",
      lightTheme: "{{ .Site.Params.giscus.lightTheme | default "light" }}",
      darkTheme: "{{ .Site.Params.giscus.darkTheme | default "dark_high_contrast" }}",
    };

    // 获取当前主题
    const getTheme = () =>
      localStorage.getItem("pref-theme") === "dark"
        ? config.darkTheme
        : config.lightTheme;

    // 动态获取 iframe 的 origin，避免 postMessage 报错
    const sendTheme = () => {
      const iframe = document.querySelector("iframe.giscus-frame");
      if (iframe?.contentWindow && iframe.src) {
        const origin = new URL(iframe.src).origin;
        iframe.contentWindow.postMessage(
          { giscus: { setConfig: { theme: getTheme() } } },
          origin
        );
      }
    };

    const load = () => {
      if (document.getElementById("giscus-script")) return;
      const s = document.createElement("script");
      s.id = "giscus-script";
      s.src = "https://giscus.app/client.js";
      s.async = true;
      s.crossOrigin = "anonymous";
      s.setAttribute("data-loading", "lazy");

      const attrs = {
        "data-repo": config.repo,
        "data-repo-id": config.repoId,
        "data-category": config.category,
        "data-category-id": config.categoryId,
        "data-mapping": config.mapping,
        "data-strict": config.strict,
        "data-reactions-enabled": config.reactionsEnabled,
        "data-emit-metadata": config.emitMetadata,
        "data-input-position": config.inputPosition,
        "data-theme": getTheme(),
        "data-lang": config.lang,
      };
      Object.entries(attrs).forEach(([k, v]) => v && s.setAttribute(k, v));

      s.onload = () => setTimeout(sendTheme, 600);
      document.getElementById("tw-comment").appendChild(s);
    };

    const observe = () => {
      ["#theme-toggle", "#theme-toggle-float", "[data-theme-toggle]", ".theme-switch"].forEach(
        (sel) => {
          const el = document.querySelector(sel);
          if (el && !el.dataset.giscus) {
            el.dataset.giscus = "true";
            el.addEventListener("click", () => setTimeout(sendTheme, 150));
          }
        }
      );
      window.addEventListener("storage", (e) => e.key === "pref-theme" && sendTheme());
      document.addEventListener("themeChanged", sendTheme);
    };

    document.readyState === "loading"
      ? document.addEventListener("DOMContentLoaded", () => {
          load();
          observe();
        })
      : (load(), observe());

    window.refreshGiscusTheme = sendTheme;
  })();
</script>
{{- /* /safeJS */ -}}
```
### 6. 在 `/assets/css/extended/` 添加 `comments.css`
```css
.giscus-frame {
    margin-bottom: 0 !important;
}

#tw-comment,
div[class*="giscus"] {
    margin-top: 3rem;     /* 与正文保持距离 */
    margin-bottom: 4rem;
}

.comments-title {
    margin: 3.5rem 0 2rem;
    text-align: center;
    font-weight: 600;
}

.x-comments-title {
    font-size: 1.55em;       /* 比原来再大一点点，更醒目 */
    margin-bottom: 0.5rem;
    color: var(--primary, #2563eb);  /* 跟随主题主色，没定义就用蓝色 */
}

.comments-title::before {
    content: "";
    display: block;
    width: 80px;
    height: 3px;
    background: var(--primary, #2563eb);
    margin: 0 auto 1.2rem;
    border-radius: 2px;
}

html[data-theme="dark"] .giscus-frame {
    --color-canvas-default: transparent !important;
    --color-border-default: rgba(240,246,252,0.1) !important;
}
```
### 7. 调整hugo.yaml，这里的params是示例
```yaml
params:
 comments: true # 默认开启评论
 giscus:
  repo: "#替换这里的参数" 
  repoId: "#替换这里的参数"
  category: "Announcements"
  categoryId: "#替换这里的参数"
  mapping: "pathname"
  strict: "0"
  reactionsEnabled: "1"
  emitMetadata: "0"
  inputPosition: "top"
  lightTheme: "light"
  darkTheme: "dark"
  lang: "zh-CN"
  discussionTitle: "" # 按需填写，评论框上方的标题
  discussionSubtitle: "" # 按需填写，评论框上方的副标题
```