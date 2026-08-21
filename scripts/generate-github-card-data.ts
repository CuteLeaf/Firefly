import fs from "node:fs/promises";
import path from "node:path";
import { glob } from "glob";
import { isValidGithubRepository } from "../src/utils/github-card-utils";

const OUTPUT_FILE = "src/constants/github-card-data.json";
const CONTENT_GLOB = "src/content/**/*.{md,mdx}";
const GITHUB_DIRECTIVE_PATTERN =
	/::github\s*\{[^}]*\brepo\s*=\s*["']([^"']+)["'][^}]*\}/g;

interface GithubCardData {
	description: string | null;
	language: string | null;
	forks: number;
	stars: number;
	avatarUrl: string | null;
	license: string | null;
}

type GithubCardCache = Record<string, GithubCardData>;

async function readCache(): Promise<GithubCardCache> {
	try {
		return JSON.parse(await fs.readFile(OUTPUT_FILE, "utf-8"));
	} catch {
		return {};
	}
}

async function findRepositories(): Promise<Map<string, string>> {
	const repositories = new Map<string, string>();
	const contentFiles = await glob(CONTENT_GLOB);

	for (const file of contentFiles) {
		const content = await fs.readFile(file, "utf-8");
		for (const match of content.matchAll(GITHUB_DIRECTIVE_PATTERN)) {
			const repo = match[1];
			if (isValidGithubRepository(repo)) {
				repositories.set(repo.toLowerCase(), repo);
			}
		}
	}

	return repositories;
}

async function fetchRepositoryData(repo: string): Promise<GithubCardData> {
	const [owner, name] = repo.split("/");
	const headers: Record<string, string> = {
		Accept: "application/vnd.github+json",
		"X-GitHub-Api-Version": "2022-11-28",
	};
	const token = process.env.GITHUB_TOKEN?.trim();
	if (token) headers.Authorization = `Bearer ${token}`;

	const response = await fetch(
		`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`,
		{
			headers,
			signal: AbortSignal.timeout(5000),
		},
	);
	if (!response.ok) {
		throw new Error(
			`GitHub API returned ${response.status}${response.statusText ? ` ${response.statusText}` : ""}`,
		);
	}

	const data = await response.json();
	return {
		description:
			typeof data.description === "string"
				? data.description.replace(/:[a-zA-Z0-9_]+:/g, "")
				: null,
		language: typeof data.language === "string" ? data.language : null,
		forks: typeof data.forks === "number" ? data.forks : 0,
		stars:
			typeof data.stargazers_count === "number" ? data.stargazers_count : 0,
		avatarUrl:
			typeof data.owner?.avatar_url === "string" ? data.owner.avatar_url : null,
		license:
			typeof data.license?.spdx_id === "string" ? data.license.spdx_id : null,
	};
}

async function main() {
	const existingCache = await readCache();
	const repositories = await findRepositories();
	const nextCache: GithubCardCache = {};
	let updated = 0;

	for (const [cacheKey, repo] of repositories) {
		try {
			nextCache[cacheKey] = await fetchRepositoryData(repo);
			updated++;
		} catch (error) {
			if (existingCache[cacheKey]) {
				nextCache[cacheKey] = existingCache[cacheKey];
				console.warn(
					`[GITHUB-CARD] Failed to refresh ${repo}; keeping cached data.`,
					error,
				);
			} else {
				console.warn(
					`[GITHUB-CARD] Failed to load ${repo}; the card will use its fallback state.`,
					error,
				);
			}
		}
	}

	const sortedCache = Object.fromEntries(
		Object.entries(nextCache).sort(([a], [b]) => a.localeCompare(b)),
	);
	await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
	await fs.writeFile(
		OUTPUT_FILE,
		`${JSON.stringify(sortedCache, null, "\t")}\n`,
	);
	console.log(
		`[GITHUB-CARD] Cached ${Object.keys(sortedCache).length} repositories (${updated} refreshed).`,
	);
}

main();
