import type { APIRoute } from 'astro';
import { aiConfig } from '@/config/aiConfig';

const SYSTEM_PROMPT = `你是一个专业的博客助手，专门为读者解答关于博客文章的问题。

## 你的职责
1. 基于提供的文章内容回答读者的问题
2. 如果问题与文章无关，可以提供一般性的技术帮助
3. 保持回答专业、准确、有帮助

## 回答格式
- 使用清晰的段落结构
- 如果引用了文章内容，在段落末尾添加章节编号引用（如 ↗）
- 语气友好专业

## 输出格式
请以 JSON 数组格式输出，每个元素包含：
- p: 段落内容
- r: 引用的章节编号数组（可选）
- q: 追问建议数组（在最后一个元素中）

示例：
[
  {"p": "根据文章内容...", "r": [1, 2]},
  {"p": "你可能还想了解...", "q": ["如何优化性能？", "有什么最佳实践？"]}
]`;

export const POST: APIRoute = async ({ request }) => {
  // CORS 头
  const origin = request.headers.get('origin') || '';
  const allowedOrigins = [
    'http://localhost:4321',
    'http://localhost:3000',
    'https://f3f3.top',
    'http://f3f3.top',
  ];
  const allowOrigin = allowedOrigins.includes(origin) ? origin : '*';

  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Origin': allowOrigin,
  };

  // 处理 OPTIONS 预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const { messages, articleContent, articleTitle, headings } = body;

    // 读取 API Key - 使用 import.meta.env（Astro SSR 推荐方式）
    const apiKey = (import.meta as any).env?.AI_API_KEY;
    console.log('Chat API Key loaded:', apiKey ? 'Yes (length: ' + apiKey.length + ')' : 'No');

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API Key 未配置，请检查 .env.local 文件' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 构建 System Prompt
    let systemMsg = SYSTEM_PROMPT;
    systemMsg += `\n\n## 博主信息\n名称：${aiConfig.authorName}\n简介：${aiConfig.authorBio}`;

    if (articleContent && articleTitle) {
      let sectionIndex = '';
      if (headings && headings.length > 0) {
        sectionIndex = headings
          .map((h: { slug: string; text: string }, i: number) => `${i + 1}. ${h.text}`)
          .join('\n');
      }

      systemMsg += `\n\n## 当前文章标题\n${articleTitle}`;
      if (sectionIndex) {
        systemMsg += `\n\n## 当前文章章节索引\n${sectionIndex}`;
      }
      systemMsg += `\n\n## 当前文章内容\n\`\`\`markdown\n${articleContent}\n\`\`\``;
    }

    console.log('Calling DeepSeek API...');

    // 调用 DeepSeek API
    const response = await fetch(aiConfig.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: aiConfig.model,
        messages: [
          { role: 'system', content: systemMsg },
          ...messages,
        ],
        max_tokens: aiConfig.maxTokens,
        temperature: aiConfig.temperature,
        stream: true,
      }),
    });

    console.log('DeepSeek API response status:', response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error('DeepSeek API error:', response.status, error);
      return new Response(
        JSON.stringify({ error: 'AI 服务暂时不可用', details: error }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 透传 SSE 流
    return new Response(response.body, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: '请求处理失败', details: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};
