const GITHUB_REPOSITORY_PATTERN = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;

export function isValidGithubRepository(repo: unknown): repo is string {
	return typeof repo === "string" && GITHUB_REPOSITORY_PATTERN.test(repo);
}

/** 紧凑计数（如 1.2K / 3.4M），去掉英文字符计数里的窄不换行空格 */
export function formatCount(value: number): string {
	return Intl.NumberFormat("en-us", {
		notation: "compact",
		maximumFractionDigits: 1,
	})
		.format(value)
		.replaceAll(" ", "");
}
