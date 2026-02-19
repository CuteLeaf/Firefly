---
title: Docker部署电子书漫画管理Kavita
description: Docker部署电子书漫画管理Kavita
author: Beiyuan
draft: false
showLastMod: true
slug: docker-kavita-deploy
categories:
  - Docker
  - Tools
tags:
  - Kavita
  - 漫画管理
  - 电子书管理
date: 2025-09-03T22:47:12+08:00
lastmod: 2025-12-04T11:09:05+08:00
---
[Github](https://github.com/Kareadita/Kavita)
[Document](https://wiki.kavitareader.com/getting-started/)

### Kavita部署在服务器上推荐和Calibre修改版calibre-web-automated搭配使用

kavita不支持直接在root文件夹下存放文件，类似 `/home/manga`这样是不行的，需要再创建子文件夹存放。

类似 `/home/manga/manga1/1.cbz`

```shell
sudo mkdir -p /opt/kavita && cd /opt/kavita
sudo mkdir -p /home/kavita/manga && sudo mkdir -p /home/kavita/comics && sudo mkdir -p /home/kavita/books && sudo mkdir -p /home/kavita/config
nano docker-compose.yaml
```

```shell
services:
    kavita:
        image: ghcr.io/kareadita/kavita:latest
        container_name: kavita
        volumes:
            - /home/manga/content:/manga #这里的文件夹可以不创建，按你的需求来
            - /home/kavita/config:/kavita/config #不可修改右边的路径
        ports:
            - "127.0.0.1:25600:5000"
        restart: unless-stopped
```

```shell
docker compose up -d
```
