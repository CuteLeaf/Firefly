---
title: Docker部署Moviepilot媒体库自动化管理
description: Docker部署Moviepilot媒体库自动化管理
author: Beiyuan
draft: false
showLastMod: true
slug: docker-moviepilot-media-automation
categories:
  - Docker
  - Tools
tags:
  - Moviepilot
  - 媒体管理
date: 2025-09-03T22:47:12+08:00
lastmod: 2025-12-04T11:10:57+08:00
---
[Github](https://github.com/jxxghp/MoviePilot)

[Document](https://wiki.movie-pilot.org/zh/install)

```shell
mkdir /opt/mp && cd /opt/mp
nano docker-compose.yaml
```

```yaml
services:
  moviepilot:
    stdin_open: true
    tty: true
    container_name: moviepilot-v2
    hostname: moviepilot-v2

    volumes:
      - '/root/Downloads:/media'# 这里参考文档
      - './moviepilot-v2/config:/config'
      - './moviepilot-v2/core:/moviepilot/.cache/ms-playwright'
      - '/var/run/docker.sock:/var/run/docker.sock:ro'

    environment:
      - 'NGINX_PORT=3000'
      - 'PORT=3001'
      - 'PUID=0'
      - 'PGID=0'
      - 'UMASK=000'
      - 'TZ=Asia/Shanghai'
      - 'SUPERUSER=admin'

    restart: always
    image: jxxghp/moviepilot-v2:latest

    network_mode: host
# 当使用内置网关时，可不启用
# networks:
#   moviepilot:  # 定义一个名为 moviepilot 的自定义网络
#     name: moviepilot  # 网络的名称
```

```shell
docker compose up -d
```

### 获取API密钥及面板密码

```shell
docker logs moviepilot-v2
API:hxMQdzy_eAk-byK5Xp37EA
PASSWORD:fWf1TamQrU7sW-oMHl9c-g
```
