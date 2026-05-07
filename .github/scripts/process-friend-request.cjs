const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { URL } = require('node:url');
const { chromium } = require('playwright');

const FRIENDS_CONFIG_RELATIVE_PATH = 'src/config/friendsConfig.ts';

// 站点信息 - 请根据你的实际站点信息修改
const SITE_INFO = {
	name: 'MmzMing',
	url: 'https://tblog.mmzhiku.xyz',
	avatar: 'https://tblog.mmzhiku.xyz/favicon/MyLogo.ico',
	desc: 'MmzMing的博客',
};

const DEFAULT_TAG = 'Blog';

function normalizeUrl(value) {
	if (!value) return '';
	try {
		return new URL(value.trim()).toString();
	} catch {
		return '';
	}
}

function trimTrailingSlash(value) {
	return value.replace(/\/$/, '');
}

function escapeString(value) {
	return String(value ?? '')
		.replace(/\\/g, '\\\\')
		.replace(/"/g, '\\"');
}

function parseIssueBody(body) {
	const data = {
		site_name: '',
		site_url: '',
		friend_page_url: '',
		site_desc: '',
		site_avatar: '',
		site_tag: DEFAULT_TAG,
	};

	const lines = body.split(/\r?\n/).map((line) => line.trim());
	let pendingField = null;

	const assignField = (field, value) => {
		if (!value) return;
		const trimmed = value.trim();
		if (!trimmed) return;
		switch (field) {
			case 'site_name':
				data.site_name = trimmed;
				break;
			case 'site_url':
				data.site_url = normalizeUrl(trimmed);
				break;
			case 'friend_page_url':
				data.friend_page_url = normalizeUrl(trimmed);
				break;
			case 'site_desc':
				data.site_desc = trimmed;
				break;
			case 'site_avatar':
				data.site_avatar = normalizeUrl(trimmed);
				break;
			case 'site_tag':
				data.site_tag = trimmed || DEFAULT_TAG;
				break;
		}
	};

	for (const line of lines) {
		if (!line) continue;

		// 匹配现有 Issue 模板的字段标题
		if (/^#+\s*(网站名称|名称|站点名称)/.test(line)) {
			pendingField = 'site_name';
			continue;
		}
		if (/^#+\s*(网站链接|站点链接|链接|网址|地址)/.test(line)) {
			pendingField = 'site_url';
			continue;
		}
		if (/^#+\s*(友链页面|友链地址|友链页面 URL)/.test(line)) {
			pendingField = 'friend_page_url';
			continue;
		}
		if (/^#+\s*(网站描述|描述|简介)/.test(line)) {
			pendingField = 'site_desc';
			continue;
		}
		if (/^#+\s*(网站头像|头像|图标|头像链接)/.test(line)) {
			pendingField = 'site_avatar';
			continue;
		}
		if (/^#+\s*(网站标签|标签|分类)/.test(line)) {
			pendingField = 'site_tag';
			continue;
		}

		if (pendingField) {
			assignField(pendingField, line);
			pendingField = null;
			continue;
		}

		if (/[:：]/.test(line)) {
			const [key, ...rest] = line.split(/[:：]/);
			const value = rest.join(':').trim();
			if (!value) continue;

			if (/名称|标题/.test(key)) assignField('site_name', value);
			else if (/网站链接|站点链接|链接|网址|地址/.test(key)) assignField('site_url', value);
			else if (/友链页面|友链地址/.test(key)) assignField('friend_page_url', value);
			else if (/描述|简介/.test(key)) assignField('site_desc', value);
			else if (/头像|图标/.test(key)) assignField('site_avatar', value);
			else if (/标签|分类/.test(key)) assignField('site_tag', value);
		}
	}

	return data;
}

function extractString(block, key) {
	const match = block.match(new RegExp(`${key}:\s*["']([\s\S]*?)["']`));
	return match ? match[1] : '';
}

function extractNumber(block, key, fallback = 0) {
	const match = block.match(new RegExp(`${key}:\s*(\d+)`));
	return match ? Number(match[1]) : fallback;
}

function extractBoolean(block, key, fallback = true) {
	const match = block.match(new RegExp(`${key}:\s*(true|false)`));
	return match ? match[1] === 'true' : fallback;
}

function extractTags(block) {
	const match = block.match(/tags:\s*\[([\s\S]*?)\]/);
	if (!match) return [DEFAULT_TAG];
	const tags = [...match[1].matchAll(/["']([^"']+)["']/g)].map((item) => item[1]);
	return tags.length ? tags : [DEFAULT_TAG];
}

function parseFriendsConfig(content) {
	const listMatch = content.match(/export const friendsConfig: FriendLink\[\] = \[([\s\S]*?)\n\];/);
	if (!listMatch) {
		throw new Error('未找到 friendsConfig 数组，请检查 src/config/friendsConfig.ts 的格式。');
	}

	const friendBlocks = [...listMatch[1].matchAll(/\{([\s\S]*?)\n\t\},?/g)].map((item) => item[1]);
	return friendBlocks.map((block) => ({
		title: extractString(block, 'title'),
		imgurl: extractString(block, 'imgurl'),
		desc: extractString(block, 'desc'),
		siteurl: extractString(block, 'siteurl'),
		tags: extractTags(block),
		weight: extractNumber(block, 'weight', 10),
		enabled: extractBoolean(block, 'enabled', true),
	}));
}

function renderFriend(friend, indent) {
	const tags = (friend.tags && friend.tags.length ? friend.tags : [DEFAULT_TAG])
		.map((tag) => `"${escapeString(tag)}"`)
		.join(', ');

	return [
		`${indent}{`,
		`${indent}\ttitle: "${escapeString(friend.title)}",`,
		`${indent}\timgurl: "${escapeString(friend.imgurl)}",`,
		`${indent}\tdesc: "${escapeString(friend.desc)}",`,
		`${indent}\tsiteurl: "${escapeString(friend.siteurl)}",`,
		`${indent}\ttags: [${tags}],`,
		`${indent}\tweight: ${Number.isFinite(friend.weight) ? friend.weight : 10},`,
		`${indent}\tenabled: ${friend.enabled !== false},`,
		`${indent}},`,
	].join('\n');
}

function updateFriendsConfig(repoRoot, data) {
	const filePath = path.join(repoRoot, FRIENDS_CONFIG_RELATIVE_PATH);
	const content = fs.readFileSync(filePath, 'utf8');
	const eol = content.includes('\r\n') ? '\r\n' : '\n';
	const indentMatch = content.match(/\n(\s*)\{/);
	const indent = indentMatch ? indentMatch[1] : '\t';

	const friends = parseFriendsConfig(content);
	const normalizedUrl = trimTrailingSlash(data.site_url);

	const nextFriend = {
		title: data.site_name,
		imgurl: data.site_avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(data.site_name)}`,
		desc: data.site_desc || '',
		siteurl: data.site_url,
		tags: [data.site_tag || DEFAULT_TAG],
		weight: 10,
		enabled: true,
	};

	const existingIndex = friends.findIndex((friend) => trimTrailingSlash(friend.siteurl) === normalizedUrl);
	if (existingIndex >= 0) {
		friends[existingIndex] = nextFriend;
	} else {
		friends.push(nextFriend);
	}

	const renderedFriends = friends
		.map((friend) => renderFriend(friend, indent))
		.join(eol);

	const updatedContent = content.replace(
		/export const friendsConfig: FriendLink\[\] = \[[\s\S]*?\n\];/,
		`export const friendsConfig: FriendLink[] = [${eol}${renderedFriends}${eol}];`
	);

	const changed = updatedContent !== content;
	if (changed) {
		fs.writeFileSync(filePath, updatedContent, 'utf8');
	}

	return {
		changed,
		filePath,
		friend: nextFriend,
	};
}

function run(command, args, options = {}) {
	const result = spawnSync(command, args, {
		stdio: 'inherit',
		shell: false,
		...options,
	});
	if (result.status !== 0) {
		throw new Error(`${command} ${args.join(' ')} failed with exit code ${result.status}`);
	}
}

function formatFriendsConfig(repoRoot) {
	const biomeBinary = path.join(
		repoRoot,
		"node_modules",
		".bin",
		process.platform === "win32" ? "biome.cmd" : "biome"
	);
	if (!fs.existsSync(biomeBinary)) {
		throw new Error("未找到 Biome 可执行文件，无法格式化 friendsConfig.ts。");
	}
	run(biomeBinary, ["format", "--write", FRIENDS_CONFIG_RELATIVE_PATH], { cwd: repoRoot });
}

async function validateFriendPage(pageUrl) {
	const browser = await chromium.launch({
		headless: true,
		args: ['--no-sandbox'],
	});
	const context = await browser.newContext({
		userAgent:
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
	});
	const page = await context.newPage();

	let response = null;
	let lastError = null;

	try {
		for (let index = 0; index < 3; index += 1) {
			try {
				response = await page.goto(pageUrl, {
					waitUntil: 'domcontentloaded',
					timeout: 12000,
				});
				if (response && response.ok()) break;
				lastError = `HTTP ${response ? response.status() : 'unknown'}`;
			} catch (error) {
				lastError = error.message || '无法访问';
			}
			if (index < 2) {
				await page.waitForTimeout(2000);
			}
		}

		const actualUrl = page.url() || pageUrl;
		const pageTitle = await page.title();
		const statusCode = response ? response.status() : null;

		if (!response || !response.ok()) {
			return {
				ok: false,
				kind: 'unreachable',
				actualUrl,
				pageTitle,
				statusCode,
				error: lastError || '无法访问页面',
			};
		}

		await page.waitForTimeout(3000);
		const content = await page.content();
		const allLinks = await page.evaluate(() => {
			return Array.from(document.querySelectorAll('a[href]')).map((item) => item.href);
		});

		const joined = `${content}\n${allLinks.join('\n')}`.toLowerCase();
		const backlinkHost = trimTrailingSlash(SITE_INFO.url).replace(/^https?:\/\//, '').toLowerCase();
		const hasBacklink = joined.includes(backlinkHost) || joined.includes(SITE_INFO.name.toLowerCase());

		if (!hasBacklink) {
			return {
				ok: false,
				kind: 'missing-backlink',
				actualUrl,
				pageTitle,
				statusCode,
			};
		}

		return {
			ok: true,
			actualUrl,
			pageTitle,
			statusCode,
		};
	} finally {
		await browser.close();
	}
}

async function addLabels(github, owner, repo, issueNumber, labels) {
	if (!labels.length) return;
	await github.rest.issues.addLabels({
		owner,
		repo,
		issue_number: issueNumber,
		labels,
	});
}

async function removeLabelIfExists(github, owner, repo, issueNumber, label) {
	try {
		await github.rest.issues.removeLabel({
			owner,
			repo,
			issue_number: issueNumber,
			name: label,
		});
	} catch (error) {
		if (error.status !== 404) throw error;
	}
}

async function createComment(github, owner, repo, issueNumber, body) {
	await github.rest.issues.createComment({
		owner,
		repo,
		issue_number: issueNumber,
		body,
	});
}

function commitAndPush(repoRoot, defaultBranch, filePath, siteName) {
	run('git', ['config', 'user.name', 'github-actions[bot]'], { cwd: repoRoot });
	run('git', ['config', 'user.email', 'github-actions[bot]@users.noreply.github.com'], { cwd: repoRoot });
	run('git', ['add', filePath], { cwd: repoRoot });

	const hasChanges = spawnSync('git', ['diff', '--cached', '--quiet', '--', filePath], {
		cwd: repoRoot,
		shell: false,
	}).status !== 0;

	if (!hasChanges) {
		return false;
	}

	run('git', ['commit', '-m', `🤝 更新友链: ${siteName}`], { cwd: repoRoot });
	run('git', ['pull', '--rebase', 'origin', defaultBranch], { cwd: repoRoot });
	run('git', ['push', 'origin', `HEAD:${defaultBranch}`], { cwd: repoRoot });
	return true;
}

module.exports = async function processFriendRequest({ github, context }) {
	const issue = context.payload.issue;
	if (!issue) {
		console.log('当前事件不包含 issue，跳过。');
		return;
	}

	const owner = context.repo.owner;
	const repo = context.repo.repo;
	const issueNumber = issue.number;
	const action = context.payload.action;
	const body = issue.body || '';
	const isCommentEvent = context.eventName === 'issue_comment';

	// 检测是否为友链申请（包含特定表单字段）
	const isFriendRequest = body.includes('### 网站名称') && body.includes('### 网站链接');
	const isFriendRequestAlt = body.includes('### 网站名称') && body.includes('### 头像链接');
	if (!isFriendRequest && !isFriendRequestAlt) {
		console.log('非友链申请 issue，跳过。');
		return;
	}

	try {

		if (action === 'opened' || action === 'reopened') {
			await addLabels(github, owner, repo, issueNumber, ['验证中']);
		}

		if (isCommentEvent) {
			const isAuthor = context.payload.comment?.user?.login === issue.user?.login;
			if (!isAuthor) {
				console.log('评论不是来自 issue 作者，跳过。');
				return;
			}
		}

		const formData = parseIssueBody(body);

		if (!formData.site_name || !formData.site_url || !formData.friend_page_url) {
			await createComment(
				github,
				owner,
				repo,
				issueNumber,
				'❌ 友链信息不完整，请确保填写了网站名称、网站链接和友链页面 URL。'
			);
			await addLabels(github, owner, repo, issueNumber, ['needs-update']);
			return;
		}

		if (!normalizeUrl(formData.site_url) || !normalizeUrl(formData.friend_page_url)) {
			await createComment(
				github,
				owner,
				repo,
				issueNumber,
				'❌ 提交的信息中包含无效 URL，请检查网站链接和友链页面 URL。'
			);
			await addLabels(github, owner, repo, issueNumber, ['needs-update']);
			return;
		}

		const validation = await validateFriendPage(formData.friend_page_url);

		if (!validation.ok) {
			const failureMessage =
				validation.kind === 'missing-backlink'
					? `❌ 友链验证失败：**${formData.site_name}**

**失败原因**：未在网站中找到本站友链
- 网站: ${validation.actualUrl}
- 标题: ${validation.pageTitle || '无'}

请先在你的网站添加本站友链：
- **名称**: ${SITE_INFO.name}
- **链接**: ${SITE_INFO.url}
- **头像**: ${SITE_INFO.avatar}
- **描述**: ${SITE_INFO.desc}

---
💡 添加友链后，回复本 Issue 即可重新检查。`
					: `❌ 友链验证失败：**${formData.site_name}**

**失败原因**：友链页面无法访问
- 链接: ${formData.friend_page_url}
- 实际访问: ${validation.actualUrl}
- 状态码: ${validation.statusCode || '无'}
- 错误: ${validation.error || '未知错误'}

请确认友链页面是否可以正常访问。`;

			await createComment(github, owner, repo, issueNumber, failureMessage);
			await addLabels(github, owner, repo, issueNumber, ['needs-update']);
			return;
		}

		const repoRoot = process.env.GITHUB_WORKSPACE || process.cwd();
		const updateResult = updateFriendsConfig(repoRoot, formData);
		formatFriendsConfig(repoRoot);

		const committed = commitAndPush(
			repoRoot,
			context.payload.repository?.default_branch || 'main',
			FRIENDS_CONFIG_RELATIVE_PATH,
			formData.site_name
		);

		const commentBody = committed
			? `✅ 你的网站 **${formData.site_name}** (${formData.site_url}) 已成功添加到 ${SITE_INFO.name} 的友链中。

**友链信息**：
- 名称: ${formData.site_name}
- 链接: ${formData.site_url}
- 描述: ${formData.site_desc || '无'}
- 头像: ${formData.site_avatar || updateResult.friend.imgurl}`
			: `✅ 友链信息已经是最新状态，无需重复提交。

**网站**：${formData.site_name}
**链接**：${formData.site_url}`;

		await createComment(github, owner, repo, issueNumber, commentBody);
		await removeLabelIfExists(github, owner, repo, issueNumber, '验证中');
		await removeLabelIfExists(github, owner, repo, issueNumber, 'needs-update');
		await github.rest.issues.update({
			owner,
			repo,
			issue_number: issueNumber,
			state: 'closed',
			state_reason: 'completed',
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.error(message);
		await createComment(
			github,
			owner,
			repo,
			issueNumber,
			`❌ 自动处理友链申请时出现异常：${message}

请检查 workflow 日志后重试。`
		);
		throw error;
	}
};
