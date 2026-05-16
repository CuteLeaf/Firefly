// 字体配置
export const fontConfig = {
  // 是否启用自定义字体功能
  enable: true,
  // 是否预加载字体文件
  preload: true,
  // 当前选择的字体，支持多个字体组合
  selected: ["lxgw-wenkai"],

  // 字体列表
  // 推荐使用可靠的 CDN 服务商提供的字体链接，它天然做了按需分片加载，且性能较好
  //
  // 也可以使用本地字体文件，需自行进行字体子集化处理，否则会因为字体文件庞大增加带宽负担导致页面加载缓慢甚至无法加载
  // 如果进行字体子集化处理，会导致动态内容（如评论，Bangumi等）无法正确显示字体，因此不推荐使用本地字体文件
  fonts: {
    // 系统字体
    system: {
      id: "system",
      name: "系统字体",
      src: "", // 系统字体无需 src
      family:
        "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
    },

    // LXGW WenKai
    "lxgw-wenkai": {
      id: "lxgw-wenkai",
      name: "LXGW WenKai",
      src: "https://registry.npmmirror.com/@callmebill/lxgw-wenkai-web/latest/files/style.css",
      family: "LXGW WenKai",
      display: "swap" as const,
    },

    "lxgw-wenkai-screen": {
      id: "lxgw-wenkai-screen",
      name: "LXGW WenKai Screen",
      src: "https://registry.npmmirror.com/lxgw-wenkai-screen-web/latest/files/style.css",
      family: "LXGW WenKai Screen",
      display: "swap" as const,
    },
  },

  // 全局字体回退
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "sans-serif",
  ],
};
