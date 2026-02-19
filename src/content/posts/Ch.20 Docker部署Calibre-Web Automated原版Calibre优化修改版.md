---
title: Docker部署Calibre-Web Automated原版Calibre优化修改版
description: Docker部署Calibre-Web Automated原版Calibre优化修改版
author: Beiyuan
draft: false
showLastMod: true
slug: docker-calibre-web-automated-mod
categories:
  - Docker
  - Tools
tags:
  - Calibre-Web Automated
  - 电子书管理
date: 2025-09-03T22:47:12+08:00
lastmod: 2025-12-04T11:10:03+08:00
---
[Github](https://github.com/crocodilestick/Calibre-Web-Automated)

```shell
mkdir -p /opt/calibre && cd /opt/calibre
mkdir -p /home/reader/config && mkdir -p /home/reader/ingest && mkdir -p /home/reader/library
nano docker-compose.yaml
```

```yaml
services:
  calibre-web-automated:
    image: crocodilestick/calibre-web-automated:latest
    container_name: calibre-web-automated
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Shanghai
    volumes:
      - /home/reader/config:/config
      - /home/reader/ingest:/cwa-book-ingest #这里是放下好的书，自动会转移到library文件夹
      - /home/reader/library:/calibre-library #需要的数据库文件也在这个文件夹，不需要添加
    ports:
      - 8083:8083
    restart: unless-stopped
```

```shell
docker-compose up -d
```

```shell
#默认账号密码
admin
admin123
```
