---
title: Docker部署Sub-store订阅管理
description: Docker部署Sub-store订阅管理
author: Beiyuan
draft: false
showLastMod: true
slug: docker-substore-subscription-management
categories:
  - Docker
  - Tools
tags:
  - Sub-store
  - 订阅管理
date: 2025-09-03T22:47:12+08:00
lastmod: 2025-12-04T11:11:48+08:00
---
[Docker](https://hub.docker.com/r/xream/sub-store)
[Github](https://github.com/sub-store-org/Sub-Store)

```shell
mkdir /opt/sub-store && cd /opt/sub-store
```

```shell
docker run -it -d --restart=always \
  -e "SUB_STORE_BACKEND_SYNC_CRON=55 23 * * *" \
  -e "SUB_STORE_FRONTEND_BACKEND_PATH=/G5uT9nqA7rXyJ2zV8LwP" \
  -p 3001:3001 \
  -v /opt/sub-store:/opt/app/data \
  --name sub-store \
  xream/sub-store
```
