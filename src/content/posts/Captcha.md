---
title: 你是人机吗？
published: 2025-08-13
description: 一篇关于人机验证的文章。有两个人机验证可以玩儿。
tags: [人机验证, Captcha,reCaptcha,Cloudflare Turnstile]
category: 人机验证
draft: false
lang: zh_CN
---
# 你是机器人吗?

>目前只有两个人机验
>证后面会添加更多。

---

  <head>
    <title>reCAPTCHA demo: Simple page</title>
    <script src="https://www.google.com/recaptcha/enterprise.js" async defer></script>
<!-- Cloudflare Turnstile -->
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback" defer async></script>

## reCaptcha (Google 的人机验证)
 <div class="g-recaptcha" data-sitekey="6LdDuKQrAAAAADf7Mjk0uGk8TpE4pS6tZGVJysmd"></div>
 
 ---
 
 ## Cloudflare Turnstile
<div id="example-container"></div>
<script is:inline>
  function onloadTurnstileCallback() {
    // 确保 turnstile 对象已加载
    if (typeof turnstile !== 'undefined') {
      turnstile.render('#example-container', {
        // 重要：将下面的 sitekey 替换为你自己的
        sitekey: '0x4AAAAAABrPIUcI27cDx0yn', // 这是一个用于测试的 key
        callback: function(token) {
          console.log(`挑战成功，获取到的 token 是: ${token}`);
          // 在这里你可以将 token 发送到后端进行验证
        },
      });
    }
  }
</script>

