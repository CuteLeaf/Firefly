---
title: Linux安装Docker及Docker-compose
description: Linux安装Docker及Docker-compose
author: Beiyuan
draft: false
showLastMod: true
slug: linux-docker-install-compose
categories:
  - Docker
  - Tools
  - Linux
tags:
  - Docker
  - Docker-compose
date: 2025-09-03T22:47:12+08:00
lastmod: 2025-12-04T11:13:50+08:00
---
[Github](https://github.com/docker/compose)

## Docker及Docker Compose官方安装脚本

```shell
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

## Docker compose手动安装

```shell
sudo curl -sSL "https://api.github.com/repos/docker/compose/releases/latest" | \
jq -r '.tag_name' | \
xargs -I {} sudo curl -L "https://github.com/docker/compose/releases/download/{}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && \
sudo chmod +x /usr/local/bin/docker-compose && \
sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose && \
docker-compose --version
```
