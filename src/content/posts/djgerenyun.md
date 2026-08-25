---
title: 如何搭建属于自己的个人云盘
published: 2026-08-25
description: 关于网站搭建
image: ./images/yunpfengm.avif
tags: [个人云盘,cloudreve,技术]
category: 网站搭建
draft: false    
---

## 第一步：部署云盘
进入https://github.com/cloudreve/Cloudreve/releases下载  【cloudreve_4.17.0_windows_amd64.zip】
![Firefly](./images/yp1.avif)
下载后解压到纯英文路径中
选中路径
![Firefly](./images/yp2.avif)
在路径中输入cmd 然后回车
![Firefly](./images/yp3.avif)
![Firefly](./images/yp4.avif)
将cloudreve.exe拖入弹出的cmd框中 然后回车执行
![Firefly](./images/yp5.avif)
![Firefly](./images/yp6.avif)
当cmd输出Listening to ":5212"时打开浏览器
![Firefly](./images/yp7.avif)
进入127.0.0.1:5212 这是你的个人云盘的本地地址
点击立即注册 第一个注册的账号为管理员 有管理员权限
![Firefly](./images/yp8.avif)

## 第二步：在局域网中访问云盘
如果你希望在外网访问你的云盘 请直接跳过第二步

Win+R输入cmd打开命令提示符
![Firefly](./images/yp9.avif)
在cmd中输入ipconfig 回车
![Firefly](./images/yp10.avif)
在输出的命令中找到你正在使用网络的ipv4地址
复制到局域网内其他设备 并加上云盘的端口号 例如：192.168.1.10:5212
![Firefly](./images/yp11.avif)
现在 你可以在内网访问你的云盘了

## 第三步：在公网中访问云盘
如果你想在家外面访问你的云盘 你需要一个公网ip 
大多家庭网络并没有ipv4公网ip 但是有ipv6公网ip
所以这篇文章使用ipv6公网作为演示 但ipv4公网也可使用
![Firefly](./images/yp16.avif)
刚刚ipconfig的输出中如果有ipv6地址即为有ipv6公网
复制你的公网地址 手机开流量热点 电脑连接 在浏览器的地址栏中输入[你的ipv6公网地址]:5212即可进入你的云盘
![Firefly](./images/yp17.avif)


但是ipv6公网ip为动态ip 会不断更新 导致刚刚的地址无法一直使用
所以需要ddns-go做动态解析（注意：后续操作需要注册域名）
进入https://github.com/jeessy2/ddns-go/releases/tag/v6.17.6 下载 【ddns-go_6.17.6_windows_x86_64.zip】
![Firefly](./images/yp12.avif)
下载后解压到纯英文路径
右键以管理员身份运行ddns-go.exe
![Firefly](./images/yp13.avif)
![Firefly](./images/yp14.avif)
看到监听端口后打开浏览器
进入127.0.0.1:9876 
![Firefly](./images/yp15.avif)
第一次登录即注册账号 不要忘记账号密码
进入ddns-go页面后先不要操作 新开一个浏览器标签 进入https://dash.cloudflare.com/ 没有cloudflare的账号的话就注册一个
接下来的操作需要域名 可以前往https://dashboard.digitalplat.org/ 免费注册一个
来到cloudflare主页 绑定你的域名 网上教程很多而且并不困难 这里不过多赘述
![Firefly](./images/yp18.avif)
![Firefly](./images/yp19.avif)
点击右上角小图标 选择配置文件
![Firefly](./images/yp20.avif)
进入配置文件界面后点击API令牌
![Firefly](./images/yp21.avif)
点击右上角的创建令牌
![Firefly](./images/yp22.avif)
![Firefly](./images/yp23.avif)
选择编辑区域DNS的模板
![Firefly](./images/yp24.avif)
选择你的域名 其他的按照我的设置填
点继续
![Firefly](./images/yp25.avif)
点创建令牌
![Firefly](./images/yp26.avif)
复制并保存你的API秘钥 这个秘钥只会显示一次
回到ddns-go的页面
![Firefly](./images/yp27.avif)
服务商选择Cloudflare 然后再Token中粘贴你的API秘钥
如果没有公网ipv4 就将ipv4取消勾选
![Firefly](./images/yp28.avif)
向下滑启用ipv6 选择通过网卡获取 匹配正则表达式可以不填
在Domains中填入你的域名 这里建议使用二级域名 即 前缀.你的域名
![Firefly](./images/yp29.avif)
随后点击保存
现在 你可以在外网环境中使用 你的域名+云盘端口号 连接到你的云盘了 例如:yun.frozenice.dpdns.org:5212
![Firefly](./images/yp30.avif)

但是眼尖的bro发现了 网站显示不安全 并且域名后的端口号显得很臃肿 不好记忆
网站显示不安全是因为我们的网站没有配置SSL证书导致的 端口号也可以通过配置SSL证书隐藏
现在我们需要获取一个SSL证书 这里演示免费的SSL证书如何获取与配置
进入https://httpsok.com/p/5EmL 使用微信扫码登录
来到主页 选择证书管理
![Firefly](./images/yp32.avif)
点击免费申请证书
![Firefly](./images/yp33.avif)
![Firefly](./images/yp34.avif)
填入你的域名 照我的设置调 此时会要求你进行域名验证
回到Cloudflare首页
![Firefly](./images/yp35.avif)
选择域名 进入概览
![Firefly](./images/yp36.avif)
选择你的域名 进入配置页面
![Firefly](./images/yp37.avif)
在你的配置页面选择DNS 进入记录页面
![Firefly](./images/yp38.avif)
点击添加记录
![Firefly](./images/yp34.avif)
![Firefly](./images/yp39.avif)
按照SSL证书申请页面要求的填 注意一定要关闭代理
然后回到SSL证书申请页面 会提示验证通过 此时点击提交申请即可
![Firefly](./images/yp40.avif)
等待2分钟左右即可申请完毕
![Firefly](./images/yp41.avif)
随后在证书管理页面找到你申请的SSL证书 点击下载
![Firefly](./images/yp42.avif)
下载服务类型为Nginx的zip文件
下载后将其解压到全英文路径
来到一开始部署的cloudreve云盘的根目录
![Firefly](./images/yp43.avif)
进入data文件夹
![Firefly](./images/yp44.avif)
使用记事本打开conf.ini
在ini配置文件中加入以下代码
```mdx
[SSL]
Listen = :443
CertPath = D:/nginx/nginx-1.30.4/certs/yun.frozenice.dpdns.org.pem ; 证书文件路径
KeyPath = D:/nginx/nginx-1.30.4/certs/yun.frozenice.dpdns.org.key ; 私钥文件路径
```
![Firefly](./images/yp45.avif)
将CertPath和KeyPath的值改为自己的SSL证书文件与私钥的路径
![Firefly](./images/yp46.avif)
保存
关闭cloudreve程序重新启动
![Firefly](./images/yp47.avif)
即可不加端口号访问你的云盘
并且你的云盘成功部署了https证书

## 最后一步：将你的云盘文件添加至自启动
如果你打算将你的电脑完全作为云盘 就需要将其添加至自启动
在每次重启电脑时就不用每次运行exe文件来启动你的云盘
Win+s搜索任务计划程序
![Firefly](./images/yp48.avif)
打开任务计划程序
![Firefly](./images/yp49.avif)
选择创建任务
![Firefly](./images/yp50.avif)
将选项改成跟我一样
![Firefly](./images/yp51.avif)
选择触发器-新建
![Firefly](./images/yp52.avif)
调完后确定
![Firefly](./images/yp53.avif)
选择操作-新建
![Firefly](./images/yp54.avif)
添加ddns-go.exe 然后一路确定
cloudreve.exe的自启动方法相同 这里不再赘述

后续云盘设置可以在网页中直接更改

恭喜你 现在你可以在不同的地方访问你的云盘了