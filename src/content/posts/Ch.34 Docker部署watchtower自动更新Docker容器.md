---
title: Docker部署watchtower自动更新Docker容器
description: Docker部署watchtower自动更新Docker容器
author: Beiyuan
draft: false
showLastMod: true
slug: docker-watchtower-auto-update
categories:
  - Docker
  - Tools
tags:
  - watchtower
date: 2025-09-17T20:50:37+08:00
lastmod: 2025-12-04T11:12:10+08:00
---
[Github](https://github.com/nicholas-fedor/watchtower)

## Docker

```shell
docker run --detach \
 --name watchtower \
 --volume /var/run/docker.sock:/var/run/docker.sock \
 nickfedor/watchtower
```

## 自动清除旧镜像

```shell
docker run --detach \
 --name watchtower \
 --volume /var/run/docker.sock:/var/run/docker.sock \
 nickfedor/watchtower
 --cleanup
```
