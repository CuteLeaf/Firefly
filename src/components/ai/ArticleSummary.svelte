<script lang="ts">
  import { onMount } from 'svelte';
  import { aiConfig } from '@/config/aiConfig';

  interface Props {
    slug: string;
    title: string;
  }

  let { slug, title }: Props = $props();

  let isLoading = $state(false);
  let hasGenerated = $state(false);
  let summaryContent = $state('');
  let thinkingContent = $state('');
  let suggestions = $state<string[]>([]);
  let showThinking = $state(false);
  let error = $state('');
  let articleContent = $state('');
  let headings = $state<Array<{ slug: string; text: string }>>([]);
  let startTime = $state(0);
  let elapsed = $state(0);

  let timer: ReturnType<typeof setInterval> | null = null;

  function getArticleContent() {
    const articleEl = document.querySelector('.markdown-content');
    if (articleEl) {
      articleContent = articleEl.textContent || '';
    }

    const headingsEl = document.getElementById('article-headings-data');
    if (headingsEl?.textContent) {
      try {
        headings = headingsEl.textContent
          .split('|')
          .filter(Boolean)
          .map(s => JSON.parse(s));
      } catch (e) {
        console.error('Failed to parse headings:', e);
      }
    }
  }

  async function generateSummary() {
    if (!articleContent) {
      getArticleContent();
    }

    if (!articleContent) {
      error = '无法获取文章内容';
      return;
    }

    // 检查缓存
    const cacheKey = `ai-summary-${slug}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        const data = JSON.parse(cached);
        summaryContent = data.content;
        suggestions = data.suggestions || [];
        thinkingContent = data.thinking || '';
        hasGenerated = true;
        return;
      } catch (e) {
        // 缓存无效，重新请求
      }
    }

    isLoading = true;
    error = '';
    summaryContent = '';
    thinkingContent = '';
    suggestions = [];
    startTime = Date.now();
    elapsed = 0;

    timer = setInterval(() => {
      elapsed = Math.floor((Date.now() - startTime) / 1000);
    }, 1000);

    try {
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleContent,
          articleTitle: title,
          headings,
        }),
      });

      if (!response.ok) {
        throw new Error('AI 服务暂时不可用');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      let thinking = '';
      let hasContent = false;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta;

              if (delta?.reasoning_content && !hasContent) {
                thinking += delta.reasoning_content;
                thinkingContent = thinking;
              }

              if (delta?.content) {
                if (!hasContent) {
                  hasContent = true;
                }
                fullContent += delta.content;
                summaryContent = fullContent;
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }

      // 解析最终的 JSON 响应
      try {
        const parsed = JSON.parse(fullContent);
        if (parsed.p && Array.isArray(parsed.p)) {
          summaryContent = parsed.p.join('\n\n');
          suggestions = parsed.q || [];

          // 缓存结果
          sessionStorage.setItem(cacheKey, JSON.stringify({
            content: summaryContent,
            suggestions,
            thinking: thinkingContent,
          }));
        }
      } catch (e) {
        // 如果不是 JSON，保持原始内容
      }

      hasGenerated = true;
    } catch (err) {
      console.error('Summary error:', err);
      error = '概括生成失败，请稍后再试';
    } finally {
      isLoading = false;
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }
  }

  function formatContent(content: string) {
    let html = content;

    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/`(.*?)`/g, '<code class="bg-black/5 dark:bg-white/10 px-1 py-0.5 rounded text-sm">$1</code>');

    html = html.replace(/↗(\d+)/g, (match, num) => {
      const idx = parseInt(num) - 1;
      const heading = headings[idx];
      if (heading) {
        return `<a href="#${heading.slug}" class="ai-cite-link" onclick="event.preventDefault(); document.getElementById('${heading.slug}')?.scrollIntoView({behavior:'smooth'})">↗${num}</a>`;
      }
      return match;
    });

    html = html.split('\n\n').map(p => `<p>${p}</p>`).join('');

    return html;
  }

  function handleSuggestionClick(suggestion: string) {
    const chatBtn = document.querySelector('.ai-chat-btn') as HTMLButtonElement;
    if (chatBtn) {
      chatBtn.click();
      setTimeout(() => {
        const input = document.querySelector('.ai-chat-input input') as HTMLInputElement;
        if (input) {
          input.value = suggestion;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, 100);
    }
  }

  onMount(() => {
    getArticleContent();

    // 如果开启了自动生成，则自动触发
    if (aiConfig.summaryAutoGenerate) {
      generateSummary();
    }

    (window as any).setupAiSummary = () => {
      getArticleContent();
      if (aiConfig.summaryAutoGenerate && !hasGenerated) {
        generateSummary();
      }
    };
  });

  $effect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  });
</script>

{#if aiConfig.summaryEnabled}
  <div class="ai-summary-card">
    {#if !hasGenerated && !isLoading}
      <!-- 未生成状态：显示手动触发按钮 -->
      <div class="ai-summary-header">
        <span class="ai-summary-title">
          <span>✨</span>
          <span>AI 概括</span>
        </span>
        <button class="ai-generate-btn" onclick={generateSummary}>
          <span>生成概括</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
      <p class="text-sm text-black/50 dark:text-white/50">
        点击按钮，AI 将为你生成这篇文章的摘要
      </p>

    {:else if isLoading}
      <!-- 加载中状态 -->
      <div class="ai-summary-header">
        <span class="ai-summary-title">
          <span>✨</span>
          <span>AI 概括</span>
        </span>
        <span class="ai-summary-loading">
          <span class="ai-summary-spinner"></span>
          <span>正在生成... {elapsed}s</span>
        </span>
      </div>

      {#if thinkingContent}
        <div class="ai-thinking mt-3">
          <button class="ai-thinking-header" onclick={() => showThinking = !showThinking}>
            <span>💭</span>
            <span>思考过程</span>
            <span class="text-xs">{showThinking ? '▾' : '▸'}</span>
          </button>
          {#if showThinking}
            <div class="ai-thinking-content">{thinkingContent}</div>
          {/if}
        </div>
      {/if}

      <div class="ai-summary-content text-black/50 dark:text-white/50">
        <p>正在分析文章内容...</p>
      </div>

    {:else if error}
      <!-- 错误状态 -->
      <div class="ai-summary-header">
        <span class="ai-summary-title">
          <span>✨</span>
          <span>AI 概括</span>
        </span>
        <button class="ai-retry-btn" onclick={generateSummary}>
          重试
        </button>
      </div>
      <div class="ai-summary-content text-red-500">
        <p>{error}</p>
      </div>

    {:else}
      <!-- 已生成状态 -->
      <div class="ai-summary-header">
        <span class="ai-summary-title">
          <span>✨</span>
          <span>AI 概括</span>
        </span>
        <button class="ai-regenerate-btn" onclick={generateSummary}>
          重新生成
        </button>
      </div>

      {#if thinkingContent}
        <div class="ai-thinking">
          <button class="ai-thinking-header" onclick={() => showThinking = !showThinking}>
            <span>💭</span>
            <span>思考过程</span>
            <span class="text-xs">{showThinking ? '▾' : '▸'}</span>
          </button>
          {#if showThinking}
            <div class="ai-thinking-content">{thinkingContent}</div>
          {/if}
        </div>
      {/if}

      <div class="ai-summary-content">
        {@html formatContent(summaryContent)}
      </div>

      {#if suggestions.length > 0}
        <div class="ai-summary-suggestions">
          <div class="ai-summary-suggestions-label">💡 你可能还想了解</div>
          <div class="ai-suggestions">
            {#each suggestions as suggestion}
              <button class="ai-suggestion-tag" onclick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </button>
            {/each}
          </div>
        </div>
      {/if}
    {/if}
  </div>
{/if}
