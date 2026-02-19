---
title: Docker部署bitmagnet磁力搜索工具
description: Docker部署bitmagnet磁力搜索工具
author: Beiyuan
draft: false
showLastMod: true
slug: docker-bitmagnet-deploy
categories:
  - Docker
  - Tools
tags:
  - 磁力搜索
date: 2025-09-17T20:50:37+08:00
lastmod: 2025-12-04T11:09:42+08:00
---
[Github](https://github.com/bitmagnet-io/bitmagnet)

> 这个东西很消耗内存，服务器内存有多少占多少，小鸡谨慎使用

![c7i5O8TsL1Wa3DaNkcvAU3Folrp9QjhF.webp](https://cdn.nodeimage.com/i/c7i5O8TsL1Wa3DaNkcvAU3Folrp9QjhF.webp)

### 开始安装

> 端口、文件路径根据实际情况修改下面的docker-compose.yaml

```shell
#创建文件夹存放配置
mkdir /opt/bit && cd /opt/bit
nano docker-compose.yaml
```

```yaml
services:
  bitmagnet:
    image: ghcr.io/bitmagnet-io/bitmagnet:latest
    container_name: bitmagnet
    ports:
      # API and WebUI port:
      - "3333:3333"
      # BitTorrent ports:
      - "3334:3334/tcp"
      - "3334:3334/udp"
    restart: unless-stopped
    environment:
      - POSTGRES_HOST=postgres
      - POSTGRES_PASSWORD=postgres
    #      - TMDB_API_KEY=your_api_key
    volumes:
      - ./config:/root/.config/bitmagnet
    command:
      - worker
      - run
      - --keys=http_server
      - --keys=queue_server
      # disable the next line to run without DHT crawler
      - --keys=dht_crawler
    depends_on:
      postgres:
        condition: service_healthy

  postgres:
    image: postgres:16-alpine
    container_name: bitmagnet-postgres
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
    #    ports:
    #      - "5432:5432" Expose this port if you'd like to dig around in the database
    restart: unless-stopped
    environment:
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=bitmagnet
      - PGUSER=postgres
    shm_size: 1g
    healthcheck:
      test:
        - CMD-SHELL
        - pg_isready
      start_period: 20s
      interval: 10s
```

### 启动

```shell
docker compose up -d
```

## 更新

```shell
docker compose down bitmagnet
docker pull ghcr.io/bitmagnet-io/bitmagnet:latest
docker compose up -d bitmagnet
```