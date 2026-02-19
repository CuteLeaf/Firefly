---
title: Rclone挂载Onedrive
description: Rclone挂载Onedrive
author: Beiyuan
draft: false
showLastMod: true
slug: rclone-mount-onedrive
categories:
  - Tools
tags:
  - Rclone
  - Onedrive
date: 2025-09-03T22:47:12+08:00
lastmod: 2025-12-04T11:15:37+08:00
---
### 获取 client_id

首先访问 [Microsoft Azure](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps)[应用注册](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps)，登录账号后点击**应用注册**
![]()点击注册后可以看到你的应用的相关信息，复制好 `应用程序 (客户端) ID`，这个就是 `client_id`

### 获取 client_secret

依次点击**证书和密码**，**新客户端密码**，在截止期限中将时间选择为最长（即两年）然后就可以看见值和机密 ID，我们只需要记录下 `值` 就可以，这个就是 `client_secret` 。

### 添加 API 权限

依次点击 **API 权限**，**添加权限**，**Microsoft Graph**，在右边栏搜索并添加权限。需要 

`Files.Read, Files.ReadWrite, Files.Read.All, Files.ReadWrite.All, offline_access, User.Read`

 这几项

### 添加身份验证

依次点击**身份验证**，**添加平台**，**Web**

在重定向 URI 中输入 `http://localhost`
