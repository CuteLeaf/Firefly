---
title: 服务器部署Hugo
description: 服务器部署Hugo
author: Beiyuan
draft: false
showLastMod: true
slug: fu-wu-qi-bu-shu-hugo
categories:
  - Tools
  - Hugo
tags:
  - Hugo
date: 2025-09-03T22:47:12+08:00
lastmod: 2025-12-04T10:55:23+08:00
---
[Github](https://github.com/gohugoio/hugo)

### 安装

```shell
# 删除旧版 Hugo
which hugo &>/dev/null && sudo rm -f $(which hugo)
# 下载并安装最新版本的 Hugo
curl -s https://api.github.com/repos/gohugoio/hugo/releases/latest \
| grep "browser_download_url" \
| grep -E "hugo_extended_.*Linux-64bit\.tar\.gz" \
| grep -vE "\.with" \
| cut -d '"' -f 4 | head -n 1 \
| xargs wget -O hugo.tar.gz && \
tar -xzf hugo.tar.gz && \
sudo mv hugo /usr/local/bin/ && \
rm -f hugo.tar.gz LICENSE* README.md

# 固定版本
wget https://github.com/gohugoio/hugo/releases/download/v0.147.2/hugo_extended_0.147.2_Linux-64bit.tar.gz -O hugo.tar.gz && \
tar -xzf hugo.tar.gz && \
sudo mv hugo /usr/local/bin/ && \
rm -rf hugo.tar.gz LICENSE* README.md
```

### 安装主题

```shell
# 创建一个名为 blog 的新 Hugo 站点
hugo new site /opt/blog --format yaml
# 进入站点目录
cd /opt/blog
# 初始化 git 仓库（推荐，方便管理主题子模块）
apt install git
git init
# 添加主题为子模块
git submodule add https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
git submodule update --remote --merge
```

### 默认配置示例

```shell
baseURL: "https:example.com"  # 网站的基础 URL，部署到子路径需调整此项
title: Beiyuan                         # 网站标题
theme: PaperMod                        # 使用的主题名称（已安装的主题文件夹名）
languageCode: zh                      # 网站默认语言（中文）
defaultContentLanguage: zh            # 默认内容语言
hasCJKLanguage: true                  # 是否启用对中日韩语言优化（统计字数、阅读时间等更准确）

pagination:
  pagerSize: 10                       # 每页最多显示 10 篇文章

enableRobotsTXT: true                # 启用 robots.txt 文件（搜索引擎爬虫指引）
buildDrafts: false                   # 不构建草稿文章
buildFuture: false                   # 不构建发布日期在未来的文章
buildExpired: false                  # 不构建已过期的文章

minify:
  disableXML: true                   # 不压缩生成的 XML 文件
  #minifyOutput: true                 # 压缩 HTML 输出

params:
  env: production                    # 环境变量，生产环境时可启用 GA、SEO 等
  title: Beiyuan                     # 站点标题（与上面重复，但为主题使用）
  description: "Share"               # 网站描述
  keywords: [资源分享]                # 关键词，SEO 使用
  author: Beiyuan                   # 作者名称
  DateFormat: "January 2, 2006"      # 日期格式（文章时间显示格式）
  defaultTheme: auto                 # 默认主题：auto（跟随系统）、dark、light
  disableThemeToggle: false          # 是否禁用切换明暗模式按钮

  ShowReadingTime: true              # 显示文章阅读时间
  ShowPostNavLinks: true             # 显示上一篇/下一篇导航链接
  ShowBreadCrumbs: true              # 显示面包屑导航
  ShowCodeCopyButtons: false         # 是否显示“复制代码”按钮
  ShowWordCount: true                # 显示文章字数
  ShowRssButtonInSectionTermList: true # 在分类、标签页面显示 RSS 按钮
  UseHugoToc: true                   # 使用 Hugo 内置目录而非主题自带目录
  disableSpecial1stPost: false       # 是否禁用首页首篇特殊展示样式
  disableScrollToTop: false          # 是否禁用回到顶部按钮
  comments: false                    # 全局禁用评论
  hidemeta: false                    # 是否隐藏 meta 信息（作者、时间等）
  hideSummary: false                 # 是否隐藏摘要
  showtoc: false                     # 是否默认显示目录
  tocopen: false                     # 是否默认展开目录

  assets:
    # disableHLJS: true              # 是否禁用 highlight.js（如果用的是 Chroma 可禁用）
    # disableFingerprinting: true   # 是否禁用静态资源指纹（可选）
    favicon: "/favicon.ico"          # 网站图标路径（放置在 static/ 下）
    favicon16x16: "/favicon-16x16.png"
    favicon32x32: "/favicon-32x32.png"
    apple_touch_icon: "/apple-touch-icon.png"
    safari_pinned_tab: "/favicon.ico"

  label:
    text: "Beiyuan"                  # 左上角 Logo 文字
    icon: /apple-touch-icon.png      # Logo 图标路径
    iconHeight: 35                   # Logo 高度

  # 首页介绍卡片
  homeInfoParams:
    Title: "Beiyuan Shares"          # 首页介绍标题
    Content: A place where I share the things I want to share  # 首页介绍内容

  cover:
    hidden: true                     # 是否在结构化数据中隐藏封面
    hiddenInList: true               # 是否在列表页隐藏封面图
    hiddenInSingle: true             # 是否在单页隐藏封面图

  # 搜索相关配置（使用 Fuse.js 本地搜索）
  # Fuse.js 配置说明：https://fusejs.io/api/options.html
  fuseOpts:
    isCaseSensitive: false
    shouldSort: true
    location: 0
    distance: 1000
    threshold: 0.4
    minMatchCharLength: 0
    limit: 10
    keys: ["title", "permalink", "summary", "content"]

menu:
  main:
    - identifier: archives           # 归档页面菜单项
      name: 归档
      url: /archives/
      weight: 10
    - identifier: tags               # 标签页面菜单项
      name: 标签
      url: /tags/
      weight: 20
    - identifier: search             # 搜索页面菜单项
      name: 搜索
      url: /search/
      weight: 30

# 使用 Hugo 的语法高亮器（Chroma）
# 更多配色方案见：https://xyproto.github.io/splash/docs/all.html
pygmentsUseClasses: true             # 使用 CSS 类进行高亮（建议开启，便于主题样式控制）
markup:
  highlight:
    noClasses: false                 # 使用 CSS 类而非内联样式（false 推荐）
    # anchorLineNos: true            # 是否为每一行添加锚点（方便链接到指定代码行）
    # codeFences: true               # 启用 ``` 代码块支持（建议开启）
    # guessSyntax: true              # 启用语言猜测（不指定语言时尝试自动识别）
    # lineNos: true                  # 显示代码行号
    # style: monokai                 # 设置代码高亮风格，如：monokai、dracula、github、solarized 等
```

### 默认文章头示例

```yaml
---
auther: Beiyuan
author: Beiyuan
categories:
- 自建折腾
date: '2025-05-06T14:26:29'
draft: false
lastmod: '2025-05-06T14:26:29'
tags:
- Tools
title: 服务器部署Hugo

---
```

### 创建文章并启动

```shell
#创建新文章
hugo new posts/my-new-post.md
#启动，创建完成后就和hugo脱离了，hugo只需要写文章build就行了
hugo --environment production --minify --cleanDestinationDir
```

### Nginx反代

```shell
#安装所需程序
sudo apt install certbot python3-certbot-nginx python3-certbot-dns-cloudflare nginx
#手动编辑
sudo nano /etc/nginx/sites-available/hugo
#启用配置
sudo ln -s /etc/nginx/sites-available/hugo /etc/nginx/sites-enabled/
#从Cloudflare获取区域DNS API
sudo nano /etc/letsencrypt/cloudflare.ini
dns_cloudflare_api_token = 你的API
#赋予权限
sudo chmod 600 /etc/letsencrypt/cloudflare.ini
#使用CF-DNS申请证书，你不想关小黄云用这个，全程y就行
sudo certbot certonly --dns-cloudflare --dns-cloudflare-credentials /etc/letsencrypt/cloudflare.ini -d example.com #替换为你的域名
#直接申请证书，上面的申请完后可以用这个命令自动配置HTTPS，选1
sudo certbot --nginx -d example.com #替换为你的域名
#这里是把hugo生成的public软链接到nginx目录
sudo ln -s /opt/blog/public /var/www/html/hugo
```

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.com;  # 替换为您的域名或 IP 地址

    root /var/www/html/hugo;  # Hugo 网站的 public 目录路径 (确保这个路径存在并指向 Hugo 的输出目录)
    index index.html;

    # Hugo 路由兼容（archives、tags 等路径支持）
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 启用 gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        application/json
        application/javascript
        application/rss+xml
        application/atom+xml
        image/svg+xml;

    # 缓存静态资源
    location ~* \.(?:css|js|jpg|jpeg|gif|png|ico|svg|woff2?|ttf|eot|otf|json|webp)$ {
        expires 30d;
        access_log off;
        add_header Cache-Control "public";
    }

    # 强化安全头部
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # 拒绝访问隐藏文件（如 .git）
    location ~ /\. {
        deny all;
    }
}
```

### 启用归档和搜索

```shell
cd /opt/blog/content
nano archives.md
nano search.md
```

```
---
auther: Beiyuan
author: Beiyuan
categories:
- 自建折腾
date: '2025-05-06T14:26:29'
draft: false
lastmod: '2025-05-06T14:26:29'
tags:
- Tools
title: 服务器部署Hugo

---
```

```
---
auther: Beiyuan
author: Beiyuan
categories:
- 自建折腾
date: '2025-05-06T14:26:29'
draft: false
lastmod: '2025-05-06T14:26:29'
tags:
- Tools
title: 服务器部署Hugo

---
```

### 标签分类和文章页面修改中文

*要将标签和分类等页面改为中文需要在对应文件夹下添加 _index.md 文件。*

```
#content\categories\_index.md
---
auther: Beiyuan
author: Beiyuan
categories:
- 自建折腾
date: '2025-05-06T14:26:29'
draft: false
lastmod: '2025-05-06T14:26:29'
tags:
- Tools
title: 服务器部署Hugo

---
```

```
#content\tags\_index.md
---
auther: Beiyuan
author: Beiyuan
categories:
- 自建折腾
date: '2025-05-06T14:26:29'
draft: false
lastmod: '2025-05-06T14:26:29'
tags:
- Tools
title: 服务器部署Hugo

---
```

```
#content\posts\_index.md
---
auther: Beiyuan
author: Beiyuan
categories:
- 自建折腾
date: '2025-05-06T14:26:29'
draft: false
lastmod: '2025-05-06T14:26:29'
tags:
- Tools
title: 服务器部署Hugo

---
```

```shell
hugo --environment production --minify
```
