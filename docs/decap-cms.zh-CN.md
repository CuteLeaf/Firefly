# Decap CMS（Git 型后台）使用说明

在浏览器打开 **`https://blog.qinrui.top/admin/`**（部署后）即可用可视化界面编辑 `src/content/posts` 下的文章；保存后会**直接向 GitHub 提交 commit**，Cloudflare Pages 会像平时一样自动构建发布。

## 1. 在 GitHub 创建 OAuth App

1. 打开 [New OAuth App](https://github.com/settings/applications/new)。
2. **Application name**：任意，例如 `Firefly Decap`。
3. **Homepage URL**：`https://blog.qinrui.top`
4. **Authorization callback URL**（须完全一致）：  
   `https://blog.qinrui.top/callback?provider=github`
5. 创建后记下 **Client ID**，并生成 **Client secrets**。

> 若仓库为**私有**，需把下文「可选：私有仓库」中的 scope 调整一并做完。

## 2. 在 Cloudflare 配置 `GITHUB_OAUTH_*`（你截图里灰字的原因）

### 为什么会出现「不能将变量添加到只有静态资产的 Worker」？

当前项目用 **`wrangler.toml` + 只挂 `[assets]`（`directory = ./dist`）** 部署时，会被识别成**只有静态文件、没有自己的 Worker 脚本**。这种形态下，控制台里的 **「变量和机密」不可用**，这是 Cloudflare 的规则，不是你操作错了。

本仓库已改为：**增加入口脚本 `workers/decap-github-oauth.js`**，并在 `wrangler.toml` 里配置了 **`main`**、**`ASSETS` 绑定** 和 **`run_worker_first`**（只对 `/auth`、`/callback` 走脚本，其它仍走静态站）。这样部署后，项目就**带有可执行 Worker**，一般即可在网页里正常加变量。

请你：**先拉取/合并包含上述改动的代码 → 再完整部署一次**（你平时用的 `wrangler deploy` 或 CI 流水线）。部署成功后再打开 **Workers 和 Pages → firefly → 设置 → 变量和机密 → 添加**，新增：

| 变量名 | 类型建议 | 说明 |
|--------|----------|------|
| `GITHUB_OAUTH_ID` | 机密或变量 | GitHub OAuth App 的 **Client ID** |
| `GITHUB_OAUTH_SECRET` | **机密** | GitHub OAuth App 的 **Client secret** |

保存后无需改 OAuth 回调地址（仍是 `https://blog.qinrui.top/callback?provider=github`）。

### 若网页里仍然不能添加（备用：Wrangler 命令行）

在本机仓库根目录（有 `wrangler.toml` 的目录）执行，并按提示粘贴值：

```bash
npx wrangler login
npx wrangler secret put GITHUB_OAUTH_SECRET
npx wrangler secret put GITHUB_OAUTH_ID
```

（把 Client ID 也存成「机密」同样可以，避免写进仓库。）然后再执行一次部署。

### 若你坚持用「单独的 OAuth Worker」

可不依赖本站 Worker：按 [sterlingwes/decap-proxy](https://github.com/sterlingwes/decap-proxy) 单独部署一个 Worker，把 `public/admin/config.yml` 里的 `base_url` 改成该 Worker 的 `https://xxx.workers.dev`，GitHub 回调 URL 也改成该 Worker 的 `/callback?provider=github`。

## 3. 仓库与分支

后台配置在 `public/admin/config.yml` 中：

- `repo`：当前为 `CokeloveMiyo/Firefly`，若你 fork 或改名请改成 `用户名/仓库名`。
- `branch`：当前为 `master`，若主分支是 `main` 请改成 `main`。

## 4. 权限说明

- 使用后台登录的 GitHub 账号必须对该仓库有 **push** 权限（协作者或本人）。
- OAuth scope 为 `public_repo,user`；仅对**公开**仓库写内容足够。
- **私有仓库**：需改 `functions/auth.js` 里 `scope` 为 `repo,user`，并在 GitHub OAuth App 中申请相应权限（或新建 App）。

## 5. 限制与说明

- 本集合仅管理 **`.md`** 新建文章；已有 **`.mdx`** 仍可在 GitHub 本地改，或后续再在 Decap 里加 mdx 集合。
- 封面等媒体建议放在 `src/content/posts/images/`，frontmatter 里写 `./images/文件名`。
- 本地 `pnpm dev` 时 **`/auth` 由 Cloudflare 提供**，本地一般无法完成登录；请在**已部署的** `blog.qinrui.top/admin/` 使用后台。

## 6. 故障排查

- 登录后提示找不到仓库：检查 `config.yml` 里的 `repo`、`branch`。
- 403 / 无法提交：确认该 GitHub 账号对仓库有写权限。
- 白屏：浏览器控制台查看是否拦截了 `unpkg.com`；可考虑将 `public/admin/index.html` 中的脚本改为 jsDelivr 等镜像。
