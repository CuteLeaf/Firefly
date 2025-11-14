// src/pages/og/[...slug].png.ts
import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

export const get: APIRoute = async ({ params }) => {
  try {
    const { slug } = params;
    
    // 验证slug参数
    if (!slug || typeof slug !== 'string') {
      return new Response('Invalid slug parameter', { status: 400 });
    }
    
    // 安全处理URL - 修复问题的关键部分
    let imageTitle = slug;
    try {
      // 尝试解码URL编码的字符串
      imageTitle = decodeURIComponent(slug);
    } catch (error) {
      console.warn('Failed to decode slug, using original:', slug);
    }
    
    // 生成OG图像
    const svg = await satori(
      <div style={{ 
        width: '1200px', 
        height: '630px', 
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}>
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold',
          color: '#333333',
          textAlign: 'center',
          wordBreak: 'break-word'
        }}>
          {imageTitle}
        </h1>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [],
      }
    );
    
    const resvg = new Resvg(svg);
    const pngData = resvg.render();
    
    return new Response(pngData.asPng(), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
};

// 生成静态路径
export async function getStaticPaths() {
  // 这里应该从你的内容集合中获取实际的文章路径
  // 示例：
  return [
    { params: { slug: 'example-post' } },
    { params: { slug: 'another-post' } }
  ];
}
