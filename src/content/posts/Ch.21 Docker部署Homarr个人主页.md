---
title: Docker部署Homarr个人主页
description: Docker部署Homarr个人主页
author: Beiyuan
draft: false
showLastMod: true
slug: docker-homarr-personal-homepage
categories:
  - Docker
  - Tools
tags:
  - Homarr
  - 个人主页
date: 2025-09-03T22:47:12+08:00
lastmod: 2025-12-04T11:10:25+08:00
---
[Documents](https://homarr.dev/docs/getting-started/installation/)

```shell
mkdir /opt/homarr && cd /opt/homarr
nano docker-compose.yaml
```

```yaml
services:
  homarr:
    container_name: homarr
    image: ghcr.io/ajnart/homarr:latest
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock # 可选，如果需要 Docker 集成功能
      - ./homarr/configs:/app/data/configs
      - ./homarr/icons:/app/public/icons
      - ./homarr/data:/data
    ports:
      - '7575:7575'

  dash:
    container_name: dash
    image: mauricenino/dashdot:latest
    restart: unless-stopped
    privileged: true
    ports:
      - '7576:3001'
    volumes:
      - /:/mnt/host:ro
```

```shell
docker compose up -d
```

## 更新

```shell
docker compose down
docker compose pull
docker compose up -d
docker image prune
```
