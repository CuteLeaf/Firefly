---
title: 在 Linux 服务器上用 pnpm 部署 Fuwari（Astro）博客
published: 2025-08-15
description: 在无桌面的 Linux 环境用 pnpm 安装、构建并发布 Fuwari（Astro）静态博客的实操步骤与长期维护建议。
tags: [部署,Astro,Fuwari]
category: 部署
draft: false
lang: zh_CN
---
# 在 Linux 服务器上用 pnpm 部署 Fuwari（Astro）博客并发布到静态托管

## 概要
本文提供一套可直接执行的流程。适用于只有服务器、没有本地电脑的情况。包含：获取代码、用 `pnpm` 安装依赖、构建站点、以及把静态产物发布到常见静态托管平台（Vercel / Netlify / GitHub Pages）或自建静态目录。

---

## 先决条件
- Linux 服务器可 SSH 登录。  
- 已安装 Git 或能从服务器直接克隆仓库。  
- Node.js（建议 18+ 或 20）可用。  
- 能在服务器上安装全局 npm 包（用于安装 pnpm）。  
- 已有目标托管方式（Vercel/Netlify/GitHub Pages/自服）。

---

## 在服务器上保存文章（示例：把本文保存为 Markdown 文件）

把本文直接写入你的仓库文章目录。下面示例假设文章目录为 `src/pages`，文件名按日期命名。

```bash
cd /path/to/your-fuwari-repo/src/pages
cat > 2025-08-14-deploy-fuwari.md <<'EOF'
---
title: "在 Linux 服务器上用 pnpm 部署 Fuwari（Astro）博客"
date: 2025-08-14
description: "在无桌面的 Linux 环境用 pnpm 安装、构建并发布 Fuwari（Astro）静态博客的实操步骤与长期维护建议。"
tags: ["部署","pnpm","Fuwari","Astro"]
---

（把文章正文粘贴到这里，或把整个本文件内容粘贴进去。）
EOF
```

如果你的文章目录不是 `src/pages`，改为实际路径如 `src/content`、`src/posts` 等。

---

## 提交并推送到远程仓库

```bash
cd /path/to/your-fuwari-repo
git add src/pages/2025-08-14-deploy-fuwari.md
git commit -m "Add: 在 Linux 服务器上用 pnpm 部署 Fuwari 博客"
git push origin main
```

把 `main` 换成你的默认分支名。

---

## 在服务器上用 pnpm 安装并构建（完整命令）

如果服务器上还没 Node / pnpm，请先安装（示例为 Debian/Ubuntu 风格）：

```bash
# 安装 Node（示例：Node 20）
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 pnpm
npm install -g pnpm
```

在项目目录安装依赖并构建：

```bash
cd /path/to/your-fuwari-repo
pnpm install
pnpm build
# 构建产物通常位于 dist/ 或 build/，以项目配置为准
ls -la dist
```

---

## 将构建产物发布（三种常见方式）

### 方式 A — 连接仓库到 Vercel / Netlify（推荐）
1. 在 Vercel 或 Netlify 控制面板创建新项目。  
2. 连接你的 Git 仓库（授权后选择仓库）。  
3. 构建命令填 `pnpm build`。输出目录填 `dist`（或项目实际输出目录）。  
4. 保存并部署。每次 push 会自动触发构建与发布。

优点：零维护、自动预览。缺点：托管受第三方控制。

### 方式 B — GitHub Pages + GitHub Actions
在仓库里添加 `.github/workflows/deploy.yml`（示例）：

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install -g pnpm
      - run: pnpm install
      - run: pnpm build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

注意：若站点部署在仓库子路径，需在 `astro.config.mjs` 设置 `base`。推送后 Actions 会自动发布到 `gh-pages` 分支。

优点：免费、GitHub 集成好。缺点：对子路径和复杂路由需配置。

### 方式 C — 手动上传（rsync / scp）
完全自托管的方式。先构建，再上传到静态服务器目录。

```bash
pnpm build
rsync -avz --delete dist/ user@static-server:/var/www/your-site/
```

优点：完全控制。缺点：需自己维护部署流程和备份。

---

## 在服务器上本地预览构建结果（临时）
用 `serve` 或简单的静态服务器查看构建结果。

```bash
pnpm install -g serve
serve -s dist
# 打开 http://服务器IP:3000 （serve 默认端口）
```

或用 Python 内置服务器快速查看：

```bash
cd dist
python3 -m http.server 8000
# 打开 http://服务器IP:8000
```

---

## 常见问题与解决方案
- **安装失败或版本不匹配**：确保 Node 版本与 `pnpm`、项目 `engines` 要求一致。使用 `node -v` 和 `pnpm -v` 检查。  
- **依赖差异**：确保仓库包含 `pnpm-lock.yaml` 并随仓库提交。CI/服务器应使用相同 lockfile。  
- **404 或 路由错误**：若部署在子路径，设置 `astro.config.mjs` 的 `base`。  
- **构建过程内存不足**：在低配服务器上可通过 swap 或在 CI 上构建再上传静态产物。  
- **资源没更新**：CDN 缓存可导致旧内容显示。清理 CDN 缓存或更改资源文件名以绕过缓存。

---

## 长期维护与策略（长线思维）
1. **CI/CD 自动化**：采用 Git-based 自动部署。减少人工错误。  
2. **备份与回滚**：使用 Git tag 做发布记录。保存关键配置和上传内容的离线备份。  
3. **依赖管理**：启用 Dependabot 或定期审查依赖，及时修补安全问题。  
4. **监控与性能**：使用 Lighthouse、SRE 指标或第三方监控检测性能退化。  
5. **扩展预留**：如果未来需要 SSR 或 API，设计时预留 serverless 或动态后端入口。  
6. **文档化**：在仓库根目录写 `DEPLOY.md`，列出部署步骤、回滚步骤、常见问题和联系方式。

---

## 推荐 `DEPLOY.md` 最小模板（放在仓库根目录）
```markdown
# DEPLOY.md

## 本地构建
pnpm install
pnpm build

## 手动上传（示例）
rsync -avz --delete dist/ user@static-server:/var/www/your-site/

## GitHub Actions
Workflow: .github/workflows/deploy.yml

## 回滚
1. git checkout <previous-tag-or-commit>
2. git push origin main
```

---

## 结论
把文章保存为 Markdown 文件，提交到仓库，选择自动化或手动发布流程即可上线。推荐使用 Vercel/Netlify 以降低运维成本。保留 `pnpm-lock.yaml` 和 `DEPLOY.md`，并把部署流程写死在 CI 中以保证长期可复现性。

## 参考资料
- Astro 官方部署指南  
  https://docs.astro.build/en/guides/deploy/  

- Astro 部署到 GitHub Pages（官方指南）  
  https://docs.astro.build/en/guides/deploy/github/  

- Astro 部署到 Vercel（官方指南）  
  https://docs.astro.build/en/guides/deploy/vercel/  

- Astro 部署到 Netlify（官方指南）  
  https://docs.astro.build/en/guides/deploy/netlify/  

- Astro GitHub Pages 模板（示例仓库）  
  https://github.com/withastro/github-pages  

- Astro 官方部署 Action（withastro/action）  
  https://github.com/withastro/action  

- peaceiris/actions-gh-pages（常用 GitHub Pages 部署 Action）  
  https://github.com/peaceiris/actions-gh-pages  

- pnpm 安装与 CLI 文档（pnpm install）  
  https://pnpm.io/cli/install  

- pnpm 安装说明（installation）  
  https://pnpm.io/installation  

- pnpm 官方 GitHub 仓库  
  https://github.com/pnpm/pnpm  

- pnpm 关于与 Git 一起使用的说明（lockfile、合并等）  
  https://pnpm.io/git  

- npm 包：serve（本地静态预览工具）  
  https://www.npmjs.com/package/serve  

- Python 标准库：http.server（快速预览）  
  https://docs.python.org/3/library/http.server.html  

- Node.js 官方下载页面（二进制与版本）  
  https://nodejs.org/en/download/  

- NodeSource 安装脚本（示例：setup_20.x）  
  https://deb.nodesource.com/setup_20.x  

- Netlify 官方：如何使用 Astro（博客 / 指南）  
  https://www.netlify.com/blog/how-to-deploy-astro/  

- Vercel 文档：Astro 框架支持页面  
  https://vercel.com/docs/frameworks/astro  

- Cloudflare Pages：部署 Astro 指南  
  https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/  

- freeCodeCamp：pnpm 使用入门文章（用户指南）  
  https://www.freecodecamp.org/news/how-to-use-pnpm/
