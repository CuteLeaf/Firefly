---
title: Linux修改DNS
description: Linux修改DNS
author: Beiyuan
draft: false
showLastMod: true
slug: linux-change-dns
categories:
  - Linux
  - Tools
tags:
  - DNS
date: 2025-09-03T22:47:12+08:00
lastmod: 2025-12-04T11:14:26+08:00
---
### DNS列表

```
# Cloudflare DNS
# IPv4
1.1.1.1
1.0.0.1
# IPv6
2606:4700:4700::1111
2606:4700:4700::1001

# Google DNS
# IPv4
8.8.8.8
8.8.4.4
# IPv6
2001:4860:4860::8888
2001:4860:4860::8844

# 阿里云公共DNS
# IPv4
223.5.5.5
223.6.6.6
# IPv6
2400:3200::1
2400:3200:baba::1

# 腾讯DNSPod公共DNS
# IPv4
119.29.29.29
# IPv6
2402:4e00::
```

### 方法一：Systemd-resolved

```shell
#查看是否安装
sudo systemctl status systemd-resolved
#没有安装执行命令安装并启动
sudo apt update
sudo apt install systemd-resolved -y
sudo systemctl enable systemd-resolved && sudo systemctl start systemd-resolved
#修改DNS
sudo nano /etc/systemd/resolved.conf
#示例
[Resolve]
DNS=8.8.8.8 1.1.1.1
FallbackDNS=8.8.4.4
#修改完后退出，重新启动
sudo systemctl restart systemd-resolved
```

### 报错masked解决方法

```shell
#输入下面的命令
sudo systemctl unmask systemd-resolved
#再次重启
sudo systemctl restart systemd-resolved
#查看是否修改成功
resolvectl status
#查看是否软链接成功
ls -l /etc/resolv.conf
#上面命令示例
lrwxrwxrwx 1 root root 32 Feb 11  2024 /etc/resolv.conf -> /run/systemd/resolve/resolv.conf
#不一样执行下面的命令后再次查看
sudo rm /etc/resolv.conf
sudo ln -s /run/systemd/resolve/resolv.conf /etc/resolv.conf
```

### 方法二：Resolved

```shell
sudo apt update
sudo apt install resolvconf
sudo nano /etc/resolv.conf
#防止被修改
sudo chattr +i /etc/resolv.conf
```
