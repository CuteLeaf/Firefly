// functions/submit-friend-request.js
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
      const yamlText = base64DecodeUTF8(file.content);   // ✅ 修复：UTF-8 解码
      currentData = parseYamlArray(yamlText);
    } else if (getRes.status !== 404) {
      const errorText = await getRes.text();
      throw new Error(`GitHub API error ${getRes.status}: ${errorText}`);
    }

    // 2. 追加新申请
    const newData = [...currentData, { ...friendData, enabled: true }];
    const yamlStr = dumpYamlArray(newData);
    const base64Content = base64EncodeUTF8(yamlStr);     // ✅ 修复：UTF-8 编码

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

// ---------- 简易 YAML 数组处理 ----------
function parseYamlArray(yamlText) {
  if (!yamlText || yamlText.trim() === '') return [];
  const lines = yamlText.split('\n');
  const items = [];
  let currentItem = {};
  let inItem = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '' || trimmed.startsWith('#')) continue;

    if (trimmed.startsWith('- ')) {
      if (inItem) items.push(currentItem);
      currentItem = {};
      inItem = true;
      const kv = trimmed.substring(2).split(': ');
      if (kv.length === 2) {
        currentItem[kv[0]] = parseYamlValue(kv[1]);
      }
    } else if (inItem && trimmed.includes(': ')) {
      const kv = trimmed.split(': ');
      if (kv.length === 2) {
        currentItem[kv[0].trim()] = parseYamlValue(kv.slice(1).join(': '));
      }
    }
  }
  if (inItem) items.push(currentItem);
  return items;
}

function parseYamlValue(value) {
  value = value.trim();
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (!isNaN(value) && value !== '') return Number(value);
  if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
    return value.slice(1, -1);
  }
  if (value.startsWith('[') && value.endsWith(']')) {
    return value.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''));
  }
  return value;
}

function dumpYamlArray(data) {
  if (!Array.isArray(data)) return '';
  return data.map(item => {
    let lines = ['- title: ' + (item.title || '')];
    if (item.siteurl) lines.push('  siteurl: ' + item.siteurl);
    if (item.imgurl) lines.push('  imgurl: ' + item.imgurl);
    if (item.desc) lines.push('  desc: ' + (item.desc || ''));
    if (item.tags && Array.isArray(item.tags)) lines.push('  tags: [' + item.tags.join(', ') + ']');
    if (item.weight !== undefined) lines.push('  weight: ' + item.weight);
    if (item.enabled !== undefined) lines.push('  enabled: ' + item.enabled);
    return lines.join('\n');
  }).join('\n') + '\n';
}
