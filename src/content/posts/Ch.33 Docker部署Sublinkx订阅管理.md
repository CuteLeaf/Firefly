---
title: Docker部署Sublinkx订阅管理
description: Docker部署Sublinkx订阅管理
author: Beiyuan
draft: false
showLastMod: true
slug: docker-sublinkx-subscription-management
categories:
  - Docker
  - Tools
tags:
  - Sublinkx
  - 订阅管理
date: 2025-09-17T20:50:37+08:00
lastmod: 2025-12-04T11:11:59+08:00
---
[Github](https://github.com/gooaclok819/sublinkX)

```shell
docker run -d --name sublinkx \
  -p 127.0.0.1:7999:8000 \
  -v ./db:/app/db \
  -v ./template:/app/template \
  -v ./logs:/app/logs \
  jaaksi/sublinkx
```
