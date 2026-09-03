/// <reference types="mdast" />
import { h } from "hastscript";
import githubCardData from "../constants/github-card-data.json" with {
	type: "json",
};
import { isValidGithubRepository } from "../utils/github-card-utils.ts";

/**
 * Creates a GitHub Card component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} properties.repo - The GitHub repository in the format "owner/repo".
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created GitHub Card component.
 */
export function GithubCardComponent(properties, children) {
	if (Array.isArray(children) && children.length !== 0)
		return h("div", { class: "hidden" }, [
			'Invalid directive. ("github" directive must be leaf type "::github{repo="owner/repo"}")',
		]);

	if (!isValidGithubRepository(properties.repo))
		return h(
			"div",
			{ class: "hidden" },
			'Invalid repository. ("repo" attributte must be in the format "owner/repo")',
		);

	const repo = properties.repo;
	const cardUuid = `GC${Math.random().toString(36).slice(-6)}`; // Collisions are not important
	const data = githubCardData[repo.toLowerCase()] ?? null;
	const hasData = data !== null;

	const avatarUrl = data?.avatarUrl
		? `${data.avatarUrl}${data.avatarUrl.includes("?") ? "&" : "?"}s=32`
		: null;
	const avatarStyle = avatarUrl
		? `background-image: url("${avatarUrl}"); background-color: transparent;`
		: undefined;
	const nAvatar = h(`div#${cardUuid}-avatar`, {
		class: "gc-avatar",
		style: avatarStyle,
	});
	const nLanguage = h(
		`span#${cardUuid}-language`,
		{ class: "gc-language" },
		data?.language ?? "Unavailable",
	);

	const nTitle = h("div", { class: "gc-titlebar" }, [
		h("div", { class: "gc-titlebar-left" }, [
			h("div", { class: "gc-owner" }, [
				nAvatar,
				h("div", { class: "gc-user" }, repo.split("/")[0]),
			]),
			h("div", { class: "gc-divider" }, "/"),
			h("div", { class: "gc-repo" }, repo.split("/")[1]),
		]),
		h("div", { class: "github-logo" }),
	]);

	const nDescription = h(
		`div#${cardUuid}-description`,
		{ class: "gc-description" },
		hasData
			? data.description || "Description not set"
			: "Repository details unavailable",
	);

	const nStars = h(`div#${cardUuid}-stars`, { class: "gc-stars" }, "—");
	const nForks = h(`div#${cardUuid}-forks`, { class: "gc-forks" }, "—");
	const nLicense = h(
		`div#${cardUuid}-license`,
		{ class: "gc-license" },
		hasData ? data.license || "no-license" : "—",
	);

	return h(
		`a#${cardUuid}-card`,
		{
			class: `card-github${hasData ? "" : " fetch-error"} no-styling`,
			href: `https://github.com/${repo}`,
			target: "_blank",
			repo,
		},
		[
			nTitle,
			nDescription,
			h("div", { class: "gc-infobar" }, [nStars, nForks, nLicense, nLanguage]),
		],
	);
}
