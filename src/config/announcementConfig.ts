import type { AnnouncementConfig } from "../types/config";

export const announcementConfig: AnnouncementConfig = {
  title: "公告", // 公告标题
  content: "欢迎光临我的博客 🎉这里会分享我的日常和学习中的收集、整理及总结，希望能对你有所帮助:) 💖", // 公告内容
  closable: true, // 允许用户关闭公告
  link: {
    enable: true, // 启用链接
    text: "了解更多", // 链接文本
    url: "/about/", // 链接 URL
    external: false, // 内部链接
  },
};
