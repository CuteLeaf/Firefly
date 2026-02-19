---
title: Docker部署热门实时新闻newsnow
description: Docker部署热门实时新闻newsnow
author: Beiyuan
draft: false
showLastMod: true
slug: 8IgYr0u
categories:
  - Docker
  - Tools
tags:
  - newsnow
  - 实时新闻
date: 2025-09-03T22:47:12+08:00

lastmod: 2025-12-04T11:46:14+08:00
---
[Github](https://github.com/ourongxing/newsnow)

```shell
mkdir /opt/newsnow && cd /opt/newsnow
nano docker-compose.yaml
```

```yaml
services:
  newsnow:
    image: ghcr.io/ourongxing/newsnow:latest
    container_name: newsnow
    restart: always
    ports:
      - '4445:4444'
    environment:
      - G_CLIENT_ID= #Github ID
      - G_CLIENT_SECRET= #Github SECRET
      - JWT_SECRET= #可以同上，这三个都可以不填，除非你需要登录
      - INIT_TABLE=true
      - ENABLE_CACHE=true
```

```shell
docker compose up -d
```
