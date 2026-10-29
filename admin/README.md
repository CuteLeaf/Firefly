# Firefly 管理后台

为 Firefly 博客主题打造的**图形化管理后台**：无需手改代码，即可在网页上完成文章管理与全部个性化配置的编辑。

> 技术栈：Node + Hono + 原生 ESM 前端（无构建步骤），与 Astro 站点完全解耦，通过一个 JSON 覆盖层文件安全地影响站点配置。

## ✨ 功能一览

| 功能 | 说明 |
| --- | --- |
| 🔐 账号密码登录 | 账号密码**只能**通过修改 `admin/admin.config.ts` 配置（网页不提供改密入口）；会话 Cookie 带 HMAC 签名，含登录防爆破与 CSRF 防护 |
| 📝 文章管理 | 新建 / 编辑 / 草稿 / 发布 / 下架 / 删除（回收站），中文标题自动转拼音 URL，正文改动自动更新「上次编辑时间」，Markdown 实时预览，封面图可从媒体库一键选择 |
| 🎨 个性化设置 | 覆盖 `src/config/` 全部 26 个配置模块（站点、导航、侧边栏、壁纸、评论、音乐、看板娘、友链、相册……），Schema 驱动的动态表单，支持保存 / 一键恢复默认 |
| 🖼️ 媒体库 | 上传图片/音频到 `public/images/admin/`，复制 `/images/admin/...` 引用路径，支持子目录与拖拽上传 |
| 🚀 构建部署 | 一键执行 `pnpm build` 并实时查看构建日志（SSE），查看开发服务器与 dist 产物状态 |

## 🚀 快速开始

```bash
pnpm install          # 已安装过可跳过
pnpm admin            # 启动管理后台 → http://localhost:4001
```

浏览器打开 <http://localhost:4001>，用默认账号登录：

- 用户名：`admin`
- 密码：`admin123`

**修改账号密码**：编辑 `admin/admin.config.ts` 中的 `adminAuth.username` / `adminAuth.password`，重启后台生效。这是修改账号密码的唯一方式（符合“账号密码只能通过配置文件修改”的设计要求）。

同时启动博客开发服务器可获得实时预览：

```bash
pnpm dev              # http://localhost:4321（另一终端）
```

后台保存的个性化设置会被运行中的 dev 服务器**自动热更新**；生产环境在后台「构建部署」页一键构建后部署 `dist/` 即可。

## 📖 使用指南

### 文章管理

- **新建**：填写标题、正文即可，slug 留空会自动按标题生成拼音；也可手动指定（如 `guide/hello-world` 支持子目录，创建后不可改名）。
- **发布**：草稿（`draft: true`）在生产构建中不会输出；点「发布」即可上线，「下架」转回草稿。
- **删除**：文件移入 `admin/trash/posts/` 回收站（gitignore），可手动找回；彻底清理直接删除该目录即可。
- **加密文章**：在文章信息的「访问密码」填入密码即可使用站点加密插件（需站点侧已启用）。
- 文章存放在 `src/content/posts/`，与手写文件完全互通——后台只是读写这些 Markdown 文件。

### 个性化设置

- 左侧按分组列出全部 26 个配置模块，点击切换；表单字段的说明文字直接取自配置源码注释。
- **保存**后写入 `src/config/user-config.json`（只保存与默认值不同的字段），站点构建时通过形状守卫的深合并覆盖 `src/config/*.ts` 中的默认值。
- **恢复默认值**：删除该模块在 `user-config.json` 中的覆盖层，立即回到代码默认值。
- 也可以**手工编辑** `src/config/user-config.json`（保持 JSON 合法即可）——后台、手写、图形界面三种方式可以混用。
- 想彻底回到纯手写配置模式：删除 `user-config.json` 的全部内容（保留 `{}` 或 `"//"` 说明键均可），一切照旧。

### 媒体库

- 上传后得到 `/images/admin/...` 引用路径（`public/` 目录下的文件站点直接可访问）。
- 在文章编辑器封面图字段点「从媒体库选择」即可直接选用。

### 构建部署

- 状态卡显示开发服务器与 `dist/` 产物状态；「开始构建」执行 `pnpm build`，日志实时滚动显示。
- 构建命令可在 `admin/admin.config.ts` 的 `adminServer.buildCommand` 自定义（数组形式）。

## 🔧 配置参考（admin/admin.config.ts）

```ts
export const adminAuth = {
  username: "admin",            // 登录用户名
  password: "admin123",         // 明文密码（与 passwordHash 二选一）
  passwordHash: "",             // scrypt 哈希：pnpm admin:hash-password -- 你的密码
  sessionTtlHours: 24,          // 会话有效期
};

export const adminServer = {
  host: "127.0.0.1",            // 仅本机访问；改为 0.0.0.0 可局域网访问（注意安全）
  port: 4001,                   // 后台端口
  postsDir: "src/content/posts",
  mediaDir: "public/images/admin",
  enableBuildModule: true,
  buildCommand: [],             // 自定义构建命令，如 ["pnpm", "build"]
};
```

**关于密码安全**：本地工具优先保证简单可用，`password` 明文即可；若希望配置文件中不出现明文密码，运行 `pnpm admin:hash-password -- 你的密码` 生成 scrypt 哈希填入 `passwordHash`（两者都填时优先用哈希）。会话签名密钥自动生成并持久化在 `admin/.secret`（已 gitignore），也可用环境变量 `FIREFLY_ADMIN_SECRET` 覆盖。

## 🏗️ 架构与模块化

```
admin/
├── admin.config.ts        # 账号密码 / 端口等（唯一需要手工编辑的配置）
├── README.md              # 本文档
├── tsconfig.json          # 后台 TypeScript 类型检查配置
├── env.d.ts               # Node 运行环境的类型补充
├── schemas/
│   ├── post.schema.json   # 文章 Frontmatter 表单 Schema
│   └── fragments/         # 26 个配置模块的表单 Schema 片段（由后台自动加载）
├── scripts/
│   ├── hash-password.mjs  # 生成 scrypt 密码哈希
│   ├── check-schemas.ts   # Schema 与配置默认值交叉校验（防字段名漂移）
│   └── e2e-test.mjs       # headless Chrome 端到端冒烟测试
├── server/
│   ├── index.ts           # 入口：模块注册表 + 静态资源 + 认证中间件
│   ├── lib/               # 基础库（认证 / 覆盖层读写 / Schema 校验 / 路径安全 / 配置清单）
│   └── modules/           # 功能模块（auth / dashboard / posts / configs / media / site）
└── ui/                    # 前端（无构建步骤的原生 ESM + hash 路由）
    ├── index.html
    ├── css/admin.css
    └── js/
        ├── app.js         # 视图注册表 + 路由分发
        ├── api.js / router.js
        ├── components/    # schema-form（通用表单渲染器）、ui（toast/弹窗）、markdown
        └── views/         # login / dashboard / posts / post-edit / settings / media / site
```

### 工作原理（配置覆盖层）

1. 每个 `src/config/*.ts` 模块导出前都经过 `mergeUserConfig("key", defaults)` 合并；
2. 合并是**形状守卫**的：只覆盖与默认值同类型的叶子字段，数组整体替换、对象递归、未知字段忽略——手改 JSON 也不会把站点搞崩；
3. 后台保存时只写入**与默认值不同的差异**（`computeOverlay`），因此模板升级新增默认字段时不会与旧覆盖层冲突；
4. `user-config.json` 被提交进仓库（构建时必需），内含一个 `"//"` 说明键，后台写入时会保留它。

### 新增一个功能模块（三步）

以“服务端模块 + 页面”为例：

1. **服务端**：新建 `admin/server/modules/xxx.ts`，导出 `createXxxModule(): Hono`，在其中定义 `/api/xxx/...` 路由；然后在 `admin/server/index.ts` 的 `moduleRegistry` 登记一行（`auth: true` 表示需要登录）。
2. **前端**：新建 `admin/ui/js/views/xxx.js`，导出 `async function render(container, params)`；在 `app.js` 的 `viewRegistry` 登记路由，并在 `index.html` 侧边栏加导航项。
3. **（可选）配置类模块**：在 `src/config/` 加 `mergeUserConfig` 包装 → 在 `admin/schemas/fragments/` 加 `key.schema.json` → 在 `admin/server/lib/config-manifest.ts` 登记一条。运行 `npx tsx admin/scripts/check-schemas.ts` 校验字段名与默认值一致。

### 表单 Schema 速查（自定义关键字）

| 关键字 | 效果 |
| --- | --- |
| `x-format` | `textarea` / `markdown` / `url` / `email` / `color` / `date` / `date-time` |
| `x-tags: true` | 字符串数组 → 标签式输入（回车添加） |
| `x-itemTitle` | 对象数组的列表项标题字段 |
| `x-editor: "json"` | 自由结构对象 → JSON 编辑器 |
| `x-if` | `{ "field": "同层字段", "equals": 值 }` 条件显示 |
| `"type": ["string","array"]` | 单值/多值切换（如壁纸图片、视频地址） |

## 🛠️ 开发与校验命令

```bash
pnpm admin            # 启动后台
pnpm admin:check      # 后台 TypeScript 类型检查
pnpm admin:hash-password -- <密码>   # 生成密码哈希
npx tsx admin/scripts/check-schemas.ts   # Schema ↔ 默认值交叉校验
node admin/scripts/e2e-test.mjs           # 浏览器端到端冒烟测试（需 Chrome，后台先启动）
```

## ❓ 常见问题

**Q：后台保存后前台没变化？**
运行中的 `pnpm dev` 会自动热更新；若已构建部署，需要重新执行构建（后台「构建部署」页一键完成）。

**Q：忘记密码了怎么办？**
直接编辑 `admin/admin.config.ts` 修改 `password`，重启后台。

**Q：能不能在服务器上部署后台？**
可以：把仓库放到服务器，`pnpm admin` 常驻运行（如 pm2/systemd），把 `host` 改为 `0.0.0.0` 并注意用防火墙限制访问、务必修改默认密码、建议开启 HTTPS 反向代理。账号密码始终以 `admin.config.ts` 为准。

**Q：后台和手写配置冲突怎么办？**
不会冲突：后台只写 `user-config.json` 覆盖层，手写改的是 `src/config/*.ts` 默认值。两者同时存在时覆盖层优先生效；删除覆盖层即回到手写值。

**Q：为什么我的某个配置字段在后台看不到？**
表单 Schema 覆盖的是默认配置对象中**真实存在**的字段；纯代码逻辑（函数、TS 枚举、`navBarSearchConfig` 等）不进入图形化编辑，仍以手写为准。

**Q：端口被占用？**
修改 `admin.config.ts` 的 `adminServer.port`。

**Q：文章上传的封面图路径怎么写？**
后台媒体库上传后复制路径（`/images/admin/...`）粘贴到封面图字段即可；也可以手写 `src/assets` 相对路径或远程 URL（见字段说明）。
