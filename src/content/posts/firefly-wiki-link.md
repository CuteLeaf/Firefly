---
title: Firefly Wiki Link 内部链接示例
published: 1970-01-03
description: 在 Firefly 文章中使用 Obsidian 风格的 Wiki Link 内部链接，并自动生成文章链接卡片。
image: ""
tags: [Markdown, Obsidian, Wiki-Link, 文章示例]
category: 文章示例
slug: firefly-wiki-link
---

Firefly 支持在 Markdown、MDX 文章中使用 Obsidian 风格的 Wiki Link。链接目标填写文章的 slug，也就是文章相对于 `src/content/posts` 的文件路径，不需要包含扩展名。

## 文章链接卡片

`[[slug]]` 单独成段时，会自动读取目标文章的标题、描述、发布时间、分类、标签和封面，渲染为链接卡片：

```markdown
[[firefly]]

[[guide/index]]

[[markdown-extended]]

[[mdx-example]]
```

[[firefly]]

[[guide/index]]

[[markdown-extended]]

[[mdx-example]]

## 行内链接

`[[slug]]` 出现在正文中间时，渲染为普通链接，链接文字自动使用目标文章的标题

```markdown
请参阅 [[firefly]] 了解主题特性。
```

请参阅 [[firefly]] 了解主题特性。

## 自定义显示文字

在 `|` 后填写链接的显示文字。带自定义文字的链接始终渲染为普通链接，不会变成卡片，可以用来在单独一行时保持普通链接样式：

```markdown
[[firefly|Firefly 主题介绍]]
```

[[firefly|Firefly 主题介绍]]

## 目录中的文章

文章没有填写Frontmatter的情况下，就会默认使用目录名+文件名为slug

所以目录名称需要包含在 slug 中。以下写法会链接到 `src/content/posts/guide/index.md`，公开地址自动格式化为 `/posts/guide/`：

[[guide/index]]

```markdown
[[guide/index]]
```

也可以省略末尾的 `index`，或显式添加 `posts/` 前缀：

[[posts/guide|Firefly 简单使用指南]]

```markdown
[[posts/guide|Firefly 简单使用指南]]
```

## 链接到其他文章的标题

在文章 slug 后添加 `#标题`。带标题锚点的链接始终渲染为普通链接：

[[code-examples#语法高亮|查看代码块语法高亮]]

```markdown
[[code-examples#语法高亮|查看代码块语法高亮]]
```

标题锚点使用与页面标题相同的 slug 规则，因此中文、空格和大小写都会按页面实际生成的 ID 处理。

## 链接到本页标题

省略文章 slug，只填写标题即可链接到当前文章：

[[#本页目标|跳转到本页目标]]

```markdown
[[#本页目标|跳转到本页目标]]
```

## 本页目标

这是本页 Wiki Link 指向的标题。

## 不支持附件嵌入

附件嵌入语法目前不会被转换，会按原文显示：

![[image.png]]

行内代码和代码块中的 `[[firefly]]` 也不会被转换。
