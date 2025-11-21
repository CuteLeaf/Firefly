import { aiSummaryConfig } from "@/config";

/**
 * 生成AI摘要
 * @param content 文章内容
 * @returns Promise<string> 生成的摘要文本
 */
export async function generateAISummary(content: string): Promise<string> {
  // 如果功能未启用，直接返回空字符串
  if (!aiSummaryConfig.enable) {
    return "";
  }

  try {
    // 构造API请求
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), aiSummaryConfig.api.timeout);

    const response = await fetch(aiSummaryConfig.api.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${aiSummaryConfig.api.apiKey}`
      },
      body: JSON.stringify({
        model: aiSummaryConfig.api.model,
        messages: [
          {
            role: "user",
            content: aiSummaryConfig.prompt.summary.replace("{content}", content)
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }

    // 解析响应数据
    const data = await response.json();
    
    // 添加安全检查：确保数据结构完整
    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      throw new Error("API返回的数据格式不正确");
    }
    
    return data.choices[0].message.content.trim();
  } catch (err) {
    console.error("AI摘要生成失败:", err);
    // 返回精简的错误信息
    const errorMessage = `${aiSummaryConfig.display.errorText}:"${err.message}"`;
    throw new Error(errorMessage);
  }
}