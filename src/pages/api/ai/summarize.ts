import type { APIRoute } from 'astro';
import { aiConfig } from '@/config/aiConfig';

const SUMMARIZE_PROMPT = `你是一个文章概括助手，专门生成简洁准确的文章摘要。

## 你的职责
1. 阅读完整文章内容
2. 生成 2-3 段核心内容概括
3. 提供 3-5 个追问建议

## 输出格式
请以 JSON 格式输出，包含以下字段：
{
  "p": ["段落1内容", "段落2内容", "段落3内容"],
  "q": ["追问建议1", "追问建议2", "追问建议3"]
}

## 要求
- 概括要简洁准确，抓住文章核心要点
- 如果引用了文章内容，在段落中添加章节编号引用（如 ↗）
- 追问建议要与文章内容相关，帮助读者深入了解
- 使用中文输出`;

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
    const { articleContent, articleTitle, headings } = body;

    if (!articleContent) {
      return new Response(
        JSON.stringify({ error: '缺少文章内容' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 读取 API Key - 使用 import.meta.env（Astro SSR 推荐方式）
    const apiKey = (import.meta as any).env?.AI_API_KEY;
    console.log('Summarize API Key loaded:', apiKey ? 'Yes (length: ' + apiKey.length + ')' : 'No');

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API Key 未配置' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 构建章节索引
    let sectionIndex = '';
    if (headings && headings.length > 0) {
      sectionIndex = headings
        .map((h: { slug: string; text: string }, i: number) => `${i + 1}. ${h.text}`)
        .join('\n');
    }

    // 构建完整的 Prompt
    let fullPrompt = SUMMARIZE_PROMPT;
    fullPrompt += `\n\n## 文章标题\n${articleTitle || '未知标题'}`;
    if (sectionIndex) {
      fullPrompt += `\n\n## 文章章节索引\n${sectionIndex}`;
    }
    fullPrompt += `\n\n## 文章内容\n\`\`\`markdown\n${articleContent}\n\`\`\``;

    console.log('Calling DeepSeek API for summarize...');

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
          { role: 'system', content: fullPrompt },
          { role: 'user', content: '请概括这篇文章的核心内容。' },
        ],
        max_tokens: aiConfig.maxTokens,
        temperature: aiConfig.summaryTemperature,
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
    console.error('Summarize API error:', error);
    return new Response(
      JSON.stringify({ error: '请求处理失败', details: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};
