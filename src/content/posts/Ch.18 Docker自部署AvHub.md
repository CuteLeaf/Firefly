---
title: Docker自部署AvHub
description: Docker自部署AvHub
author: Beiyuan
draft: false
showLastMod: true
slug: docker-avhub-self-deploy
categories:
  - Tools
  - Docker
tags:
  - AvHub
date: 2025-09-03T22:47:12+08:00
lastmod: 2025-12-04T11:13:17+08:00
---
[Github](https://github.com/levywang/avhub)

```shell
cd /opt && git clone https://github.com/levywang/avhub.git && cd avhub
```

```shell
pip install -r requirements.txt  
python main.py  
```

```shell
docker run -d \
  -p 1001:80 \
  -v /opt/avhub:/app \
  --name avhub \
  levywang/avhub:latest
```

```
默认运行的API地址：http://127.0.0.1:8000/

可以配置反代和域名，替换 web/script.js 52行中的 BASE_URL

后端运行的配置文件在 data/config.yaml 中，请根据实际情况修改

注意：Python Version >= 3.7
```

### 数据源

- 番号磁力链和封面图：来源于 `missav`
- 里番资源：来源于 `hacg 琉璃神社`
- 随机视频推荐：来源于到的爬虫数据，存储在本地文件 `/data/video_urls.txt`
  以上数据源均配置在 `data/config.yaml` 中，如果数据源变更或者无法访问，需要进行修改和维护
