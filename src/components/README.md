# Components 组件目录

本目录包含项目中所有的可复用组件，按功能分类组织。

## 📁 目录结构

### 🏗️ layout/ - 布局组件
页面布局和结构相关的组件，负责整体页面框架。

- `Footer.astro` - 页脚组件
- `Navbar.astro` - 导航栏组件
- `PostPage.astro` - 文章页面布局组件
- `ConfigCarrier.astro` - 配置载体组件
- `GlobalStyles.astro` - 全局样式组件
- `SideBar.astro` - 侧边栏组件
- `DropdownMenu.astro` - 下拉菜单组件
- `NavMenuPanel.astro` - 导航菜单面板

### 🎮 interactive/ - 交互组件
具有用户交互功能的组件，如切换、搜索、面板等。

- `LightDarkSwitch.svelte` - 主题切换组件
- `LayoutSwitchButton.svelte` - 布局切换按钮
- `Search.svelte` - 搜索功能组件
- `ArchivePanel.svelte` - 归档面板组件
- `FontManager.astro` - 字体管理组件
- `DisplaySettings.svelte` - 显示设置组件
- `FloatingTOC.astro` - 浮动目录组件
- `WallpaperSwitch.svelte` - 壁纸模式切换组件

### 📄 content/ - 内容组件
用于展示内容的组件，如文章卡片、元数据等。

- `PostCard.astro` - 文章卡片组件
- `PostCardCompact.astro` - 紧凑文章卡片组件
- `PostMeta.astro` - 文章元数据组件
- `TypewriterText.astro` - 打字机效果文本组件
- `StatCard.astro` - 统计卡片组件
- `Profile.astro` - 个人资料组件

### 🎛️ control/ - 控制组件
页面控制相关的组件，如按钮、分页等。

- `BackToTop.astro` - 返回顶部按钮
- `ButtonLink.astro` - 链接按钮组件
- `ButtonTag.astro` - 标签按钮组件
- `Pagination.astro` - 分页组件

### 🧩 widget/ - 小部件组件
各种功能小部件，如音乐播放器、Live2D等。

- `Advertisement.astro` - 广告组件
- `Announcement.astro` - 公告组件
- `Categories.astro` - 分类组件
- `Live2DWidget.astro` - Live2D 小部件
- `MusicPlayer.astro` - 音乐播放器组件
- `PioMessageBox.astro` - Pio 消息框组件
- `SpineModel.astro` - Spine 模型组件
- `Tags.astro` - 标签组件
- `TOC.astro` - 目录组件
- `WidgetLayout.astro` - 小部件布局组件

### 🔧 misc/ - 杂项组件
各种辅助和工具组件。

- `FullscreenWallpaper.astro` - 全屏壁纸组件
- `Icon.astro` - 图标组件
- `IconifyLoader.astro` - Iconify 加载器组件
- `ImageWrapper.astro` - 图片包装器组件
- `License.astro` - 许可证组件
- `Markdown.astro` - Markdown 渲染组件

### 💬 comment/ - 评论组件
评论系统相关组件。

- `index.astro` - 评论主组件
- `Twikoo.astro` - Twikoo 评论组件

### ✨ effects/ - 特效组件
页面特效和动画相关的组件。

- `FancyboxManager.astro` - Fancybox 图片查看器管理组件
- `SakuraEffect.astro` - 樱花飘落特效组件



### 组件分类原则

1. **layout/** - 页面布局和结构
2. **interactive/** - 用户交互功能
3. **content/** - 内容展示
4. **control/** - 页面控制
5. **widget/** - 功能小部件
6. **misc/** - 辅助工具
7. **comment/** - 评论系统
8. **effects/** - 页面特效和动画
---

