---
title: Linux安装qBittorrent-Enhanced-Edition
description: Linux安装qBittorrent-Enhanced-Edition
author: Beiyuan
draft: false
showLastMod: true
slug: linux-qbittorrent-ee-install
categories:
  - Linux
  - Tools
tags:
  - qBittorrent-Enhanced-Edition
  - 磁力下载
date: 2025-09-03T22:47:12+08:00
lastmod: 2025-12-04T11:14:04+08:00
---
[Github](https://github.com/userdocs/qbittorrent-nox-static)

### 下载可执行文件

```shell
#x86_64
download_url=$(curl -s https://api.github.com/repos/c0re100/qBittorrent-Enhanced-Edition/releases/latest | jq -r '.assets[] | select(.name | test("qbittorrent-enhanced-nox_x86_64-linux-musl_static.zip")) | .browser_download_url') && \
curl -L $download_url -o /usr/bin/qbittorrent-nox.zip && \
unzip /usr/bin/qbittorrent-nox.zip -d /usr/bin/ && \
chmod +x /usr/bin/qbittorrent-nox && \
rm /usr/bin/qbittorrent-nox.zip
#arm64
download_url=$(curl -s https://api.github.com/repos/c0re100/qBittorrent-Enhanced-Edition/releases/latest | jq -r '.assets[] | select(.name | test("qbittorrent-enhanced-nox_aarch64-linux-musl_static.zip")) | .browser_download_url') && \
curl -L "$download_url" -o /usr/bin/qbittorrent-nox.zip && \
unzip /usr/bin/qbittorrent-nox.zip -d /usr/bin/ && \
chmod +x /usr/bin/qbittorrent-nox && \
rm /usr/bin/qbittorrent-nox.zip
```

### 创建system服务

```shell
cat > /etc/systemd/system/qbittorrent.service <<EOF
[Unit]
Description=qBittorrent Daemon Service
After=network-online.target

[Service]
Type=simple
User=root
Group=root
UMask=007
ExecStart=/usr/bin/qbittorrent-nox
ExecStop=/bin/kill -s SIGTERM $MAINPID
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF
```

### 启动

```shell
systemctl enable qbittorrent
systemctl start qbittorrent
systemctl status qbittorrent # 查看登录密码，默认登录端口8080
```

### 下载完后上传网盘

```shell
#创建日志文件夹
mkdir -p /root/rclone_logs
#下载完成后执行命令，bt:/bt自行修改为你设置rclone remote名和上传到网盘的路径
rclone move "%F" "bt:/bt/%N" --create-empty-src-dirs --transfers=4 --checkers=4
```

### Nginx反代

```shell
#安装所需程序
sudo apt install certbot python3-certbot-nginx python3-certbot-dns-cloudflare nginx
#手动编辑
sudo nano /etc/nginx/sites-available/bt
#这里是nginx配置路径为conf.d的配置，下面启用配置命令不用
sudo nano /etc/nginx/conf.d/bt.conf
#启用配置
sudo ln -s /etc/nginx/sites-available/bt /etc/nginx/sites-enabled/
#从Cloudflare获取区域DNS API
sudo nano /etc/letsencrypt/cloudflare.ini
dns_cloudflare_api_token = 你的API
#赋予权限
sudo chmod 600 /etc/letsencrypt/cloudflare.ini
#使用CF-DNS申请证书，你不想关小黄云用这个，全程y就行
sudo certbot certonly --dns-cloudflare --dns-cloudflare-credentials /etc/letsencrypt/cloudflare.ini -d example.com
#直接申请证书，上面的申请完后可以用这个命令自动配置HTTPS，选1
sudo certbot --nginx -d example.com
```

### 配置示例

```nginx
server {
    listen 80;             # 端口可以随意修改
    listen [::]:80;        # IPv6 监听，同样可修改

    #server_name _;
    server_name example.com;  # 也可以写多个域名，用空格分隔

    location / {
        proxy_pass http://127.0.0.1:8080;              # 代理到本地 8080 端口
        proxy_set_header Host $host;                  # 保留原始 Host 头
        proxy_set_header X-Real-IP $remote_addr;      # 真实客户端 IP
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;   # 协议（http/https）
    }
}
```

### 内存占用解决办法

`在设置高级中将磁盘 IO 类型设置为遵循 POSIX`
