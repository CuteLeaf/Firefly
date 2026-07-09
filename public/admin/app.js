// public/admin/app.js
import { getAllPostFiles, getFileContent, savePost, deletePost } from './api.js';
import { stringToBase64, parseFrontmatter, buildFrontmatter, escapeHtml } from './utils.js';
import { renderReviewList, renderFriendsList } from './links.js';

const AUTH_ENDPOINT = '/auth';
const CONFIG_ENDPOINT = '/admin/config.yml';

let GITHUB_OWNER = '';
let GITHUB_REPO = '';
let GITHUB_BRANCH = 'master';
let POSTS_BASE_PATH = 'src/content/posts';
let accessToken = localStorage.getItem('github_token') || '';

// ============================================
// 所有函数定义
// ============================================

function logout() {
    localStorage.removeItem('github_token');
    accessToken = '';
    window.location.hash = '#/login';
    updateNav();
    renderLogin();
}

async function loginWithGithub() {
    const popup = window.open(AUTH_ENDPOINT, '_blank', 'width=800,height=600');
    if (!popup || popup.closed) {
        window.location.href = AUTH_ENDPOINT;
        return;
    }
    let resolved = false;
    const cleanup = () => {
        window.removeEventListener('message', handler);
        window.removeEventListener('storage', storageHandler);
        clearInterval(timer);
    };
    const handler = (e) => {
        if (e.origin !== window.location.origin) return;
        if (typeof e.data === 'string' && e.data.startsWith('authorization:github:success:')) {
            try {
                const data = JSON.parse(e.data.replace('authorization:github:success:', ''));
                accessToken = data.token;
                localStorage.setItem('github_token', accessToken);
                resolved = true;
                cleanup();
                initApp();
            } catch (_) {}
        }
    };
    const storageHandler = (e) => {
        if (e.key === 'oauth_token_received' && e.newValue) {
            accessToken = e.newValue;
            localStorage.setItem('github_token', accessToken);
            resolved = true;
            cleanup();
            initApp();
        }
    };
    const timer = setInterval(() => {
        if (popup.closed && !resolved) cleanup();
    }, 500);
    window.addEventListener('message', handler);
    window.addEventListener('storage', storageHandler);
    setTimeout(() => {
        if (!resolved) cleanup();
    }, 60000);
}

async function loadConfig() {
    const res = await fetch(CONFIG_ENDPOINT);
    if (!res.ok) throw new Error('无法获取配置文件');
    const yamlText = await res.text();
    const config = jsyaml.load(yamlText);
    const repoFull = config.backend?.repo || config.repo;
    if (!repoFull) throw new Error('配置中缺少 repo');
    const [owner, repoName] = repoFull.split('/');
    const branch = config.backend?.branch || config.branch || 'master';
    let folder = 'src/content/posts';
    if (config.collections?.length) {
        const col = config.collections.find(c => c.folder);
        if (col) folder = col.folder;
    }
    return { owner, repo: repoName, branch, folder };
}

function updateNav() {
    const loginBtn = document.getElementById('login-btn');
    const userInfo = document.getElementById('user-info');
    if (accessToken) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (userInfo) {
            userInfo.innerHTML = '✅ 已授权 <button id="logout-link" class="text-xs text-gray-400 hover:text-red-400 underline ml-2">退出</button>';
            const logoutLink = document.getElementById('logout-link');
            if (logoutLink) logoutLink.addEventListener('click', logout);
        }
    } else {
        if (loginBtn) loginBtn.style.display = '';
        if (userInfo) userInfo.textContent = '';
    }
}

const mainView = document.getElementById('main-view');

function renderLogin() {
    if (!mainView) return;
    mainView.innerHTML = `
    <div class="hero-bg pt-20 pb-12 px-6 text-center text-white">
        <h1 class="text-5xl font-bold mb-4 drop-shadow-lg">管理控制台</h1>
        <p class="text-gray-300 text-sm">请登录 GitHub 以管理文章和友链</p>
    </div>
    <div class="max-w-md mx-auto mt-10 bg-white p-10 rounded-3xl shadow-xl text-center">
        <i class="fas fa-lock text-4xl text-[#4cd9b2] mb-4"></i>
        <h2 class="text-xl font-bold text-slate-800 mb-2">需要认证</h2>
        <p class="text-slate-500 text-sm mb-6">点击上方按钮登录 GitHub 账号。</p>
    </div>`;
}

async function renderPostList() {
    if (!mainView) return;
    mainView.innerHTML = `
    <div class="hero-bg pt-20 pb-12 px-6 text-center text-white">
        <h1 class="text-5xl font-bold mb-4">文章管理</h1>
    </div>
    <div class="max-w-7xl mx-auto -mt-10 px-4 pb-10">
        <div class="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
            <div class="flex justify-between items-center border-b border-gray-100 pb-4">
                <span class="px-4 py-1.5 bg-[#4cd9b2] text-white rounded-full text-sm font-medium" id="post-count">全部 (0)</span>
                <div class="flex gap-2">
                    <button id="new-post-btn" class="bg-[#4cd9b2] hover:bg-[#3ccba4] text-white px-4 py-2 rounded-xl text-sm"><i class="fas fa-plus"></i> 新建</button>
                    <button id="refresh-btn" class="bg-gray-100 hover:bg-gray-200 text-slate-600 px-4 py-2 rounded-xl text-sm"><i class="fas fa-sync-alt"></i> 刷新</button>
                </div>
            </div>
            <div id="post-list" class="mt-4 space-y-3">
                <div class="text-center text-slate-400 py-8"><span class="loading-spinner mr-2"></span>加载中...</div>
            </div>
        </div>
    </div>`;

    const newBtn = document.getElementById('new-post-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    if (newBtn) newBtn.onclick = () => window.location.hash = '#/new';
    if (refreshBtn) refreshBtn.onclick = loadPostList;
    await loadPostList();
}

async function loadPostList() {
    const listEl = document.getElementById('post-list');
    const countEl = document.getElementById('post-count');
    if (!listEl) return;
    try {
        const files = await getAllPostFiles(GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH, POSTS_BASE_PATH, accessToken);
        if (countEl) countEl.textContent = `全部 (${files.length})`;
        if (files.length === 0) {
            listEl.innerHTML = '<div class="text-center text-slate-400 py-8">暂无文章，点击"新建"开始</div>';
            return;
        }
        const items = await Promise.allSettled(files.map(f =>
            getFileContent(GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH, f.path, accessToken)
        ));
        const posts = [];
        items.forEach((res, i) => {
            if (res.status === 'fulfilled' && res.value) posts.push(res.value);
            else posts.push({ path: files[i].path, title: files[i].name.replace(/\.(md|mdx)$/i, ''), draft: false });
        });
        posts.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
        let html = '';
        posts.forEach((post, idx) => {
            const badge = post.draft
                ? '<span class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">草稿</span>'
                : '<span class="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">已发布</span>';
            html += `
            <div class="post-item flex items-center gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-transparent hover:border-[#4cd9b2]/30 cursor-pointer" data-path="${escapeHtml(post.path)}">
                <span class="text-xs text-slate-300 font-mono">#${idx+1}</span>
                ${badge}
                <span class="font-semibold text-slate-700 flex-1">${escapeHtml(post.title)}</span>
                <span class="text-xs text-slate-400 font-mono hidden sm:inline">${escapeHtml(post.path.split('/').pop())}</span>
            </div>`;
        });
        listEl.innerHTML = html;
        listEl.querySelectorAll('.post-item').forEach(el => {
            el.onclick = () => window.location.hash = `#/edit/${encodeURIComponent(el.dataset.path)}`;
        });
    } catch (err) {
        listEl.innerHTML = `<div class="text-center text-red-400 py-8"><i class="fas fa-exclamation-triangle"></i> 加载失败: ${err.message}</div>`;
    }
}

async function renderEditor(path = null) {
    if (!mainView) return;
    const isNew = !path;
    mainView.innerHTML = `
    <div class="hero-bg pt-20 pb-12 px-6 text-center text-white">
        <h1 class="text-5xl font-bold mb-4">${isNew ? '新建文章' : '编辑文章'}</h1>
    </div>
    <div class="max-w-7xl mx-auto -mt-10 px-4 pb-10">
        <div class="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
            <div class="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <button id="back-btn" class="text-slate-500 hover:text-[#4cd9b2]"><i class="fas fa-arrow-left"></i> 返回列表</button>
                <h3 class="font-bold text-lg"><i class="fas fa-pen-fancy text-[#4cd9b2]"></i> ${isNew ? '新建' : '编辑'}</h3>
                <div></div>
            </div>
            <form id="editor-form" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="text-xs font-medium text-slate-500 block mb-1">标题 <span class="text-red-400">*</span></label>
                        <input id="input-title" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#4cd9b2]">
                    </div>
                    <div>
                        <label class="text-xs font-medium text-slate-500 block mb-1">文件路径 <span class="text-red-400">*</span></label>
                        <input id="input-path" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono outline-none focus:ring-2 focus:ring-[#4cd9b2]">
                        <input id="input-sha" type="hidden">
                    </div>
                </div>
                <div>
                    <label class="text-xs font-medium text-slate-500 block mb-1">描述</label>
                    <input id="input-desc" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#4cd9b2]">
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="text-xs font-medium text-slate-500 block mb-1">标签 (逗号分隔)</label>
                        <input id="input-tags" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#4cd9b2]">
                    </div>
                    <div>
                        <label class="text-xs font-medium text-slate-500 block mb-1">分类</label>
                        <input id="input-category" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#4cd9b2]">
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="text-xs font-medium text-slate-500 block mb-1">封面图片</label>
                        <input id="input-image" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono outline-none focus:ring-2 focus:ring-[#4cd9b2]">
                    </div>
                    <div>
                        <label class="text-xs font-medium text-slate-500 block mb-2">状态</label>
                        <div class="flex items-center gap-4">
                            <label class="flex items-center gap-1 cursor-pointer"><input type="radio" name="draft" value="false" checked> 已发布</label>
                            <label class="flex items-center gap-1 cursor-pointer"><input type="radio" name="draft" value="true"> 草稿</label>
                        </div>
                    </div>
                </div>
                <div>
                    <label class="text-xs font-medium text-slate-500 block mb-1">正文 (Markdown)</label>
                    <textarea id="input-content" rows="15" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4cd9b2] resize-none font-mono"></textarea>
                </div>
                <div class="flex gap-2 pt-2">
                    <button type="button" id="save-btn" class="flex-1 bg-[#4cd9b2] hover:bg-[#3ccba4] text-white py-2.5 rounded-xl text-sm font-medium"><i class="fas fa-save"></i> 保存</button>
                    <button type="button" id="delete-btn" class="flex-1 bg-red-50 hover:bg-red-100 text-red-500 py-2.5 rounded-xl text-sm border border-red-200 disabled:opacity-50" ${isNew ? 'disabled' : ''}><i class="fas fa-trash-alt"></i> 删除</button>
                </div>
            </form>
        </div>
    </div>`;

    const textarea = document.getElementById('input-content');
    if (!textarea) return;
    
    const simplemde = new SimpleMDE({
        element: textarea,
        spellChecker: false,
        status: ['lines', 'words'],
        toolbar: ['bold', 'italic', 'heading', '|', 'quote', 'unordered-list', 'ordered-list', '|', 'link', 'image', 'code', 'table', '|', 'preview', 'side-by-side', 'fullscreen', '|', 'guide'],
    });

    const backBtn = document.getElementById('back-btn');
    if (backBtn) backBtn.onclick = () => window.location.hash = '#/posts';

    if (!isNew) {
        const post = await getFileContent(GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH, decodeURIComponent(path), accessToken);
        if (!post) { alert('文章加载失败'); window.location.hash = '#/posts'; return; }
        const titleInput = document.getElementById('input-title');
        const pathInput = document.getElementById('input-path');
        const shaInput = document.getElementById('input-sha');
        const descInput = document.getElementById('input-desc');
        const tagsInput = document.getElementById('input-tags');
        const categoryInput = document.getElementById('input-category');
        const imageInput = document.getElementById('input-image');
        if (titleInput) titleInput.value = post.title;
        if (pathInput) pathInput.value = post.path;
        if (shaInput) shaInput.value = post.sha;
        if (descInput) descInput.value = post.description;
        if (tagsInput) tagsInput.value = post.tags;
        if (categoryInput) categoryInput.value = post.category;
        if (imageInput) imageInput.value = post.image;
        const draftRadio = document.querySelector(`input[name="draft"][value="${post.draft}"]`);
        if (draftRadio) draftRadio.checked = true;
        simplemde.value(post.content);
    } else {
        const today = new Date().toISOString().slice(0, 10);
        const pathInput = document.getElementById('input-path');
        const titleInput = document.getElementById('input-title');
        if (pathInput) pathInput.value = `${POSTS_BASE_PATH}/${today}-new-post.md`;
        if (titleInput) titleInput.value = '新文章';
        simplemde.value(`---\ntitle: 新文章\npublished: ${today}\ndraft: false\n---\n\n开始写作...`);
    }

    // ===== 保存按钮 =====
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        saveBtn.onclick = async () => {
            const titleInput = document.getElementById('input-title');
            const pathInput = document.getElementById('input-path');
            const shaInput = document.getElementById('input-sha');
            const descInput = document.getElementById('input-desc');
            const tagsInput = document.getElementById('input-tags');
            const categoryInput = document.getElementById('input-category');
            const imageInput = document.getElementById('input-image');
            
            const title = titleInput ? titleInput.value.trim() : '';
            const filePath = pathInput ? pathInput.value.trim() : '';
            const sha = shaInput ? shaInput.value : '';
            const desc = descInput ? descInput.value.trim() : '';
            const tags = tagsInput ? tagsInput.value.trim() : '';
            const category = categoryInput ? categoryInput.value.trim() : '';
            const image = imageInput ? imageInput.value.trim() : '';
            
            const draftRadio = document.querySelector('input[name="draft"]:checked');
            const isDraft = draftRadio ? draftRadio.value === 'true' : false;
            const content = simplemde.value();

            if (!filePath) { alert('请填写文件路径'); return; }
            if (!filePath.startsWith(POSTS_BASE_PATH)) { alert(`路径必须在 ${POSTS_BASE_PATH} 下`); return; }
            if (!/\.(md|mdx)$/i.test(filePath)) { alert('文件扩展名必须是 .md 或 .mdx'); return; }

            let existingFrontmatter = {};
            const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
            if (fmMatch) {
                try {
                    existingFrontmatter = jsyaml.load(fmMatch[1]);
                } catch (_) {}
            }

            const finalContent = buildFrontmatter(
                content, 
                title, 
                isDraft, 
                desc, 
                tags, 
                category, 
                image,
                existingFrontmatter
            );
            
            const base64Content = stringToBase64(finalContent);
            const res = await savePost(GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH, filePath, base64Content, sha, accessToken);
            if (res.ok) {
                alert('保存成功');
                window.location.hash = '#/posts';
            } else {
                const err = await res.json().catch(() => ({}));
                alert('保存失败: ' + err.message);
            }
        };
    }

    // ===== 删除按钮 =====
    const deleteBtn = document.getElementById('delete-btn');
    if (deleteBtn) {
        deleteBtn.onclick = async () => {
            const pathInput = document.getElementById('input-path');
            const shaInput = document.getElementById('input-sha');
            const filePath = pathInput ? pathInput.value.trim() : '';
            const sha = shaInput ? shaInput.value : '';
            if (!filePath || !sha) return;
            if (!confirm(`确定要删除 ${filePath} 吗？此操作不可撤销。`)) return;
            const res = await deletePost(GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH, filePath, sha, accessToken);
            if (res.ok) {
                alert('文章已删除');
                window.location.hash = '#/posts';
            } else {
                const err = await res.json().catch(() => ({}));
                alert('删除失败: ' + err.message);
            }
        };
    }
}

function renderFriendsView() {
    if (!mainView) return;
    mainView.innerHTML = `
    <div class="hero-bg pt-20 pb-12 px-6 text-center text-white">
        <h1 class="text-5xl font-bold mb-4 drop-shadow-lg">友链审核</h1>
        <p class="text-gray-300 text-sm">管理待处理的申请 & 已通过的友链</p>
    </div>
    <div class="max-w-7xl mx-auto -mt-10 px-4 pb-10">
        <div class="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
            <section>
                <h2 class="text-lg font-bold border-b pb-2 mb-4">待审核申请</h2>
                <div id="friends-review-container"></div>
            </section>
            <section id="approved-section" class="mt-8">
                <div id="friends-approved-container"></div>
            </section>
        </div>
    </div>`;

    const reviewContainer = document.getElementById('friends-review-container');
    const approvedContainer = document.getElementById('friends-approved-container');
    if (reviewContainer) {
        renderReviewList(reviewContainer, {
            owner: GITHUB_OWNER, repo: GITHUB_REPO, branch: GITHUB_BRANCH, token: accessToken
        });
    }
    if (approvedContainer) {
        renderFriendsList(approvedContainer, {
            owner: GITHUB_OWNER, repo: GITHUB_REPO, branch: GITHUB_BRANCH, token: accessToken
        });
    }
}

function handleRoute() {
    if (!accessToken) { updateNav(); renderLogin(); return; }
    updateNav();
    const hash = window.location.hash.slice(1) || '/';
    if (hash === '/friends') renderFriendsView();
    else if (hash.startsWith('/edit/')) renderEditor(hash.replace('/edit/', ''));
    else if (hash === '/new') renderEditor();
    else renderPostList();
}

async function initApp() {
    if (!accessToken) { handleRoute(); return; }
    try {
        const cfg = await loadConfig();
        GITHUB_OWNER = cfg.owner;
        GITHUB_REPO = cfg.repo;
        GITHUB_BRANCH = cfg.branch;
        POSTS_BASE_PATH = cfg.folder;
        handleRoute();
    } catch (e) {
        console.error(e);
        alert('仓库配置加载失败，请检查 admin/config.yml');
        logout();
    }
}

// ============================================
// 等待 DOM 加载完成后启动
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', loginWithGithub);
    }
    
    window.addEventListener('hashchange', handleRoute);

    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
        accessToken = tokenFromUrl;
        localStorage.setItem('github_token', tokenFromUrl);
        history.replaceState({}, document.title, location.pathname);
    }
    
    initApp();
});