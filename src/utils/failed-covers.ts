/** 封面加载失败的本地缓存（用于跳过已知失败的图片） */

export function getFailedCovers(key: string): Set<string> {
	try {
		return new Set(JSON.parse(localStorage.getItem(key) || "[]"));
	} catch {
		return new Set();
	}
}

export function markCoverFailed(url: string, key: string): void {
	try {
		const failed = getFailedCovers(key);
		failed.add(url);
		const arr = [...failed];
		localStorage.setItem(key, JSON.stringify(arr.slice(-200)));
	} catch {
		// localStorage 不可用时静默忽略
	}
}
