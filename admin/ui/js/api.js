/** 统一 API 请求封装：自动携带凭证与 CSRF 头，统一错误处理 */

export class ApiError extends Error {
	constructor(message, status, details = null) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.details = details;
	}
}

export async function api(path, { method = "GET", body, formData } = {}) {
	const opts = { method, credentials: "same-origin" };
	if (method !== "GET" && method !== "HEAD") {
		opts.headers = { "x-admin-request": "1" };
	}
	if (body !== undefined) {
		opts.headers = { ...opts.headers, "Content-Type": "application/json" };
		opts.body = JSON.stringify(body);
	}
	if (formData) {
		opts.body = formData;
	}
	let res;
	try {
		res = await fetch(`/api${path}`, opts);
	} catch {
		throw new ApiError("无法连接到后台服务", 0);
	}
	let data = null;
	try {
		data = await res.json();
	} catch {
		/* 非 JSON 响应 */
	}
	if (!res.ok) {
		throw new ApiError(
			data?.error || `请求失败（HTTP ${res.status}）`,
			res.status,
			data?.details,
		);
	}
	return data;
}
