---
title: 把博客的图片格式迁移到AVIF
published: 2025-11-25
description: cloudflare在中国大陆的访问速度太慢了，我看到cloudflare的官网上有这个付费模块，就来尝尝鲜。
tags:
  - webP
  - AVIF
category: blog
draft: false
series: blog
lang: zh_CN
---

# 从webP转换到AVIF
我的博客之前一直都是使用`webP`图片格式的，但是因为最近我换了图床，看到有一种图片格式叫做`AVIF`的图片格式，就顺便转换了。

## AVIF和webP有什么区别
对我来说，最重要的就是压缩率和兼容性和。

|     | AVIF       | webP                |
| --- | ---------- | ------------------- |
| 压缩率 | 80%左右      | 50%左右               |
| 兼容性 | 现代浏览器基本都支持 | 比AVIF兼容性更好，兼容更老的浏览器 |
可以看到AVIF的压缩率更好，我的200多KB的jpg图片转换成AVIF后才40KB左右。

# 最差实践
不要把较小的webP图片转换成AVIF！要不然就会想我这样，11KB的webP转换成AVIF后要14KB这就是反向优化！

# 效果
这是一个火狐浏览器的图标(PNG格式，298.59KB)

![](https://img.mckero.com/try-to-use-avif/Firefox-icon-png.png)

这是转换成AVIF后的大小，15.74KB

![](https://img.mckero.com/try-to-use-avif/Firefox-icon-avif.avif)

不仔细看，看不出什么区别来。
# 结语
如果你的博客的读者大部分都是现代浏览器，你可以将你的博客的图片格式转换成AVIF，但是如果你的博客的读者大部分都不使用现代的浏览器，你可能得使用webP。