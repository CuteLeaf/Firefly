---
title: "Claude Code 完全指南：从安装到精通（2026 年版）"
published: 2026-03-03
description: "Claude Code 是 Anthropic 推出的官方命令行 AI 编程工具。本文覆盖安装、认证、配置、核心功能到高级特性，特别深入解析 hasCompletedOnboarding、skipWebFetchPreflight 等关键配置项。"
image: ""
tags: ["Claude Code", "AI", "CLI", "Anthropic", "开发工具"]
category: "技术教程"
draft: false
lang: "zh_CN"
---

# Claude Code 完全指南：从安装到精通（2026 年版）

**TL;DR:** Claude Code 是 Anthropic 推出的官方命令行 AI 编程工具，能直接在终端中理解你的代码库、编写代码、执行命令。本文覆盖安装、认证、配置、核心功能到高级特性，特别深入解析 `hasCompletedOnboarding`、`skipWebFetchPreflight` 等关键配置项，帮你彻底掌握 Claude Code。

> **本文假定读者**：有基本的命令行使用经验，了解 Git 和包管理器概念。如果你是完全的终端新手，建议先学习基本的 Shell 操作。
>
> **环境信息**：本文内容基于 2026 年 3 月的最新版本，使用的模型包括 Claude Opus 4.6、Claude Sonnet 4.6、Claude Haiku 4.5。

---

## 目录

1. [什么是 Claude Code](#1-什么是-claude-code)
2. [安装](#2-安装)
3. [认证与账户](#3-认证与账户)
4. [首次启动与 Onboarding](#4-首次启动与-onboarding)
5. [配置系统深度解析](#5-配置系统深度解析)
6. [核心功能](#6-核心功能)
7. [权限与安全模型](#7-权限与安全模型)
8. [MCP 服务器：扩展 Claude Code 的能力](#8-mcp-服务器扩展-claude-code-的能力)
9. [Hooks 系统：自动化工作流](#9-hooks-系统自动化工作流)
10. [IDE 集成](#10-ide-集成)
11. [高级特性](#11-高级特性)
12. [定价与方案选择](#12-定价与方案选择)
13. [常见问题与故障排除](#13-常见问题与故障排除)
14. [延伸阅读](#14-延伸阅读)

---

## 1. 什么是 Claude Code

Claude Code 是 Anthropic 推出的**官方命令行 AI 编程工具**。它运行在你的终端中，能够：

- 阅读和理解整个代码库
- 编写、编辑、创建文件
- 执行 Shell 命令
- 搜索代码和文件
- 进行 Web 搜索和网页抓取
- 管理 Git 工作流
- 通过 MCP 协议连接外部工具

它不是一个简单的代码补全工具——它是一个**具有完整系统访问权限的 AI 代理**，能够自主完成复杂的多步骤编程任务。

---

## 2. 安装

### 2.1 原生安装器（推荐）

自 2025 年 10 月起，Anthropic 推出了原生二进制安装器，这是目前**官方推荐的安装方式**。它生成一个独立的可执行文件，无需 Node.js 依赖，并支持自动后台更新。

**macOS / Linux：**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows（PowerShell）：**

```powershell
irm https://claude.ai/install.ps1 | iex
```

安装完成后，二进制文件默认安装到 `~/.local/bin`。

### 2.2 包管理器安装

**macOS（Homebrew）：**

```bash
brew install claude-code
```

**Windows（WinGet）：**

```powershell
winget install Anthropic.ClaudeCode
```

> **注意**：通过包管理器安装的版本**不会自动更新**，需要手动运行 `brew upgrade claude-code` 或 `winget upgrade Anthropic.ClaudeCode`。

### 2.3 npm 安装（已弃用）

```bash
npm install -g @anthropic-ai/claude-code
```

截至 2026 年 2 月，npm 安装方式**已被官方标记为弃用**。它仍然可以工作，但不再被推荐。使用此方式需要 Node.js 18+ 和 npm 9+。

> **重要**：不要使用 `sudo npm install -g`，这会导致权限问题和安全风险。

**Windows 特殊说明**：npm 包的 `package.json` 中包含 `"os":"!win32"` 配置，会阻止在原生 Windows 上通过 npm 安装。Windows 用户应使用原生安装器或 WinGet。

如果你在 WSL 环境中遇到 OS 检测问题，可以使用：

```bash
npm config set os linux
npm install -g @anthropic-ai/claude-code --force --no-os-check
```

### 2.4 从 npm 迁移到原生安装器

如果你之前通过 npm 安装，可以在 Claude Code 会话内执行：

```bash
claude install
```

你的 MCP 配置、项目设置和会话历史会在迁移过程中保留。

### 2.5 系统要求

| 项目 | 要求 |
|------|------|
| **操作系统** | macOS 10.15+、Ubuntu 20.04+ / Linux、Windows 10+（需要 Git for Windows 或 WSL） |
| **Node.js** | 18+（仅 npm 安装或使用 `npx` 运行 MCP 服务器时需要） |
| **Git** | 2.30+（推荐） |
| **网络** | 需要互联网连接 |
| **推荐工具** | 安装 `ripgrep` 以获得最佳搜索体验 |

**Windows 用户的两种使用方式**：

- **原生 Windows + Git Bash**：安装 [Git for Windows](https://gitforwindows.org/)，Claude Code 内部使用 Git Bash 执行命令。
- **WSL**：WSL 1 和 WSL 2 均支持。WSL 2 额外支持沙箱隔离。注意：需要在 WSL 环境**内部**安装 Node.js。

---

## 3. 认证与账户

Claude Code 支持三种认证方式：

### 3.1 Claude 订阅（Pro / Max / Team / Enterprise）

最简单的方式。你的现有订阅直接包含 Claude Code 访问权限，无需单独的 API 计费。

```bash
claude login
```

选择 **"Claude account with subscription"**，通过浏览器完成 OAuth 认证。系统会自动在 Console 中创建一个 "Claude Code" 工作区用于成本追踪。

**各方案的使用限额（5 小时滚动窗口）**：

| 方案 | 价格 | 消息限额 |
|------|------|----------|
| Pro | $20/月 | ~45 条/5 小时 |
| Max 5x | $100/月 | ~225 条/5 小时 |
| Max 20x | $200/月 | ~900 条/5 小时 |

> **重要**：claude.ai 网页、Claude Code CLI、Claude Desktop 共享**同一个**订阅配额池。

### 3.2 API Key（按 Token 计费）

设置 `ANTHROPIC_API_KEY` 环境变量：

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

当此变量存在时，Claude Code 会使用 API Key 而非订阅凭据。适合需要精确控制成本或在 CI/CD 中使用的场景。

### 3.3 企业云服务商

支持通过以下平台接入：

- **Amazon Bedrock**
- **Google Vertex AI**
- **Microsoft Foundry**

配置示例（Amazon Bedrock）：

```bash
export CLAUDE_CODE_USE_BEDROCK=1
export ANTHROPIC_BEDROCK_BASE_URL='https://your-llm-gateway.com/bedrock'
export CLAUDE_CODE_SKIP_BEDROCK_AUTH=1  # 如果网关处理 AWS 认证
```

### 3.4 防止意外 API 扣费

如果你只想使用订阅配额，不想被意外按 API 扣费：

```bash
claude logout
claude login
```

仅使用 Pro/Max 凭据认证，避免添加 Console 凭据。

---

## 4. 首次启动与 Onboarding

### 4.1 Onboarding 流程

首次运行 `claude` 时，会经历以下步骤：

1. **认证提示**：选择通过浏览器 OAuth 登录或配置 API Key
2. **信任对话框**：确认是否信任 Claude Code 在当前目录操作
3. **Shift+Enter 键绑定**：询问是否安装终端快捷键
4. **就绪**：完成后进入交互模式，等待你的指令

### 4.2 推荐的首次操作

```bash
# 验证安装是否正常
hello

# 让 Claude 分析你的代码库并生成 CLAUDE.md
/init

# 检查当前使用量
/usage

# 运行诊断检查
claude doctor
```

### 4.3 深度解析：`hasCompletedOnboarding`

这是本文需要重点讲解的配置项之一。

#### 它是什么

`hasCompletedOnboarding` 是一个布尔标志，告诉 Claude Code "用户已完成所有首次设置步骤"。

#### 存储位置

存储在 **`~/.claude.json`** 文件中。

> **注意区分**：
> - `~/.claude.json` — Claude Code 自动管理的文件，存储 onboarding 状态、OAuth 令牌、主题偏好
> - `~/.claude/settings.json` — 用户手动编辑的文件，存储权限、Hooks、环境变量、模型选择

#### 它控制什么

Claude Code 在启动时，**先检查此标志，再检查 API 凭据**。当此标志为 `false` 或缺失时：

- 强制进入 onboarding 向导
- **忽略** `~/.claude/settings.json` 中的设置
- **忽略** `ANTHROPIC_BASE_URL` 等环境变量
- 强制连接 `api.anthropic.com`，即使你配置了自定义 API 端点

#### 何时需要手动设置

大多数用户通过正常 onboarding 流程自动设置，无需手动干预。但以下场景**必须手动设置**：

**场景 1：企业 LLM 网关用户**

如果你的公司通过 LiteLLM、自定义代理等 LLM 网关路由请求，onboarding 期间 Claude Code 会尝试连接 `api.anthropic.com` 并失败。此时需要手动跳过 onboarding：

```json
// ~/.claude.json
{
  "hasCompletedOnboarding": true
}
```

**场景 2：CI/CD 和 GitHub Codespaces**

每次创建新的 Codespace 会重建环境，需要重新 onboarding。可以在启动脚本中预配置：

```bash
# 在 CI/CD 初始化脚本中
cat > ~/.claude.json << 'EOF'
{
  "hasCompletedOnboarding": true,
  "shiftEnterKeyBindingInstalled": true
}
EOF
```

**场景 3：自定义 `ANTHROPIC_BASE_URL`**

使用 LiteLLM 等工具时，不设置此标志会导致 Claude Code 忽略你的自定义端点：

```bash
# 这样不够——没有 hasCompletedOnboarding，ANTHROPIC_BASE_URL 会被忽略
export ANTHROPIC_BASE_URL=https://litellm-server:4000/v1

# 必须同时在 ~/.claude.json 中设置
{
  "hasCompletedOnboarding": true
}
```

#### 相关的配套设置

手动跳过 onboarding 时，通常还需要设置以下配置：

```bash
# 通过 CLI 设置信任对话框
claude config set hasTrustDialogAccepted true
claude config set hasCompletedProjectOnboarding true
```

如果使用 API Key，可能还需要在 `~/.claude.json` 中预批准：

```json
{
  "hasCompletedOnboarding": true,
  "customApiKeyResponses": {
    "approved": ["<API Key 的最后 20 个字符>"],
    "rejected": []
  }
}
```

> **注意**：`hasCompletedOnboarding` **不能**通过 `claude config set` 命令设置，必须直接编辑 JSON 文件。

#### 已知 Bug（Windows）

GitHub Issue [#29056](https://github.com/anthropics/claude-code/issues/29056)：在 Windows 11 上，`~/.claude.json` 可能在退出时被标记为"已损坏"，导致文件被重写为几乎为空的骨架结构，从而丢失 `hasCompletedOnboarding` 标志——每次启动都会出现 onboarding 流程。

**临时解决方案**：设置文件为只读，或使用启动脚本在每次运行前重写该文件。

#### 安全提醒

`~/.claude.json` 中可能包含 OAuth 令牌等敏感信息，应保持其访问权限私有：

```bash
# macOS/Linux
chmod 600 ~/.claude.json
```

永远不要将此文件提交到版本控制中。

---

## 5. 配置系统深度解析

### 5.1 配置文件层级

Claude Code 使用多层配置系统，优先级从高到低：

```
命令行参数（单次会话）
  ↓
.claude/settings.local.json（项目本地，gitignore）
  ↓
.claude/settings.json（项目共享，可提交到 Git）
  ↓
~/.claude/settings.json（全局用户设置）
  ↓
managed-settings.json（企业管理设置，不可覆盖）
```

**关键规则**：
- 如果用户设置中 `allow` 了某个权限，但项目设置中 `deny` 了它，**deny 优先**
- 数组类设置（如 `allowedTools`）跨层级**合并**（拼接去重），而非替换

### 5.2 完整的文件地图

```
~/.claude.json                          # 自动管理：OAuth、主题、onboarding、缓存
~/.claude/
  settings.json                         # 用户设置：权限、模型、Hooks、环境变量
  CLAUDE.md                             # 全局指令（所有项目生效）
  rules/                                # 规则目录（组织化的指令文件）
  agents/                               # 自定义代理定义
  commands/                             # 全局斜杠命令
  skills/                               # 全局技能
  teams/                                # 团队配置
  tasks/                                # 任务列表
  projects/<project>/memory/            # 自动记忆（按项目隔离）

<project>/
  CLAUDE.md                             # 项目指令（团队共享）
  CLAUDE.local.md                       # 项目指令（个人，gitignore）
  .mcp.json                             # 项目 MCP 服务器（共享）
  .claude/
    settings.json                       # 项目设置（共享）
    settings.local.json                 # 项目设置（个人，gitignore）
    commands/                           # 项目斜杠命令
    agents/                             # 项目代理定义
    skills/                             # 项目技能
```

### 5.3 深度解析：`skipWebFetchPreflight`

这是本文另一个需要重点讲解的配置项。

#### 工作原理

Claude Code 的 WebFetch 工具在抓取目标网站之前，会执行一个**域名安全预检请求**：

```
GET https://claude.ai/api/web/domain_info?domain=<target>
```

这个预检请求验证目标域名是否安全可访问。

#### 为什么需要跳过

当以下情况发生时，预检请求会失败：

1. **企业防火墙/代理**：公司网络阻止或限制对 `claude.ai` 的访问，导致预检失败——即使目标网站完全可以访问
2. **HTTPS 代理证书问题**：使用代理时，Claude Code 可能用代理的证书与目标主机名进行验证，导致 TLS 错误（GitHub Issue [#16873](https://github.com/anthropics/claude-code/issues/16873)）
3. **网络受限环境**：产生错误信息："Unable to verify if domain X is safe to fetch. This may be due to network restrictions or enterprise security policies blocking claude.ai"

#### 如何配置

在 `~/.claude/settings.json` 中添加：

```json
{
  "skipWebFetchPreflight": true
}
```

或者在项目级别 `.claude/settings.json` 中设置。

#### 效果

- 跳过对 `claude.ai` 的预检请求
- WebFetch 工具直接尝试获取目标 URL
- 实际的底层错误（如 TLS 证书不匹配）会直接暴露，而不是被通用的 "unable to verify" 消息遮盖
- **安全提醒**：此设置绕过了域名安全验证检查，请确保你了解其影响

#### 典型使用场景

```json
// ~/.claude/settings.json — 企业环境下的典型配置
{
  "skipWebFetchPreflight": true,
  "env": {
    "HTTPS_PROXY": "http://corp-proxy:8080",
    "HTTP_PROXY": "http://corp-proxy:8080"
  }
}
```

### 5.4 其他重要设置

#### 模型选择

支持多种配置方式，优先级从高到低：

```bash
# 方式 1：会话内切换
/model opus

# 方式 2：启动时指定
claude --model sonnet

# 方式 3：环境变量
export ANTHROPIC_MODEL=opus

# 方式 4：settings.json
{
  "model": "sonnet"
}
```

可用的模型标识：`"opus"`、`"sonnet"`、`"haiku"`

如果需要指向特定模型版本，使用覆盖变量：

```bash
export ANTHROPIC_DEFAULT_SONNET_MODEL=claude-sonnet-4-6
export ANTHROPIC_DEFAULT_OPUS_MODEL=claude-opus-4-6
export ANTHROPIC_DEFAULT_HAIKU_MODEL=claude-haiku-4-5-20251001
```

#### 环境变量

```json
// ~/.claude/settings.json
{
  "env": {
    "ANTHROPIC_MODEL": "sonnet",
    "MAX_THINKING_TOKENS": "10000",
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "70",
    "NODE_ENV": "development"
  }
}
```

Shell 环境变量优先级高于 `settings.json` 中的 `env` 值。

#### 归属设置

```json
{
  "attribution": {
    "commit": "",
    "pr": ""
  }
}
```

将 `commit` 或 `pr` 设为空字符串可以隐藏 Claude Code 的 Co-Authored-By 署名。

#### JSON Schema 支持

在 `settings.json` 开头添加 `$schema` 可以在编辑器中获得自动补全和验证：

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json"
}
```

### 5.5 CLAUDE.md 指令系统

CLAUDE.md 是 Claude Code 的**持久化记忆/指令系统**。它的内容在每次会话开始时被加载到 Claude 的系统提示中。

#### 文件层级（按加载顺序，后者覆盖前者）

| 文件 | 位置 | 范围 | 提交到 Git？ |
|------|------|------|-------------|
| `~/.claude/CLAUDE.md` | 主目录 | 全局——所有项目 | 否 |
| `./CLAUDE.md` | 项目根目录 | 项目——团队共享 | 是 |
| `./CLAUDE.local.md` | 项目根目录 | 本地项目——个人 | 否（gitignore） |

另外还有 `~/.claude/rules/` 目录系统，支持将指令组织为多个文件。

#### 最佳实践

- 保持在 **30-100 行**（超过 200 行会消耗过多上下文窗口，降低信噪比）
- 每条指令应解决**实际遇到的问题**，而非理论性的担忧
- 绝不在其中包含**密钥**（API Key、密码、令牌），因为内容会成为系统提示的一部分
- 使用 `CLAUDE.local.md` 存放机器特定的路径和个人偏好

#### 示例 CLAUDE.md

```markdown
# 项目约定

## 技术栈
- TypeScript 5.4 + React 18.3 + Next.js 15
- 状态管理：Zustand
- 样式：Tailwind CSS

## 编码规范
- 使用函数式组件，禁止 class 组件
- 使用 TypeScript 严格模式
- 组件文件使用 PascalCase，工具函数使用 camelCase
- 提交消息遵循 Conventional Commits 格式

## 测试
- 使用 Vitest + Testing Library
- 新功能必须有测试覆盖
- 运行测试：`npm run test`
```

---

## 6. 核心功能

### 6.1 交互模式 vs 单次模式

**交互模式（REPL）**是默认模式：

```bash
claude
```

进入一个持续对话的编程会话，支持实时流式输出、会话持久化、历史导航（上/下箭头、Ctrl+R 搜索）、外部编辑器（Ctrl+G）。

**单次模式**通过 `-p` 标志调用：

```bash
# 单次执行并退出
claude -p "解释这个函数的作用"

# 管道输入
cat main.py | claude -p "审查这段代码"

# 指定工具和权限
claude -p "运行测试" --allowedTools "Bash(npm run test)"
```

适合脚本化、CI/CD 管道和自动化场景。

### 6.2 斜杠命令

在交互模式中，输入 `/` 查看所有可用命令：

| 命令 | 功能 |
|------|------|
| `/help` | 显示帮助信息 |
| `/clear` | 清空对话（切换任务时使用） |
| `/compact` | 压缩上下文，可选保留特定信息（如 `/compact retain error handling`） |
| `/model` | 切换模型 |
| `/resume` | 恢复之前的会话 |
| `/rewind` | 回滚对话或代码变更 |
| `/context` | 显示上下文窗口使用情况 |
| `/cost` | 查看当前会话费用 |
| `/usage` | 查看订阅使用限额 |
| `/permissions` | 管理工具权限 |
| `/init` | 分析代码库并生成 CLAUDE.md |
| `/vim` | 切换 Vim 模式 |
| `/memory` | 管理自动记忆设置 |
| `/stats` | 使用统计和分析 |

### 6.3 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| **Esc** | 中断 Claude |
| **Esc + Esc** | 回滚（代码或对话） |
| **Tab** | 切换扩展思考（Extended Thinking） |
| **Shift+Tab** | 循环切换权限模式 |
| **Ctrl+C** | 取消当前操作 |
| **Ctrl+B** | 将长时间运行的命令放到后台 |
| **Ctrl+L** | 清屏（保留对话） |
| **Ctrl+G** | 打开外部编辑器 |
| **Ctrl+V** | 粘贴图片 |
| **Ctrl+R** | 完整输出/上下文 |

### 6.4 扩展思考（Extended Thinking）

扩展思考让 Claude 展示内部推理过程，显著提升复杂任务的质量。

- **切换**：按 **Tab** 键切换开关
- **自适应思考**：Claude Opus 4.6 使用自适应思考模式，动态决定何时以及思考多少
- **触发词**：在提示中使用 "ultrathink" 等词会自动触发最大思考预算
- **预算控制**：`export MAX_THINKING_TOKENS=10000`
- **Token 计费**：扩展思考的 token 按输出 token 标准费率计费

### 6.5 Plan 模式

Plan 模式是结构化的任务规划工作流：

1. 通过 **Shift+Tab** 切换到 Plan 模式，或 `claude --permission-mode plan` 启动
2. Claude 只能**读取文件、搜索代码、分析代码库**——不能编辑或执行命令
3. Claude 创建结构化的实施方案，可能通过提问来澄清需求
4. 方案满意后，切换到 Normal 模式执行
5. **推荐工作流**：先用 Plan 模式理解问题，再切换到 Normal 模式执行

---

## 7. 权限与安全模型

### 7.1 五种权限模式

通过 **Shift+Tab** 循环切换，或通过 `--permission-mode` 指定：

| 模式 | 行为 | 适用场景 |
|------|------|----------|
| **Normal** | 大多数操作前询问确认 | 日常开发（推荐默认） |
| **Auto-Accept** | 自动接受文件编辑；Shell 命令仍需确认 | 重复性任务 |
| **Plan** | 只读——可分析但不能修改 | 研究和探索 |
| **Don't Ask** | 未预批准的工具静默拒绝 | 限制性环境 |
| **Bypass** | 所有工具自动批准 | 受控/可信环境（Hooks 仍生效） |

### 7.2 权限配置

在 `settings.json` 中使用 allow/deny/ask 规则：

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Edit(src/**)",
      "Bash(git *)",
      "Bash(npm run *)"
    ],
    "deny": [
      "Read(.env*)",
      "Write(production.config.*)",
      "Bash(rm -rf *)",
      "Bash(sudo *)"
    ],
    "ask": [
      "WebFetch",
      "Bash(curl *)"
    ]
  }
}
```

**工具模式语法**：
- `ToolName` — 允许该工具的所有操作
- `ToolName(*)` — 允许任意参数
- `ToolName(filter)` — 仅允许匹配的调用（支持 Glob 模式）

**评估顺序**：先检查 deny，再检查 ask，最后检查 allow。首次匹配生效。

### 7.3 沙箱

Claude Code 支持沙箱隔离执行 Bash 命令：

```json
{
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true,
    "allowedDomains": ["registry.npmjs.org", "github.com"],
    "network": {
      "allowLocalBinding": true
    }
  }
}
```

底层技术：macOS 使用 Seatbelt，Linux 使用 bubblewrap。

> **注意**：沙箱仅适用于 `Bash` 工具，不适用于 Read、Write、WebSearch、WebFetch、MCP 等。

---

## 8. MCP 服务器：扩展 Claude Code 的能力

MCP（Model Context Protocol）是一个开放标准，用于将 AI 系统与数据源和工具连接。截至 2026 年初，生态系统中已有超过 200 个服务器。

### 8.1 添加 MCP 服务器

```bash
# 添加 GitHub 服务器
claude mcp add github -e GITHUB_TOKEN -- npx -y @modelcontextprotocol/server-github

# 添加数据库服务器
claude mcp add postgres -- npx -y @modelcontextprotocol/server-postgres postgresql://localhost/mydb

# 查看已配置的服务器
claude mcp list

# 移除服务器
claude mcp remove github
```

### 8.2 配置文件

MCP 服务器可以在多个级别配置：

**项目级别（`.mcp.json`）**——推荐，可提交到 Git：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**用户级别**——在 `~/.claude.json` 的 `mcpServers` 部分。

支持环境变量展开（`${VAR}` 语法）。

### 8.3 推荐的 MCP 服务器组合

| 服务器 | 功能 | 安装 |
|--------|------|------|
| GitHub | Issues、PR、搜索（15 个工具） | `@modelcontextprotocol/server-github` |
| Brave Search | Web 搜索 | `@modelcontextprotocol/server-brave-search` |
| Playwright | 浏览器自动化 | `@playwright/mcp` |
| Context7 | 实时文档查询 | `@anthropic-ai/context7` |

这四个服务器覆盖了 90%+ 的开发需求。

### 8.4 MCP 工具搜索

当 MCP 工具描述超过上下文窗口的 10% 时，工具搜索自动启用。它按需动态加载工具，而不是预加载所有定义，节省上下文空间。

### 8.5 Claude Code 作为 MCP 服务器

Claude Code 具有双重身份——它既是 MCP 客户端，也可以作为 MCP 服务器：

```bash
claude mcp serve
```

这会暴露 Bash、Read、Write、Edit、Glob、Grep 等工具，其他 AI 客户端可以通过 MCP 协议调用。

---

## 9. Hooks 系统：自动化工作流

Hooks 是用户定义的命令或提示，在特定生命周期点自动执行。

### 9.1 生命周期事件

| 事件 | 触发时机 | 典型用途 |
|------|----------|----------|
| `UserPromptSubmit` | 处理用户提示之前 | 验证/转换输入 |
| `PreToolUse` | 工具执行之前 | 批准、拒绝或修改工具调用 |
| `PostToolUse` | 工具成功完成后 | 自动格式化、运行测试 |
| `SessionStart` | 会话开始时 | 环境初始化 |
| `Notification` | 发送通知时 | 自定义通知路由 |
| `Stop` | Claude 完成响应时 | 最终验证 |
| `SubagentStop` | 子代理完成时 | 验证子代理输出 |

### 9.2 三种处理器类型

**Command Hook**（命令类型）：

```json
{
  "PostToolUse": [{
    "matcher": "Write|Edit",
    "hooks": [{
      "type": "command",
      "command": "prettier --write $CLAUDE_FILE_PATH"
    }]
  }]
}
```

**Prompt Hook**（提示类型）：向 Claude 发送提示进行语义评估。

**Agent Hook**（代理类型）：生成有工具访问权限的子代理进行深度验证。

### 9.3 实际例子：自动格式化

每次文件编辑后自动运行 Prettier：

```json
// .claude/settings.json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "npx prettier --write \"$CLAUDE_FILE_PATH\" 2>/dev/null || true"
      }]
    }]
  }
}
```

### 9.4 实际例子：会话启动时激活虚拟环境

```json
{
  "hooks": {
    "SessionStart": [{
      "matcher": "startup",
      "hooks": [{
        "type": "command",
        "command": "echo 'conda activate myenv' >> \"$CLAUDE_ENV_FILE\""
      }]
    }]
  }
}
```

---

## 10. IDE 集成

### 10.1 VS Code 扩展

最成熟的集成方案。从 Visual Studio Marketplace 安装（扩展包含 CLI 二进制）。

**核心功能**：
- **Cmd+Esc**（Mac）/ **Ctrl+Esc**（Windows/Linux）打开 Claude Code
- 原生图形化聊天面板
- 基于检查点的撤销
- 通过 **@** 引用文件
- 并行对话
- 内联编辑和 IDE 风格的差异审查
- 自动共享打开的文件、诊断信息和选中内容

### 10.2 JetBrains 插件（Beta）

支持 IntelliJ、WebStorm、PyCharm 等大多数 JetBrains IDE。

**核心功能**：
- **Cmd+Esc**（Mac）/ **Ctrl+Esc**（Windows/Linux）打开 Claude Code
- 代码变更显示在 IDE 差异查看器中
- 当前选中/标签自动共享给 Claude
- **Cmd+Option+K**（Mac）/ **Alt+Ctrl+K**（Windows/Linux）插入文件引用
- 诊断错误自动共享
- 从外部终端使用 `/ide` 连接

### 10.3 终端使用

Claude Code 在任何终端中原生运行。这是最灵活的选项，支持所有功能。IDE 扩展实际上是在底层编排 CLI。

---

## 11. 高级特性

### 11.1 自定义代理

在 `.claude/agents/` 目录中创建 `.md` 文件，定义专用的子代理：

```markdown
---
name: security-reviewer
description: 安全审查专家
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
model: opus
---

你是一个安全审查专家。检查代码中的安全漏洞...
```

代理通过 `--agent` 标志调用，或由 Claude 在委派任务时自动选择。每个代理在独立的上下文窗口中运行。

### 11.2 Skills 系统

Skills 是统一架构，替代了旧的 `.claude/commands/` 系统（两者兼容共存）。

```markdown
---
name: deploy
description: 部署到生产环境
user-invocable: true
allowed-tools:
  - Bash
  - Read
---

# 部署流程

1. 运行测试
2. 构建项目
3. 部署到生产环境
```

Skills 支持自动发现——描述被注入系统提示，Claude 通过语言理解自动选择相关的 Skill。

### 11.3 多代理团队（Swarm 模式）

2026 年初发布的团队功能，将 Claude Code 变为多代理编排系统：

- 一个会话作为**团队领导**协调工作
- **团队成员**独立工作，各自有独立的上下文窗口
- 团队成员可以**直接相互发消息**
- 每个代理在**独立的 Git worktree** 中工作，避免文件冲突
- 上下文窗口使用率从单代理的 ~80-90% 降至每个成员的 ~40%

**最佳实践**：
- 每个团队成员 5-6 个任务是最佳点
- 拆分工作使每个成员负责不同文件
- 任务应该是自包含的，产生明确的交付物

### 11.4 自动记忆

Claude Code 维护两种记忆机制：

1. **CLAUDE.md 文件**：你手写的指令，完全在压缩后存活
2. **自动记忆**：Claude 自己记录的笔记，存储在 `~/.claude/projects/<project>/memory/`

通过 `/memory` 切换，或设置 `autoMemoryEnabled` 控制。

---

## 12. 定价与方案选择

### 12.1 订阅方案

| 方案 | 价格 | Claude Code 访问 | 使用级别 |
|------|------|-----------------|----------|
| Free | $0 | 无 | 仅基本 claude.ai |
| Pro | $20/月 | 有 | 适合轻度使用 |
| Max 5x | $100/月 | 有 | 全天编码，大多数开发者够用 |
| Max 20x | $200/月 | 有 | 多个并发会话，重度代理工作流 |
| Team | $25-150/座/月 | 高级座位包含 | 组织使用 |
| Enterprise | 自定义 | 完整访问 | 自定义 |

> **经验法则**：如果月度 API 费用会超过 $60-80，Max 5x 更便宜。超过 $150 时，Max 20x 是明确的赢家。

### 12.2 API 按量计费（每百万 Token）

| 模型 | 输入 | 输出 |
|------|------|------|
| Claude Opus 4.6 | $5.00 | $25.00 |
| Claude Sonnet 4.6 | $3.00 | $15.00 |
| Claude Haiku 4.5 | $1.00 | $5.00 |

**成本优化**：
- **Batch API**：50% 折扣（异步处理）
- **Prompt Caching**：缓存读取仅需 0.1x 基准价（节省 90%）
- **新用户**：$5 免费额度，无过期限制

> Opus 4.6 的 $5/MTok 输入价格，相比前代 Opus 4.1 的 $15/MTok **降低了 67%**。

---

## 13. 常见问题与故障排除

### Q: 每次启动都出现 Onboarding 流程

**原因**：`~/.claude.json` 中的 `hasCompletedOnboarding` 标志丢失或被重置。

**解决方案**：

```bash
# 检查文件内容
cat ~/.claude.json

# 如果标志缺失，手动添加
# 编辑 ~/.claude.json，确保包含：
# "hasCompletedOnboarding": true
```

Windows 用户参考 [Issue #29056](https://github.com/anthropics/claude-code/issues/29056)。

### Q: WebFetch 报错 "Unable to verify domain"

**原因**：预检请求无法访问 `claude.ai`。

**解决方案**：

```json
// ~/.claude/settings.json
{
  "skipWebFetchPreflight": true
}
```

### Q: 设置了 `ANTHROPIC_BASE_URL` 但被忽略

**原因**：`hasCompletedOnboarding` 未设置为 `true`。Claude Code 在 onboarding 期间忽略自定义端点。

**解决方案**：

```json
// ~/.claude.json
{
  "hasCompletedOnboarding": true
}
```

### Q: 上下文窗口不够用

**解决方案**：

- 使用 `/compact` 命令压缩上下文
- 使用 `/clear` 清空对话并重新开始
- 设置 `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=70` 自动在 70% 时压缩
- 将复杂任务分解为更小的子任务

### Q: npm 安装在 Windows 上失败

**原因**：npm 包配置了 `"os":"!win32"`。

**解决方案**：使用原生安装器或 WinGet：

```powershell
irm https://claude.ai/install.ps1 | iex
# 或
winget install Anthropic.ClaudeCode
```

### Q: 运行诊断

```bash
claude doctor
```

这会检查安装状态、认证、网络连接和配置完整性。

---

## 14. 延伸阅读

- [Claude Code 官方文档](https://code.claude.com/docs/en/overview)
- [Claude Code GitHub 仓库](https://github.com/anthropics/claude-code)
- [Claude Code 快速入门](https://code.claude.com/docs/en/quickstart)
- [设置参考](https://code.claude.com/docs/en/settings)
- [权限配置](https://code.claude.com/docs/en/permissions)
- [MCP 服务器指南](https://code.claude.com/docs/en/mcp)
- [Hooks 参考](https://code.claude.com/docs/en/hooks)
- [CLAUDE.md 最佳实践](https://claude.com/blog/using-claude-md-files)
- [Agent Teams 指南](https://code.claude.com/docs/en/agent-teams)
- [Claude API 定价](https://platform.claude.com/docs/en/about-claude/pricing)
