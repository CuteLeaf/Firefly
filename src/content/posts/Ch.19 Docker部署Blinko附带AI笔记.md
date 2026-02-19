---
title: Docker部署Blinko附带AI笔记
description: Docker部署Blinko附带AI笔记
author: Beiyuan
draft: false
showLastMod: true
slug: docker-blinko-ai-notes
categories:
  - Docker
  - Tools
tags:
  - Blinko
  - AI
  - 笔记
date: 2025-09-03T22:47:12+08:00
lastmod: 2025-12-04T11:09:52+08:00
---
[Github](https://github.com/blinko-space/blinko)

```shell
# 创建文件夹及yaml文件
mkdir /opt/blinko && cd /opt/blinko
nano docker-compose.yaml
```

```yaml
networks:
  blinko-network:
    driver: bridge

services:
  blinko-website:
    image: blinkospace/blinko:latest
    container_name: blinko-website
    environment:
      NODE_ENV: production
      NEXTAUTH_URL: http://localhost:1111
      NEXT_PUBLIC_BASE_URL: https://notes.gugu.ovh       #改成自己的域名
      NEXTAUTH_SECRET: uNG9%&Nce8z^Yev  #自己设置一个密码
      DATABASE_URL: postgresql://postgres:password@postgres:5432/postgres  #password改成自己的密码，和下方POSTGRES_PASSWORD的一样
    depends_on:
      postgres:
        condition: service_healthy
    # Make sure you have enough permissions.
    volumes:
      - ./blinko:/app/.blinko 
    restart: always
    logging:
      options:
        max-size: "10m"
        max-file: "3"
    ports:
      - 3000:1111     # 3000可以自己修改成没有用过的端口
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:1111/"]
      interval: 30s 
      timeout: 10s   
      retries: 5   
      start_period: 30s 
    networks:
      - blinko-network

  postgres:
    image: postgres:14
    container_name: blinko-postgres
    restart: always
    ports:
      - 5432
    environment:
      POSTGRES_DB: postgres
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password     #记得改一个密码
      TZ: Asia/Shanghai
    healthcheck:
      test:
        ["CMD", "pg_isready", "-U", "postgres", "-d", "postgres"]
      interval: 5s
      timeout: 10s
      retries: 5
    networks:
      - blinko-network
```

```shell
docker compose up -d
```
