// public/admin/links.js
import { stringToBase64, escapeHtml, base64ToString } from './utils.js';

const FRIENDS_PATH = 'public/data/friends.yaml';
const REQUESTS_PATH = 'public/data/friend_requests.yaml';

// ---------- 数据获取 ----------
export async function getFriendRequests(owner, repo, branch, token) {
    try {
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${REQUESTS_PATH}?ref=${branch}`, {
            headers: { Authorization: `token ${token}` }
        });
        if (!res.ok) return { sha: null, data: [] };
        const file = await res.json();
        const content = base64ToString(file.content);
        return { sha: file.sha, data: window.jsyaml.load(content) || [] };
    } catch (err) {
        console.error('获取友链请求失败:', err);
        return { sha: null, data: [] };
    }
}

export async function getFriends(owner, repo, branch, token) {
    try {
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${FRIENDS_PATH}?ref=${branch}`, {
            headers: { Authorization: `token ${token}` }
        });
        if (!res.ok) return { sha: null, data: [] };
        const file = await res.json();
        const content = base64ToString(file.content);
        return { sha: file.sha, data: window.jsyaml.load(content) || [] };
    } catch (err) {
        console.error('获取友链列表失败:', err);
        return { sha: null, data: [] };
    }
}

// ---------- 文件更新（基础） ----------
async function updateFile(owner, repo, branch, path, content, sha, token, message) {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: {
            Authorization: `token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message,
            content: stringToBase64(window.jsyaml.dump(content)),
            branch,
            sha
        })
    });
    return res;
}

// 自动重试一次，解决 409 冲突
async function updateFileWithRetry(owner, repo, branch, path, newContent, initialSha, token, message) {
    let sha = initialSha;
    for (let attempt = 0; attempt < 2; attempt++) {
        const res = await updateFile(owner, repo, branch, path, newContent, sha, token, message);
        if (res.ok) return true;
        if (res.status === 409 && attempt === 0) {
            const getRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`, {
                headers: { Authorization: `token ${token}` }
            });
            if (getRes.ok) {
                const file = await getRes.json();
                sha = file.sha;
                continue;
            }
        }
        const errData = await res.json().catch(() => ({}));
        throw new Error(`GitHub API ${res.status} (${path}): ${errData.message || res.statusText}`);
    }
    return false;
}

// ---------- 审核批准 ----------
export async function approveRequest(owner, repo, branch, token, index) {
    const reqRes = await getFriendRequests(owner, repo, branch, token);
    const friendRes = await getFriends(owner, repo, branch, token);

    const request = reqRes.data[index];
    if (!request) return false;

    const newRequests = reqRes.data.filter((_, i) => i !== index);
    const newFriends = [...friendRes.data, { ...request, enabled: true }];

    try {
        await Promise.all([
            updateFileWithRetry(owner, repo, branch, REQUESTS_PATH, newRequests, reqRes.sha, token, `审核通过: ${request.title}`),
            updateFileWithRetry(owner, repo, branch, FRIENDS_PATH, newFriends, friendRes.sha, token, `新增友链: ${request.title}`)
        ]);

        if (window.NETLIFY_HOOK) {
            try { await fetch(window.NETLIFY_HOOK, { method: 'POST' }); } catch (e) { console.warn('构建钩子失败:', e); }
        }
        return true;
    } catch (e) {
        console.error('批准失败:', e);
        alert('操作失败: ' + e.message);
        return false;
    }
}

// ---------- 审核拒绝 ----------
export async function rejectRequest(owner, repo, branch, token, index) {
    const { sha, data } = await getFriendRequests(owner, repo, branch, token);
    const newData = data.filter((_, i) => i !== index);
    try {
        await updateFileWithRetry(owner, repo, branch, REQUESTS_PATH, newData, sha, token, '拒绝友链申请');
        return true;
    } catch (e) {
        console.error('拒绝失败:', e);
        alert('操作失败: ' + e.message);
        return false;
    }
}

// ---------- 已通过友链的修改与删除 ----------
export async function updateFriend(owner, repo, branch, token, index, updatedData) {
    const { sha, data } = await getFriends(owner, repo, branch, token);
    if (index < 0 || index >= data.length) return false;
    const newData = [...data];
    newData[index] = { ...newData[index], ...updatedData };
    try {
        await updateFileWithRetry(owner, repo, branch, FRIENDS_PATH, newData, sha, token, `更新友链: ${updatedData.title}`);
        if (window.NETLIFY_HOOK) {
            try { await fetch(window.NETLIFY_HOOK, { method: 'POST' }); } catch (e) { console.warn('构建钩子失败:', e); }
        }
        return true;
    } catch (e) {
        console.error('更新失败:', e);
        alert('操作失败: ' + e.message);
        return false;
    }
}

export async function deleteFriend(owner, repo, branch, token, index) {
    const { sha, data } = await getFriends(owner, repo, branch, token);
    if (index < 0 || index >= data.length) return false;
    const newData = data.filter((_, i) => i !== index);
    try {
        await updateFileWithRetry(owner, repo, branch, FRIENDS_PATH, newData, sha, token, '删除友链');
        if (window.NETLIFY_HOOK) {
            try { await fetch(window.NETLIFY_HOOK, { method: 'POST' }); } catch (e) { console.warn('构建钩子失败:', e); }
        }
        return true;
    } catch (e) {
        console.error('删除失败:', e);
        alert('操作失败: ' + e.message);
        return false;
    }
}

// ---------- UI：审核列表（待处理） ----------
export function renderReviewList(container, { owner, repo, branch, token }) {
    container.innerHTML = `
    <div id="review-list" class="space-y-4">
        <div class="text-center text-slate-400 py-8"><span class="loading-spinner mr-2"></span>加载中...</div>
    </div>`;
    loadReviewList(container, owner, repo, branch, token);
}

async function loadReviewList(container, owner, repo, branch, token) {
    const listEl = document.getElementById('review-list');
    const { data: requests } = await getFriendRequests(owner, repo, branch, token);

    if (!requests || requests.length === 0) {
        listEl.innerHTML = '<div class="text-center text-slate-400 py-8">暂无待审核申请</div>';
        return;
    }

    listEl.innerHTML = requests.map((req, i) => `
        <div class="border p-4 rounded-2xl bg-white hover:bg-gray-50">
            <div class="flex items-center gap-3">
                <img src="${escapeHtml(req.imgurl)}" class="w-10 h-10 rounded-full" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 10 10%22><rect width=%2210%22 height=%2210%22 fill=%22%23ddd%22/></svg>'">
                <div>
                    <h3 class="font-semibold">${escapeHtml(req.title)}</h3>
                    <a href="${escapeHtml(req.siteurl)}" target="_blank" class="text-sm text-blue-500">${escapeHtml(req.siteurl)}</a>
                </div>
            </div>
            <p class="mt-2 text-gray-600 text-sm">${escapeHtml(req.desc)}</p>
            ${req.tags?.length ? `<div class="mt-2 flex gap-1 text-xs text-[#4cd9b2]">${req.tags.map(t => `<span>#${escapeHtml(t)}</span>`).join('')}</div>` : ''}
            <div class="mt-3 flex gap-2">
                <button class="approve-btn bg-green-500 text-white px-3 py-1 rounded text-sm" data-index="${i}">批准</button>
                <button class="reject-btn bg-red-500 text-white px-3 py-1 rounded text-sm" data-index="${i}">拒绝</button>
            </div>
        </div>
    `).join('');

    listEl.querySelectorAll('.approve-btn').forEach(btn => {
        btn.onclick = async () => {
            const idx = parseInt(btn.dataset.index);
            if (!confirm('确认批准该友链？')) return;
            btn.disabled = true;
            btn.textContent = '处理中...';
            const ok = await approveRequest(owner, repo, branch, token, idx);
            if (ok) {
                alert('已批准，站点即将更新');
                loadReviewList(container, owner, repo, branch, token);
            } else {
                btn.disabled = false;
                btn.textContent = '批准';
            }
        };
    });

    listEl.querySelectorAll('.reject-btn').forEach(btn => {
        btn.onclick = async () => {
            const idx = parseInt(btn.dataset.index);
            if (!confirm('确认拒绝该申请？')) return;
            btn.disabled = true;
            btn.textContent = '处理中...';
            const ok = await rejectRequest(owner, repo, branch, token, idx);
            if (ok) {
                alert('已拒绝');
                loadReviewList(container, owner, repo, branch, token);
            } else {
                btn.disabled = false;
                btn.textContent = '拒绝';
            }
        };
    });
}

// ---------- UI：已通过友链列表（查看、编辑、删除） ----------
export function renderFriendsList(container, { owner, repo, branch, token }) {
    container.innerHTML = `
    <div id="approved-friends-list" class="space-y-4 mt-8">
        <h3 class="text-lg font-bold border-b pb-2 mb-4">已通过友链</h3>
        <div id="friends-list-content" class="space-y-4">
            <div class="text-center text-slate-400 py-8"><span class="loading-spinner mr-2"></span>加载中...</div>
        </div>
    </div>`;
    loadFriendsList(container, owner, repo, branch, token);
}

async function loadFriendsList(container, owner, repo, branch, token) {
    const contentEl = document.getElementById('friends-list-content');
    const { data: friends } = await getFriends(owner, repo, branch, token);

    if (!friends || friends.length === 0) {
        contentEl.innerHTML = '<div class="text-center text-slate-400 py-8">暂无已通过的友链</div>';
        return;
    }

    contentEl.innerHTML = friends.map((friend, i) => `
        <div class="friend-item border p-4 rounded-2xl bg-white hover:bg-gray-50 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <img src="${escapeHtml(friend.imgurl)}" class="w-10 h-10 rounded-full" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 10 10%22><rect width=%2210%22 height=%2210%22 fill=%22%23ddd%22/></svg>'">
                <div>
                    <h3 class="font-semibold">${escapeHtml(friend.title)}</h3>
                    <a href="${escapeHtml(friend.siteurl)}" target="_blank" class="text-sm text-blue-500">${escapeHtml(friend.siteurl)}</a>
                </div>
            </div>
            <div class="flex gap-2 text-sm">
                <button class="edit-friend-btn bg-yellow-400 text-white px-3 py-1 rounded" data-index="${i}">编辑</button>
                <button class="delete-friend-btn bg-red-500 text-white px-3 py-1 rounded" data-index="${i}">删除</button>
            </div>
        </div>
    `).join('');

    // 绑定编辑按钮
    contentEl.querySelectorAll('.edit-friend-btn').forEach(btn => {
        btn.onclick = () => {
            const idx = parseInt(btn.dataset.index);
            showEditModal(friends[idx], idx, owner, repo, branch, token, () => {
                loadFriendsList(container, owner, repo, branch, token);
            });
        };
    });

    // 绑定删除按钮
    contentEl.querySelectorAll('.delete-friend-btn').forEach(btn => {
        btn.onclick = async () => {
            const idx = parseInt(btn.dataset.index);
            if (!confirm(`确定要删除友链“${friends[idx].title}”吗？`)) return;
            btn.disabled = true;
            btn.textContent = '删除中...';
            const ok = await deleteFriend(owner, repo, branch, token, idx);
            if (ok) {
                alert('已删除');
                loadFriendsList(container, owner, repo, branch, token);
            } else {
                btn.disabled = false;
                btn.textContent = '删除';
            }
        };
    });
}

// 编辑友链的模态框
function showEditModal(friend, index, owner, repo, branch, token, onSuccess) {
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h3 class="text-lg font-bold mb-4">编辑友链</h3>
            <form id="edit-friend-form" class="space-y-3">
                <div>
                    <label class="text-xs font-medium text-slate-500 block mb-1">标题</label>
                    <input id="edit-title" type="text" value="${escapeHtml(friend.title)}" class="w-full bg-gray-50 border rounded-lg px-3 py-2 text-sm">
                </div>
                <div>
                    <label class="text-xs font-medium text-slate-500 block mb-1">网址</label>
                    <input id="edit-url" type="url" value="${escapeHtml(friend.siteurl)}" class="w-full bg-gray-50 border rounded-lg px-3 py-2 text-sm">
                </div>
                <div>
                    <label class="text-xs font-medium text-slate-500 block mb-1">头像</label>
                    <input id="edit-img" type="url" value="${escapeHtml(friend.imgurl)}" class="w-full bg-gray-50 border rounded-lg px-3 py-2 text-sm">
                </div>
                <div>
                    <label class="text-xs font-medium text-slate-500 block mb-1">描述</label>
                    <textarea id="edit-desc" rows="2" class="w-full bg-gray-50 border rounded-lg px-3 py-2 text-sm">${escapeHtml(friend.desc)}</textarea>
                </div>
                <div>
                    <label class="text-xs font-medium text-slate-500 block mb-1">标签（逗号分隔）</label>
                    <input id="edit-tags" type="text" value="${escapeHtml((friend.tags || []).join(', '))}" class="w-full bg-gray-50 border rounded-lg px-3 py-2 text-sm">
                </div>
                <div class="flex justify-end gap-2 mt-4">
                    <button type="button" id="cancel-edit-btn" class="px-4 py-2 rounded-lg border text-sm">取消</button>
                    <button type="submit" class="bg-[#4cd9b2] text-white px-4 py-2 rounded-lg text-sm">保存</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    const form = document.getElementById('edit-friend-form');
    const cancelBtn = document.getElementById('cancel-edit-btn');

    const closeModal = () => modal.remove();

    cancelBtn.onclick = closeModal;
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    form.onsubmit = async (e) => {
        e.preventDefault();
        const title = document.getElementById('edit-title').value.trim();
        const siteurl = document.getElementById('edit-url').value.trim();
        const imgurl = document.getElementById('edit-img').value.trim();
        const desc = document.getElementById('edit-desc').value.trim();
        const tagsStr = document.getElementById('edit-tags').value.trim();
        const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];

        if (!title || !siteurl || !imgurl || !desc) {
            alert('请填写所有必填项');
            return;
        }

        const updatedData = { title, siteurl, imgurl, desc, tags, weight: friend.weight || 0 };
        const ok = await updateFriend(owner, repo, branch, token, index, updatedData);
        if (ok) {
            alert('友链已更新');
            closeModal();
            onSuccess();
        }
    };
}
