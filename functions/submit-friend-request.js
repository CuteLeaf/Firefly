import yaml from 'js-yaml';

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const friendData = await request.json();

    const GITHUB_TOKEN = env.GITHUB_TOKEN;
    const REPO_OWNER = env.REPO_OWNER || 'jeio258';
    const REPO_NAME = env.REPO_NAME || 'Firefly';
    const BRANCH = env.BRANCH || 'master';
    const REQUESTS_PATH = 'public/data/friend_requests.yaml';

    if (!GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN is not configured');
    }

    // 1. 获取现有文件
    const getUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${REQUESTS_PATH}?ref=${BRANCH}`;
    const getRes = await fetch(getUrl, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'User-Agent': 'Cloudflare Worker'
      }
    });

    let sha = null;
    let currentData = [];

    if (getRes.ok) {
      const file = await getRes.json();
      sha = file.sha;
      const yamlText = base64DecodeUTF8(file.content);
      // 使用 yaml.load 解析
      currentData = yaml.load(yamlText) || [];
    } else if (getRes.status !== 404) {
      const errorText = await getRes.text();
      throw new Error(`GitHub API error ${getRes.status}: ${errorText}`);
    }

    // 2. 追加新申请
    const newData = [...currentData, { ...friendData, enabled: true }];
    // 使用 yaml.dump 序列化
    const yamlStr = yaml.dump(newData);
    const base64Content = base64EncodeUTF8(yamlStr);

    // 3. 写回 GitHub
    const putUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${REQUESTS_PATH}`;
    const putRes = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Cloudflare Worker'
      },
      body: JSON.stringify({
        message: `友链申请: ${friendData.title}`,
        content: base64Content,
        branch: BRANCH,
        sha: sha || undefined
      })
    });

    if (putRes.ok) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      const err = await putRes.json();
      throw new Error(`GitHub PUT error: ${err.message}`);
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// ---------- UTF-8 安全的 Base64 编解码 ----------
function base64EncodeUTF8(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64DecodeUTF8(base64Str) {
  const binaryStr = atob(base64Str);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}
