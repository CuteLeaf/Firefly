import type { AISummaryConfig } from "../types/config";

export const aiSummaryConfig: AISummaryConfig = {
  // AI总结功能开关（默认关闭）
  enable: false, 
  // 调试信息输出开关
  debug: false,
  // API配置
  api: {
    // API地址（OpenAI Compatible标准格式）
    endpoint: '',
    // API密钥 (请在环境变量中设置，不要在此处暴露)
    // 本地调试请在根目录新建`.env`文件填写API调用
    apiKey: import.meta.env.OPENAI_API_KEY || "",
    // 使用的模型
    model: "gpt-3.5-turbo",
    // 请求超时时间(ms)
    timeout: 30000,
  },
  
  // 提示词配置
  prompt: {
    // 生成摘要的提示词
    summary: "请为以下文章内容生成一个简洁的中文摘要，突出文章的核心观点和重要信息，长度在100-200字之间：\n\n{content}",
  },
  
  // 显示配置
  display: {  
    // 加载时显示的文本
    loadingText: "AI正在生成摘要...",
    // 错误时显示的文本
    errorText: "AI摘要生成失败，请稍后重试\n\n",
    // 成功生成后的显示时长(ms)，0表示不自动隐藏
    autoHideDelay: 0,
  }
};