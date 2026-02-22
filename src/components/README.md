# 📦 Components 组件目录

Firefly 项目中所有可复用组件的集中管理。组件按照功能和职责进行分类，提供清晰的架构和易于维护的代码组织。

## 📁 目录结构

### 🏗️ layout/ - 页面布局组件

负责整体页面框架和布局结构的组件。

- `CategoryBar.astro` - 分类栏组件
- `ConfigCarrier.astro` - 配置载体组件
- `DropdownMenu.astro` - 下拉菜单组件
- `Footer.astro` - 页脚组件
- `Navbar.astro` - 导航栏组件
- `NavMenuPanel.astro` - 导航菜单面板
- `PostCard.astro` - 文章卡片组件
- `PostMeta.astro` - 文章元数据组件
- `PostPage.astro` - 文章页面布局组件
- `SideBar.astro` - 侧边栏组件

### 🎮 controls/ - 导航和交互控件

页面导航和用户交互功能组件。

**导航控件**
- `BackToHome.astro` - 返回主页按钮
- `BackToTop.astro` - 返回顶部按钮
- `FloatingControls.astro` - 右下角悬浮控件容器
- `FloatingTOC.astro` - 浮动目录组件

**交互组件**
- `ArchivePanel.svelte` - 归档面板组件
- `DisplaySettings.svelte` - 显示设置组件
- `DisplaySettingsIntegrated.svelte` - 集成显示设置组件
- `LayoutSwitchButton.svelte` - 布局切换按钮
- `LightDarkSwitch.svelte` - 主题切换组件
- `Search.svelte` - 搜索功能组件
- `WallpaperSwitch.svelte` - 壁纸模式切换组件

### 🔧 common/ - 公共可复用组件

通用的 UI 组件和工具组件，支持跨项目复用。

**基础 UI 组件**
- `ButtonLink.astro` - 链接按钮
- `ButtonTag.astro` - 标签按钮
- `DropdownItem.astro`/`.svelte` - 下拉选项
- `DropdownPanel.astro`/`.svelte` - 下拉面板容器
- `FloatingButton.astro` - 悬浮按钮基础组件
- `Icon.svelte` - 图标组件（带加载状态和错误处理）
- `WidgetLayout.astro` - 小部件布局容器

**内容和展示组件**
- `CoverImage.astro` - 封面图组件（支持本地图片和随机图API）
- `ImageWrapper.astro` - 图片包装器（支持本地和远程图片）
- `Markdown.astro` - Markdown 内容样式包装器
- `PioMessageBox.astro` - 消息框组件（Live2D/Spine 消息显示）

**分页组件**
- `ClientPagination.astro` - 客户端分页（JavaScript 控制）
- `Pagination.astro` - 静态路由分页（Astro 原生）

### 🧩 widget/ - 小部件

侧边栏中使用的各种功能小部件。

- `Advertisement.astro` - 广告组件
- `Announcement.astro` - 公告组件
- `Calendar.astro` - 日历组件
- `Categories.astro` - 分类组件
- `Live2DWidget.astro` - Live2D 看板娘组件
- `Music.astro` - 音乐播放器小部件
- `Profile.astro` - 个人信息/社交链接小部件
- `SidebarTOC.astro` - 侧边栏目录组件
- `SiteStats.astro` - 站点统计组件
- `SpineModel.astro` - Spine 看板娘组件
- `Tags.astro` - 标签组件

### ✨ features/ - 全局功能特效组件

全局加载的功能增强和特效组件。

**管理器（初始化和管理功能）**
- `FancyboxManager.astro` - Fancybox 图片查看器管理
- `FontManager.astro` - 字体加载和管理
- `KatexManager.astro` - Katex 数学公式渲染管理
- `MusicManager.astro` - 全局音乐播放管理器（单例，管理唯一 audio 元素和播放状态，通过 CustomEvent 同步所有 MusicPlayer 视图实例）

**功能组件**
- `Live2DWidget.astro` - Live2D 看板娘组件
- `MusicPlayer.astro` - 音乐播放器 UI 视图控制器（纯 UI，委托 MusicManager 进行播放控制）
- `SakuraEffect.astro` - 樱花飘落特效
- `SpineModel.astro` - Spine 看板娘组件
- `TypewriterText.astro` - 打字机动画效果

### 📃 pages/ - 页面特定组件

特定页面使用的组件，不用于其他页面。

- `AdvancedSearch.svelte` - 高级搜索组件

**pages/bangumi/** - 番组计划页面组件
- `BangumiSection.astro` - 番组分类展示组件
- `Card.astro` - 番组卡片组件
- `FilterControls.astro` - 筛选控制组件
- `TabNav.astro` - 标签导航组件

### 💬 comment/ - 评论系统组件

第三方评论系统集成组件。

- `index.astro` - 评论主组件
- `Artalk.astro` - Artalk 评论集成
- `Disqus.astro` - Disqus 评论集成
- `Giscus.astro` - Giscus 评论集成（GitHub 讨论）
- `Twikoo.astro` - Twikoo 评论集成
- `Waline.astro` - Waline 评论集成

### 📊 analytics/ - 数据统计组件

网站分析和统计集成组件。

- `GoogleAnalytics.astro` - Google Analytics
- `MicrosoftClarity.astro` - Microsoft Clarity

### 🔧 misc/ - 杂项工具组件

其他辅助和工具类组件。

- `License.astro` - 许可证信息显示
- `SharePoster.svelte` - 分享海报生成

---

## 🗂️ 分类原则

| 分类 | 用途 | 特点 |
|------|------|------|
| **layout/** | 页面布局和结构 | 决定整体页面框架 |
| **controls/** | 导航和交互 | 用户交互功能 |
| **common/** | 通用可复用组件 | 跨多个页面/组件使用 |
| **widget/** | 侧边栏小部件 | 侧边栏特定组件 |
| **features/** | 全局功能特效 | 全局加载的增强功能 |
| **pages/** | 页面特定组件 | 仅在特定页面使用 |
| **comment/** | 评论系统 | 第三方服务集成 |
| **analytics/** | 数据统计 | 分析和统计服务 |
| **misc/** | 工具和辅助 | 其他杂项功能 |
