---
title: 使用cloudflare argo smart routing后的感受
published: 2025-11-18
description: cloudflare在中国大陆的访问速度太慢了，我看到cloudflare的官网上有这个付费模块，就来尝尝鲜。
tags:
  - cloudflare
  - cloudflareArgo智能路由
category: cloudflare
draft: false
series: cloudflare
lang: zh_CN
customcover: https://img.mckero.com/use-cloudflare-argo/fengmian.webp
image: https://img.mckero.com/use-cloudflare-argo/fengmian.webp
---
# 什么是cloudflare argo smart routing？
  [cloudflare](https://www.cloudflare.com/zh-cn/application-services/products/argo-smart-routing/)是这样说的。
  避免网络拥塞，加速 Web 应用程序
  互联网上的网络拥塞可导致加载缓慢。Argo Smart Routing 检测并绕过实时网络拥塞，使 Web 应用性能（平均）加快 30%。
# cloudflare argo smart routing是什么时候出现的？
  据我所知可能是2017年，或者2019年。

# cloudflare argo smart routing有什么作用？
  [blog.cloudflare.com](https://blog.cloudflare.com/zh-cn/argo-and-the-cloudflare-global-private-backbone/)上说：“启用Argo智能路由可以**平均减少33％**的HTTP第一个字节到达时间（TTFB）。”并且还可以优化回源速度（从cdn到源服务器的速度）
  
  :::tip[提示]
  我的博客[blog.mckero.com](https://blog.mckero.com/)在2025年11月到12月15日左右应该都是启用cloudflare argo smart routing的。
  :::

# cloudflare argo smart routing的订阅费用
<font color="red">cloudflare argo smart routing的订阅费用还是有点很贵的，它是用流量计费的！</font>
![](https://img.mckero.com/old-blog-p/image.73udk1d0th.avif)
但是如果你的网站的流量很多的话，那账单就很贵，但是如果没什么流量的话，cloudflare argo smart routing又学习不到什么（就是效果不好,argo smart routing是需要流量学习的）如果你的网站流量很大还是建议买Pro。
# cloudflare argo smart routing测试TTFB和ip
  效果可能不是很好，因为我的源站就在cloudflare pages，cloudflare argo smart routing的主要效果就是减少TTFB，我现在关闭cloudflare argo smart routing测试一下TTFB。我先是用curl测试。
  这是我用ai生成的命令。
```bash
echo "=== IPv4 测试 ===" && \
curl -4 -w "\n性能指标 (IPv4):\n状态码: %{http_code}\nTTFB: %{time_starttransfer}s\nDNS: %{time_namelookup}s\nTCP: %{time_connect}s\nTLS: %{time_appconnect}s\n总时间: %{time_total}s\n速度: %{speed_download} B/s\n大小: %{size_download} bytes\n远程IP: %{remote_ip}:%{remote_port}\n" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36" \
  -H "Accept-Language: zh-CN,zh;q=0.9" \
  -o /dev/null -s \
  https://blog.mckero.com/ && \
echo "" && echo "=== IPv6 测试 ===" && \
curl -6 -w "\n性能指标 (IPv6):\n状态码: %{http_code}\nTTFB: %{time_starttransfer}s\nDNS: %{time_namelookup}s\nTCP: %{time_connect}s\nTLS: %{time_appconnect}s\n总时间: %{time_total}s\n速度: %{speed_download} B/s\n大小: %{size_download} bytes\n远程IP: %{remote_ip}:%{remote_port}\n" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36" \
  -H "Accept-Language: zh-CN,zh;q=0.9" \
  -o /dev/null -s \
  https://blog.mckero.com/
```
这是测试结果（广东深圳移动，没开cloudflare argo smart routing）
```text
=== IPv4 测试 ===

性能指标 (IPv4):
状态码: 200
TTFB: 2.401583s
DNS: 0.639793s
TCP: 1.252995s
TLS: 1.898642s
总时间: 4.961801s
速度: 89573 B/s
大小: 444444 bytes
远程IP: 104.21.40.129:443

=== IPv6 测试 ===

性能指标 (IPv6):
状态码: 200
TTFB: 1.316419s
DNS: 0.548081s
TCP: 0.726425s
TLS: 1.054573s
总时间: 3.051245s
速度: 145659 B/s
大小: 444444 bytes
远程IP: 2606:4700:3031::ac43:97f0:443
```
广东深圳电信（没开cloudflare argo smart routing）这网没有ipv6
```text
=== IPv4 测试 ===

性能指标 (IPv4):
状态码: 200
TTFB: 1.339218s
DNS: 0.121932s
TCP: 0.418897s
TLS: 0.754316s
总时间: 2.476046s
速度: 179497 B/s
大小: 444444 bytes
远程IP: 104.21.40.129:443

=== IPv6 测试 ===

性能指标 (IPv6):
状态码: 000
TTFB: 0.000000s
DNS: 0.096014s
TCP: 0.000000s
TLS: 0.000000s
总时间: 0.102149s
速度: 0 B/s
大小: 0 bytes
远程IP: :-1
```
可以看到TTFB都在1.3秒左右

## 海外测试
![keycdntext](https://img.mckero.com/old-blog-p/Screenshot_20251118_164739.2yys7ukwws.avif)
因为我设置了waf所以有些403了。可以看到大部分都在60ms左右。

## 没开cloudflare argo smart routing的IP
ip就这些
- 172.67.151.240(平均280ms，延迟微高)
- 104.21.40.129(平均270ms)
- 2606:4700:3031::6815:2881(平均200ms)
- 2606:4700:3031::ac43:97f0(平均160ms)

## 开启cloudflare argo smart routing后
首先ip变了

## 开启cloudflare argo smart routing后的ip
大部分地区的ip都变成的两个ip了，少部分dns还没好。
- 172.66.43.129(平均150ms)
- 172.66.40.127(平均150ms)
- 2606:4700:3108::ac42:2b81(平均150ms)
- 2606:4700:3108::ac42:287f(平均150ms)
ipv4效果明显好一点，ipv6差不多。

## 开启cloudflare argo smart routing的后TTFB
首先curl测试
广东深圳移动
```text
=== IPv4 测试 ===

性能指标 (IPv4):
状态码: 200
TTFB: 1.332947s
DNS: 0.379638s
TCP: 0.676709s
TLS: 0.999466s
总时间: 2.758808s
速度: 161100 B/s
大小: 444444 bytes
远程IP: 172.66.40.127:443

=== IPv6 测试 ===

性能指标 (IPv6):
状态码: 200
TTFB: 1.152041s
DNS: 0.315701s
TCP: 0.577526s
TLS: 0.885486s
总时间: 1.868585s
速度: 237850 B/s
大小: 444444 bytes
远程IP: 2606:4700:3108::ac42:2b81:443
```
海外测试
![](https://img.mckero.com/old-blog-p/Screenshot_20251118_172141.77dzhp5dux.avif)
几乎没有什么提升(可能是因为我的源站在cloudflare pages)

# cloudflare argo smart routing智能吗？
用curl -I测试
广东深圳移动
```bash
~ $ curl -I https://blog.mckero.com
HTTP/2 200
date: Tue, 18 Nov 2025 09:25:38 GMT
content-type: text/html; charset=utf-8
access-control-allow-origin: *
cache-control: public, max-age=86400, must-revalidate
cf-cache-status: HIT
referrer-policy: strict-origin-when-cross-origin
x-content-type-options: nosniff
vary: accept-encoding
report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=VNFVubRCwEZ2pp7nOovbFn1R3fGjUmhMmIW%2BlaFEllnW3SGRoOxyH4LeeIiEEpJDmyuYdrZhUq1sqnnPNxloZPlG9DPIda%2BweQWjtgJVTg%3D%3D"}]}
nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
server: cloudflare
speculation-rules: "/cdn-cgi/speculation"
age: 3120
cf-ray: 9a066bf57f89a666-SJC
alt-svc: h3=":443"; ma=86400

~ $
```
给我选择到了地球的另一边，可以看到cloudflare argo smart routing不回影响你路由到哪个数据中心。(可能因为我没有升级Pro吧)

# cloudflare argo smart routing效果立竿见影的地方
  我有一个[ct8](ct8.pl)的账号，我在上面部署了一个[wordpress](https://wordpress.org/))，由于ct8的服务器在波兰，所以访问速度特别慢！平均5到8秒，甚至访问不了，所以我就给他套上了cloudflare cdn同时启用了cloudflare argo smart routing。速度立马就快了好多，访问速度到了1-2秒。
  cloudflare argo smart routing的效果就提现出来了，比如，源站在美国而用户在中国。
# 结语
 由此可见cloudflare argo smart routing效果是分场景的。如果你买Pro的话呢，可以买上这个试一试。效果可能更好。(我的博客流量太少了)

# 2025年11月18日
  就在我写完这篇文章，刚提交上去没多久，结果cloudflare就炸掉了。我所有托管到cloud flare的服务都用不了。就连cloudflare argo smart routing也没有用。
