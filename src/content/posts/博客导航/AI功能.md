---
title: FireflyBlog AI 功能完整指南
published: 2026-06-01
description: FireflyBlog 博客 AI 问答与文章概括功能的完整技术文档，包含架构设计、实现细节、配置说明和注意事项
tags:
  - 博客系列
  - 技术文档
  - AI
  - DeepSeek
category: 博客导航
pinned: true
abbrlink: ai-feature
---

## 一、功能概览

FireflyBlog 集成了两套 AI 功能，基于 DeepSeek API 实现：

| 功能 | 入口 | 能力 |
|------|------|------|
| AI 问答 | 文章页面右下角「🤖」按钮 | 基于当前文章内容进行多轮对话，支持引用跳转、思维链展示 |
| 文章概括 | 文章标题下方「✨ AI 概括」卡片 | 一键生成文章摘要，含思维链展开、段落引用、追问建议 |

### 功能特点

- **前端零密钥**：API Key 存储在服务端环境变量中，前端不暴露
- **SSE 流式输出**：逐 Token 渲染，用户体验流畅
- **引用跳转**：回答中的 `↗` 链接可直接跳转到文章对应章节
- **追问建议**：AI 生成相关问题，点击直接发送到聊天面板
- **sessionStorage 缓存**：同一会话内不重复请求概括
- **Swup 兼容**：支持 SPA 风格页面切换

---

## 二、目录结构

```
src/
├── config/
│   └── aiConfig.ts                    # AI 配置文件（功能开关、模型参数）
├── pages/
│   └── api/
│       └── ai/
│           ├── chat.ts                # AI 问答 API 路由
│           └── summarize.ts           # 文章概括 API 路由
├── components/
│   └── ai/
│       ├── AiChat.svelte              # AI 聊天面板组件
│       └── ArticleSummary.svelte      # 文章概括卡片组件
├── styles/
│   └── ai.css                         # AI 组件样式
├── layouts/
│   └── Layout.astro                   # 添加了 Swup 钩子（需修改）
├── components/
│   └── controls/
│       └── FloatingControls.astro     # 添加了 AI 聊天按钮（需修改）
└── pages/
    └── posts/
        └── [...slug].astro            # 添加了概括卡片（需修改）
```

---

## 三、技术架构

```
┌─────────────────────────────────────────────────────┐
│                    浏览器端                          │
│  ┌──────────────────┐  ┌────────────────────────┐   │
│  │   AiChat.svelte  │  │  ArticleSummary.svelte │   │
│  │   (聊天面板)      │  │  (概括卡片)            │   │
│  └────────┬─────────┘  └───────────┬────────────┘   │
│           │                        │                │
│           └──────────┬─────────────┘                │
│                      │ POST /api/ai/chat            │
│                      │ POST /api/ai/summarize       │
└──────────────────────┼──────────────────────────────┘
                       │
┌──────────────────────┼──────────────────────────────┐
│          Astro API Routes (SSR)                      │
│                      │                               │
│  ┌───────────────────┴───────────────────────┐      │
│  │              路由处理                      │      │
│  │  ├── chat.ts → 构建 System Prompt        │      │
│  │  └── summarize.ts → 构建概括 Prompt      │      │
│  └───────────────────┬───────────────────────┘      │
│                      │                               │
│  ┌───────────────────┴───────────────────────┐      │
│  │           环境变量读取                     │      │
│  │  import.meta.env.AI_API_KEY              │      │
│  └───────────────────┬───────────────────────┘      │
└──────────────────────┼──────────────────────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │   DeepSeek API  │
              │  - deepseek-chat│
              │  - SSE 流式响应 │
              └─────────────────┘
```

---

## 四、配置说明

### 4.1 环境变量

在 `.env.local` 文件中添加：

```bash
# DeepSeek API Key（必需）
AI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

### 4.2 AI 配置文件

编辑 `src/config/aiConfig.ts`：

```typescript
export const aiConfig = {
  // 是否启用 AI 功能
  enable: true,

  // DeepSeek API 配置
  apiEndpoint: 'https://api.deepseek.com/v1/chat/completions',
  model: 'deepseek-chat',
  maxTokens: 4096,
  temperature: 0.7,        // 问答模式
  summaryTemperature: 0.1,  // 概括模式（更稳定）

  // 功能开关
  chatEnabled: true,        // 启用 AI 问答
  summaryEnabled: true,     // 启用文章概括
  summaryAutoGenerate: false, // 是否自动生成概括

  // 博主信息
  authorName: 'Firefly',
  authorBio: '这是一个技术博客，分享编程、AI、Web 开发等技术内容。',
};
```

### 4.3 配置项说明

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enable` | boolean | `true` | 总开关 |
| `chatEnabled` | boolean | `true` | 显示问AI按钮 |
| `summaryEnabled` | boolean | `true` | 显示概括卡片 |
| `summaryAutoGenerate` | boolean | `false` | 进入文章自动生成概括 |
| `temperature` | number | `0.7` | 问答温度（越高越随机） |
| `summaryTemperature` | number | `0.1` | 概括温度（越低越稳定） |
| `maxTokens` | number | `4096` | 最大输出 token 数 |

---

## 五、实现流程

### 5.1 AI 问答流程

```
用户输入问题
    │
    ▼
前端构建请求 { messages, articleContent, articleTitle, headings }
    │
    ▼
POST /api/ai/chat
    │
    ├─ 1. 读取环境变量 AI_API_KEY
    │
    ├─ 2. 构建 System Prompt
    │     ├── SYSTEM_PROMPT（角色定义 + 输出格式）
    │     ├── 博主信息
    │     ├── 文章标题
    │     ├── 章节索引（用于引用编号）
    │     └── 文章全文
    │
    ├─ 3. 调用 DeepSeek API（stream: true）
    │
    └─ 4. 透传 SSE 流 → 浏览器
```

### 5.2 文章概括流程

```
页面加载 / 点击「生成概括」按钮
    │
    ├─ 检查 sessionStorage 缓存
    │     ├─ 命中 → 直接渲染缓存结果
    │     └─ 未命中 → 发起请求
    │
    ├─ POST /api/ai/summarize
    │
    ├─ 服务端处理：
    │     ├── 读取文章内容
    │     ├── 构建章节索引
    │     ├── 组装 SUMMARIZE_PROMPT + 文章内容
    │     └── 调用 DeepSeek API → SSE 流
    │
    ├─ 前端流式渲染：
    │     ├── thinking 过程（可折叠）
    │     ├── 正文段落（支持行内 Markdown）
    │     ├── 引用链接（↗ + 章节编号）
    │     └── 提问建议标签
    │
    └─ 写入 sessionStorage
```

### 5.3 SSE 流式渲染

```javascript
// 前端 SSE 解析核心逻辑
const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value, { stream: true });
  const lines = chunk.split('\n');

  for (const line of lines) {
    if (!line.startsWith('data: ')) continue;
    const data = line.slice(6).trim();
    if (data === '[DONE]') continue;

    const parsed = JSON.parse(data);
    const delta = parsed.choices?.[0]?.delta;

    // 处理思维链（thinking）
    if (delta?.reasoning_content) {
      thinkingContent += delta.reasoning_content;
    }

    // 处理正文内容
    if (delta?.content) {
      fullContent += delta.content;
    }
  }
}
```

---

## 六、Prompt 设计

### 6.1 问答 System Prompt

```
你是一个专业的博客助手，专门为读者解答关于博客文章的问题。

## 输出格式
请以 JSON 数组格式输出，每个元素包含：
- p: 段落内容
- r: 引用的章节编号数组（可选）
- q: 追问建议数组（在最后一个元素中）

示例：
[
  {"p": "根据文章内容...", "r": [1, 2]},
  {"p": "你可能还想了解...", "q": ["如何优化性能？"]}
]
```

### 6.2 概括 Prompt

```
你是一个文章概括助手，专门生成简洁准确的文章摘要。

## 输出格式
{
  "p": ["段落1内容", "段落2内容", "段落3内容"],
  "q": ["追问建议1", "追问建议2", "追问建议3"]
}
```

---

## 七、注意事项

### 7.1 环境变量读取

在 Astro SSR API 路由中，必须使用 `import.meta.env` 读取环境变量：

```typescript
// ✅ 正确
const apiKey = (import.meta as any).env?.AI_API_KEY;

// ❌ 错误（在 Astro 中可能不工作）
const apiKey = process.env.AI_API_KEY;
```

### 7.2 CORS 配置

API 路由需要配置 CORS 头，否则浏览器会阻止请求：

```typescript
const corsHeaders = {
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Origin': isDev ? origin : '*',
};
```

生产环境建议限制为你的域名：

```typescript
const allowedOrigins = ['https://your-domain.com'];
```

### 7.3 Swup 兼容

由于使用了 Swup SPA 导航，AI 组件必须：

1. 在 `onMount` 中将函数注册到 `window` 对象
2. 在 `Layout.astro` 的 `page:view` 钩子中重新初始化

```javascript
// 组件中
onMount(() => {
  (window as any).setupAiChat = () => {
    getArticleData();
  };
});

// Layout.astro 中
window.swup.hooks.on("page:view", () => {
  if ((window as any).setupAiChat) {
    (window as any).setupAiChat();
  }
});
```

### 7.4 Svelte 响应式更新

更新数组中的对象时，必须创建新对象才能触发响应式更新：

```typescript
// ✅ 正确 - 创建新对象
messages = messages.map((m, i) =>
  i === messages.length - 1
    ? { ...m, content: newContent }
    : m
);

// ❌ 错误 - 直接修改不会触发更新
assistantMessage.content = newContent;
messages = [...messages];
```

### 7.5 避免嵌套箭头函数

Svelte 编译器对嵌套箭头函数的支持有限，建议使用 `for` 循环：

```typescript
// ✅ 推荐
const results: string[] = [];
for (const item of items) {
  results.push(process(item));
}

// ❌ 可能导致编译错误
const results = items.map(item => {
  return item.subItems.map(sub => {
    return process(sub);
  }).join('');
});
```

### 7.6 API Key 安全

- 永远不要将 API Key 提交到 Git 仓库
- 使用 `.env.local` 文件存储敏感信息
- 确保 `.gitignore` 中包含 `.env.local`
- 生产环境使用 Vercel 环境变量

### 7.7 错误处理

前端需要处理以下错误情况：

```typescript
// API 请求失败
if (!response.ok) {
  throw new Error('AI 服务暂时不可用');
}

// SSE 解析错误
try {
  const parsed = JSON.parse(data);
} catch (e) {
  // 忽略解析错误，继续处理下一个 chunk
}

// JSON 响应解析失败
try {
  const parsed = JSON.parse(fullContent);
} catch (e) {
  // 如果不是 JSON，保持原始内容
}
```

---

## 八、部署说明

### 8.1 Vercel 部署

1. 将代码推送到 GitHub
2. 在 Vercel 控制台导入项目
3. 在 Settings → Environment Variables 中添加：
   - `AI_API_KEY` = `sk-xxxxxxxxxx`
4. 部署完成后测试

### 8.2 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
echo 'AI_API_KEY=sk-xxxxxxxxxx' >> .env.local

# 3. 启动开发服务器
npm run dev
```

---

## 九、常见问题

### Q1: 显示「API Key 未配置」

检查 `.env.local` 文件是否存在且包含 `AI_API_KEY`，然后重启开发服务器。

### Q2: 显示「AI 服务暂时不可用」

1. 检查终端日志，看 DeepSeek API 返回的状态码
2. 确认 API Key 是否有效
3. 检查网络连接

### Q3: 概括卡片不显示

检查 `aiConfig.ts` 中的 `summaryEnabled` 是否为 `true`。

### Q4: Swup 导航后 AI 功能失效

确保 `Layout.astro` 中的 `page:view` 钩子正确调用了 `setupAiChat` 和 `setupAiSummary`。

### Q5: 流式输出不显示

检查浏览器控制台是否有 SSE 解析错误，确保 DeepSeek API 返回的是标准 SSE 格式。

---

## 十、扩展方向

1. **多模型支持**：参考 UpXuu 的实现，支持多个模型切换和失败重试链
2. **Cloudflare Worker**：将 AI 代理层部署到边缘计算，降低延迟
3. **文章索引**：通过 GitHub API 获取文章列表，构建全局知识库
4. **对话历史**：将对话历史存储到 localStorage，支持跨页面继续对话
5. **自定义 Prompt**：允许用户在前端选择不同的 Prompt 模板
