# Spine 看板娘功能使用指南

## 功能说明

此功能为博客添加了一个可配置的 Spine 动画看板娘，可以显示在页面的角落位置。

## 配置选项

在 `src/config.ts` 文件中的 `spineModelConfig` 对象包含以下配置选项：

```typescript
export const spineModelConfig: SpineModelConfig = {
  enable: false, // 是否启用看板娘（默认关闭）
  model: {
    path: "/pio/models/shizuku/shizuku.model.json", // 模型文件路径
    scale: 1.0, // 模型缩放比例
    x: 0, // X轴偏移
    y: 0, // Y轴偏移
  },
  position: {
    corner: "bottom-right", // 显示位置: "bottom-left" | "bottom-right" | "top-left" | "top-right"
    offsetX: 20, // 距离边缘的X轴偏移（像素）
    offsetY: 20, // 距离边缘的Y轴偏移（像素）
  },
  size: {
    width: 280, // 容器宽度（像素）
    height: 400, // 容器高度（像素）
  },
  interactive: {
    enabled: true, // 是否启用交互功能
    clickAnimation: "tap_body", // 点击时播放的动画名称
    idleAnimations: ["idle"], // 待机动画列表
    idleInterval: 10000, // 待机动画切换间隔（毫秒）
  },
  responsive: {
    hideOnMobile: true, // 是否在移动端隐藏
    mobileBreakpoint: 768, // 移动端断点（像素）
  },
  zIndex: 1000, // CSS 层级
  opacity: 1.0, // 透明度（0.0-1.0）
};
```

## 文件结构要求

要使用此功能，您需要准备以下文件：

### 1. Spine 运行时库
将 Spine 运行时 JavaScript 文件放置在：
- `public/pio/static/spine-player.js`

您可以从以下来源获取：
- [Spine官方运行时](http://esotericsoftware.com/spine-runtimes)
- [spine-ts运行时](https://github.com/EsotericSoftware/spine-runtimes/tree/4.1/spine-ts)

### 2. Spine 模型文件
将您的 Spine 模型文件放置在：
- `public/pio/models/[模型名称]/`

每个模型需要包含以下文件：
- `[模型名称].json` - Spine 骨骼数据文件
- `[模型名称].atlas` - 纹理图集文件  
- `[模型名称].png` - 纹理图像文件

例如，对于默认的 shizuku 模型：
- `public/pio/models/shizuku/shizuku.json`
- `public/pio/models/shizuku/shizuku.atlas`
- `public/pio/models/shizuku/shizuku.png`

## 启用步骤

1. **准备 Spine 文件**：将必要的文件按照上述结构放置在 `public/pio/` 目录中

2. **修改配置**：在 `src/config.ts` 中将 `spineModelConfig.enable` 设置为 `true`

3. **自定义设置**：根据您的需求调整其他配置选项

4. **测试功能**：重新构建并启动项目，查看看板娘是否正常显示

## 动画配置

### 点击动画
设置 `clickAnimation` 为您模型中存在的动画名称，用户点击看板娘时会播放此动画。

### 待机动画
在 `idleAnimations` 数组中添加多个动画名称，系统会按照设定的间隔随机播放这些动画。

### 常见动画名称参考
- `idle` - 待机动画
- `tap_body` - 点击身体
- `tap_head` - 点击头部  
- `shake` - 摇摆动画
- `flick_head` - 轻拍头部

（具体动画名称取决于您的 Spine 模型文件）

## 响应式设计

- 默认在移动端隐藏看板娘以提高性能
- 可以通过 `hideOnMobile` 和 `mobileBreakpoint` 配置响应式行为
- 支持窗口大小变化时的动态显示/隐藏

## 故障排除

### 看板娘不显示
1. 检查 `enable` 是否设置为 `true`
2. 确认模型文件路径是否正确
3. 检查浏览器控制台是否有错误信息
4. 验证 Spine 运行时文件是否正确加载

### 动画不播放
1. 检查动画名称是否与模型文件中的动画匹配
2. 确认模型文件是否包含所需的动画数据
3. 查看浏览器控制台的错误信息

### 位置或大小问题
1. 调整 `position.offsetX` 和 `position.offsetY` 来微调位置
2. 修改 `size.width` 和 `size.height` 来调整容器大小
3. 使用 `model.scale` 来缩放模型本身

## 注意事项

- Spine 模型文件可能较大，建议优化文件大小以提高加载速度
- 在移动端默认隐藏以节省带宽和提高性能
- 确保您有使用 Spine 模型的适当许可证
- 某些浏览器可能需要用户交互后才能播放动画

## 获取 Spine 模型

您可以从以下渠道获取或制作 Spine 模型：
- [Spine官方网站](http://esotericsoftware.com/)
- 各种开源 Live2D/Spine 模型资源
- 自制或委托制作

请确保您有合法使用权限的模型文件。