---
title: Docker部署Komga私人漫画库
description: Docker部署Komga私人漫画库
author: Beiyuan
draft: false
showLastMod: true
slug: docker-komga-private-comic-library
categories:
  - Docker
  - Tools
tags:
  - Komga
  - 漫画管理
date: 2025-09-17T20:50:37+08:00
lastmod: 2025-12-04T11:10:35+08:00
---
[Github](https://github.com/gotson/komga)
[Document](https://komga.org/docs/introduction)

```text
#komga支持的格式
Comic Book archives: cbz, zip, cbr, rar
PDF: pdf
Epub: epub
```

![](https://s3.nyanx.de/2025/10/18d681e10274cb0166bde12d96801579.webp)

### 通过Docker安装

```shell
mkdir -p /opt/komga && cd /opt/komga
nano docker-compose.yaml
mkdir -p /home/manga/content
mkdir -p /home/komga/config
chmod 777 /home/komga/config
chmod 777 /home/komga/content
```

### 重启后操作

```shell
cd /home/komga/config/lucene
sudo rm -rf *
```

```yaml
services:
  komga:
    image: gotson/komga:latest
    container_name: komga
    restart: unless-stopped
    ports:
      - "127.0.0.1:25600:25600"
    volumes:
      - /home/komga/config:/config
      - /home/manga/content:/data
    environment:
      - JAVA_TOOL_OPTIONS=-Xmx4g
      - TZ=Asia/Shanghai
    user: "1000:1000"
```

```shell
docker compose up -d
```

### 更新

```shell
cd /opt/komga
docker compose down
docker compose pull
docker image prune
docker compose up -d
```

### 通过jar文件安装

```shell
mkdir -p /opt/komga && \
download_url=$(curl -s https://api.github.com/repos/gotson/komga/releases/latest | jq -r '.assets[] | select(.name | test("komga-.*.jar")) | .browser_download_url') && \
curl -L $download_url -o /opt/komga/komga.jar && \
chmod +x /opt/komga/komga.jar

sudo apt install -y openjdk-21-jdk
cd /opt/komga && java -jar /opt/komga/komga.jar
```
