---
title: 给你的fuwari添加twikoo评论系统
published: 2025-10-10
description: 本文讲述了如何给你的fuwari添加twikoo评论系统。
tags:
  - fuwari
  - twikoo
category: 教程
draft: false
lang: zh_CN
---

# 给你的fuwari添加twikoo评论系统
  twikoo是一个优秀的评论系统，有美观的界面，而且可以高度自定义。（最重要的是可以匿名发评论）
  # 部署twikoo
   先访问[twikoo的官网](https://twikoo.js.org/)点击`快速上手`，会跳转到Twikoo 文档，再点击`云函数部署`选择一个你喜欢的部署方式。
## MongoDB Atlas 注册
我比较喜欢Netlify部署，因为我已经有Netlify账号了，大部分的部署方式都是要MongoDB的数据库的，Netlify部署就需要。MongoDB Atlas为免费账户可以永久使用 500 MiB 的数据库，足够存储 Twikoo 评论使用。[注册MongoDB Atlas的教程](https://twikoo.js.org/mongodb-atlas.html)Twikoo 文档中有详细的教程。
## Netlify 部署
获取到 MongoDB 连接字符串后要妥善保管（这个字符串可以连接数据库）[Netlify 部署教程](https://twikoo.js.org/backend.html#netlify-%E9%83%A8%E7%BD%B2)
# 前端部署
在拿到环境 id后就可以开始在fuwari中部署了。
下载[https://github.com/saicaca/fuwari/tree/comments](https://github.com/saicaca/fuwari/tree/comments)中的/src/components/comment（把整个文件夹下载下来），把comment文件夹复制到你的fuwari的/src/components中，删掉`Giscus.astr`和`Disqus.astro`
把`index.astro`中的代码全部替换
```
---
import type { CollectionEntry } from 'astro:content'
import { commentConfig } from '@/config'
import Twikoo from './Twikoo.astro'
interface Props {
  post: CollectionEntry<'posts'>
}

const { id, data, slug } = Astro.props.post

const path = `/posts/${slug}`
const url = `${Astro.site?.href}${path}`

let commentService = ''
if (commentConfig?.twikoo) {
  commentService = 'twikoo'
}
---
<div class="card-base p-6 mb-4">
  {commentService === 'twikoo' && <Twikoo path={path} />}
  {commentService === '' && null}
</div>
```
把Twikoo.astro中的代码替换
```
---
import { commentConfig } from '@/config'

interface Props {
  path: string
}

const config = {
  ...commentConfig.twikoo,
  el: '#tcomment',
  path: Astro.props.path,
}
---

<div id="tcomment"></div>
<script define:vars={{ config }}>
function loadTwikoo() {

  // 动态加载 Twikoo 脚本，并在加载完成后执行 twikoo.init

  const script = document.createElement('script');
  script.src = 'https://s4.zstatic.net/npm/twikoo@替换成你的twikoo版本/dist/twikoo.min.js';
  script.defer = true;
  script.onload = () => {
    if (window.twikoo) {
      window.twikoo.init(config);
    }
  };
  // script.onerror = () => {
  //   console.error('Twikoo script load failed');
  // };
  document.body.appendChild(script);
}
  document.addEventListener("loadComment", loadTwikoo, { once: true }); // 监听加载评论事件，但是我们只能监听一次，从而避免多次触发。
</script>
```
打开 /src/types/config.ts，将这段代码添加至 72 行处
```
export type CommentConfig = {
    twikoo?: TwikooConfig
  }
  
  type TwikooConfig = {
    envId: string
    region?: string
    lang?: string
  }
```
打开 /src/config.ts ，引入 CommentConfig
```
import type {
+  CommentConfig,
  LicenseConfig,
  NavBarConfig,
  ProfileConfig,
  SiteConfig,
} from './types/config'
import { LinkPreset } from './types/config'
```
在config.ts末尾添加这段代码
```
export const commentConfig: CommentConfig = {
  twikoo: {
    envId: '这里替换为你的 envId，就是环境ID',
  },
}
```
打开 /src/pages/posts/[...slug].astro ，在16行处添加 import Comment from "@components/comment/index.astro"
```
import Comment from "@components/comment/index.astro"
```
在 112 行处添加
```
<Comment post={entry}></Comment>
```
配置好后，`git push`部署后查看博客，你就能看到文章底下的评论区了。
# 黑暗模式
在黑暗模式中，twikoo评论区会有显示不清楚的问题。可以通过添加[Twikoo.css](https://github.com/MCKero6423/fuwari/blob/main/src%2Fstyles%2Ftwikoo.css)解决