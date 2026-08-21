const GITHUB_REPOSITORY_PATTERN = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;

export function isValidGithubRepository(repo: unknown): repo is string {
	return typeof repo === "string" && GITHUB_REPOSITORY_PATTERN.test(repo);
}
