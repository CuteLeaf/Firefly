<script lang="ts">
  import { onMount } from 'svelte';
  import { aiConfig } from '@/config/aiConfig';

  interface Message {
    role: 'user' | 'assistant';
    content: string;
    thinking?: string;
    suggestions?: string[];
  }

  let isOpen = $state(false);
  let messages = $state<Message[]>([]);
  let inputValue = $state('');
  let isLoading = $state(false);
  let articleContent = $state('');
  let articleTitle = $state('');
  let headings = $state<Array<{ slug: string; text: string }>>([]);

  // 获取文章内容和标题
  function getArticleData() {
    const articleEl = document.querySelector('.markdown-content');
    if (articleEl) {
      articleContent = articleEl.textContent || '';
    }

    const titleEl = document.querySelector('[data-pagefind-body]');
    if (titleEl) {
      articleTitle = titleEl.textContent || '';
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

  // 发送消息
  async function sendMessage() {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    inputValue = '';
    messages = [...messages, { role: 'user', content: userMessage }];
    isLoading = true;

    try {
      const assistantMessage: Message = { role: 'assistant', content: '', thinking: '' };
      messages = [...messages, assistantMessage];

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.slice(0, -1).map(m => ({
            role: m.role,
            content: m.content,
          })),
          articleContent,
          articleTitle,
          headings,
        }),
      });

      if (!response.ok) {
        throw new Error('AI 服务暂时不可用');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      let thinkingContent = '';
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
                thinkingContent += delta.reasoning_content;
                // 创建新对象触发响应式更新
                messages = messages.map((m, i) =>
                  i === messages.length - 1
                    ? { ...m, thinking: thinkingContent }
                    : m
                );
              }

              if (delta?.content) {
                if (!hasContent) {
                  hasContent = true;
                }
                fullContent += delta.content;
                // 创建新对象触发响应式更新
                messages = messages.map((m, i) =>
                  i === messages.length - 1
                    ? { ...m, content: fullContent }
                    : m
                );
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
        if (Array.isArray(parsed)) {
          // 提取段落和引用
          const paragraphs = parsed
            .filter(item => item.p)
            .map(item => ({
              text: item.p,
              citations: item.r || [],
            }));

          // 提取追问建议
          const lastItem = parsed[parsed.length - 1];
          const newSuggestions = lastItem?.q || [];

          // 格式化为可显示的内容
          const formattedParts: string[] = [];
          for (const item of paragraphs) {
            let text = item.text;
            // 添加引用链接
            if (item.citations.length > 0) {
              const cites = item.citations
                .map((n: number) => {
                  const heading = headings[n - 1];
                  if (heading) {
                    return `<a href="#${heading.slug}" class="ai-cite-link" onclick="event.preventDefault(); document.getElementById('${heading.slug}')?.scrollIntoView({behavior:'smooth'})">↗${n}</a>`;
                  }
                  return '';
                })
                .filter(Boolean)
                .join('');
              text += cites;
            }
            formattedParts.push(text);
          }
          const formattedContent = formattedParts.join('\n\n');

          // 创建新对象触发响应式更新
          messages = messages.map((m, i) =>
            i === messages.length - 1
              ? { ...m, content: formattedContent, suggestions: newSuggestions }
              : m
          );
        }
      } catch (e) {
        // 如果不是 JSON，保持原始内容
      }
    } catch (error) {
      console.error('Chat error:', error);
      messages = [...messages.slice(0, -1), {
        role: 'assistant',
        content: '抱歉，AI 服务暂时不可用，请稍后再试。',
      }];
    } finally {
      isLoading = false;
    }
  }

  // 处理追问建议点击
  function handleSuggestionClick(suggestion: string) {
    inputValue = suggestion;
    sendMessage();
  }

  // 格式化消息内容（处理 markdown）
  function formatContent(content: string) {
    let html = content;

    // 处理 markdown 格式
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/`(.*?)`/g, '<code class="bg-black/5 dark:bg-white/10 px-1 py-0.5 rounded text-sm">$1</code>');

    // 转换换行符为 <br>
    html = html.replace(/\n/g, '<br>');

    return html;
  }

  onMount(() => {
    getArticleData();

    (window as any).setupAiChat = () => {
      getArticleData();
    };
  });
</script>

{#if aiConfig.chatEnabled}
<div class="ai-chat-container">
  <div class="ai-chat-panel" class:open={isOpen}>
    <div class="ai-chat-header">
      <span class="ai-chat-title">
        <span>🤖</span>
        <span>AI 助手</span>
      </span>
      <button class="ai-chat-close" onclick={() => isOpen = false}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <div class="ai-chat-messages">
      {#if messages.length === 0}
        <div class="text-center text-black/50 dark:text-white/50 py-8">
          <p class="text-sm">👋 你好！</p>
          <p class="text-xs mt-2">我可以帮你解答关于这篇文章的问题</p>
        </div>
      {/if}

      {#each messages as message}
        <div class="ai-message {message.role}">
          {#if message.thinking}
            <div class="ai-thinking">
              <div class="ai-thinking-header">
                <span>💭</span>
                <span>思考中...</span>
              </div>
              <div class="ai-thinking-content">{message.thinking}</div>
            </div>
          {/if}

          <div class="ai-message-content">
            {@html formatContent(message.content)}
          </div>

          {#if message.suggestions && message.suggestions.length > 0}
            <div class="ai-suggestions">
              {#each message.suggestions as suggestion}
                <button class="ai-suggestion-tag" onclick={() => handleSuggestionClick(suggestion)}>
                  {suggestion}
                </button>
              {/each}
            </div>
          {/if}
        </div>
      {/each}

      {#if isLoading}
        <div class="ai-message assistant">
          <div class="ai-message-content">
            <span class="inline-flex items-center gap-2">
              <span class="ai-summary-spinner"></span>
              <span class="text-sm text-black/50 dark:text-white/50">思考中...</span>
            </span>
          </div>
        </div>
      {/if}
    </div>

    <div class="ai-chat-input">
      <input
        type="text"
        bind:value={inputValue}
        placeholder="输入你的问题..."
        onkeydown={(e) => e.key === 'Enter' && sendMessage()}
        disabled={isLoading}
      />
      <button onclick={sendMessage} disabled={isLoading || !inputValue.trim()}>
        发送
      </button>
    </div>
  </div>

  <button class="ai-chat-btn" onclick={() => isOpen = !isOpen}>
    {#if isOpen}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    {:else}
      <span>🤖</span>
    {/if}
  </button>
</div>
{/if}
