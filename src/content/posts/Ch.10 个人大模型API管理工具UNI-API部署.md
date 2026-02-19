---
title: 个人大模型API管理工具UNI-API部署
description: 个人大模型API管理工具UNI-API部署
author: Beiyuan
draft: false
showLastMod: true
slug: uni-api-bu-shu-jiao-cheng
categories:
  - Tools
tags:
  - AI
  - API管理
date: 2025-09-03T22:47:12+08:00
lastmod: 2025-12-04T10:55:54+08:00
---
[Github](https://github.com/yym68686/uni-api)
[面板](https://github.com/melosbot/uni-api-status)
[配置生成](https://uni-api-config-generator.vercel.app/)

```shell
mkdir -p /opt/uniapi && cd /opt/uniapi
nano api.yaml
nano docker-compose.yaml
```

```yaml
services:
#主程序
  uniapi:
    image: yym68686/uni-api:latest
    restart: unless-stopped
    ports:
      - "8001:8000"
    volumes:
      - ./api.yaml:/home/api.yaml
      - ./data:/home/data
#面板服务
  uniapi-frontend:
    image: ghcr.io/melosbot/uni-api-status:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      # 以下为容器内的路径，与 volumes 挂载点对应
      - API_YAML_PATH=/app/config/api.yaml
      - STATS_DB_PATH=/app/data/stats.db
    volumes:
      # 将宿主机的 api.yaml 挂载到容器内，需要【读写】权限
      - ./api.yaml:/app/config/api.yaml
      # 将宿主机包含 stats.db 的目录挂载到容器内，建议只读【:ro】
      - ./data:/app/data:ro
```

```shell
docker compose up -d
```

### 最小可启动配置模板

```yaml
providers:
  - provider: provider_name # 服务提供商名称, 如 openai、anthropic、gemini、openrouter，随便取名字，必填
    base_url: https://api.your.com/v1/chat/completions # 后端服务的API地址，必填
    api: sk-YgS6GTi0b4bEabc4C # 提供商的API Key，必填，自动使用 base_url 和 api 通过 /v1/models 端点获取可用的所有模型。
  # 这里可以配置多个提供商，每个提供商可以配置多个 API Key，每个提供商可以配置多个模型。
api_keys:
  - api: sk-Pkj60Yf8JFWxfgRmXQFWyGtWUddGZnmi3KlvowmRWpWpQxx # API Key，用户请求 uni-api 需要 API key，必填
  # 该 API Key 可以使用所有模型，即可以使用 providers 下面设置的所有渠道里面的所有模型，不需要一个个添加可用渠道。
```
