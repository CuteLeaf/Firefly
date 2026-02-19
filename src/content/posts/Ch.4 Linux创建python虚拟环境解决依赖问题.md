---
title: Linux创建python虚拟环境解决依赖问题
description: Linux创建python虚拟环境解决依赖问题
author: Beiyuan
draft: false
showLastMod: true
slug: linux-python-venv-dependencies
categories:
  - Linux
  - Tools
tags:
  - python
date: 2025-09-03T22:47:12+08:00
lastmod: 2025-12-04T11:14:15+08:00
---
```shell
sudo apt update && sudo apt install python3 -y #安装python
```

```shell
sudo apt install python3-venv -y #安装虚拟环境
mkdir /opt/env && cd /opt/env #创建文件夹单独存放相关文件和配置，也可以不创建
python3 -m venv komga #创建虚拟环境，env是你虚拟环境的名称，可以自定义，这里创建虚拟环境同时会创建一个文件夹
source komga/bin/activate #激活虚拟环境，这里的env同理，需要和上面一致
deactivate #关闭虚拟环境
```
