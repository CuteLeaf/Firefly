---
title: 给你的fuwari博客添加AI文章摘要
published: 2025-11-26
description: 最近，看到很多博客都有AI摘要，我的博客没有，就想去添加一个AI摘要。
tags:
  - AI
  - AI摘要
category: 教程
draft: false
lang: zh_CN
---

# 给你的fuwari博客添加AI文章摘要
我之前在很多的博客上都可以看到文章摘要，今天看到了相关内容，就给我的博客添加了。

# 经历
我原本是在测试我的博客的`开往`是否可以跳转的，试着试着我跳转到了[张洪Heo](https://blog.zhheo.com/)这个博客，我看到他的网站的文章质量很高（文章的封面就很高级，感觉质量很高）

![](https://img.mckero.com/add-TianliGPT/heo-ai-zhaiyao.avif)

我就点了一下文章摘要，就跳转到了[Heo-如何让博客支持AI摘要，使用TianliGPT自动生成文章的AI摘要](https://blog.zhheo.com/p/ec57d8b2.html)我看了这篇文章，很有启发，这篇文章讲了如何接入还说了一个平台[洪墨AI](https://ai.zhheo.com/docs/)看了文档后我看到有两种接入方式，[插件接入](https://ai.zhheo.com/docs/plugin/)和[代码嵌入](https://ai.zhheo.com/docs/addCode.html)

## 插件接入
插件接入是有要求的，你的博客必须是这些框架的。

- Wordpress

- Hexo

- Halo

- Typecho

- Discuz

- emlog

- VitePress

- Z-Blog

可以看到，列表里面没有astro或者fuwari所以我不能通过插件接入。

## 代码嵌入
文档上是这样说的
洪墨AI是用过js在网页中插入iframe的方式提供，体积小巧，功能强大，兼容性强。
我的博客就是使用这种方式接入的。

# 接入
首先，先注册洪墨AI（这个很简单吧？就不细讲了。）
注册后，花8.9左右买点Token
在控制台找到[代码生成器](https://ai.zhheo.com/console/code-generator)往下滑可以找到配置接入代码的地方，你可能需要调整一些设置，比如说字数限制
```html
<link rel="stylesheet" href="https://ai.zhheo.com/static/public/tianli_gpt.min.css">
<script>
let tianliGPT_postSelector = '这里修改为指定参数，详见页面底部的摘要参数配置教程';
let tianliGPT_wordLimit = 200;
let tianliGPT_Title = '智能摘要';
let tianliGPT_key = '项目KEY';
</script>
<script src="https://ai.zhheo.com/static/public/tianli_gpt.min.js"></script>
```

日常其实只用改动这些参数
`tianliGPT_wordLimit`：字数限制
`tianliGPT_Title`：AI摘要标题

## 如何填写tianliGPT_postSelector参数？
tianliGPT_postSelector这个参你自己去获取，洪墨AI文档中有记载，[如何获取tianliGPT_postSelector？](https://ai.zhheo.com/docs/summary.html)文档中已经列出一些常见博客主题的选择器值(tianliGPT_postSelector)

这个列表中也没有astro或fuwari，由于我代码能力不行，我就直接把文章页面的HTML源代码丢给了Gemini，Gemini分析出我应该填写`.markdown-content`(Gemini上下文还是太高了，我原本想把源代码丢给Claude的但是Claude吃不下那么多)

## 插入到模板
得到代码之后，我们就要把代码填入到模板，经过Gemini的分析，我们应该把代码插入`src/pages/posts/[...slug].astro`这个应该是文章的模板。

找到`src/pages/posts/[...slug].astro`中的最后一个`</MainGridLayout>`（应该是在文件最下面）找到`</MainGridLayout>`上面的`</div>`

这是我使用的代码（刚开始我是使用Gemini写的，但是效果太差所以我就换Claude来写了，如果你的博客也是fuwari你可以试试）
```html title="[...slug].astro"
<div class="hongmo-ai-container mt-4">
    <link rel="stylesheet" href="https://ai.zhheo.com/static/public/tianli_gpt.min.css">
    
    <!-- 配置脚本 - 使用 data-astro-rerun 确保每次都执行 -->
    <script is:inline data-astro-rerun>
        window.tianliGPT_postSelector = '.markdown-content';
        window.tianliGPT_postURL = '*/posts/*';
        window.tianliGPT_wordLimit = 700;
        window.tianliGPT_Title = '智能摘要';
        window.tianliGPT_key = 'S-HMJ7UXQGBIAZ0U8Q';

        // 立即尝试初始化
        function tryInitTianliGPT() {
            if (typeof window.tianliGPT === 'object' && 
                typeof window.tianliGPT.checkURLAndRun === 'function') {
                
                // 清除旧的摘要
                const old = document.querySelector('#tianliGPT');
                if (old) old.remove();
                
                // 等待 DOM 和动画
                setTimeout(() => {
                    if (document.querySelector('.markdown-content')) {
                        window.tianliGPT.checkURLAndRun();
                        console.log('✓ TianliGPT 初始化成功');
                    }
                }, 500);
            } else {
                // 脚本还没加载,继续等待
                setTimeout(tryInitTianliGPT, 200);
            }
        }

        // 开始尝试
        tryInitTianliGPT();
    </script>
    
    <!-- 主脚本 - 只加载一次 -->
    <script is:inline>
        // 使用全局标志避免重复加载脚本
        if (!window.tianliGPT_scriptLoaded) {
            window.tianliGPT_scriptLoaded = true;
            const script = document.createElement('script');
            script.src = 'https://ai.zhheo.com/static/public/tianli_gpt.min.js';
            script.async = true;
            document.body.appendChild(script);
        }
    </script>
</div>
```

插入后部署完就可以看到AI摘要了。

效果
![](https://img.mckero.com/add-TianliGPT/result-add-tianliGPT.avif)
