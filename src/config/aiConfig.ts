export const aiConfig = {
  // 是否启用 AI 功能
  enable: true,

  // DeepSeek API 配置
  apiEndpoint: 'https://api.deepseek.com/v1/chat/completions',
  model: 'deepseek-chat',
  maxTokens: 4096,
  temperature: 0.7,        // 问答模式
  summaryTemperature: 0.1,  // 概括模式（更稳定）

  // 功能开关
  chatEnabled: true,        // 启用 AI 问答
  summaryEnabled: true,     // 启用文章概括
  summaryAutoGenerate: false, // 是否自动生成概括（false = 手动触发）

  // 博主信息（用于 AI 问答的 System Prompt）
  authorName: 'Firefly',
  authorBio: '这是一个技术博客，分享编程、AI、Web 开发等技术内容。',
};
