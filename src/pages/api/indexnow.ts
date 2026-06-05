import fs from "fs";
import path from "path";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

// 已提交URL记录文件路径
const SUBMITTED_URLS_FILE = path.join(
	process.cwd(),
	".indexnow-submitted.json",
);

// 读取已提交的URL记录
function getSubmittedUrls() {
	if (!fs.existsSync(SUBMITTED_URLS_FILE)) {
		return {
			urls: [] as string[],
			lastSubmitted: null as string | null,
			totalSubmissions: 0,
		};
	}

	try {
		const data = fs.readFileSync(SUBMITTED_URLS_FILE, "utf-8");
		return JSON.parse(data);
	} catch (error) {
		console.warn("Warning: Cannot read submitted URLs record:", error);
		return {
			urls: [] as string[],
			lastSubmitted: null as string | null,
			totalSubmissions: 0,
		};
	}
}

// 保存已提交的URL记录
function saveSubmittedUrls(submittedData: Record<string, unknown>) {
	try {
		fs.writeFileSync(
			SUBMITTED_URLS_FILE,
			JSON.stringify(submittedData, null, 2),
			"utf-8",
		);
	} catch (error) {
		console.error("Failed to save submitted URLs record:", error);
	}
}

export const POST: APIRoute = async ({ request }) => {
	try {
		console.log("IndexNow API called");

		// 检查是否请求强制提交
		const body = await request.text();
		const requestData = body ? JSON.parse(body) : {};
		const forceSubmit = requestData.force === true;

		// 获取所有博客文章
		const posts = await getCollection("posts");

		// 构建要提交的 URL 列表
		const baseUrl = "https://f3f3.top";
		const currentUrls = [
			baseUrl, // 首页
			`${baseUrl}/archive`, // 归档页
			`${baseUrl}/about`, // 关于页
			...posts.map((post) => `${baseUrl}/posts/${post.data.abbrlink ?? post.id}`), // 所有文章页面
		];

		console.log(`Current site has ${currentUrls.length} URLs`);

		let urlsToSubmit = currentUrls;
		let isIncremental = false;

		if (!forceSubmit) {
			// 增量提交模式
			const submittedData = getSubmittedUrls();
			const submittedUrls = new Set(submittedData.urls || []);

			// 找出新增的URL
			const newUrls = currentUrls.filter((url) => !submittedUrls.has(url));

			if (newUrls.length === 0) {
				return new Response(
					JSON.stringify({
						success: true,
						message: "No new URLs to submit",
						totalUrls: currentUrls.length,
						submittedUrls: submittedUrls.size,
						newUrls: 0,
						savedQuota: currentUrls.length,
						isIncremental: true,
						lastSubmitted: submittedData.lastSubmitted,
						totalSubmissions: submittedData.totalSubmissions || 0,
					}),
					{
						status: 200,
						headers: { "Content-Type": "application/json" },
					},
				);
			}

			urlsToSubmit = newUrls;
			isIncremental = true;
			console.log(
				`Incremental mode: Submitting ${newUrls.length} new URLs to IndexNow`,
			);
		} else {
			console.log(
				`Force mode: Submitting all ${urlsToSubmit.length} URLs to IndexNow`,
			);
		}

		// IndexNow 配置 - 请替换为你自己的 Key
		const key = process.env.INDEXNOW_KEY || "YOUR_INDEXNOW_KEY";
		const host = "f3f3.top";
		const keyLocation = `${baseUrl}/${key}.txt`;

		// 提交到 api.indexnow.org
		const response = await fetch("https://api.indexnow.org/IndexNow", {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"User-Agent": "FireflyBlog-IndexNow/1.0",
			},
			body: JSON.stringify({
				host,
				key,
				keyLocation,
				urlList: urlsToSubmit,
			}),
		});

		console.log(`IndexNow response: ${response.status} ${response.statusText}`);

		// IndexNow API 通常返回 HTTP 200 (成功) 或 202 (已接受)
		const isSuccess = response.status === 200 || response.status === 202;

		let responseText = "";
		try {
			responseText = await response.text();
			console.log("IndexNow response body:", responseText);
		} catch {
			console.log("No response body or failed to read response");
		}

		if (isSuccess) {
			// 更新已提交URL记录
			const submittedData = getSubmittedUrls();
			const submittedUrls = new Set(submittedData.urls || []);

			const updatedSubmittedData = {
				urls: forceSubmit ? urlsToSubmit : [...submittedUrls, ...urlsToSubmit],
				lastSubmitted: new Date().toISOString(),
				totalSubmissions: (submittedData.totalSubmissions || 0) + 1,
				lastSubmissionDetails: {
					newUrlsCount: urlsToSubmit.length,
					totalUrlsCount: currentUrls.length,
					timestamp: new Date().toISOString(),
					status: response.status,
					isIncremental,
					forceSubmit,
				},
			};

			saveSubmittedUrls(updatedSubmittedData);
		}

		return new Response(
			JSON.stringify({
				success: isSuccess,
				message: isSuccess
					? `URLs submitted to IndexNow successfully (${isIncremental ? "incremental" : "full"} mode)`
					: `IndexNow submission failed: HTTP ${response.status}`,
				totalUrls: urlsToSubmit.length,
				totalSiteUrls: currentUrls.length,
				savedQuota: isIncremental
					? currentUrls.length - urlsToSubmit.length
					: 0,
				isIncremental,
				forceSubmit,
				status: response.status,
				statusText: response.statusText,
				responseBody: responseText,
				submittedUrls: urlsToSubmit,
				endpoint: "https://api.indexnow.org/IndexNow",
				submittedAt: new Date().toISOString(),
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	} catch (error) {
		console.error("IndexNow API error:", error);
		return new Response(
			JSON.stringify({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
				endpoint: "https://api.indexnow.org/IndexNow",
			}),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	}
};
