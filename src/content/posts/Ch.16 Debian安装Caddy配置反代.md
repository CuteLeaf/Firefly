---
title: Debian安装Caddy配置反代
description: Debian安装Caddy配置反代
author: Beiyuan
draft: false
showLastMod: true
slug: debian-caddy-reverse-proxy
categories:
  - Tools
  - Linux
tags:
  - Caddy
date: 2025-09-03T22:47:12+08:00
lastmod: 2025-12-04T11:08:03+08:00
---
[Document](https://caddy2.dengxiaolong.com/docs/install)

```shell
# 安装Caddy，仅适用于Debian及Ubuntu系统
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install caddy
```

### 示例

```shell
cat > /etc/caddy/Caddyfile <<EOF
123.com {
    tls 123@qq.com
    encode gzip
    reverse_proxy 0.0.0.0:1234
}
EOF
```
