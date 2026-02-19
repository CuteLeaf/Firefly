---
title: Debian开启ZRAM
description: Debian开启ZRAM
author: Beiyuan
draft: false
showLastMod: true
slug: debian-zram-setup
categories:
  - Tools
  - Linux
tags:
  - ZRAM
date: 2025-09-03T22:47:12+08:00
lastmod: 2025-12-04T11:08:38+08:00
---
### 1. 安装ZRAM工具

- 首先，确保系统已安装 `zram-tools` 包

```bash
sudo apt update
sudo apt install zram-tools -y
```

### 2. 配置ZRAM大小

- 编辑ZRAM配置文件

```bash
sudo nano /etc/default/zramswap
```

- 找到 `SIZE` 参数，将其设置为280M

```bash
SIZE=280M
```

- 保存并退出编辑器

### 3. 启用并启动ZRAM服务

- 启用ZRAM服务并立即启动

```bash
sudo systemctl enable zramswap
sudo systemctl start zramswap
```

### 4. 验证ZRAM配置

- 检查ZRAM是否已启用并正确配置

```bash
cat /proc/swaps
```

- 输出应显示 `zram` 设备，大小约为280M

### 5. 重启系统

- 为确保ZRAM在重启后自动启用，重启系统

```bash
sudo reboot
```

### 6. 验证ZRAM状态

- 系统重启后，再次检查ZRAM状态

```bash
cat /proc/swaps
```
