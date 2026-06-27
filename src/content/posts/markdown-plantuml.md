---
title: Markdown PlantUML 图表
published: 1970-01-01
description: 用于验证 Firefly 中 PlantUML 插件渲染、主题切换与交互能力的示例文章。
tags: [PlantUML, Firefly, Markdown]
category: 文章示例
draft: false
---

## Markdown 中 PlantUML 图表指南

PlantUML 是一种使用纯文本描述图表的工具。你只需要写一段结构化语法，就可以生成时序图、类图、用例图、活动图等常见工程图。

它特别适合写在技术博客和项目文档里：

- 图表和正文一起版本管理，便于协作与审阅
- 修改图只需要改文本，适合频繁迭代
- 能和 Markdown 无缝结合，保持文档统一

在 Firefly 中，`plantuml` 代码块会在构建阶段编码并生成服务器 SVG 地址，页面端再根据亮暗主题自动切换图源，并支持缩放、拖拽和全屏交互。

如果你想快速上手，可以记住这个最小模板：

```plantuml
@startuml
Alice -> Bob: Hello
Bob --> Alice: Hi
@enduml
```

## 活动图示例

```plantuml
@startuml
start
:用户提交订单;
if (库存充足?) then (是)
	:冻结库存;
	:创建支付单;
	if (支付成功?) then (是)
		:生成发货单;
		:通知仓库拣货;
	else (否)
		:取消订单;
		:释放库存;
	endif
else (否)
	:提示缺货;
endif
stop
@enduml
```

## 状态图示例

```plantuml
@startuml
[*] --> 草稿

草稿 --> 待审核 : 提交
待审核 --> 草稿 : 驳回
待审核 --> 已发布 : 审核通过
已发布 --> 已归档 : 到期归档
已发布 --> 草稿 : 撤回修改

state 已发布 {
	[*] --> 可见
	可见 --> 隐藏 : 手动隐藏
	隐藏 --> 可见 : 恢复展示
}

已归档 --> [*]
@enduml
```

## 用例图示例

```plantuml
@startuml
left to right direction
actor 游客
actor 用户
actor 管理员

rectangle 博客系统 {
	usecase "浏览文章" as UC1
	usecase "搜索内容" as UC2
	usecase "发表评论" as UC3
	usecase "点赞收藏" as UC4
	usecase "审核评论" as UC5
	usecase "发布文章" as UC6
}

游客 --> UC1
游客 --> UC2
用户 --> UC1
用户 --> UC2
用户 --> UC3
用户 --> UC4
管理员 --> UC5
管理员 --> UC6
@enduml
```

## 组件图示例

```plantuml
@startuml
package "Firefly Site" {
	[Astro App] as App
	[Markdown Parser] as Parser
	[PlantUML Encoder] as Encoder
	[Theme Switcher] as Theme
	[Search Indexer] as Search
}

cloud "PlantUML Server" as PU
database "Content Store" as Content

App --> Parser : parse markdown
Parser --> Encoder : encode plantuml blocks
Encoder --> PU : request svg
App --> Theme : switch dark/light src
App --> Search : build page index
Parser --> Content : read posts
@enduml
```

## 部署图示例

```plantuml
@startuml
node "User Device" {
	artifact "Browser"
}

node "CDN / Edge" {
	artifact "Static Assets"
}

node "Cloudflare Worker" {
	artifact "SSR Handler"
}

node "PlantUML Service" {
	artifact "SVG Renderer"
}

database "Object Storage" {
	artifact "Markdown Content"
}

"Browser" --> "Static Assets" : GET js/css/img
"Browser" --> "SSR Handler" : request page
"SSR Handler" --> "Markdown Content" : read post
"Browser" --> "SVG Renderer" : fetch diagram svg
@enduml
```

## ER 图示例

```plantuml
@startuml
entity User {
	*id : uuid <<PK>>
	--
	username : varchar
	email : varchar
	created_at : datetime
}

entity Post {
	*id : uuid <<PK>>
	--
	author_id : uuid <<FK>>
	title : varchar
	content : text
	published_at : datetime
}

entity Comment {
	*id : uuid <<PK>>
	--
	post_id : uuid <<FK>>
	user_id : uuid <<FK>>
	body : text
	created_at : datetime
}

User ||--o{ Post : writes
User ||--o{ Comment : creates
Post ||--o{ Comment : has
@enduml
```

## 时序图示例（登录与刷新令牌）

```plantuml
@startuml
autonumber
actor User as 用户
participant Web as 前端页面
participant API as 网关接口
participant Auth as 认证服务
database Redis as 会话缓存

用户 -> 前端页面 : 输入账号密码并提交
前端页面 -> 网关接口 : POST /login
网关接口 -> 认证服务 : 校验凭据
认证服务 -> 会话缓存 : 写入 refresh_token
认证服务 --> 网关接口 : access_token + refresh_token
网关接口 --> 前端页面 : 200 登录成功

... access_token 过期 ...

前端页面 -> 网关接口 : POST /refresh
网关接口 -> 认证服务 : 校验 refresh_token
认证服务 -> 会话缓存 : 轮换 refresh_token
认证服务 --> 网关接口 : 新 access_token
网关接口 --> 前端页面 : 200 新令牌
@enduml
```

## C4 风格容器图示例

```plantuml
@startuml
!includeurl https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

Person(user, "博客访客", "阅读文章与搜索内容")

System_Boundary(system, "Firefly Blog") {
	Container(web, "Web App", "Astro + Svelte", "渲染页面与交互")
	Container(worker, "SSR Worker", "Cloudflare Workers", "处理服务端渲染请求")
	ContainerDb(content, "Content Store", "Markdown / Object Storage", "存储文章与资源元数据")
	Container(search, "Search Index", "Pagefind", "提供全文检索")
}

System_Ext(plantuml, "PlantUML Server", "生成 SVG 图表")

Rel(user, web, "访问", "HTTPS")
Rel(web, worker, "请求 SSR 页面", "HTTPS")
Rel(worker, content, "读取文章")
Rel(web, search, "查询关键词")
Rel(web, plantuml, "请求图表 SVG")

LAYOUT_LEFT_RIGHT()
@enduml
```

