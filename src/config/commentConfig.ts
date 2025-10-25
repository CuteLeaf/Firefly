import type { CommentConfig } from "../types/config";

export const commentConfig: CommentConfig = {
  enable: true, // 启用评论功能。当设置为 false 时，评论组件将不会显示在文章区域。
  enableVisitorCount: true, // 启用文章访问量统计功能。当设置为 false 时，文章访问量统计将不会显示。需要enable和enableVisitorCount都为true时才启用。
  twikoo: {
    envId: "https://jasmiam.netlify.app/",
    lang: "zh-CN", // 设置 Twikoo 评论系统语言
  },
};
