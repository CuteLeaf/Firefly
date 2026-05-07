---
title: IDEA快捷键
published: 2025-01-01
description: 详细介绍 IntelliJ IDEA 常用快捷键与高效插件推荐，涵盖编辑、导航、查找替换、运行调试、重构等核心操作，帮助开发者提升编码效率。
tags: [IDEA快捷键, 技术]
category: JAVA
draft: false
---


## 插件推荐
| 类型      | 名称                  | 作用                                             |
| ------- | ------------------- | ---------------------------------------------- |
| 编写      | Key Promoter X      | 快捷键教学助手：操作时提示快捷键，帮助记忆高频操作。                     |
|         | String Manipulation | 字符串处理工具：支持大小写转换、加解密、排序等（右键文本使用）。               |
|         | GitToolBox          | Git 增强：实时显示当前行最后提交信息，支持快速 blame 和 commit 导航。   |
|         | Rainbow Brackets    | 彩虹括号：相同层级括号颜色一致，提升嵌套代码可读性。                     |
|         | CodeGlance Pro      | 代码缩略图：在编辑器右侧显示代码全景图，支持快速定位。                    |
| API查找   | RestfulTool         | 工具窗口，以树状结构清晰地展示项目中所有的RESTful API。              |
| Maven依赖 | Maven Helper        | Maven 依赖管理：可视化分析依赖冲突，一键排除冲突包。                  |
| 数据库     | MyBatisX            | MyBatis 增强：XML 与接口方法双向跳转，自动生成 SQL 占位符。         |
| AI      | Lingma(通义灵码)        | 提供代码智能生成、智能问答、多文件修改、编程智能体等能力，为开发者带来高效、流畅的编码体验。 |
| 翻译      | Tanslation          |                                                |
|         |                     |                                                |
| JVM     | jclasslib           |                                                |
|         | Profiler            | 火焰图查看web时间                                     |
## 模板设置



## 编辑

| 快捷键                           | 说明                       |
| ----------------------------- | ------------------------ |
| `Ctrl + Space`                | 基本代码补全                   |
| `Ctrl + Shift + Space`        | 智能代码补全（根据类型）             |
| `Ctrl + P`                    | 显示方法参数信息                 |
| `Ctrl + Q`                    | 快速查看文档                   |
| `Ctrl + /`                    | 注释/取消注释行或选中块（`//`）       |
| `Ctrl + Shift + /`            | 块注释（`/* */`）             |
| `Ctrl + W`                    | 递进式选择代码块（扩展选择）           |
| `Ctrl + Shift + W`            | 递进式取消选择代码块（收缩选择）         |
| `Ctrl + D`                    | 复制当前行或选中的块               |
| `Ctrl + Y`                    | 删除当前行                    |
| `Ctrl + X`                    | 剪切当前行或选中的块               |
| `Ctrl + C`                    | 复制当前行或选中的块               |
| `Ctrl + V`                    | 粘贴                       |
| `Ctrl + Shift + ↑ / ↓`        | 移动当前行或选中的代码块             |
| `Ctrl + Alt + L`              | 格式化代码                    |
| `Alt + Enter`                 | 显示意图动作（快速修复）             |
| `Ctrl + Alt + O`              | 优化导入（去除无用 import）        |
| `Ctrl + Shift + Enter`        | 补全当前语句（加分号、补全花括号等）       |
| `Ctrl + Alt + T`              | 包围代码（if / while / try 等） |
| `Alt + J` / `Alt + Shift + J` | 多选相同单词（逐个选择/取消）          |

## 导航

| 快捷键 | 说明 |
|--------|------|
| `Ctrl + N` | 查找类 |
| `Ctrl + Shift + N` | 查找文件 |
| `Ctrl + Alt + Shift + N` | 查找符号（方法、变量等） |
| `Alt + ↑ / ↓` | 在方法间快速移动 |
| `Ctrl + B` 或 `Ctrl + 单击` | 跳转到声明 |
| `Ctrl + Alt + B` | 跳转到实现 |
| `Ctrl + Shift + B` | 跳转到类型声明 |
| `Ctrl + U` | 跳转到父类/方法 |
| `Ctrl + Alt + ← / →` | 后退/前进导航 |

## 查找/替换

| 快捷键 | 说明 |
|--------|------|
| `Ctrl + F` | 当前文件查找 |
| `Ctrl + R` | 当前文件替换 |
| `Ctrl + Shift + F` | 全局查找 |
| `Ctrl + Shift + R` | 全局替换 |
| `F3` / `Shift + F3` | 查找下一个/上一个 |
| `Ctrl + F3` | 查找当前单词的下一个出现位置 |
| `Ctrl + Shift + F7` | 高亮显示当前单词的所有出现位置 |

## 运行/调试

| 快捷键 | 说明 |
|--------|------|
| `Shift + F10` | 运行当前配置 |
| `Shift + F9` | 调试当前配置 |
| `F8` | 步过 |
| `F7` | 步入 |
| `Shift + F8` | 步出 |
| `Alt + F9` | 运行到光标处 |
| `Alt + F8` | 计算表达式（调试时） |
| `Ctrl + F2` | 停止运行/调试 |

## 重构

| 快捷键 | 说明 |
|--------|------|
| `Shift + F6` | 重命名 |
| `Ctrl + Alt + V` | 提取变量 |
| `Ctrl + Alt + C` | 提取常量 |
| `Ctrl + Alt + M` | 提取方法 |
| `Ctrl + Alt + P` | 提取参数 |
| `Ctrl + Alt + F` | 提取字段 |
| `Ctrl + Alt + N` | 内联 |
| `Ctrl + Alt + Shift + T` | 打开重构菜单 |

## 其他

| 快捷键 | 说明 |
|--------|------|
| `Ctrl + E` | 最近打开的文件 |
| `Ctrl + Shift + E` | 最近编辑的文件 |
| `Ctrl + Tab` | 切换活动文件 |
| `Ctrl + Shift + Backspace` | 跳转到上次编辑位置 |
| `Alt + 1` | 打开/关闭项目工具窗口 |
| `Esc` | 焦点回到编辑器 |
| `F2` | 下一个错误或警告 |
| `Shift + F2` | 上一个错误或警告 |
| `Ctrl + Shift + A` | 查找动作（可快速执行任何功能） |
| `Ctrl + -` / `Ctrl + +` (小键盘) | 折叠/展开代码块 |
| `Ctrl + Shift + -` / `Ctrl + Shift + +` | 折叠/展开所有代码块 |