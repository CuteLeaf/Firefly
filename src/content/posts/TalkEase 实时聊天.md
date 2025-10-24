---
title: TalkEase - 实时聊天
categories: Cloudflare
tags:
  - Cloudflare
  - 实时聊天
  - 开源
id: 202510190515
published: 2025-10-19 05:15:00
recommend: true
---

# TalkEase - 实时聊天

::btn[👉 快速开始]{link="https://github.com/JASM1AM/TalkEase"}

::btn[👉 体验地址]{link="https://talkease-room.jasmiam.top/"}

## 项目概述

TalkEase 是一款轻量级实时聊天，支持用户注册登录、实时消息发送与接收、在线用户查看、消息导出与清空等功能，采用响应式设计，适配手机端与桌面端，后端基于 Cloudflare Worker 实现，数据库使用 Cloudflare D1（关系型数据库），部署便捷且无需自建服务器。

## 技术栈



| 模块   | 技术 / 工具                        | 说明                     |
| ---- | ------------------------------ | ---------------------- |
| 前端   | HTML5 + CSS3 + JavaScript      | 核心界面与交互逻辑              |
| 前端依赖 | Font Awesome、Anime.js、Typed.js | 图标库、动画库、文字打字效果         |
| 后端   | Cloudflare Worker              | 处理 API 请求、定时任务（用户离线检测） |
| 数据库  | Cloudflare D1                  | 存储用户数据与聊天消息            |
| 认证   | SHA-256 密码哈希                   | 用户密码加密存储               |
| 实时性  | 轮询机制（3 秒 / 次）+ 心跳检测            | 保证消息实时更新与在线状态同步        |

## 项目结构



```
TalkEase/

├─ index.html    # 前端界面（登录/注册、聊天、用户列表、设置）

├─ schema.sql    # 数据库表结构（用户表、消息表）

└─ worker.js     # 后端逻辑（API 处理、数据库操作、定时任务、速率限制）
```

各文件核心作用：

1. **index.html**：包含完整前端界面与交互逻辑，如登录注册表单、聊天窗口、消息输入区、底部导航等，集成响应式样式与动画效果。

2. **schema.sql**：定义 D1 数据库表结构（`users` 用户表、`messages` 消息表），并创建索引优化查询。

3. **worker.js**：Cloudflare Worker 核心逻辑，处理所有 API 请求（注册 / 登录 / 消息 / 用户状态）、定时检测离线用户、提供 HTML 页面访问。

## 环境准备

1. **Cloudflare 账号**：需注册 [Cloudflare 账号](https://dash.cloudflare.com/)（免费版足够使用）。

2. **Cloudflare D1 数据库**：在 Cloudflare 控制台创建 D1 数据库（用于存储用户与消息数据）。

## 部署步骤

#### 1. 创建 Cloudflare D1 数据库

1. 登录 Cloudflare 控制台，进入 **存储和数据库 > D1 SQL 数据库**，点击 **创建数据库**。

2. 输入数据库名称（如 `talkease-db`），选择免费计划，点击 **创建**。

3. 数据库创建完成后，进入 **查询** 页面，复制 `schema.sql` 中的所有代码，粘贴到查询框，点击 **运行**，创建 `users` 和 `messages` 表及索引。

#### 2. 创建 Cloudflare Worker



1. 进入 Cloudflare 控制台 **Workers 和 Pages > Workers**，点击 **创建 Worker**。

2. 输入 Worker 名称（如 `talkease-worker`），点击 **部署**（默认生成的代码可删除）。

3. 部署完成后，点击 **编辑代码**，进入 Worker 代码编辑器。

#### 3. 上传项目代码

1. 在 Worker 代码编辑器中，删除默认代码，将 `worker.js` 中的内容完整粘贴进去。

2. 处理 `index.html` 导入：

* 在 Worker 编辑器左侧，点击 **添加文件**，创建 `index.html` 文件，将项目中 `index.html` 的内容完整粘贴进去。

* 确保 `worker.js` 中 `import htmlContent from './index.html';` 语句正确（若编辑器提示导入错误，可将 `index.html` 内容转为字符串直接嵌入 `serveHTML()` 函数，示例：

```
function serveHTML() {

&#x20; const html = \`\<!DOCTYPE html>

&#x20; \<html lang="zh-CN">

&#x20; \<!-- 此处粘贴 index.html 完整内容 -->

&#x20; \</html>\`;

&#x20; return new Response(html, {

&#x20;   headers: {

&#x20;     'Content-Type': 'text/html; charset=utf-8',

&#x20;     'Access-Control-Allow-Origin': '\*',

&#x20;     'Cache-Control': 'public, max-age=300'

&#x20;   }

&#x20; });

}
```

1. 绑定 D1 数据库：
* 点击编辑器右侧 **设置 > 变量 > D1 数据库绑定**，点击 **添加绑定**。

* 绑定名称填写 `DB`（必须与 `worker.js` 中 `env.DB` 一致），选择第一步创建的 D1 数据库，点击 **保存**。

2. 点击编辑器顶部 **部署**，完成 Worker 部署。

#### 4. 测试访问

1. 部署完成后，点击 Worker 详情页的 **触发器 > 路由**，查看默认访问域名（如 `talkease-worker.your-account.workers.dev`）。

2. 在浏览器中访问该域名，若能正常显示 TalkEase 登录界面，说明部署成功。

## 功能使用说明

### 1. 注册与登录

* 首次使用需点击 **注册**，输入 QQ 号（5-12 位数字）、昵称（1-20 字符）、密码（6-20 位），注册后自动切换到登录页。

* 切勿输入QQ密码

* QQ号仅用于头像显示

* 输入 QQ 号和密码登录，登录后显示聊天界面。

### 2. 实时聊天

* 在聊天输入框输入消息（1-1000 字符），点击发送按钮或按 Enter 键发送。

* 消息实时更新（3 秒轮询一次），自己发送的消息在右侧（渐变色背景），他人消息在左侧（白色背景）。

### 3. 消息管理

* 点击聊天界面顶部 **垃圾桶图标**，可清空所有已发送的消息。

* 点击 **下载图标**，可导出聊天记录为 TXT 文件（保存到手机下载目录）。

### 4. 用户列表

* 点击底部导航 **用户**，查看 30 秒内在线的用户（显示昵称和 QQ 号）。

### 5. 个人设置

* 点击底部导航 **设置**，可查看 QQ 号码和昵称，点击 **修改** 可更改昵称。

* 可点击 **清空已发送的聊天记录** 或 **退出登录**。

## 常见问题与解决方案

1. **访问 Worker 时显示 “500 错误”**：
* 检查 D1 数据库是否绑定正确（绑定名称是否为 `DB`）。

* 查看 Worker 日志（**日志 > 实时日志**），排查代码错误（如 `index.html` 导入问题）。

2. **注册时提示 “QQ 号码已被注册”**：
* 确认 QQ 号码输入正确，若已注册可直接登录，或更换其他 QQ 号码。

3. **手机端控制台操作不便**：
* 确保浏览器已开启 “桌面模式”，可放大页面后点击操作，或使用 Cloudflare 官方手机 APP（功能有限，建议优先桌面模式）。

4. **消息不实时更新**：
* 检查网络连接，若网络正常，可能是轮询机制延迟（默认 3 秒，可在 `index.html` 中修改 `startMessagePolling()` 函数的 `setInterval` 时间）。

5. **头像不显示**：
* 头像使用 QQ 官方头像接口，若不显示可能是 QQ 号无效或网络问题，会自动显示昵称首字母作为备用头像。

## 许可证

本项目采用 MIT 许可证，可自由使用、修改和分发

> （注：本文档部分内容可能由 AI 生成）