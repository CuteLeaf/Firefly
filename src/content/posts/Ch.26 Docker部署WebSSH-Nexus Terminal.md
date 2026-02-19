---
title: Docker部署WebSSH-Nexus Terminal
description: Docker部署WebSSH-Nexus Terminal
author: Beiyuan
draft: false
showLastMod: true
slug: docker-webssh-nexus-terminal
categories:
  - Docker
  - Tools
tags:
  - WebSSH
  - Nexus Terminal
date: 2025-09-03T22:47:12+08:00
lastmod: 2025-12-04T11:12:24+08:00
---
[GIthub](https://github.com/Heavrnl/nexus-terminal)

```shell
mkdir /opt/ssh && cd /opt/ssh
```

```shell
#下载docker-compose.yml及.env
wget https://raw.githubusercontent.com/Heavrnl/nexus-terminal/refs/heads/main/docker-compose.yml -O docker-compose.yml && wget https://raw.githubusercontent.com/Heavrnl/nexus-terminal/refs/heads/main/.env -O .env
#编辑，按需修改
nano docker-compose.yml
nano .env
```

### Docker开启ipv6

> 在 `/etc/docker/daemon.json` 加入以下内容，不存在就直接创建
> 修改完后重启docker `sudo systemctl restart docker`

```json
{
  "ipv6": true,
  "fixed-cidr-v6": "fd00::/80",
  "ip6tables": true,
  "experimental": true
}
```

```shell
#启动
docker compose up -d
```

### Nginx反代

```shell
#安装所需程序
sudo apt install certbot python3-certbot-nginx python3-certbot-dns-cloudflare nginx
#清空默认配置
> /etc/nginx/sites-available/default
#手动编辑一个名为ssh的配置
sudo nano /etc/nginx/sites-available/ssh
#启用配置
sudo ln -s /etc/nginx/sites-available/ssh /etc/nginx/sites-enabled/
#从Cloudflare获取区域DNS API，这里如果你需要使用CF申请证书也不想关小黄云再操作
sudo nano /etc/letsencrypt/cloudflare.ini
dns_cloudflare_api_token = 你的API
#赋予权限
sudo chmod 600 /etc/letsencrypt/cloudflare.ini
#使用CF-DNS申请证书，全程y就行
sudo certbot certonly --dns-cloudflare --dns-cloudflare-credentials /etc/letsencrypt/cloudflare.ini -d example.com #替换为你的域名
#直接申请证书，上面的申请完后可以用这个命令自动配置HTTPS，选1
sudo certbot --nginx -d example.com #替换为你的域名
```

#### 配置示例

```nginx
server {
    listen 80;                # 端口可以随意修改
    listen [::]:80;           # 支持 IPv6，端口同样可以修改
    server_name example.com;            # 你的域名

    location / {
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Range $http_range;
        proxy_set_header If-Range $http_if_range;
        proxy_redirect off;
        proxy_pass http://127.0.0.1:18111;
    }
}
```

```shell
sudo nginx -t  #检查配置
sudo systemctl reload nginx  #重新加载配置
```

> 完成后访问你的域名即可

### 备份

> 直接备份目录下的data文件夹即可
