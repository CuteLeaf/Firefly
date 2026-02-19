---
title: 手搓Nginx反代开启HTTPS
description: 手搓Nginx反代开启HTTPS
author: Beiyuan
draft: false
showLastMod: true
slug: nginx-reverse-proxy-https-from-scratch
categories:
  - Tools
tags:
  - Nginx
date: 2025-09-03T22:47:12+08:00
lastmod: 2025-12-04T10:58:04+08:00
---
[Nginx Documents](https://nginx.org/en/linux_packages.html)

### 安装Nginx

#### 1. 安装依赖项

```bash
#我只用Debian和Ubuntu，需要centos的自行去nginx官网查找
#Debian
sudo apt install curl gnupg2 ca-certificates lsb-release debian-archive-keyring -y
#Ubuntu
sudo apt install curl gnupg2 ca-certificates lsb-release ubuntu-keyring -y
```

#### 2 . 导入 Nginx 官方签名密钥

```shell
curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor \
    | sudo tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null
```

#### 3 . 验证密钥

```shell
gpg --dry-run --quiet --no-keyring --import --import-options import-show /usr/share/keyrings/nginx-archive-keyring.gpg
```

应看到如下输出中的指纹：

```shell
pub   rsa2048 2011-08-19 [SC] [expires: 2027-05-24]
      573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62
uid                      nginx signing key <signing-key@nginx.com>
```

#### 4 . 添加 Nginx 稳定版软件源

```shell
#Debian
echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
http://nginx.org/packages/debian `lsb_release -cs` nginx" \
    | sudo tee /etc/apt/sources.list.d/nginx.list
#Ubuntu
echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" \
    | sudo tee /etc/apt/sources.list.d/nginx.list
```

#### 5 . 更新软件包索引并安装 Nginx

```shell
sudo apt update
sudo apt install nginx -y
```

### 安装所需程序

```shell
#安装所需程序
sudo apt install certbot python3-certbot-nginx python3-certbot-dns-cloudflare -y
#手动编辑
sudo nano /etc/nginx/conf.d/vw.conf
#从Cloudflare获取区域DNS API
sudo nano /etc/letsencrypt/cloudflare.ini
dns_cloudflare_api_token = L7JVL_mjc-XbViGhAuQg48g736epLUgPqt1e5Cgo
#赋予权限
sudo chmod 600 /etc/letsencrypt/cloudflare.ini
#使用CF-DNS申请证书，你不想关小黄云用这个，全程y就行
sudo certbot certonly --dns-cloudflare --dns-cloudflare-credentials /etc/letsencrypt/cloudflare.ini -d example.com #替换为你的域名
#直接申请证书，上面的申请完后可以用这个命令自动配置HTTPS，选1
sudo certbot --nginx -d example.com #替换为你的域名
#如果报错试试下面的命令
sudo cp /usr/lib/python3/dist-packages/certbot/ssl-dhparams.pem /etc/letsencrypt/ssl-dhparams.pem
sudo openssl dhparam -out /etc/letsencrypt/ssl-dhparams.pem 2048
```

### Nginx反代示例

```nginx
server {
    listen 80; #端口可以随意修改
    listen [::]:80; #端口可以随意修改
    server_name _; #这里可以写域名也可以不写，看你要不要申请证书

    location / {
        proxy_pass http://127.0.0.1:3000; #你的后端服务端口
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 较为通用的配置

```nginx
#这个推荐写到nginx.conf
map $http_upgrade $connection_upgrade {
    ~^\s*$   close;
    default  upgrade;
}

server {
    listen 80;
    listen [::]:80;
    server_name _; #这里可以写域名也可以不写，看你要不要申请证书
    http2 on;

 client_max_body_size 100M;

    location / {
        proxy_pass http://127.0.0.1:3000; # 你的后端服务端口

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $http_connection;
        proxy_set_header X-Real-IP "";
        proxy_set_header X-Forwarded-For "";
        proxy_set_header X-Forwarded-Proto "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
        proxy_connect_timeout 10s;

        proxy_buffering off;
    }
}
```

### 重载

```
sudo nginx -t  #检查配置
sudo systemctl reload nginx  #重新加载配置
```
