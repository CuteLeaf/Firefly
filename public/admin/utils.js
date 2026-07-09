// utils.js
// Base64 编解码
export function stringToBase64(str) {
    return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
}

export function base64ToString(b64) {
    return new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, '')), c => c.charCodeAt(0)));
}

// HTML 转义
export function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// 解析 frontmatter（返回完整元数据对象）
export function parseFrontmatter(raw) {
    const match = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return { title: '', draft: false };
    try {
        const fm = jsyaml.load(match[1]);
        return {
            title: fm.title || '',
            draft: fm.draft === true || fm.draft === 'true',
            description: fm.description || '',
            tags: fm.tags || '',
            category: fm.category || '',
            image: fm.image || '',
            // 保留所有其他字段
            ...fm
        };
    } catch {
        return { title: '', draft: false };
    }
}

// 构建完整的 frontmatter + 正文 - 保留所有原有字段
export function buildFrontmatter(content, title, isDraft, desc, tagsStr, category, image, existingFrontmatter = {}) {
    // 从现有 frontmatter 中提取所有字段
    const {
        published,
        pinned,
        updated,
        lang,
        author,
        slug,
        comment,
        password,
        passwordHint,
        licenseName,
        licenseUrl,
        sourceLink,
        ...otherFields  // 捕获任何其他未列出的字段
    } = existingFrontmatter;

    // 使用现有的 published，如果没有则用今天
    const pubDate = published || new Date().toISOString().slice(0, 10);
    const draftStr = isDraft ? 'true' : 'false';
    
    let body = content;
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (fmMatch) {
        body = content.substring(fmMatch[0].length);
    }
    
    let tagsYaml = '';
    if (tagsStr) {
        const tagsArray = tagsStr.split(/[,，]/).map(t => t.trim()).filter(Boolean);
        if (tagsArray.length > 0) {
            tagsYaml = `[${tagsArray.join(', ')}]`;
        }
    }
    
    let fm = `---\ntitle: ${title || '未命名文章'}\npublished: ${pubDate}\ndraft: ${draftStr}`;
    
    // 保留 pinned
    if (pinned !== undefined) fm += `\npinned: ${pinned}`;
    
    // 保留 updated
    if (updated) fm += `\nupdated: ${updated}`;
    
    if (desc) fm += `\ndescription: ${desc}`;
    if (tagsYaml) fm += `\ntags: ${tagsYaml}`;
    if (category) fm += `\ncategory: ${category}`;
    if (image) fm += `\nimage: ${image}`;
    
    // 保留语言
    if (lang) fm += `\nlang: ${lang}`;
    // 保留作者
    if (author) fm += `\nauthor: ${author}`;
    // 保留 slug
    if (slug) fm += `\nslug: ${slug}`;
    // 保留评论开关
    if (comment !== undefined) fm += `\ncomment: ${comment}`;
    // 保留密码
    if (password) fm += `\npassword: ${password}`;
    if (passwordHint) fm += `\npasswordHint: ${passwordHint}`;
    // 保留许可证
    if (licenseName) fm += `\nlicenseName: ${licenseName}`;
    if (licenseUrl) fm += `\nlicenseUrl: ${licenseUrl}`;
    // 保留来源链接
    if (sourceLink) fm += `\nsourceLink: ${sourceLink}`;
    
    // 保留任何其他未列出的字段
    for (const [key, value] of Object.entries(otherFields)) {
        // 跳过 undefined 和 null
        if (value === undefined || value === null) continue;
        // 如果是对象或数组，用 JSON 序列化
        if (typeof value === 'object') {
            fm += `\n${key}: ${JSON.stringify(value)}`;
        } else {
            fm += `\n${key}: ${value}`;
        }
    }
    
    fm += `\n---\n${body}`;
    return fm;
}