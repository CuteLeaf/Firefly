import fs from "node:fs";

/**
 * Download a URL to a file path using built-in fetch.
 */
export async function downloadFile(url, destPath, opts = {}) {
	const controller = new AbortController();
	const timeout = opts.timeout || 30000;
	const timer = setTimeout(() => controller.abort(), timeout);

	try {
		const res = await fetch(url, {
			headers: opts.headers || {},
			signal: controller.signal,
		});
		if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
		const buffer = Buffer.from(await res.arrayBuffer());
		fs.writeFileSync(destPath, buffer);
		return destPath;
	} finally {
		clearTimeout(timer);
	}
}

/**
 * Fetch JSON from a URL.
 */
export async function fetchJSON(url, opts = {}) {
	const res = await fetch(url, {
		headers: opts.headers || {},
	});
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	return res.json();
}
