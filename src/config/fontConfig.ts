// 字体配置
export const fontConfig = {
  enable: true, // 启用自定义字体功能
  preload: true, // 预加载字体文件以提高性能
  selected: ["misans-semibold"], // 当前选择的字体，支持多个字体组合
  fonts: {
    // 系统字体
    system: {
      id: "system",
      name: "系统字体",
      src: "", // 系统字体无需 src
      family:
        "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
    },
    // Google Fonts - Zen Maru Gothic
    "zen-maru-gothic": {
      id: "zen-maru-gothic",
      name: "Zen Maru Gothic",
      src: "https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@300;400;500;700;900&display=swap",
      family: "Zen Maru Gothic",
      display: "swap" as const,
    },
    // Google Fonts - Inter
    inter: {
      id: "inter",
      name: "Inter",
      src: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
      family: "Inter",
      display: "swap" as const,
    },
    // 小米字体 - MiSans Normal
    "misans-normal": {
      id: "misans-normal",
      name: "MiSans Normal",
      src: "https://unpkg.com/misans@4.1.0/lib/Normal/MiSans-Normal.min.css",
      family: "MiSans",
      weight: 400,
      display: "swap" as const,
    },
    // 小米字体 - MiSans Semibold
    "misans-semibold": {
      id: "misans-semibold",
      name: "MiSans Semibold",
      src: "https://unpkg.com/misans@4.1.0/lib/Normal/MiSans-Semibold.min.css",
      family: "MiSans",
      weight: 600,
      display: "swap" as const,
    },
  },
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "sans-serif",
  ], // 全局字体回退
};
