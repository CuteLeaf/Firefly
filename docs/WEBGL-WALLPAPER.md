# WebGL 壁纸

在显示设置的「壁纸模式」中选择 **WebGL 动态壁纸**，或把 [`backgroundWallpaper.mode`](../src/config/backgroundWallpaper.ts) 设为 `"webgl"`。默认加载 `cloud-train`（云海、蒸汽列车与桥梁）。WebGL 2 不可用、场景加载失败或着色器报错时，原图片壁纸会保留为回退；切走该模式时会释放画布和场景资源。

## 配置 Cloud Train

```ts
webgl: {
  scene: "cloud-train",
  options: {
    speed: 1, resolution: 0.75, feedback: 0.3,
    zoom: 1, offset: 0, amplitude: 1, detail: 8,
    exposure: 1, saturation: 1, hue: 0, temperature: 0,
    skyTint: "#ffffff", smokeTint: "#ffffff", trainTint: "#ffffff",
    introEnabled: true, introDuration: 3, introFeather: 0.22,
    paused: false,
  },
  // 首屏布局："hero" 固定全屏首屏（首页内容推到首屏之下），
  // "classic" 文档流（首页 100vh、非首页横幅高度，壁纸随滚动离开）
  layout: "hero",
},
```

`speed` 范围 0–5；`resolution` 范围 0.25–1；`feedback` 范围 0–0.85。场景会限制其余参数范围，避免无效配置直接进入着色器。窗口隐藏时停止渲染；系统开启减少动态效果时保持静态画面。

`layout` 与全屏壁纸的 `fullscreen.layout` 相互独立：设置面板在 WebGL 模式下也会显示「全屏布局」切换按钮（classic/hero），运行时切换的保存值对两种模式共用。

## 使用自己的片元着色器

把 WebGL 2 片元着色器放在 `public` 下。例如已提供的 [`example-wallpaper.frag`](../public/assets/shaders/example-wallpaper.frag)：

```ts
webgl: {
  scene: "fragment",
  options: {
    url: "/assets/shaders/example-wallpaper.frag",
    speed: 1,
    resolution: 1,
  },
},
```

着色器须以 `#version 300 es` 开头，声明 `uniform vec3 iResolution`、`uniform float iTime`、`out vec4 color`，并提供 `void main()`。渲染宿主自动更新分辨率和时间。`url` 也可指向允许跨域读取的地址。

## 编写完整场景模块

多通道、反馈纹理或自行管理参数的场景，在 [`src/utils/webgl-wallpaper/scenes/`](../src/utils/webgl-wallpaper/scenes/) 下操作一个 ts 文件即可：

1. 复制 [`cloud-train.ts`](../src/utils/webgl-wallpaper/scenes/cloud-train.ts) 为 `my-scene.ts`（该文件零外部依赖，可整体复制后任意修改参数、着色器与渲染逻辑）；
2. 把配置 `webgl.scene` 改为 `"my-scene"`。

宿主通过 `import.meta.glob` 按需加载，切换壁纸不需要改动 host、CSS 或任何布局代码。模块只需默认导出一个接收 `{ canvas, options, signal, onFirstFrame }` 的工厂函数，返回含 `dispose()` 的对象：

```ts
export default function createScene({ canvas, onFirstFrame }: {
  canvas: HTMLCanvasElement;
  options: Record<string, unknown>;
  signal: AbortSignal;
  onFirstFrame(): void;
}) {
  const gl = canvas.getContext("webgl2");
  if (!gl) throw new Error("WebGL 2 is unavailable");
  // 在此编译着色器并启动渲染；第一帧成功后调用 onFirstFrame()。
  return { dispose() { /* 释放场景的 WebGL 资源与监听器 */ } };
}
```

工厂应在画出第一帧后调用 `onFirstFrame()`，并在 `dispose()` 中取消动画帧、监听器及 GPU 资源；可使用 `signal` 取消异步资产加载。宿主生命周期见 [`host.ts`](../src/utils/webgl-wallpaper/host.ts)，场景契约见 [`types.ts`](../src/utils/webgl-wallpaper/types.ts)。
