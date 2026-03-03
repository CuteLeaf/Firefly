---
title: "Claude Code 完全指南：从安装到精通（2026 版）"
published: 2026-03-03
description: "面向中文开发者的 Claude Code 深度教程，涵盖安装、认证、配置体系、权限管理、Hooks 与 MCP 扩展、IDE 集成，并附作者实践配置参考。"
image: ""
tags: ["Claude Code", "AI 编程", "CLI 工具", "MCP", "开发效率"]
category: "技术教程"
draft: false
lang: "zh_CN"
---

**TL;DR** — Claude Code 是 Anthropic 推出的终端 AI 编程代理，它能理解你的整个代码库、执行 Shell 命令、编辑文件、搜索网页，并通过自然语言完成从 Bug 修复到大型重构的一切工作。截至 2026 年 3 月，GitHub 上约 4% 的公开提交（每日约 13.5 万次）由 Claude Code 完成，Anthropic 自身 90% 的代码也由 AI 编写。本文将带你从零开始，系统掌握 Claude Code 的安装、认证、配置、权限、扩展与 IDE 集成。

> **适合谁阅读**：有基础命令行经验的开发者，尤其是希望通过第三方 API 代理使用 Claude Code 的中国开发者。

## 目录

- [1. Claude Code 概述与订阅方案](#1-claude-code-概述与订阅方案)
- [2. 安装](#2-安装)
- [3. 认证与第三方 API 接入](#3-认证与第三方-api-接入)
- [4. 配置体系与权限管理](#4-配置体系与权限管理)
- [5. Hooks 与 MCP 扩展](#5-hooks-与-mcp-扩展)
- [6. 核心功能与 IDE 集成](#6-核心功能与-ide-集成)
- [7. 我的实践配置](#7-我的实践配置)
- [总结](#总结)

---

## 1. Claude Code 概述与订阅方案

Claude Code 是一个运行在终端中的 **AI 编程代理**（Agentic Coding Tool）。它不是简单的代码补全，而是一个能自主规划、执行多步操作的智能体。它的核心能力包括：

- **代码库理解** — 读取项目文件、搜索代码、分析架构
- **文件操作** — 创建、编辑、重构代码文件
- **Shell 执行** — 运行构建、测试、Git 等命令
- **网络能力** — 搜索文档、获取网页内容
- **子代理协作** — 将任务分派给多个并行代理

Claude Code 的架构围绕五大核心系统构建：**配置**（Configuration）、**权限**（Permissions）、**Hooks**（自动化钩子）、**MCP**（Model Context Protocol 扩展）和**子代理**（Subagents）。掌握这五个系统，就能释放它的全部生产力。

### 订阅方案

| 方案 | 价格 | Claude Code | 用量（相对 Free） |
|------|------|:-----------:|:------------------:|
| **Free** | $0/月 | 不包含 | 基准 |
| **Pro** | $20/月 | 包含 | 5x |
| **Max 5x** | $100/月 | 包含 | 25x |
| **Max 20x** | $200/月 | 包含（优先级最高） | 100x |
| **Team** | $25-150/席位/月 | 高级席位包含 | 按席位 |
| **Enterprise** | 定制 | 包含 | 定制 |
| **API（Console）** | 按 token 计费 | 通过 API Key 使用 | 按量付费 |

:::tip[选择建议]
日常开发用 **Pro**（$20/月）足够入门。如果你每天花 2-4 小时在 Claude Code 上，**Max 5x**（$100/月）是性价比最高的选择。使用第三方 API 代理的用户，直接按 token 付费即可，无需订阅。
:::

---

## 2. 安装

### 2.1 macOS / Linux（推荐）

原生安装器是 Anthropic 官方推荐的方式，一行命令，无需 Node.js：

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

安装完成后关闭终端并重新打开，使 PATH 生效。

### 2.2 Windows

Windows 支持三种安装方式：

**方式一：PowerShell（推荐）**

确保已安装 [Git for Windows](https://git-scm.com/download/win)，然后在 PowerShell 中执行：

```powershell
irm https://claude.ai/install.ps1 | iex
```

Claude Code 在 Windows 上通过 Git Bash 执行命令。如果 Git 未安装，安装器会提示你先安装。

**方式二：Git Bash**

在 Git Bash 中使用与 macOS/Linux 相同的命令：

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**方式三：WSL（Windows Subsystem for Linux）**

```bash
wsl --install          # 安装 WSL2 + Ubuntu
# 进入 WSL 后执行
curl -fsSL https://claude.ai/install.sh | bash
```

:::note
WSL 方案提供额外的沙箱隔离，但原生 Git Bash 方式更简单。为获得最佳性能，项目文件应存放在 WSL 文件系统内（`/home/username/projects/`），而非 Windows 挂载路径（`/mnt/c/`）。
:::

### 2.3 其他安装方式

```bash
# Homebrew（macOS/Linux）
brew install --cask claude-code

# WinGet（Windows）
winget install Anthropic.ClaudeCode

# npm（已废弃，但仍可用，需要 Node.js 18+）
npm install -g @anthropic-ai/claude-code
```

### 2.4 安装验证

```bash
claude --version    # 确认版本号
claude doctor       # 自动检测配置问题并给出修复建议
```

如果出现 `command not found: claude`，说明 PATH 未更新：

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

Windows 用户如果遇到路径问题，可以在 PowerShell Profile 中设置：

```powershell
$env:CLAUDE_CODE_GIT_BASH_PATH = "C:\Program Files\Git\bin\bash.exe"
```

---

## 3. 认证与第三方 API 接入

### 3.1 官方 OAuth 认证

首次运行 `claude` 会自动打开浏览器进行 OAuth 认证，登录你的 Claude 账户即可。这是最简单的方式，适合有 Pro/Max 订阅的用户。

如果浏览器无法自动打开，按 `c` 键复制 OAuth URL 手动在浏览器中打开。

### 3.2 API Key 认证

对于 CI/CD、无头服务器或偏好按量付费的用户，可以通过环境变量提供 API Key：

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
claude
```

也可以在 `~/.claude/settings.json` 的 `env` 字段中配置（详见第 4 节）。

### 3.3 第三方 API 代理配置（重点）

对于使用第三方 API 中转服务的用户，需要配置以下环境变量：

| 变量 | 说明 |
|------|------|
| `ANTHROPIC_BASE_URL` | API 代理地址，替代官方 `api.anthropic.com` |
| `ANTHROPIC_AUTH_TOKEN` | 你的 API Token |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | 覆盖 Opus 模型标识 |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | 覆盖 Sonnet 模型标识 |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | 覆盖 Haiku 模型标识 |

在 `~/.claude/settings.json` 中配置：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-your-token",
    "ANTHROPIC_BASE_URL": "https://your-proxy.example.com",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "claude-opus-4-6",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "claude-sonnet-4-6",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "claude-haiku-4-5"
  }
}
```

**关键步骤：跳过引导流程**

Claude Code 首次启动时会强制运行引导向导（选择登录方式、打开浏览器认证）。即使你已经配置了 API Token，只要 `hasCompletedOnboarding` 不为 `true`，引导流程就会阻断启动。

编辑 `~/.claude.json`（注意不是 `~/.claude/settings.json`），添加：

```json
{
  "hasCompletedOnboarding": true
}
```

如果你使用的 API 代理无法访问 `claude.ai`，WebFetch 工具的域名安全预检会失败。在 `~/.claude/settings.json` 中添加：

```json
{
  "skipWebFetchPreflight": true
}
```

:::warning
`skipWebFetchPreflight` 会跳过 WebFetch 的域名安全检查。建议配合权限系统限制 WebFetch 可访问的域名，以保持安全性。
:::

你还可以通过 `forceLoginMethod` 强制指定登录方式，避免每次启动时的选择提示：

```json
{
  "forceLoginMethod": "api-key"
}
```

### 3.4 其他云平台

Claude Code 还支持 Amazon Bedrock（`CLAUDE_CODE_USE_BEDROCK=1`）、Google Vertex AI（`CLAUDE_CODE_USE_VERTEX=1`）和 Microsoft Foundry 等云平台的认证方式，通过各平台的 IAM/OIDC 体系接入。

---

## 4. 配置体系与权限管理

### 4.1 配置文件层级

Claude Code 采用分层配置架构，优先级从高到低：

| 层级 | 路径 | 作用域 | 可被覆盖 |
|------|------|--------|:--------:|
| **Managed** | 系统级目录 | 企业全局策略 | 否 |
| **全局** | `~/.claude/settings.json` | 当前用户所有项目 | 是 |
| **项目共享** | `.claude/settings.json` | 当前项目，提交到 Git | 是 |
| **项目本地** | `.claude/settings.local.json` | 当前项目，仅本人 | 是 |

Managed Settings 的路径因系统而异：
- **Windows**: `C:\ProgramData\ClaudeCode\managed-settings.json`
- **macOS**: `/Library/Application Support/ClaudeCode/managed-settings.json`
- **Linux**: `/etc/claude-code/managed-settings.json`

:::tip
在 `settings.json` 首行添加 `"$schema": "https://json.schemastore.org/claude-code-settings.json"` 可在 VS Code 中获得自动补全和校验。
:::

另外还有一个状态文件 `~/.claude.json`（注意路径不同），它存储运行时状态而非配置，包括 `hasCompletedOnboarding`、`theme`、OAuth 会话信息等。不要将两者混淆。

### 4.2 settings.json 核心字段

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "model": "opus",
  "permissions": { "allow": [], "deny": [] },
  "env": {},
  "hooks": {},
  "skipWebFetchPreflight": false,
  "attribution": { "commits": true, "pullRequests": true },
  "spinnerTipsEnabled": true,
  "alwaysThinkingEnabled": false
}
```

### 4.3 CLAUDE.md 指令文件

CLAUDE.md 是用自然语言编写的项目指令文件，在每次会话启动时自动加载，即使上下文压缩也会保留。

**加载层级：**

| 文件 | 位置 | 作用域 |
|------|------|--------|
| `~/.claude/CLAUDE.md` | 用户目录 | 所有项目全局 |
| `CLAUDE.md` | 项目根目录 | 团队共享（提交到 Git） |
| `CLAUDE.local.md` | 项目根目录 | 个人使用（自动加入 .gitignore） |
| `子目录/CLAUDE.md` | 任意子目录 | Claude 进入该目录时按需加载 |

**编写原则：**

- 保持在 **200 行以内**（约 2500 tokens），过长会导致重要指令被忽略
- 包含：项目概览、构建/测试命令、架构要点、代码风格约定
- 用 `/init` 命令自动生成初始版本，再手动精简
- 复杂规则拆分到 `.claude/rules/*.md` 中模块化管理

### 4.4 权限模式

Claude Code 提供四种权限模式，按 `Shift+Tab` 循环切换：

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| **Normal** | 默认，每次敏感操作都需确认 | 日常开发（90% 场景） |
| **Plan** | 只读，Claude 只能规划不能执行 | 复杂任务的前期分析 |
| **Auto-accept** | 自动批准文件读写，Shell 命令仍需确认 | 信任度较高的常规操作 |
| **Bypass** | 跳过所有确认 | 一次性/沙箱环境，**有数据丢失风险** |

:::danger
`bypassPermissions` 模式会跳过所有安全确认，包括删除文件、执行危险命令等。仅在可丢弃的环境中使用（如 Docker 容器、临时分支），且务必配合 Git 版本控制。
:::

### 4.5 allowedTools / blockedTools 精细控制

权限系统支持三级规则，评估顺序为：**deny → allow → ask**。deny 始终优先。

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Edit",
      "Glob",
      "Grep",
      "Bash(npm run *)",
      "Bash(git status)",
      "WebSearch",
      "mcp__github__*"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force *)",
      "Read(**/.env)"
    ]
  }
}
```

**通配符语法：**

| 模式 | 含义 |
|------|------|
| `ToolName` | 允许/拒绝该工具的所有用法 |
| `Bash(git:*)` | 允许以 `git` 开头的命令 |
| `Bash(npm install)` | 仅允许这个精确命令 |
| `WebFetch(domain:example.com)` | 仅允许获取该域名 |
| `Read(**/.env)` | 匹配任意目录下的 `.env` 文件 |
| `mcp__server__*` | 允许某个 MCP 服务器的所有工具 |

### 4.6 交互式权限管理

在 Claude Code 中输入 `/permissions` 即可打开交互式权限管理器，实时添加、修改或删除规则，无需手动编辑 JSON 文件。

当 Claude Code 请求权限时，你也可以选择 **Always allow** 将该工具永久加入允许列表。

---

## 5. Hooks 与 MCP 扩展

### 5.1 Hooks：确定性的自动化

Hooks 是在 Claude Code 生命周期特定节点自动执行的 Shell 命令。与提示词不同，Hooks **保证执行** — 你不需要"希望" Claude 记得格式化代码，PostToolUse Hook 会在每次文件写入后自动运行。

截至 2026 年 2 月，Hooks 系统支持 14 种生命周期事件和 3 种处理器类型（command、prompt、agent）。最常用的是：

| 事件 | 触发时机 | 典型用途 |
|------|----------|----------|
| **PreToolUse** | 工具执行前 | 校验、拦截危险操作 |
| **PostToolUse** | 工具执行后 | 自动格式化、日志记录 |
| **Stop** | 会话结束时 | 最终验证、清理 |
| **UserPromptSubmit** | 用户提交提示时 | 输入预处理 |

**PreToolUse 退出码：**
- `0` — 允许操作
- `2` — 拦截操作（stderr 内容会反馈给 Claude）
- 其他非零 — 非阻塞错误，显示给用户

### 5.2 实战示例

**自动格式化（PostToolUse）：**

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write 2>/dev/null; exit 0"
      }]
    }]
  }
}
```

**阻止危险命令（PreToolUse）：**

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "if echo \"$TOOL_INPUT\" | grep -qE 'rm -rf|git reset --hard|git push --force'; then echo 'Blocked dangerous command' >&2; exit 2; fi"
      }]
    }]
  }
}
```

配置方式有两种：在 Claude Code 中输入 `/hooks` 使用交互式菜单，或直接编辑 `settings.json`。

### 5.3 MCP：Model Context Protocol

MCP 是 Anthropic 开发的开放标准，为 AI 工具连接外部系统提供统一的中间件协议。截至 2026 年 2 月，生态中已有超过 **200 个** MCP 服务器。

在 `settings.json` 中配置 MCP 服务器：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_..."
      }
    }
  }
}
```

MCP 工具的命名规则为 `mcp__<服务器名>__<工具名>`，可在权限系统中使用通配符控制访问：

```json
{
  "permissions": {
    "allow": ["mcp__github__*"],
    "deny": ["mcp__github__delete_*"]
  }
}
```

### 5.4 MCP Tool Search

当你配置了大量 MCP 服务器时，工具定义会占用大量上下文窗口。**MCP Tool Search** 功能通过按需动态加载工具来解决这个问题，最高可减少 **95%** 的上下文消耗。当工具描述超过上下文窗口的 10% 时，Claude Code 会自动启用此功能。

### 5.5 推荐配置与最佳实践

**入门三件套：** GitHub、Brave Search、Playwright — 这三个 MCP 服务器覆盖了 90% 的开发需求。

**最佳实践：**

- Hooks 用于**必须执行**的操作（格式化、lint、安全检查）
- MCP 用于**扩展能力**（数据库查询、浏览器自动化、外部 API）
- PreToolUse Hooks 优先用于安全策略，PostToolUse 用于清理和反馈
- 用 `claude --debug` 调试 Hooks 执行
- MCP 权限精确到工具级别，避免使用 `mcp__*__*` 全放行

---

## 6. 核心功能与 IDE 集成

### 6.1 常用斜杠命令

| 命令 | 功能 |
|------|------|
| `/init` | 自动分析代码库并生成 CLAUDE.md |
| `/clear` | 清空对话历史，重新开始 |
| `/compact` | 压缩当前会话，节省上下文窗口 |
| `/context` | 可视化上下文使用情况 |
| `/model` | 切换模型（如 Sonnet ↔ Opus） |
| `/review` | 代码审查（Bug、风格、性能） |
| `/permissions` | 交互式权限管理 |
| `/hooks` | 交互式 Hooks 配置 |
| `/config` | 打开设置界面 |
| `/cost` | 查看当前会话的 token 消耗 |
| `/resume` | 恢复之前的会话 |

### 6.2 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `Shift+Tab` | 切换权限模式（Normal → Auto-accept → Plan） |
| `Tab` | 开关扩展思考（Extended Thinking） |
| `Escape` | 中断当前操作；双击可回退对话 |
| `Ctrl+L` | 清屏 |
| `Ctrl+C` | 取消当前操作 |
| `Ctrl+D` | 退出 Claude Code |
| `\` + `Enter` | 多行输入 |
| `Alt+V` | 粘贴剪贴板中的图片 |

### 6.3 子代理与自定义代理

子代理（Subagent）是运行在独立上下文窗口中的专业 AI 助手。Claude Code 内置两个子代理：

- **Explore** — 文件发现和代码搜索，保持主对话上下文整洁
- **Plan** — Plan Mode 下的调研代理

你可以在 `.claude/agents/` 目录下创建自定义代理，用 YAML 前置元数据和 Markdown 正文定义：

```markdown
---
name: code-reviewer
description: Reviews code for quality, security, and maintainability
tools: [Read, Grep, Glob, Bash]
model: sonnet
---

You are an expert code reviewer. Review code for:
- Security vulnerabilities
- Performance issues
- Code style consistency
...
```

- **用户级代理** → `~/.claude/agents/`（所有项目可用）
- **项目级代理** → `.claude/agents/`（仅当前项目，项目级覆盖用户级同名代理）

对于需要多个代理并行协作的场景，可以使用 **Agent Teams** 功能（需设置 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`）。

### 6.4 Skills 技能系统

Skills 是 Claude 自动调用的能力扩展，定义在 `.claude/skills/` 中，每个 Skill 包含一个 `SKILL.md` 描述文件。与斜杠命令不同，Skills 由 Claude 根据上下文自动匹配触发，也可通过 `/skill-name` 手动调用。

### 6.5 IDE 集成

**VS Code 扩展（推荐）：**

在扩展市场搜索 "Claude Code" 安装。提供原生图形化界面，主要特性：
- `@` 引用文件并指定行范围（如 `@app.ts#5-10`）
- 多标签页并行对话
- Checkpoint 回退系统（悬停消息点击 rewind）
- `@terminal:name` 引用终端输出

快捷键：`Cmd+Esc` / `Ctrl+Esc` 在编辑器和 Claude 之间切换焦点。

**JetBrains 插件：**

Settings → Plugins → Marketplace → 搜索 "Claude Code"。核心优势是编辑建议直接在 JetBrains 原生 Diff 视图中展示。

**CLI + IDE 混合使用：**

在外部终端运行 `claude` 后，输入 `/ide` 连接到当前打开的 IDE。推荐使用 VS Code 扩展处理日常开发和 Diff 审查，CLI 处理 MCP 配置、高级命令和自动化管道。

---

## 7. 我的实践配置

以下是我在实际使用中沉淀的配置方案，供参考。

### 7.1 ~/.claude.json — 跳过引导

```json
{
  "hasCompletedOnboarding": true
}
```

由于我使用第三方 API 代理，无法完成官方的浏览器 OAuth 流程。手动设置 `hasCompletedOnboarding` 跳过引导向导，直接通过环境变量中的 Token 认证。

### 7.2 settings.json — 核心配置

**环境变量：**

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-your-token",
    "ANTHROPIC_BASE_URL": "https://api.mechat.top",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
    "CLAUDE_CODE_MAX_OUTPUT_TOKENS": 64000,
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "claude-opus-4-6",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "claude-sonnet-4-6",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "claude-haiku-4-5"
  }
}
```

逐项说明：

| 配置 | 用途 |
|------|------|
| `ANTHROPIC_BASE_URL` | 指向第三方 API 代理地址，替代官方 `api.anthropic.com` |
| `ANTHROPIC_AUTH_TOKEN` | 代理服务的 API Token |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | 禁用遥测、错误上报和自动更新检查，减少不必要的网络请求 |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | 最大输出 token 数设为 64000，适合长文生成和大型代码重构 |
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` | 开启实验性多代理团队功能 |
| `ANTHROPIC_DEFAULT_*_MODEL` | 将所有模型层级（Haiku/Sonnet/Opus）统一覆盖为 `claude-opus-4-6`，确保子代理和后台任务都使用最强模型 |

:::note
将三个模型层级都覆盖为同一模型意味着更高的成本，但保证了所有操作的质量一致性。如果需要节省成本，可以将 Haiku 层级保留为较便宜的模型。
:::

**精细权限控制：**

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(git commit *)",
      "Bash(git * main)",
      "Bash(* --version)"
    ],
    "deny": [
      "Bash(git push *)"
    ]
  }
}
```

设计思路：

- **允许** `npm run *` — 所有 npm 脚本（构建、测试、lint）无需确认
- **允许** `git commit *` — 提交操作自动放行
- **允许** `git * main` — 主分支相关的 Git 操作（如 `git merge main`、`git rebase main`）
- **允许** `* --version` — 任何工具的版本检查
- **拒绝** `git push *` — 推送操作必须由我手动执行，防止意外推送到远程

这个策略的核心原则是：**本地操作自动化，远程操作手动控制**。

**WebFetch 预检跳过：**

```json
{
  "skipWebFetchPreflight": true
}
```

因为我的网络环境无法直接访问 `claude.ai` 的域名安全检查 API，设置此项跳过预检。配合权限系统中对 `WebFetch` 的域名限制使用，保持安全性。

### 7.3 CLAUDE.md 编写参考

```markdown
# CLAUDE.md

## Project Overview
[1-2 句项目简介]

## Commands
- **Dev:** `pnpm dev`
- **Build:** `pnpm build`
- **Test:** `pnpm test`
- **Lint:** `pnpm lint`

## Architecture
[关键目录说明、技术栈、路径别名]

## Code Style
- [格式化工具与规则]
- [命名约定]
- [提交规范]

## Key Decisions
- [为什么选择 X 而不是 Y]
- [已知限制和注意事项]
```

**编写心得：**

- 不要照搬文档，只写 Claude 需要但无法从代码中推断的信息
- 构建命令**必须写**，这是 Claude 执行操作的基础
- 代码风格约定写明即可避免反复纠正
- 犯过的错误写进去，防止 Claude 重蹈覆辙
- 定期清理过时内容，保持精简

### 7.4 配置心得

1. **优先使用项目级配置**（`.claude/settings.json`）而非全局配置，不同项目可以有不同的权限和 Hooks 策略
2. **敏感信息放在 `settings.local.json`** 中，它不会被提交到 Git
3. **在 70% 上下文使用率时主动执行 `/compact`**，不要等到自动压缩（性能在 80% 后明显下降）
4. **将研究密集型任务委派给子代理**，它们有独立的上下文窗口，不会污染主对话
5. **每个不相关的任务启动新会话**，用 `/clear` 保持上下文清洁

---

## 总结

Claude Code 不仅是一个 CLI 工具，更是一个完整的 AI 编程平台。掌握它的五大核心系统 — 配置、权限、Hooks、MCP、子代理 — 你就能将它从一个"智能助手"变成一个真正的"编程搭档"。

**快速回顾：**

- 安装用原生安装器，一行命令搞定
- 第三方 API 用户需手动设置 `hasCompletedOnboarding` 和 `skipWebFetchPreflight`
- 配置遵循分层架构，`settings.json` 管权限和环境，`CLAUDE.md` 管指令
- 权限策略的核心原则：本地自动化，远程手动控制
- Hooks 用于确定性自动化，MCP 用于能力扩展
- IDE 集成推荐 VS Code 扩展 + CLI 混合使用

**推荐资源：**

- [Claude Code 官方文档](https://code.claude.com/docs)
- [Claude Code GitHub 仓库](https://github.com/anthropics/claude-code)
- [Awesome Claude Code — 社区资源合集](https://github.com/hesreallyhim/awesome-claude-code)
- [MCP 服务器目录](https://github.com/modelcontextprotocol/servers)
