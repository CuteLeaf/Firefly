export async function onRequest(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  try {
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code: code,
          redirect_uri: `${url.origin}/callback`,
        }),
      }
    );

    const data = await tokenResponse.json();

    if (data.error) {
      return new Response(
        `Error: ${data.error_description || data.error}`,
        { status: 400 }
      );
    }

    const token = data.access_token;
    if (!token) {
      return new Response("No token received", { status: 500 });
    }

    // 构造返回给 CMS 的消息
    const content = JSON.stringify({ token, provider: "github" });
    const successMsg = `authorization:github:success:${content}`;
    const escapedMsg = successMsg.replace(/"/g, '\\"').replace(/'/g, "\\'");

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>授权完成</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background: #f5f5f5;
    }
    .message {
      text-align: center;
      padding: 40px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .success { color: #52c41a; font-size: 18px; }
    .error { color: #ff4d4f; font-size: 18px; }
  </style>
</head>
<body>
  <div class="message">
    <p class="success" id="status">✅ 授权成功，正在跳转...</p>
  </div>

  <script>
    (function() {
      const opener = window.opener;
      const statusEl = document.getElementById('status');
      
      if (!opener) {
        statusEl.className = 'error';
        statusEl.textContent = '❌ 无法找到主窗口\\n请检查是否被浏览器拦截了弹窗';
        return;
      }

      const successMessage = "${escapedMsg}";
      
      // 发送握手信号
      function sendHandshake() {
        opener.postMessage("authorizing:github", "*");
      }

      // 监听 CMS 的握手回复
      function handleReply(event) {
        if (event.data === "authorizing:github") {
          window.removeEventListener("message", handleReply);
          // 收到回复，发送 token
          opener.postMessage(successMessage, "*");
          statusEl.textContent = '✅ 授权成功，窗口即将关闭';
          setTimeout(() => window.close(), 500);
        }
      }

      window.addEventListener("message", handleReply);

      // 重试机制：最多尝试 5 次握手
      let attempts = 0;
      const maxAttempts = 5;
      
      function tryHandshake() {
        attempts++;
        sendHandshake();
        
        if (attempts < maxAttempts) {
          setTimeout(tryHandshake, 800);
        } else {
          // 降级方案：直接发送 token
          window.removeEventListener("message", handleReply);
          opener.postMessage(successMessage, "*");
          statusEl.textContent = '✅ 授权成功，窗口即将关闭';
          setTimeout(() => window.close(), 500);
        }
      }

      // 页面加载后稍等片刻再开始握手
      setTimeout(tryHandshake, 300);
    })();
  </script>
</body>
</html>`;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return new Response(`Server Error: ${error.message}`, { status: 500 });
  }
}
