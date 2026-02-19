---
title: Docker部署Memos个人备忘录
description: Docker部署Memos个人备忘录
author: Beiyuan
draft: false
showLastMod: true
slug: docker-memos-personal-notes
categories:
  - Docker
  - Tools
tags:
  - memos
  - 个人备忘录
date: 2025-09-03T22:47:12+08:00
lastmod: 2025-12-04T11:10:44+08:00
---
[Github](https://github.com/usememos/memos)

```shell
# 创建文件夹及yaml文件
mkdir /opt/memos && cd /opt/memos
nano docker-compose.yaml
```

```yaml
services:
  memos:
    image: neosmemo/memos:stable
    container_name: memos
    volumes:
      - ~/.memos/:/var/opt/memos
    ports:
      - 5230:5230
```

## 使用外部数据库

### Postgres数据库

```yaml
services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: memos
      POSTGRES_USER: memos
      POSTGRES_PASSWORD: memosss  # 替换为实际密码
    volumes:
      - ./postgres_data:/var/lib/postgresql/data
    healthcheck:  # 添加健康检查
      test: ["CMD-SHELL", "pg_isready -U memos"]
      interval: 5s
      timeout: 5s
      retries: 5

  memos:
    image: neosmemo/memos:stable
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      - MEMOS_DRIVER=postgres
      - MEMOS_DSN=postgresql://memos:memosss@postgres:5432/memos?sslmode=disable  # 添加 sslmode
    ports:
      - "127.0.0.1:5230:5230"
    volumes:
      - ./memos_data:/var/opt/memos
```

```shell
docker compose up -d
```
