---
title: Nginx搭配php部署随机图片API
description: Nginx搭配php部署随机图片API
author: Beiyuan
draft: false
showLastMod: true
slug: nginx-php-random-image-api
categories:
  - Tools
tags:
  - 图片API
date: 2025-09-03T22:47:12+08:00
lastmod: 2025-12-04T11:14:37+08:00
---
[Github](https://github.com/Nei-Xin/random-pic-api)

### 准备

```shell
#安装所需程序
sudo apt install nginx php7.4-fpm php7.4-mysql php7.4-fpm php7.4-mysql php7.4-cli php7.4-opcache certbot python3-certbot-nginx python3-certbot-dns-cloudflare
```

### 创建Index.php文件

> 这里只需要修改路径

#### 主路径

```
cd /var/www/html
nano index.php
```

```
<?php
$pcPath = '/landscape';#这里的路径自行修改
$mobilePath = '/portrait';#这里的路径自行修改

// 函数：从目录中获取图片列表
function getImagesFromDir($path) {
    $images = array();
    if ($img_dir = @opendir($path)) {
        while (false !== ($img_file = readdir($img_dir))) {
            // 匹配 webp、jpg、jpeg、png、gif 格式的图片
            if (preg_match("/\.(webp|jpg|jpeg|png|gif)$/i", $img_file)) {
                $images[] = $img_file;
            }
        }
        closedir($img_dir);
    }
    return $images;
}

// 函数：生成完整的图片路径
function generateImagePath($path, $img) {
    return $path . '/' . $img;
}

// 检测用户代理以区分手机和电脑访问
$userAgent = $_SERVER['HTTP_USER_AGENT'];
$isMobile = preg_match('/(android|iphone|ipad|ipod|blackberry|windows phone)/i', $userAgent);

// 根据访问设备设置图片路径
if ($isMobile) {
    $path = $mobilePath;
} else {
    $path = $pcPath;
}

// 缓存图片列表
$imgList = getImagesFromDir($path);

// 从列表中随机选择一张图片
shuffle($imgList);
$img = reset($imgList);

// 获取图片的格式
$img_extension = pathinfo($img, PATHINFO_EXTENSION);

// 根据图片的格式设置 Content-Type
switch ($img_extension) {
    case 'webp':
        header('Content-Type: image/webp');
        break;
    case 'jpg':
    case 'jpeg':
        header('Content-Type: image/jpeg');
        break;
    case 'png':
        header('Content-Type: image/png');
        break;
    case 'gif':
        header('Content-Type: image/gif');
        break;
    // 添加其他格式的处理方式
    // case 'bmp':
    //     header('Content-Type: image/bmp');
    //     break;
}

// 生成完整的图片路径
$img_path = generateImagePath($path, $img);

// 直接输出所选的随机图片
readfile($img_path);
?>
```

#### PC路径

```
mkdir /var/www/html/pc && cd /var/www/html/pc
nano index.php
```

```
<?php
$pcPath = '../landscape';#这里的路径自行修改

// 函数：从目录中获取图片列表
function getImagesFromDir($path) {
    $images = array();
    if ($img_dir = @opendir($path)) {
        while (false !== ($img_file = readdir($img_dir))) {
            // 匹配 webp、jpg、jpeg、png、gif 格式的图片
            if (preg_match("/\.(webp|jpg|jpeg|png|gif)$/i", $img_file)) {
                $images[] = $img_file;
            }
        }
        closedir($img_dir);
    }
    return $images;
}

// 函数：生成完整的图片路径
function generateImagePath($path, $img) {
    return $path . '/' . $img;
}

// 设置图片路径为 landscape
$path = $pcPath;

// 缓存图片列表
$imgList = getImagesFromDir($path);

// 从列表中随机选择一张图片
shuffle($imgList);
$img = reset($imgList);

// 获取图片的格式
$img_extension = pathinfo($img, PATHINFO_EXTENSION);

// 根据图片的格式设置 Content-Type
switch ($img_extension) {
    case 'webp':
        header('Content-Type: image/webp');
        break;
    case 'jpg':
    case 'jpeg':
        header('Content-Type: image/jpeg');
        break;
    case 'png':
        header('Content-Type: image/png');
        break;
    case 'gif':
        header('Content-Type: image/gif');
        break;
    // 添加其他格式的处理方式
    // case 'bmp':
    //     header('Content-Type: image/bmp');
    //     break;
}

// 生成完整的图片路径
$img_path = generateImagePath($path, $img);

// 直接输出所选的随机图片
readfile($img_path);
?>
```

#### Mobile路径

```
mkdir /var/www/html/mobile && cd /var/www/html/mobile
nano index.php
```

```
<?php
$pcPath = '../portrait';#这里的路径自行修改

// 函数：从目录中获取图片列表
function getImagesFromDir($path) {
    $images = array();
    if ($img_dir = @opendir($path)) {
        while (false !== ($img_file = readdir($img_dir))) {
            // 匹配 webp、jpg、jpeg、png、gif 格式的图片
            if (preg_match("/\.(webp|jpg|jpeg|png|gif)$/i", $img_file)) {
                $images[] = $img_file;
            }
        }
        closedir($img_dir);
    }
    return $images;
}

// 函数：生成完整的图片路径
function generateImagePath($path, $img) {
    return $path . '/' . $img;
}

// 设置图片路径为 portrait
$path = $pcPath;

// 缓存图片列表
$imgList = getImagesFromDir($path);

// 从列表中随机选择一张图片
shuffle($imgList);
$img = reset($imgList);

// 获取图片的格式
$img_extension = pathinfo($img, PATHINFO_EXTENSION);

// 根据图片的格式设置 Content-Type
switch ($img_extension) {
    case 'webp':
        header('Content-Type: image/webp');
        break;
    case 'jpg':
    case 'jpeg':
        header('Content-Type: image/jpeg');
        break;
    case 'png':
        header('Content-Type: image/png');
        break;
    case 'gif':
        header('Content-Type: image/gif');
        break;
    // 添加其他格式的处理方式
    // case 'bmp':
    //     header('Content-Type: image/bmp');
    //     break;
}

// 生成完整的图片路径
$img_path = generateImagePath($path, $img);

// 直接输出所选的随机图片
readfile($img_path);
?>
```

### 反代开启HTTPS

```shell
#清空默认配置
> /etc/nginx/sites-available/default
#手动编辑默认配置
sudo nano /etc/nginx/sites-available/default
```

```
server {
    listen [::]:8080;
    listen 8080;
    server_name example.com;  # 替换为你的域名以便下面申请域名

    root /var/www/html;  # 设置网站根目录

    # 默认首页是 index.php 或其他文件（根据你的需求）
    index index.php index.html index.htm;

    # 处理根目录请求，直接返回根目录下的文件（如果存在）
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # 处理 PHP 文件
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # 防止访问 .ht 文件（如果有）
    location ~ /\.ht {
        deny all;
    }
}
```

```
#测试Nginx配置
sudo nginx -t
#重新加载Nginx配置
sudo systemctl reload nginx
```

> 现在可以访问ip:8080查看效果

### 开始申请证书

```shell
#从Cloudflare获取区域DNS API，这里可选，往下看
sudo nano /etc/letsencrypt/cloudflare.ini
dns_cloudflare_api_token = 你的API
#赋予权限
sudo chmod 600 /etc/letsencrypt/cloudflare.ini
#使用CF-DNS申请证书，你不想关小黄云用这个，全称y就行
sudo certbot certonly --dns-cloudflare --dns-cloudflare-credentials /etc/letsencrypt/cloudflare.ini -d example.com #替换为你的域名
#直接申请证书，上面的申请完后可以用这个命令自动配置HTTPS，选1
sudo certbot --nginx -d example.com #替换为你的域名
```

### 示例配置

```
server {
    listen 80;
    server_name example.com;
  
    # 强制重定向到 HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl ipv6only=on;
    server_name example.com;

    # SSL 证书配置
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /var/www/html;
    index index.php index.html index.htm;

    # 处理根目录请求
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # 处理 /mobile 路径
    location /mobile {
        try_files $uri $uri/ /mobile/index.php?$query_string;  # 如果是动态路由，调整路径
    }

    # 处理 /pc 路径
    location /pc {
        try_files $uri $uri/ /pc/index.php?$query_string;  # 如果是动态路由，调整路径
    }

    # 处理 PHP 文件
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;

        # 禁止执行上传目录中的 PHP 文件
        location ~ ^/uploads/.*\.php$ {
            deny all;
        }
    }

    # 防止访问 .ht 文件
    location ~ /\.ht {
        deny all;
    }

    # 压缩和缓存优化
    gzip on;
    gzip_disable "msie6";
    gzip_vary on;
    gzip_proxied any;
    gzip_types text/plain text/css application/javascript application/json application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;

    location ~* \.(jpg|jpeg|png|gif|css|js|woff|woff2|ttf|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

```
#测试Nginx配置
sudo nginx -t
#重新加载Nginx配置
sudo systemctl reload nginx
```

> 到此就可以使用你的域名访问，使用/pc或/mobile显示不同方向图片

### 查看是否自动续期

查看 certbot.timer 的状态

```
sudo systemctl list-timers | grep certbot
```

如果看到类似以下的输出，表示 certbot.timer 服务已启用并正在运行：

```
Thu 2025-04-23 00:00:00 UTC  12h left  certbot.timer
```

查看 certbot.timer 服务是否正在运行

```
systemctl status certbot.timer
```

如果服务未启用，你可以启用并启动它

```
sudo systemctl enable --now certbot.timer
```

这会启用并立即启动 certbot.timer，使其每 12 小时自动检查证书续期。

### 图片处理代码

```
from PIL import Image
import os

# 检查图片方向
def get_image_orientation(image_path):
    with Image.open(image_path) as img:
        width, height = img.size
        return "landscape" if width > height else "portrait"

# 转换图片为 WebP 格式
def convert_to_webp(image_path, output_folder, max_pixels=178956970):
    try:
        with Image.open(image_path) as img:
            # Check image size
            width, height = img.size
            if width * height > max_pixels:
                print(f"Skipping {image_path} because it exceeds the size limit.")
                return
  
            # Save the image as WebP
            output_path = os.path.join(output_folder, os.path.splitext(os.path.basename(image_path))[0] + ".webp")
            img.save(output_path, "webp")
    except Exception as e:
        print(f"Failed to convert {image_path}: {e}")

# 遍历文件夹中的图片
def process_images(input_folder, output_folder_landscape, output_folder_portrait):
    for filename in os.listdir(input_folder):
        if filename.endswith(('.jpg', '.jpeg', '.png')):
            image_path = os.path.join(input_folder, filename)
            orientation = get_image_orientation(image_path)
            try:
                if orientation == "landscape":
                    convert_to_webp(image_path, output_folder_landscape)
                else:
                    convert_to_webp(image_path, output_folder_portrait)
            except Exception as e:
                print(f"Error processing {image_path}: {e}. Skipping this image.")

# 指定输入和输出文件夹
input_folder = "/root/photos"
output_folder_landscape = "/root/landscape"
output_folder_portrait = "/root/portrait"

# 执行转换
process_images(input_folder, output_folder_landscape, output_folder_portrait)
```
