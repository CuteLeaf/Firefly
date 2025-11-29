---
title: Markdown 教程
published: 1970-01-01
pinned: false
description: 一个简明的 Markdown 博客示例。
tags: [文章示例]
category: 文章示例
licenseName: "未授权"
author: emn178
sourceLink: "https://github.com/emn178/markdown"
draft: false

---

# Markdown 教程

这是一个展示如何编写 Markdown 文件的示例。本文档汇总了核心语法与常见扩展（GFM）。

- [块级元素](#block-elements)
    - [段落与换行](#paragraphs-and-line-breaks)
    - [标题](#headers)
    - [引用](#blockquotes)
    - [列表](#lists)
    - [代码块](#code-blocks)
    - [分割线](#horizontal-rules)
    - [表格](#table)
- [内联元素](#span-elements)
    - [链接](#links)
    - [强调](#emphasis)
    - [行内代码](#code)
    - [图片](#images)
    - [删除线](#strikethrough)
- [杂项](#miscellaneous)
    - [自动链接](#automatic-links)
    - [反斜杠转义](#backslash-escapes)
- [内联 HTML](#inline-html)

<a id="block-elements"></a>
## 块级元素

<a id="paragraphs-and-line-breaks"></a>
### 段落与换行

#### 段落

HTML 标签：`<p>`

使用一个或多个空行分隔段落。（仅包含**空格**或**制表符**的行也视为空行。）

代码：

    This will be
    inline.

    This is second paragraph.

预览：

---

This will be
inline.

This is second paragraph.

---

#### 换行

HTML 标签：`<br />`

在行末添加**两个或更多空格**来产生换行。

代码：

    This will be not
    inline.

预览：

---

This will be not  
inline.

---

<a id="headers"></a>
### 标题

Markdown 支持两种标题样式：Setext 与 atx。

#### Setext

HTML 标签：`<h1>`，`<h2>`

使用**等号 (=)** 表示 `<h1>`、使用**短横线 (-)** 表示 `<h2>`，数量不限，作为“下划线”。

代码：

    This is an H1
    =============
    This is an H2
    -------------

预览：

---

# This is an H1

## This is an H2

---

#### atx

HTML 标签：`<h1>`，`<h2>`，`<h3>`，`<h4>`，`<h5>`，`<h6>`

在行首使用 1-6 个**井号 (#)**，对应 `<h1>` 至 `<h6>`。

代码：

    # This is an H1
    ## This is an H2
    ###### This is an H6

预览：

---

# This is an H1

## This is an H2

###### This is an H6

---

可选：你可以在行尾“闭合” atx 标题。末尾的井号数量**不必与**开头一致。

代码：

    # This is an H1 #
    ## This is an H2 ##
    ### This is an H3 ######

预览：

---

# This is an H1

## This is an H2

### This is an H3

---

<a id="blockquotes"></a>
### 引用

HTML 标签：`<blockquote>`

Markdown 使用邮件风格的 **>** 作为引用符号。若手动换行并在每行前加 >，显示效果最佳。

代码：

    > This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
    > consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
    > Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
    >
    > Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
    > id sem consectetuer libero luctus adipiscing.

预览：

---

> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
> Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
>
> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
> id sem consectetuer libero luctus adipiscing.

---

Markdown 允许“偷懒”：在一个硬换行段落中，只在第一行前加 > 即可。

代码：

    > This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
    consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
    Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.

    > Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
    id sem consectetuer libero luctus adipiscing.

预览：

---

> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
> Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.

> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
> id sem consectetuer libero luctus adipiscing.

---

引用可以嵌套（引用中的引用），通过增加 > 层级实现。

代码：

    > This is the first level of quoting.
    >
    > > This is nested blockquote.
    >
    > Back to the first level.

预览：

---

> This is the first level of quoting.
>
> > This is nested blockquote.
>
> Back to the first level.

---

引用内可包含其他 Markdown 元素，包括标题、列表与代码块。

代码：

    > ## This is a header.
    >
    > 1.   This is the first list item.
    > 2.   This is the second list item.
    >
    > Here's some example code:
    >
    >     return shell_exec("echo $input | $markdown_script");

预览：

---

> ## This is a header.
>
> 1.  This is the first list item.
> 2.  This is the second list item.
>
> Here's some example code:
>
>     return shell_exec("echo $input | $markdown_script");

---

<a id="lists"></a>
### 列表

Markdown 支持有序（数字）与无序（圆点）列表。

#### 无序列表

HTML 标签：`<ul>`

无序列表可使用 **星号 (\*)**、**加号 (+)** 或 **短横线 (-)**。

代码：

    *   Red
    *   Green
    *   Blue

预览：

---

- Red
- Green
- Blue

---

等价于：

代码：

    +   Red
    +   Green
    +   Blue

或者：

代码：

    -   Red
    -   Green
    -   Blue

#### 有序列表

HTML 标签：`<ol>`

有序列表使用数字加英文句点：

代码：

    1.  Bird
    2.  McHale
    3.  Parish

预览：

---

1.  Bird
2.  McHale
3.  Parish

---

注意：像下面这样可能会“意外触发”有序列表：

代码：

    1986. What a great season.

预览：

---

1986. What a great season.

---

你可以用**反斜杠转义 (\\)** 句点：

代码：

    1986\. What a great season.

预览：

---

1986\. What a great season.

---

#### 列表中的缩进内容

##### 列表项里的引用

在列表项内放置引用，需要将 > 符号整体缩进：

代码：

    *   A list item with a blockquote:

        > This is a blockquote
        > inside a list item.

预览：

---

- A list item with a blockquote:

  > This is a blockquote
  > inside a list item.

---

##### 列表项里的代码块

在列表项内放置代码块，需要缩进两层——**8 个空格**或**两个 Tab**：

代码：

    *   A list item with a code block:

            <code goes here>

预览：

---

- A list item with a code block:

      <code goes here>

---

##### 嵌套列表

代码：

    * A
      * A1
      * A2
    * B
    * C

预览：

---

- A
  - A1
  - A2
- B
- C

---

<a id="code-blocks"></a>
### 代码块

HTML 标签：`<pre>`

将代码块中的每行缩进至少**4 个空格**或**1 个制表符**。

代码：

    This is a normal paragraph:

        This is a code block.

预览：

---

This is a normal paragraph:

    This is a code block.

---

代码块会一直持续，直到遇到未缩进的行（或文末）。

在代码块内，**与号 (&)** 和尖括号 **(< >)** 会自动转为 HTML 实体。

代码：

        <div class="footer">
            &copy; 2004 Foo Corporation
        </div>

预览：

---

    <div class="footer">
        &copy; 2004 Foo Corporation
    </div>

---

下文的“围栏代码块”和“语法高亮”属于扩展语法，你也可以用它们来书写代码块。

#### 围栏代码块

使用成对的反引号围起来（如下所示），就不需要四空格缩进了。

代码：

    Here's an example:

    ```
    function test() {
      console.log("notice the blank line before this function?");
    }
    ```

预览：

---

Here's an example:

```
function test() {
  console.log("notice the blank line before this function?");
}
```

---

#### 语法高亮

在围栏代码块后添加可选的语言标识，即可启用语法高亮（参见支持语言列表）。

代码：

    ```ruby
    require 'redcarpet'
    markdown = Redcarpet.new("Hello World!")
    puts markdown.to_html
    ```

预览：

---

```ruby
require 'redcarpet'
markdown = Redcarpet.new("Hello World!")
puts markdown.to_html
```

---

<a id="horizontal-rules"></a>
### 分割线（水平线）

HTML 标签：`<hr />`
一行中放置**三个或以上的短横线 (-)、星号 (\*) 或下划线 (\_)**。符号之间允许有空格。

代码：

    * * *
    ***
    *****
    - - -
    ---------------------------------------
    ___

预览：

---

---

---

---

---

---

---

---

<a id="table"></a>
### 表格

HTML 标签：`<table>`

这是扩展语法。

用**竖线 (|)** 分隔列，用**短横线 (-)** 分隔表头，使用**冒号 (:)** 指定对齐方式。

两侧的**竖线 (|)** 与对齐可选。用于表头分隔时，每列至少需要 **3 个短横线**。

代码：

```
| Left | Center | Right |
|:-----|:------:|------:|
|aaa   |bbb     |ccc    |
|ddd   |eee     |fff    |

 A | B
---|---
123|456


A |B
--|--
12|45
```

预览：

---

| Left | Center | Right |
| :--- | :----: | ----: |
| aaa  |  bbb   |   ccc |
| ddd  |  eee   |   fff |

| A   | B   |
| --- | --- |
| 123 | 456 |

| A   | B   |
| --- | --- |
| 12  | 45  |

---

<a id="span-elements"></a>
## 内联元素

<a id="links"></a>
### 链接

HTML 标签：`<a>`

Markdown 支持两种链接样式：行内链接与引用式链接。

#### 行内链接

行内链接格式：`[文本](URL "标题")`

标题可选。

代码：

    This is [an example](http://example.com/ "Title") inline link.

    [This link](http://example.net/) has no title attribute.

预览：

---

This is [an example](http://example.com/ "Title") inline link.

[This link](http://example.net/) has no title attribute.

---

如果引用同一站点的本地资源，可以使用相对路径：

代码：

    See my [About](/about/) page for details.

预览：

---

See my [About](/about/) page for details.

---

#### 引用式链接

可以预定义链接引用。定义格式：`[id]: URL "标题"`

标题同样可选。引用时使用：`[文本][id]`

代码：

    [id]: http://example.com/  "Optional Title Here"
    This is [an example][id] reference-style link.

预览：

---

[id]: http://example.com/ "Optional Title Here"

This is [an example][id] reference-style link.

---

说明：

- 方括号中包含链接标识（**不区分大小写**，可在左侧缩进最多三格空格）；
- 随后是冒号；
- 再跟一个或多个空格（或 tab）；
- 然后是链接 URL；
- URL 可选地用尖括号包裹；
- 可选地跟随标题属性，用引号或圆括号包裹。

以下三种定义等价：

代码：

    [foo]: http://example.com/  "Optional Title Here"
    [foo]: http://example.com/  'Optional Title Here'
    [foo]: http://example.com/  (Optional Title Here)
    [foo]: <http://example.com/>  "Optional Title Here"

如果使用空的方括号，则链接文本本身会作为名称。

代码：

    [Google]: http://google.com/
    [Google][]

预览：

---

[Google]: http://google.com/

[Google][]

---

<a id="emphasis"></a>
### 强调

HTML 标签：`<em>`，`<strong>`

Markdown 使用 **星号 (\*)** 或 **下划线 (\_)** 表示强调。**一个分隔符**对应 `<em>`；**两个分隔符**对应 `<strong>`。

代码：

    *single asterisks*

    _single underscores_

    **double asterisks**

    __double underscores__

预览：

---

_single asterisks_

_single underscores_

**double asterisks**

**double underscores**

---

但如果两侧有空格，则会被视作普通字符而非强调语法。

你可以使用反斜杠进行转义：

代码：

    \*this text is surrounded by literal asterisks\*

预览：

---

\*this text is surrounded by literal asterisks\*

---

<a id="code"></a>
### 行内代码

HTML 标签：`<code>`

用**反引号 (`)** 包裹。

代码：

    Use the `printf()` function.

预览：

---

Use the `printf()` function.

---

若行内代码中需要包含反引号字符，可使用**多重反引号**作为定界符：

代码：

    ``There is a literal backtick (`) here.``

预览：

---

``There is a literal backtick (`) here.``

---

行内代码两侧的定界符允许包含空格（开头一个、结尾一个），方便在代码起始或结尾放置反引号字符：

代码：

    A single backtick in a code span: `` ` ``

    A backtick-delimited string in a code span: `` `foo` ``

预览：

---

A single backtick in a code span: `` ` ``

A backtick-delimited string in a code span: `` `foo` ``

---

<a id="images"></a>
### 图片

HTML 标签：`<img />`

Markdown 的图片语法与链接类似，支持行内与引用两种方式。

#### 行内图片

行内图片语法：`![替代文本](URL "标题")`

标题可选。

代码：

    ![Alt text](/path/to/img.jpg)

    ![Alt text](/path/to/img.jpg "Optional title")

预览：

---

![Alt text](https://s2.loli.net/2024/08/20/5fszgXeOxmL3Wdv.webp)

![Alt text](https://s2.loli.net/2024/08/20/5fszgXeOxmL3Wdv.webp "Optional title")

---

说明：

- 一个感叹号 !；
- 后接方括号，放置图片的替代文本；
- 再接圆括号，内含图片 URL/路径，及可选的标题（引号包裹）。

#### 引用式图片

引用式图片语法：`![替代文本][id]`

代码：

    [img id]: https://s2.loli.net/2024/08/20/5fszgXeOxmL3Wdv.webp  "Optional title attribute"
    ![Alt text][img id]

预览：

---

[img id]: https://s2.loli.net/2024/08/20/5fszgXeOxmL3Wdv.webp "Optional title attribute"

![Alt text][img id]

---

<a id="strikethrough"></a>
### 删除线

HTML 标签：`<del>`

这是扩展语法。

GFM 增加了删除线语法。

代码：

```
~~Mistaken text.~~
```

预览：

---

~~Mistaken text.~~

---

<a id="miscellaneous"></a>
## 杂项

<a id="automatic-links"></a>
### 自动链接

Markdown 支持一种便捷写法来创建“自动链接”（URL 与邮箱地址）：只需用尖括号将其包住即可。

代码：

    <http://example.com/>

    <address@example.com>

预览：

---

<http://example.com/>

<address@example.com>

---

GFM 会自动识别标准 URL 并转换为链接。

代码：

```
https://github.com/emn178/markdown
```

预览：

---

https://github.com/emn178/markdown

---

<a id="backslash-escapes"></a>
### 反斜杠转义

Markdown 允许使用反斜杠来转义那些本用于 Markdown 语法的特殊字符，使其按字面显示。

代码：

    \*literal asterisks\*

预览：

---

\*literal asterisks\*

---

以下字符可通过反斜杠转义以按字面量输出：

Code:

    \   backslash
    `   backtick
    *   asterisk
    _   underscore
    {}  curly braces
    []  square brackets
    ()  parentheses
    #   hash mark
    +   plus sign
    -   minus sign (hyphen)
    .   dot
    !   exclamation mark

<a id="inline-html"></a>
## 内联 HTML

对于 Markdown 语法未覆盖的标记，直接使用原生 HTML 即可。无需特别声明从 Markdown 切换到 HTML，直接写标签就行。

代码：

    This is a regular paragraph.

    <table>
        <tr>
            <td>Foo</td>
        </tr>
    </table>

    This is another regular paragraph.

预览：

---

This is a regular paragraph.

<table>
    <tr>
        <td>Foo</td>
    </tr>
</table>

This is another regular paragraph.

---

请注意：在**块级 HTML 标签**内不会处理 Markdown 语法。

与块级标签不同，在**行内级标签**内会处理 Markdown 语法。

代码：

    <span>**Work**</span>

    <div>
        **No Work**
    </div>

预览：

---

<span>**Work**</span>

<div>
  **No Work**
</div>
***