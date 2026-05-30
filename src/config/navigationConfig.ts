// 网站导航配置文件
// 在这里自定义导航页面的所有内容

export interface NavSite {
  name: string;
  url: string;
  description: string;
  icon: string; // Iconify icon name
  iconColor?: string; // 图标背景颜色
  tags: string[];
}

export interface NavCategory {
  id: string;
  name: string;
  icon: string; // Iconify icon name
  color: string; // 主题颜色 (用于标签和左边框)
  dotColor?: string; // 分类标签的圆点颜色
  sites: NavSite[];
}

export const navigationConfig = {
  // 页面标题
  title: "网站导航",
  // 页面描述
  description: "我常用和推荐的网站",

  // 分类配置
  // 可以自由添加、删除、重命名分类
  categories: [
    {
      id: "featured",
      name: "精选网站",
      icon: "material-symbols:star",
      color: "#f59e0b", // amber
      dotColor: "#f59e0b",
      sites: [
        {
          name: "GitHub",
          url: "https://github.com",
          description: "全球最大的代码托管平台",
          icon: "mdi:github",
          iconColor: "#24292e",
          tags: ["开发工具", "代码托管"],
        },
        {
          name: "Vercel",
          url: "https://vercel.com",
          description: "现代Web部署平台",
          icon: "mdi:tray-arrow-up",
          iconColor: "#000000",
          tags: ["部署平台", "托管"],
        },
        {
          name: "Cloudflare",
          url: "https://cloudflare.com",
          description: "全球CDN与网络安全服务",
          icon: "mdi:cloud",
          iconColor: "#f38020",
          tags: ["云服务", "CDN"],
        },
      ],
    },
    {
      id: "my-sites",
      name: "我的网站",
      icon: "material-symbols:person",
      color: "#3b82f6", // blue
      dotColor: "#3b82f6",
      sites: [
        {
          name: "团子的邮箱",
          url: "mailto:your@email.com",
          description: "个人使用的邮箱服务",
          icon: "mdi:email",
          iconColor: "#3b82f6",
          tags: ["个人网站", "实用工具"],
        },
        {
          name: "团子的相册",
          url: "#",
          description: "个人照片存储与展示",
          icon: "mdi:image-multiple",
          iconColor: "#8b5cf6",
          tags: ["个人网站", "相册"],
        },
        {
          name: "团子和蛋糕的博客",
          url: "#",
          description: "个人技术与生活分享博客",
          icon: "mdi:notebook",
          iconColor: "#10b981",
          tags: ["个人网站", "博客"],
        },
        {
          name: "跑步步数统计",
          url: "#",
          description: "记录每日跑步数据",
          icon: "mdi:run",
          iconColor: "#f59e0b",
          tags: ["个人网站", "健康"],
        },
        {
          name: "评论管理后台",
          url: "#",
          description: "Waline 评论管理系统",
          icon: "mdi:comment-text-multiple",
          iconColor: "#06b6d4",
          tags: ["个人网站", "管理工具"],
        },
      ],
    },
    {
      id: "frequently-used",
      name: "常用网站",
      icon: "material-symbols:star",
      color: "#f97316", // orange
      dotColor: "#f97316",
      sites: [
        {
          name: "Cloudflare",
          url: "https://cloudflare.com",
          description: "全球CDN与网络安全服务",
          icon: "mdi:cloud",
          iconColor: "#f38020",
          tags: ["云服务", "CDN"],
        },
      ],
    },
    {
      id: "resources",
      name: "资源网站",
      icon: "material-symbols:folder",
      color: "#ec4899", // pink
      dotColor: "#ec4899",
      sites: [
        {
          name: "Emoji词典",
          url: "#",
          description: "全面的emoji表情查询工具",
          icon: "mdi:emoticon-outline",
          iconColor: "#ec4899",
          tags: ["工具", "emoji"],
        },
        {
          name: "樱之空动漫",
          url: "#",
          description: "动漫资源分享平台",
          icon: "mdi:filmstrip",
          iconColor: "#ec4899",
          tags: ["动漫", "资源"],
        },
      ],
    },
    {
      id: "tools",
      name: "工具网站",
      icon: "material-symbols:build",
      color: "#10b981", // emerald
      dotColor: "#10b981",
      sites: [
        {
          name: "Excalidraw",
          url: "https://excalidraw.com",
          description: "手绘风格白板工具",
          icon: "mdi:draw",
          iconColor: "#6d28d9",
          tags: ["设计工具", "白板"],
        },
        {
          name: "TinyPNG",
          url: "https://tinypng.com",
          description: "图片压缩工具",
          icon: "mdi:image-size-select-large",
          iconColor: "#10b981",
          tags: ["图片工具", "压缩"],
        },
      ],
    },
    {
      id: "blogs",
      name: "大佬博客",
      icon: "material-symbols:person",
      color: "#8b5cf6", // violet
      dotColor: "#8b5cf6",
      sites: [
        {
          name: "tsh520",
          url: "https://blog.tsh520.cn",
          description: "团子和蛋糕的个人博客",
          icon: "mdi:account-circle",
          iconColor: "#8b5cf6",
          tags: ["个人博客", "技术分享"],
        },
      ],
    },
    {
      id: "learning",
      name: "学习网站",
      icon: "material-symbols:school",
      color: "#06b6d4", // cyan
      dotColor: "#06b6d4",
      sites: [
        {
          name: "MDN Web Docs",
          url: "https://developer.mozilla.org",
          description: "Web 开发文档与学习资源",
          icon: "mdi:book-open-variant",
          iconColor: "#06b6d4",
          tags: ["文档", "前端"],
        },
        {
          name: "Astro 官网",
          url: "https://astro.build",
          description: "现代化静态网站生成框架",
          icon: "mdi:rocket-launch",
          iconColor: "#ff5d01",
          tags: ["框架", "前端"],
        },
      ],
    },
    {
      id: "docs",
      name: "文档",
      icon: "material-symbols:description",
      color: "#84cc16", // lime
      dotColor: "#84cc16",
      sites: [],
    },
    {
      id: "other",
      name: "其他网站",
      icon: "material-symbols:language",
      color: "#6b7280", // gray
      dotColor: "#6b7280",
      sites: [],
    },
  ] as NavCategory[],
};

// 分类颜色映射 - 用于卡片左边框
export const categoryColorMap: Record<string, string> = {
  "my-sites": "#3b82f6",
  "frequently-used": "#f97316",
  "resources": "#ec4899",
  "tools": "#10b981",
  "blogs": "#8b5cf6",
  "learning": "#06b6d4",
  "docs": "#84cc16",
  "other": "#6b7280",
  "featured": "#f59e0b",
};
