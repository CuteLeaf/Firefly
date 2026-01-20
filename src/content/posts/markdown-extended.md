---
title: Markdown 扩展功能
published: 1970-01-01
updated: 1970-01-01
description: "了解 Firefly 中的 Markdown 功能"
image: ""
tags: [演示, 示例, Markdown, Firefly]
category: "文章示例"
draft: false
---

## GitHub 仓库卡片

您可以添加链接到 GitHub 仓库的动态卡片，在页面加载时，仓库信息会从 GitHub API 获取。

::github{repo="CuteLeaf/Firefly"}

使用代码 `::github{repo="CuteLeaf/Firefly"}` 创建 GitHub 仓库卡片。

```markdown
::github{repo="CuteLeaf/Firefly"}
```

## 提醒框(Admonitions)配置

Firefly 采用了 [rehype-callouts](https://github.com/lin-stephanie/rehype-callouts) 插件，支持了三种风格的提醒框主题：`GitHub`、`Obsidian` 和 `VitePress`。您可以在 `src/config/siteConfig.ts` 中进行配置：

```typescript
// src/config/siteConfig.ts
export const siteConfig: SiteConfig = {
  // ...
  rehypeCallouts: {
    // 选项: "github" | "obsidian" | "vitepress"
    theme: "github",
  },
  // ...
};
```

注意：**更改配置后需要重启开发服务器才能生效。**

以下是各个主题支持的类型列表，每个主题风格和语法不同，可根据喜好选择。

### 1. GitHub 主题风格

这是 GitHub 官方支持的 5 种基本类型。

![GitHub](./images/github.png)

**基本语法**

```markdown
> [!NOTE] NOTE
> 突出显示用户应该考虑的信息。

> [!TIP] TIP
> 可选信息，帮助用户更成功。

> [!IMPORTANT] IMPORTANT
> 用户成功所必需的关键信息。

> [!WARNING] WARNING
> 关键内容，需要立即注意。

> [!CAUTION] CAUTION
> 行动的负面潜在后果。

> [!NOTE] 自定义标题
> 这是一个带有自定义标题的示例。
```

---

### 2. Obsidian 主题风格

[Obsidian](https://obsidian.md/) 风格支持非常丰富的类型和别名。

<details>
<summary>点击展开 Obsidian 语法列表</summary>

```markdown

> [!NOTE] NOTE
> 通用的笔记块。

> [!ABSTRACT] ABSTRACT
> 文章的摘要。

> [!SUMMARY] SUMMARY
> 文章的总结（同 Abstract）。

> [!TLDR] TLDR
> 太长不看（同 Abstract）。

> [!INFO] INFO
> 提供额外信息。

> [!TODO] TODO
> 需要完成的事项。

> [!TIP] TIP
> 实用技巧或提示。

> [!HINT] HINT
> 暗示（同 Tip）。

> [!IMPORTANT] IMPORTANT
> 重要信息（Obsidian 风格通常使用类似的图标）。

> [!SUCCESS] SUCCESS
> 操作成功。

> [!CHECK] CHECK
> 检查通过（同 Success）。

> [!DONE] DONE
> 已完成（同 Success）。

> [!QUESTION] QUESTION
> 提出问题。

> [!HELP] HELP
> 寻求帮助（同 Question）。

> [!FAQ] FAQ
> 常见问题（同 Question）。

> [!WARNING] WARNING
> 警告信息。

> [!CAUTION] CAUTION
> 注意事项（同 Warning）。

> [!ATTENTION] ATTENTION
> 引起注意（同 Warning）。

> [!FAILURE] FAILURE
> 操作失败。

> [!FAIL] FAIL
> 失败（同 Failure）。

> [!MISSING] MISSING
> 缺失内容（同 Failure）。

> [!DANGER] DANGER
> 危险操作警告。

> [!ERROR] ERROR
> 错误信息（同 Danger）。

> [!BUG] BUG
> 报告软件缺陷。

> [!EXAMPLE] EXAMPLE
> 展示一个例子。

> [!QUOTE] QUOTE
> 引用一段话。

> [!CITE] CITE
> 引证（同 Quote）。

> [!NOTE] 自定义标题
> 这是一个带有自定义标题的示例。
```
</details>

![Obsidian](./images/obsidian.png)

---

### 3. VitePress 主题风格

[VitePress](https://vitepress.dev/) 风格提供了一套现代化的、扁平的默认样式。目前仅包含与 GitHub 一致的 **5 种** 基础类型。

<details>
<summary>点击展开 VitePress 语法列表</summary>

```markdown
> [!NOTE] NOTE
> 对应 GitHub 的 Note。

> [!TIP] TIP
> 对应 GitHub 的 Tip。

> [!IMPORTANT] IMPORTANT
> 对应 GitHub 的 Important。

> [!WARNING] WARNING
> 对应 GitHub 的 Warning。

> [!CAUTION] CAUTION
> 对应 GitHub 的 Caution。

> [!TIP] 自定义标题
> VitePress 风格同样支持自定义标题。
```
</details>

![VitePress](./images/vitepress.png)

---

### 4. Docusaurus 风格语法

仅支持语法，风格保持跟上面三个主题相同。

<details>
<summary>点击展开 Docusaurus 语法列表 </summary>

支持以下类型的提醒框：`note` `tip` `important` `warning` `caution`

```markdown
:::note
突出显示用户应该考虑的信息，即使在快速浏览时也是如此。
:::

:::tip
可选信息，帮助用户更成功。
:::

:::important
用户成功所必需的关键信息。
:::

:::warning
由于潜在风险需要用户立即注意的关键内容。
:::

:::caution
行动的负面潜在后果。
:::

:::tip[自定义标题]
可选信息，帮助用户更成功。
:::
```
 </details>



---

## 剧透

您可以为文本添加剧透。文本也支持 **Markdown** 语法。

内容 :spoiler[被隐藏了 **哈哈**]！

```markdown
内容 :spoiler[被隐藏了 **哈哈**]！
````