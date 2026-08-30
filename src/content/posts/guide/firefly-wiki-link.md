---
title: Firefly Wiki Link 内部链接示例
published: 1970-01-03
hidden: true
description: 在 Firefly 文章中使用 Obsidian 风格的 Wiki Link 内部链接，并自动生成文章链接卡片。
image: ""
tags: [Markdown, Obsidian, Wiki-Link, 文章示例]
category: 博客指南
slug: guide/firefly-wiki-link
---

Firefly 支持在 Markdown、MDX 文章中使用 Obsidian 风格的 Wiki Link 内部链接。链接目标填写文章的 slug 或文件路径，都不需要包含扩展名，具体匹配规则见下文「链接目标的三种写法」。

## 文章链接卡片

`[[slug]]` 单独成段时，会自动读取目标文章的标题、描述、发布时间、分类、标签和封面，渲染为链接卡片：

```markdown
[[firefly]]

[[guide/index]]

[[markdown-extended]]
```

[[firefly]]

[[guide/index]]

[[markdown-extended]]

## 行内链接

`[[slug]]` 出现在正文中间时，渲染为普通链接，链接文字自动使用目标文章的标题

```markdown
请参阅 [[firefly]] 了解主题特性。
```

请参阅 [[firefly]] 了解主题特性。

## 自定义显示标题

在 `|` 后填写链接的显示文字。行内链接会用它替换文章标题；单独成段时依然渲染为卡片，卡片标题使用自定义文字，描述、时间、分类、标签和封面仍然读取目标文章：

```markdown
请参阅 [[firefly|主题介绍]] 了解主题特性。

[[firefly|Firefly 主题介绍]]
```

请参阅 [[firefly|主题介绍]] 了解主题特性。

[[firefly|Firefly 主题介绍]]

一个例外：如果 `|` 后的文字只是把链接目标又抄了一遍（`[[guide/index|index]]`），会被当作无效别名忽略，仍然显示文章标题。Obsidian 在插入的链接时会自动补上这样的别名，避免笔记里显示一长串路径，这个例外就是为它准备的。

## 链接目标的三种写法

用 Obsidian 管理文章时，把 `src/content/posts` 目录本身作为 Obsidian 仓库（vault）打开。下文提到的「仓库根目录」都指这个目录，它正好也是 Firefly 解析链接路径的起点。

链接目标按以下顺序匹配：

| 写法 | 示例 | 在 Obsidian 中 |
|---|---|---|
| frontmatter 的 `slug` | `[[firefly-wiki-link]]` | ✗ 不支持 |
| 文件路径（相对仓库根目录） | `[[guide/firefly-layout-system]]` | ✓ 需改设置（推荐） |
| 裸文件名（仓库内唯一时） | `[[firefly-layout-system]]` | ✓ 默认即是 |

### 第一种：slug 

`slug` 写法在 Obsidian 中不支持，`slug` 是 Firefly 自己的概念，Obsidian 不读取 frontmatter 里的 `slug`，所以按 slug 写的链接在 Obsidian 里既不会自动补全，也点不动，只有构建出的站点上能正常跳转。如果你主要在 Obsidian 里写作，用下面两种写法。

### 第二种：文件路径（推荐）

文件路径写法需要改 Obsidian 设置，在 `设置 → 文件与链接 → 链接 → 内部链接类型` 中选择**基于仓库根目录的绝对路径**，Obsidian 插入的链接才会带上目录：

```markdown
[[guide/firefly-layout-system|firefly-layout-system]]
```

[[guide/firefly-layout-system|firefly-layout-system]]

因为仓库根目录就是 `src/content/posts`，Obsidian 写出的这个路径和 Firefly 需要的路径完全一致，不需要任何额外转换。

上面这行末尾的 `|firefly-layout-system` 是 Obsidian 自动补的别名，Firefly 会忽略它，卡片标题仍然取文章的 title，除非你把它修改和文件名不一致，才会变成你修改后的别名。

内部链接类型下拉框里的**基于当前笔记的相对路径**只在同目录内可用：它给同目录文章生成的是裸文件名，能正常匹配；但跨目录时会生成 `../` 前缀，Firefly 无法解析，链接会按原文显示。

### 第三种：裸文件名

「内部链接类型」的默认值就是**尽可能简短的形式**：只要文件名在整个仓库里唯一，Obsidian 插入的链接就只有文件名，不带目录。这种写法不需要改任何设置，效果和写完整路径完全一致：

```markdown
[[firefly-layout-system]]
```

[[firefly-layout-system]]

文件名重名时这种写法会失效，构建日志里会给出提示，改用完整文件路径即可，所以推荐直接修改 Obsidian 内部链接类型设置为**基于仓库根目录的绝对路径**，使用第二种文件路径写法，一劳永逸

## 链接到其他文章的标题

在文章 slug 后添加 `#标题`。带标题锚点的链接始终渲染为普通链接：

[[code-examples#语法高亮|查看代码块语法高亮]]

[[guide/firefly-layout-system#相关链接|firefly-layout-system]]

```markdown
[[code-examples#语法高亮|查看代码块语法高亮]]

[[guide/firefly-layout-system#相关链接|firefly-layout-system]]
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
