---
title: Docker部署Openwebui加Ollama
description: Docker部署Openwebui加Ollama
author: Beiyuan
draft: false
showLastMod: true
slug: docker-openwebui-ollama
categories:
  - Docker
  - Tools
tags:
  - AI
  - Openwebui
  - Ollama
date: 2025-09-02T22:38:56+08:00
lastmod: 2025-12-04T11:11:19+08:00
---
[Github](https://github.com/ollama/ollama)
[Github](https://github.com/open-webui/open-webui)

```shell
mkdir /opt/openwebui && cd /opt/openwebui
nano docker-compose.yaml
```

#### 单独安装

```yaml
services:
  openwebui:
    image: ghcr.io/open-webui/open-webui:main
    ports:
      - "8080:8080"
    volumes:
      - ./data/open-webui:/app/backend/data
    restart: unless-stopped  
```

#### 搭配Ollama

*这里同时安装了Ollama和Openwebui这样Openwebui能自动识别出来Ollama，直接使用即可*

```yaml
services:
  ollama:
    image: ollama/ollama
    container_name: ollama
    ports:
      - "11434:11434"
    volumes:
      - ./data/ollama:/root/.ollama
    restart: unless-stopped

  openwebui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: openwebui
    ports:
      - "3000:3000"
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
    volumes:
      - ./data/openwebui:/app/backend/data
    depends_on:
      - ollama
    restart: unless-stopped
```

```shell
docker compose up -d
```
