---
title: Markdown Mermaid 图表
published: 1970-01-01
pinned: false
description: 一个包含 Mermaid 的 Markdown 博客文章简单示例。
tags: [Markdown, 博客, Mermaid, Firefly]
category: 文章示例
slug: markdown-mermaid
---
## Markdown 中 Mermaid 图表完整指南

本文演示如何在 Markdown 文档中使用 Mermaid 创建各种复杂图表，包括流程图、时序图、ER 图、类图、状态图、XY 图、甘特图、思维导图等。

> Mermaid 图表由 [Merman](https://github.com/Latias94/merman) 实现。Firefly 在 Astro 构建阶段生成亮色和深色两套静态 SVG，无需在浏览器中加载 Mermaid 渲染运行时。可以前往 [Merman Playground](http://frankorz.com/merman/) 实时编辑语法并预览渲染结果。

## 流程图示例

流程图非常适合表示流程或算法步骤。




```mermaid
graph TD
    A[开始] --> B{条件检查}
    B -->|是| C[处理步骤 1]
    B -->|否| D[处理步骤 2]
    C --> E[子过程]
    D --> E
    subgraph E [子过程详情]
        E1[子步骤 1] --> E2[子步骤 2]
        E2 --> E3[子步骤 3]
    end
    E --> F{另一个决策}
    F -->|选项 1| G[结果 1]
    F -->|选项 2| H[结果 2]
    F -->|选项 3| I[结果 3]
    G --> J[结束]
    H --> J
    I --> J
```

## 时序图示例

时序图显示对象之间随时间的交互。

```mermaid
sequenceDiagram
    participant User as 用户
    participant WebApp as 网页应用
    participant Server as 服务器
    participant Database as 数据库

    User->>WebApp: 提交登录请求
    WebApp->>Server: 发送认证请求
    Server->>Database: 查询用户凭据
    Database-->>Server: 返回用户数据
    Server-->>WebApp: 返回认证结果
    
    alt 认证成功
        WebApp->>User: 显示欢迎页面
        WebApp->>Server: 请求用户数据
        Server->>Database: 获取用户偏好
        Database-->>Server: 返回偏好设置
        Server-->>WebApp: 返回用户数据
        WebApp->>User: 加载个性化界面
    else 认证失败
        WebApp->>User: 显示错误消息
        WebApp->>User: 提示重新输入
    end
```

## ER 图示例

ER 图（实体关系图）非常适合表示数据库结构。

```mermaid
erDiagram
    USER {
        int id PK
        string username
        string email
        datetime created_at
    }
    ARTICLE {
        int id PK
        string title
        text content
        datetime published
        int author_id FK
    }
    COMMENT {
        int id PK
        text content
        datetime created_at
        int user_id FK
        int article_id FK
    }
    CATEGORY {
        int id PK
        string name
        string description
    }
    USER ||--o{ ARTICLE : "writes"
    USER ||--o{ COMMENT : "posts"
    ARTICLE ||--o{ COMMENT : "has"
    ARTICLE }o--o{ CATEGORY : "belongs to"
```

## 类图示例

类图显示系统的静态结构，包括类、属性、方法及其关系。

```mermaid
classDiagram
    class User {
        +String username
        +String password
        +String email
        +Boolean active
        +login()
        +logout()
        +updateProfile()
    }
    
    class Article {
        +String title
        +String content
        +Date publishDate
        +Boolean published
        +publish()
        +edit()
        +delete()
    }
    
    class Comment {
        +String content
        +Date commentDate
        +addComment()
        +deleteComment()
    }
    
    class Category {
        +String name
        +String description
        +addArticle()
        +removeArticle()
    }
    
    User "1" -- "*" Article : 写作
    User "1" -- "*" Comment : 发表
    Article "1" -- "*" Comment : 拥有
    Article "1" -- "*" Category : 属于
```

## 状态图示例

状态图显示对象在其生命周期中经历的状态序列。

```mermaid
stateDiagram-v2
    [*] --> 草稿
    
    草稿 --> 审核中 : 提交
    审核中 --> 草稿 : 拒绝
    审核中 --> 已批准 : 批准
    已批准 --> 已发布 : 发布
    已发布 --> 已归档 : 归档
    已发布 --> 草稿 : 撤回
    
    state 已发布 {
        [*] --> 活跃
        活跃 --> 隐藏 : 临时隐藏
        隐藏 --> 活跃 : 恢复
        活跃 --> [*]
        隐藏 --> [*]
    }
    
    已归档 --> [*]
```

## XY 图示例

XY 图表非常适合展示趋势和对比数据。

```mermaid
xychart-beta
    title "月度访问量趋势"
    x-axis [1月, 2月, 3月, 4月, 5月, 6月]
    y-axis "访问量" 0 --> 5000
    bar [2500, 3200, 4100, 3800, 4500, 4800]
    line [2500, 3200, 4100, 3800, 4500, 4800]
```

## 饼图示例

饼图适合直观展示各部分在整体中的占比。

```mermaid
pie showData
    title 内容类型占比
    "技术文章" : 45
    "项目记录" : 30
    "生活随笔" : 15
    "其他" : 10
```

## 甘特图示例

甘特图可以按时间轴展示项目阶段、任务依赖和当前进度。

```mermaid
gantt
    title 博客版本发布计划
    dateFormat YYYY-MM-DD
    axisFormat %m/%d
    section 准备
    需求整理 :done, req, 2026-07-01, 3d
    视觉设计 :done, design, after req, 4d
    section 开发
    功能实现 :active, dev, after design, 7d
    内容迁移 :content, after design, 5d
    section 发布
    构建检查 :test, after dev, 2d
    正式上线 :milestone, release, after test, 0d
```

## 思维导图示例

思维导图适合梳理主题层级和知识结构。

```mermaid
mindmap
  root((Firefly))
    内容
      技术文章
      生活记录
    体验
      搜索
      深色模式
      图表
    工程
      Astro
      Svelte
      Merman
```

## 时间线示例

时间线用于按年份或阶段呈现项目的重要事件。

```mermaid
timeline
    title Firefly 演进时间线
    2024 : 建立博客
         : 完成基础主题
    2025 : 加入搜索与图库
         : 完善内容系统
    2026 : 升级 Astro 7
         : 使用 Merman 渲染图表
```

## 用户旅程图示例

用户旅程图能够描述用户在不同阶段的行为和体验评分。

```mermaid
journey
    title 读者浏览文章的旅程
    section 发现内容
      打开首页: 5: 读者
      搜索主题: 4: 读者
    section 阅读文章
      浏览正文: 5: 读者
      查看图表: 5: 读者
    section 继续探索
      查看相关文章: 4: 读者
      分享文章: 3: 读者
```

## Git 图示例

Git 图可以清晰展示分支、提交和合并历史。

```mermaid
gitGraph
    commit id: "init"
    branch feature
    checkout feature
    commit id: "add-diagrams"
    commit id: "polish-themes"
    checkout main
    merge feature id: "merge-feature"
    commit id: "release"
```

## 看板示例

看板适合展示任务在不同工作阶段之间的分布。

```mermaid
kanban
  todo[待办]
    task1[整理需求]
    task2[准备示例]
  doing[进行中]
    task3[接入 Merman]
  done[已完成]
    task4[服务端渲染]
    task5[亮暗主题]
```

## Sankey 图示例

Sankey 图通过连线宽度展示流量在不同节点之间的流向。

```mermaid
sankey-beta
Home,Post list,1200
Home,Search,450
Post list,Post detail,900
Search,Post detail,320
Post detail,Related posts,260
Post detail,External shares,180
```

## 总结

Mermaid 是在 Markdown 文档中创建各种类型图表的强大工具。本文演示了流程图、时序图、ER 图、类图、状态图、XY 图、饼图、甘特图、思维导图、时间线、用户旅程图、Git 图、看板和 Sankey 图。这些图表可以帮助您更清晰地表达复杂的概念、流程和数据结构。

要使用 Mermaid，只需在代码块中指定 mermaid 语言，并使用简洁的文本语法描述图表。图表会在构建时自动渲染为 SVG，无需客户端 JavaScript 加载。

可以前往 [Merman Playground](http://frankorz.com/merman/) 尝试更多语法，再将图表代码粘贴到文章中。
