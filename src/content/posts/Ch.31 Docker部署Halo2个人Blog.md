---
title: Docker部署Halo2个人Blog
description: Docker部署Halo2个人Blog
author: Beiyuan
draft: false
showLastMod: true
slug: docker-halo2-personal-blog
categories:
  - Docker
  - Tools
tags:
  - Halo2
  - 博客
date: 2025-09-17T20:50:37+08:00
lastmod: 2025-12-04T11:10:14+08:00
---
[Github](https://github.com/halo-dev/halo)
[Documents](https://docs.halo.run/)

```shell
# 创建文件夹及yaml文件
mkdir /opt/halo2 && cd /opt/halo2
nano docker-compose.yaml
```

```yaml
services:
  halo:
    image: halohub/halo:2.21
    restart: on-failure:3
    depends_on:
      halodb:
        condition: service_healthy
    networks:
      halo_network:
    volumes:
      - ./halo2:/root/.halo2
    ports:
      - "8090:8090"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:1080/actuator/health/readiness"]
      interval: 30s
      timeout: 5s
      retries: 5
      start_period: 30s
    command:
      - --spring.r2dbc.url=r2dbc:pool:postgresql://halodb/halo
      - --spring.r2dbc.username=halo
      # PostgreSQL 的密码，请保证与下方 POSTGRES_PASSWORD 的变量值一致。
      - --spring.r2dbc.password=openpostgresqll
      - --spring.sql.init.platform=postgresql
      # 外部访问地址，请根据实际需要修改
      - --halo.external-url=https://blogs.slioi.com/
  halodb:
    image: postgres:15.4
    restart: on-failure:3
    networks:
      halo_network:
    volumes:
      - ./db:/var/lib/postgresql/data
    healthcheck:
      test: [ "CMD", "pg_isready" ]
      interval: 10s
      timeout: 5s
      retries: 5
    environment:
      - POSTGRES_PASSWORD=openpostgresqll
      - POSTGRES_USER=halo
      - POSTGRES_DB=halo
      - PGUSER=halo

networks:
  halo_network:
```

- 此示例的 PostgreSQL 数据库容器默认没有设置端口映射，如果需要在容器外部访问数据库，可以自行在 `halodb` 服务中添加端口映射，PostgreSQL 的端口为 `5432`。

```shell
docker-compose up -d
```

实时查看日志：

```shell
docker-compose logs -f
```

### 镜像

```text
registry.fit2cloud.com/halo/halo
halohub/halo
ghcr.io/halo-dev/halo
```

## 更新容器组

1. 备份数据，可以参考 备份与恢复 进行完整备份（可选，但推荐备份）。
2. 更新 Halo 服务

- 修改 docker-compose.yaml 中配置的镜像版本。

```yaml
services:
 halo:
   image: registry.fit2cloud.com/halo/halo:2.20
```

```shell
docker-compose up -d
```

### 反代

```shell
#安装所需程序
sudo apt install certbot python3-certbot-nginx python3-certbot-dns-cloudflare nginx
#新建一个名为halo2的配置
sudo nano /etc/nginx/sites-available/halo2
#启用配置
sudo ln -s /etc/nginx/sites-available/halo2 /etc/nginx/sites-enabled/
#从Cloudflare获取区域DNS API
sudo nano /etc/letsencrypt/cloudflare.ini
dns_cloudflare_api_token = 你的API
#赋予权限
sudo chmod 600 /etc/letsencrypt/cloudflare.ini
#使用CF-DNS申请证书，你不想关小黄云用这个
sudo certbot certonly --dns-cloudflare --dns-cloudflare-credentials /etc/letsencrypt/cloudflare.ini -d example.com #替换为你的域名
#直接申请证书，上面的申请完后可以用这个命令自动配置HTTPS，选1
sudo certbot --nginx -d example.com #替换为你的域名
```

### 官方配置示例

```nginx
upstream halo {
  server 127.0.0.1:8090;
}
server {
  listen 80;
  listen [::]:80;
  server_name example.com;#修改域名
  client_max_body_size 1024m;
  location / {
    proxy_pass http://halo;
    proxy_set_header HOST $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

### 重载

```
sudo nginx -t  #检查配置
sudo systemctl reload nginx  #重新加载配置
```
