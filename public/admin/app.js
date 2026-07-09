document.getElementById('save-btn').onclick = async () => {
    const title = document.getElementById('input-title').value.trim();
    const filePath = document.getElementById('input-path').value.trim();
    const sha = document.getElementById('input-sha').value;
    const desc = document.getElementById('input-desc').value.trim();
    const tags = document.getElementById('input-tags').value.trim();
    const category = document.getElementById('input-category').value.trim();
    const image = document.getElementById('input-image').value.trim();
    const isDraft = document.querySelector('input[name="draft"]:checked').value === 'true';
    const content = simplemde.value();

    if (!filePath) { alert('请填写文件路径'); return; }
    if (!filePath.startsWith(POSTS_BASE_PATH)) { alert(`路径必须在 ${POSTS_BASE_PATH} 下`); return; }
    if (!/\.(md|mdx)$/i.test(filePath)) { alert('文件扩展名必须是 .md 或 .mdx'); return; }

    // ===== 关键修改：读取原有 frontmatter 中的所有字段 =====
    let existingFrontmatter = {};
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (fmMatch) {
        try {
            existingFrontmatter = jsyaml.load(fmMatch[1]);
        } catch (_) {}
    }

    // 传入现有 frontmatter
    const finalContent = buildFrontmatter(
        content, 
        title, 
        isDraft, 
        desc, 
        tags, 
        category, 
        image,
        existingFrontmatter  // ← 新增参数
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