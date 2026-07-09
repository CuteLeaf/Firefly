import { base64ToString } from './utils.js';

const API_BASE = 'https://api.github.com';

function encodePath(filePath) {
    return filePath.split('/').map(seg => encodeURIComponent(seg)).join('/');
}

async function gitRequest(owner, repo, branch, method, path, body, token) {
    const headers = {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
    };
    if (body) headers['Content-Type'] = 'application/json';
    const url = `${API_BASE}/repos/${owner}/${repo}/contents/${encodePath(path)}?ref=${branch}`;
    const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
    if (res.status === 401 || res.status === 403) {
        const remaining = res.headers.get('X-RateLimit-Remaining');
        if (remaining === '0') {
            throw new Error('API 速率限制已达上限，请稍后再试。');
        } else {
            throw new Error('Token 已失效，请重新登录');
        }
    }
    return res;
}

export async function getAllPostFiles(owner, repo, branch, basePath, token) {
    // 优先使用 Git Trees API
    const treeSha = `${branch}:${basePath}`;
    const treeUrl = `${API_BASE}/repos/${owner}/${repo}/git/trees/${encodeURIComponent(treeSha)}?recursive=1`;
    const headers = { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' };
    try {
        const res = await fetch(treeUrl, { headers });
        if (res.ok) {
            const data = await res.json();
            const files = (data.tree || []).filter(item => item.type === 'blob' && /\.(md|mdx)$/i.test(item.path));
            return files.map(f => ({
                path: `${basePath}/${f.path}`,
                sha: f.sha,
                name: f.path.split('/').pop()
            }));
        }
    } catch (e) {
        console.warn('Trees API 失败，回退递归', e);
    }
    // 递归获取
    const recursiveGet = async (dirPath) => {
        const res = await gitRequest(owner, repo, branch, 'GET', dirPath, null, token);
        if (!res.ok) return [];
        const items = await res.json();
        if (!Array.isArray(items)) return [];
        let files = [];
        for (const item of items) {
            if (item.type === 'dir') {
                files = files.concat(await recursiveGet(item.path));
            } else if (item.type === 'file' && /\.(md|mdx)$/i.test(item.name)) {
                files.push({ path: item.path, sha: item.sha, name: item.name });
            }
        }
        return files;
    };
    return await recursiveGet(basePath);
}

export async function getFileContent(owner, repo, branch, filePath, token) {
    const res = await gitRequest(owner, repo, branch, 'GET', filePath, null, token);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.content) return null;
    const raw = base64ToString(data.content);
    // 简单解析 frontmatter 获取基础元数据
    const match = raw.match(/^---\n([\s\S]*?)\n---/);
    let title = '', draft = false, description = '', tags = '', category = '', image = '';
    if (match) {
        try {
            const fm = jsyaml.load(match[1]);
            title = fm.title || '';
            draft = fm.draft === true || fm.draft === 'true';
            description = fm.description || '';
            tags = Array.isArray(fm.tags) ? fm.tags.join(', ') : (fm.tags || '');
            category = fm.category || '';
            image = fm.image || '';
        } catch (_) {}
    }
    if (!title) title = filePath.split('/').pop().replace(/\.(md|mdx)$/i, '');
    return { path: filePath, sha: data.sha, content: raw, title, draft, description, tags, category, image };
}

export async function savePost(owner, repo, branch, filePath, base64Content, sha, token) {
    return await gitRequest(owner, repo, branch, 'PUT', filePath, {
        message: `Update: ${filePath}`,
        content: base64Content,
        sha: sha || undefined
    }, token);
}

export async function deletePost(owner, repo, branch, filePath, sha, token) {
    return await gitRequest(owner, repo, branch, 'DELETE', filePath, {
        message: `Delete: ${filePath}`,
        sha
    }, token);
}