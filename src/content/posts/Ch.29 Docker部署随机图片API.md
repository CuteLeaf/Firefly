---
title: Docker部署随机图片API
description: Docker部署随机图片API
author: Beiyuan
draft: false
showLastMod: true
slug: docker-random-image-api
categories:
  - Docker
  - Tools
tags:
  - 图片API
date: 2025-09-03T22:47:12+08:00
lastmod: 2025-12-04T11:09:33+08:00
---
[Github](https://github.com/Nei-Xin/random-pic-api)

```shell
mkdir /opt/api && cd /opt/api
nano docker-compose.yaml
```

```yaml
version: '3.9'
services:
    random-api:
        image: 'neixin/random-pic-api'
        volumes:
# 竖屏图片
            - './portrait:/var/www/html/portrait'
# 横屏图片
            - './landscape:/var/www/html/landscape'
        ports:
            - '8080:80'
```

```shell
docker compose up -d
```

### 转换脚本

```python
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
input_folder = "/root/input"
output_folder_landscape = "/root/landscape"
output_folder_portrait = "/root/portrait"

# 执行转换
process_images(input_folder, output_folder_landscape, output_folder_portrait)
```
