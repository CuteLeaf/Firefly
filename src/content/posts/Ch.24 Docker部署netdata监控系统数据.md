---
title: Docker部署netdata监控系统数据
description: Docker部署netdata监控系统数据
author: Beiyuan
draft: false
showLastMod: true
slug: docker-netdata-monitoring
categories:
  - Docker
  - Tools
tags:
  - netdata
date: 2025-09-03T22:47:12+08:00
lastmod: 2025-12-04T11:11:06+08:00
---
[Github](https://github.com/netdata/netdata)

```shell
# 创建文件夹及yaml文件
mkdir -p /opt/netdata/netdataconfig /opt/netdata/netdatalib /opt/netdata/netdatacache && cd /opt/netdata
nano docker-compose.yaml
```

### Docker-compose

```yaml
services:
  netdata:
    image: netdata/netdata
    container_name: netdata
    pid: host
    network_mode: "host"
    restart: unless-stopped
    cap_add:
      - SYS_PTRACE
      - SYS_ADMIN
    security_opt:
      - apparmor:unconfined
    ports:
      - "19999:19999"
    volumes:
      - ./netdataconfig:/etc/netdata
      - ./netdatalib:/var/lib/netdata
      - ./netdatacache:/var/cache/netdata
      - /:/host/root:ro,rslave
      - /etc/passwd:/host/etc/passwd:ro
      - /etc/group:/host/etc/group:ro
      - /etc/localtime:/etc/localtime:ro
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /etc/os-release:/host/etc/os-release:ro
      - /var/log:/host/var/log:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro

volumes:
  netdataconfig:
  netdatalib:
  netdatacache:
```

```shell
docker compose up -d
```

### Docker CLI

```shell
docker run -d --name=netdata \
  --pid=host \
  --network=host \
  -p 19999:19999 \
  -v ./netdataconfig:/etc/netdata \
  -v ./netdatalib:/var/lib/netdata \
  -v ./netdatacache:/var/cache/netdata \
  -v /:/host/root:ro,rslave \
  -v /etc/passwd:/host/etc/passwd:ro \
  -v /etc/group:/host/etc/group:ro \
  -v /etc/localtime:/etc/localtime:ro \
  -v /proc:/host/proc:ro \
  -v /sys:/host/sys:ro \
  -v /etc/os-release:/host/etc/os-release:ro \
  -v /var/log:/host/var/log:ro \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  --restart unless-stopped \
  --cap-add SYS_PTRACE \
  --cap-add SYS_ADMIN \
  --security-opt apparmor=unconfined \
  netdata/netdata
```

```shell
sudo cat /opt/netdata/netdatalib/netdata_random_session_id
```
