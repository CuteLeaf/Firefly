---
title: Realm端口转发
description: Realm端口转发
author: Beiyuan
draft: false
showLastMod: true
slug: realm-port-forwarding
categories:
  - Tools
tags:
  - Realm
  - 端口转发
date: 2025-09-03T22:47:12+08:00
lastmod: 2025-12-04T11:16:01+08:00
---
### 获取执行文件

```shell
sudo mkdir -p /root/realm && \
curl -s https://api.github.com/repos/zhboner/realm/releases/latest | \
jq -r '.assets[] | select(.name | test("realm-x86_64-unknown-linux-gnu.tar.gz")) | .browser_download_url' | \
wget -O /root/realm/realm.tar.gz && \
sudo tar -xvf /root/realm/realm.tar.gz -C /root/realm && \
sudo chmod +x /root/realm/realm && \
sudo rm /root/realm/realm.tar.gz #可执行文件位于/root/realm
```

### 新建 `config.toml` 文件

```shell
cat > /root/realm/config.toml <<EOF

[network]
no_tcp = false
use_udp = true

[[endpoints]]
listen = "[::]:443" #监听v6，你的中转机，端口自行修改，以下类似
remote = "0.0.0.0:443 #监听v4，你的落地机

[[endpoints]]
listen = "0.0.0.0:80" #监听v4，你的中转机
remote = "[::]:80#监听v6，你的落地机

EOF
```

### 写入Service

```shell
cat > /etc/systemd/system/realm.service <<EOF
[Unit]
Description=realm
After=network-online.target
Wants=network-online.target systemd-networkd-wait-online.service

[Service]
Type=simple
User=root
Restart=on-failure
RestartSec=5s
DynamicUser=true
WorkingDirectory=/root
ExecStart=/root/realm/realm -c /root/realm/config.toml

[Install]
WantedBy=multi-user.target
EOF
```

### 启动服务

```shell
systemctl daemon-reload
systemctl enable realm
systemctl start realm
systemctl restart realm
systemctl status realm
```
