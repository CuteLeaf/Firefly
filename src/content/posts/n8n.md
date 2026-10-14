---
title: 从零开始部署n8n
published: 2025-11-10
description: 这是一篇使用Zeabur部署n8n的教程
tags:
  - n8n
  - zeabur
category: 部署
draft: false
series: 部署
lang: zh_CN
---
# 从零开始部署n8n
  **n8n** 是一个开源的、功能强大的工作流自动化工具，允许用户通过可视化方式连接不同的应用程序和服务。它结合了 **AI 功能** 和 **业务流程自动化**，帮助开发者和非技术人员创建复杂的工作流，实现数据在不同系统间的自动传输和处理。
# 部署
那我们要怎样才能部署n8n呢？我选择的是[Zeabur](https://zeabur.com/)
## 什么是Zeabur?
[Zeabur文档](https://zeabur.com/docs/zh-CN)的官方文档是这样介绍的
**Zeabur** 是一个可以帮助你部署服务的平台，无论你使用什么编程语言或开发框架，你都只需要通过几个简单的按钮进行部署。
  而且，Zeabur还采用按量计费，我们只需要为我们的服务实际用到的资源付费。

## 注册Zeabur
  zeabur上有详细的注册引导，这里不细讲了。

## 部署n8n
![](https://cdn.jsdelivr.net/gh/MCKero6423/picx-images-hosting@master/image.4ubcom13md.webp)
打开Zeabur的控制台，你可以看到有一个创建项目的按钮，点一下，就会到达这个界面。

![](https://cdn.jsdelivr.net/gh/MCKero6423/picx-images-hosting@master/image.4g4wxqweuw.webp)
点击模板，n8n就在第一位。

![](https://cdn.jsdelivr.net/gh/MCKero6423/picx-images-hosting@master/image.szda83mtn.webp)
这上面有很多的项目比如n8n，LobeChat，SillyTavern。我们点击Deploy

![](https://cdn.jsdelivr.net/gh/MCKero6423/picx-images-hosting@master/image.5fl0ax5s9f.webp)
这里让我们输入一个域名，自己取一个就好。

![](https://cdn.jsdelivr.net/gh/MCKero6423/picx-images-hosting@master/image.2a5ibzeal7.webp)
等一小会，就部署好了。

# 完成！
 n8n现在已经部署好了，去创建你的工作流吧！
