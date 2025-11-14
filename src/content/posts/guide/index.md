---
title: Firefly 简单使用指南
published: 1970-01-02
pinned: true
description: "如何使用 Firefly 博客模板。"
image: "./cover.webp"
tags: ["Firefly", "博客", "Markdown", "使用指南"]
category: 博客指南
draft: false
---



这个博客模板是基于 [Astro](https://astro.build/) 构建的。对于本指南中未提及的内容，您可以在 [Astro 文档](https://docs.astro.build/) 中找到答案。

## 文章的 Front-matter

```yaml
---
title: 我的第一篇博客文章
published: 2023-09-09
description: 这是我新 Astro 博客的第一篇文章。
image: ./cover.jpg
tags: [前端, 开发]
category: 前端开发
draft: false
---
```




| 属性          | 描述                                                                                                                                                                                                 |
|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `title`       | 文章标题。                                                                                                                                                                                          |
| `published`   | 文章发布日期。                                                                                                                                                                                      |
| `pinned`      | 是否将此文章置顶在文章列表顶部。                                                                                                                                                                    |
| `description` | 文章的简短描述。显示在首页上。                                                                                                                                                                      |
| `image`       | 文章封面图片路径。<br/>1. 以 `http://` 或 `https://` 开头：使用网络图片<br/>2. 以 `/` 开头：`public` 目录中的图片<br/>3. 不带任何前缀：相对于 markdown 文件的路径 |
| `tags`        | 文章标签。                                                                                                                                                                                          |
| `category`    | 文章分类。                                                                                                                                                                                          |
| `licenseName` | 文章内容的许可证名称。                                                                                                                                                                              |
| `author`      | 文章作者。                                                                                                                                                                                          |
| `sourceLink`  | 文章内容的来源链接或参考。                                                                                                                                                                          |
| `draft`       | 如果这篇文章仍是草稿，则不会显示。                                                                                                                                                                  |
| `slug`        | 自定义文章 URL 路径。如果不设置，将使用文件名作为 URL。                                                                                                                                              |

## 文章文件的放置位置

您的文章文件应放置在 `src/content/posts/` 目录中。您也可以创建子目录来更好地组织您的文章和资源。

```
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.png
    └── index.md
```

## 自定义文章 URL (Slug)

### 什么是 Slug？

Slug 是文章 URL 路径的自定义部分。如果不设置 slug，系统将使用文件名作为 URL。

### Slug 使用示例

#### 示例 1：使用文件名作为 URL
```yaml
---
title: 我的第一篇博客文章
published: 2023-09-09
---
```
文件：`src/content/posts/my-first-blog-post.md`
URL：`/posts/my-first-blog-post`

#### 示例 2：自定义 Slug
```yaml
---
title: 我的第一篇博客文章
published: 2023-09-09
slug: hello-world
---
```
文件：`src/content/posts/my-first-blog-post.md`
URL：`/posts/hello-world`

#### 示例 3：中文标题使用英文 Slug
```yaml
---
title: 如何使用 Firefly 博客主题
published: 2023-09-09
slug: how-to-use-firefly-blog-theme
---
```
文件：`src/content/posts/firefly-guide.md`
URL：`/posts/how-to-use-firefly-blog-theme`

### Slug 使用建议

1. **使用英文和连字符**：`my-awesome-post` 而不是 `my awesome post`
2. **保持简洁**：避免过长的 slug
3. **具有描述性**：让 URL 能够反映文章内容
4. **避免特殊字符**：只使用字母、数字和连字符
5. **保持一致性**：在整个博客中使用相似的命名模式

### 注意事项

- Slug 一旦设置并发布，建议不要随意更改，以免影响 SEO 和已存在的链接
- 如果多个文章使用相同的 slug，后面的文章会覆盖前面的
- Slug 会自动转换为小写