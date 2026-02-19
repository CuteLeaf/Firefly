---
title: PaperMod美化归档
description: PaperMod美化归档
author: Beiyuan
draft: false
showLastMod: true
slug: papermod-archive-beautification
categories:
  - Hugo
tags:
  - Papermod
  - 归档
  - 美化
date: 2025-11-21T17:24:39+08:00
lastmod: 2025-12-04T11:14:48+08:00
---
### **主要就是修改归档页面为默认折叠显示，按年月展开**
 在 `layouts\_default\archives.html` 中添加
```html
{{/* layouts/_default/archives.html —— 年→月二级归档 · 默认全部折叠 · 标题在前 · MM-DD后缀 */}}
{{define "main" }}

<header class="page-header">
  <h1>{{ .Title }}</h1>
  {{if .Description }}<div class="post-description">{{ .Description | markdownify }}</div>{{end }}
</header>

{{- $pages := where site.RegularPages "Type" "in" site.Params.mainSections }}
{{if site.Params.ShowAllPagesInArchive }}{{ $pages := site.RegularPages }}{{ end }}

{{- $monthMap := dict "January" "01" "February" "02" "March" "03" "April" "04" "May" "05" "June" "06" "July" "07"
"August" "08" "September" "09" "October" "10" "November" "11" "December" "12" }}

{{range $pages.GroupByPublishDate "2006" }}
{{if ne .Key "0001" }}
<section class="archive-year">
  <!-- ★ 把所有 open 属性删掉 = 默认折叠 ★ -->
  <details>
    <summary class="archive-year-header" id="{{ .Key }}">
      <span class="archive-toggle"></span>
      {{ .Key }} 年
      <sup class="archive-count">{{ len .Pages }} 篇</sup>
    </summary>

    <div class="archive-year-content">
      {{range .Pages.GroupByDate "January" }}
      {{- $monthNum := index $monthMap .Key }}
      {{- $monthID := printf "%s-%s" $.Key $monthNum }}

      <details>
        <summary class="archive-month-header" id="{{ $monthID }}">
          <span class="archive-toggle"></span>
          {{ .Key }}
          <sup class="archive-count">{{ len .Pages }} 篇</sup>
        </summary>

        <div class="archive-posts">
          {{range .Pages.ByPublishDate.Reverse }}
          {{if eq .Kind "page" }}
          <article class="archive-entry">
            <h3 class="archive-entry-title entry-hint-parent">
              <a href="{{ .Permalink }}">{{ .Title | markdownify }}</a>
              {{if .Draft }}<span class="entry-hint" title="Draft">[草稿]</span>{{end }}

              <span class="archive-date-postfix">
                ・ {{ .PublishDate.Format "01-02" }}
              </span>
            </h3>

            <div class="archive-meta">{{partial "post_meta.html" . -}}</div>
            <a class="entry-link" aria-label="post link to {{ .Title }}" href="{{ .Permalink }}"></a>
          </article>
          {{end }}
          {{end }}
        </div>
      </details>
      {{end }}
    </div>
  </details>
</section>
{{end }}
{{end }}

<style>
  details summary {
    list-style: none;
    cursor: pointer;
    user-select: none;
  }

  details summary::-webkit-details-marker {
    display: none;
  }

  .archive-toggle {
    display: inline-block;
    width: 1.2em;
    font-size: 0.85em;
    margin-right: 0.3em;
    opacity: 0.8;
    transition: opacity 0.2s;
  }

  details>summary .archive-toggle::before {
    content: "▶";
  }

  /* 折叠时右箭头 */
  details[open]>summary .archive-toggle::before {
    content: "▼";
  }

  /* 展开时下箭头 */

  .archive-year-header {
    font-size: 1.9em;
    font-weight: 600;
    margin: 1.8em 0 0.4em;
  }

  .archive-month-header {
    font-size: 1.55em;
    font-weight: 600;
    margin: 1.2em 0 0.4em 1.5em;
  }

  .archive-year-content {
    margin-left: 1.5em;
    margin-top: -0.4em;
  }

  .archive-posts {
    margin: 0.6em 0 1.8em 3em;
    padding-left: 0.5em;
  }

  .archive-count {
    font-size: 0.75em;
    color: var(--secondary);
    margin-left: 0.5em;
    font-weight: 500;
    vertical-align: middle;
    opacity: 0.9;
  }

  .archive-entry-title {
    font-size: 1.25em !important;
    margin: 0 0 0.35em !important;
    font-weight: 600;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.8em;
  }

  .archive-entry+.archive-entry {
    margin-top: 1rem;
  }

  .archive-date-postfix {
    font-size: 0.9em;
    color: var(--secondary);
    font-weight: normal;
    opacity: 0.9;
    flex-shrink: 0;
  }

  summary:hover {
    color: var(--tertiary);
  }

  summary:hover .archive-toggle {
    opacity: 1;
  }
</style>

{{end }}
```