import type { PrivateSpaceUserId } from "./types";

export const DEFAULT_PRIVATE_SPACE_USER_ID: PrivateSpaceUserId = "you";

export function isPrivateSpaceUserId(
	value: string | null,
): value is PrivateSpaceUserId {
	return value === "you" || value === "partner";
}

export function resolvePrivateSpaceUserId(url: URL): PrivateSpaceUserId {
	const candidate = url.searchParams.get("as");
	return isPrivateSpaceUserId(candidate)
		? candidate
		: DEFAULT_PRIVATE_SPACE_USER_ID;
}

export function buildPrivateSpaceUrl(
	path: string,
	userId: PrivateSpaceUserId,
): string {
	return `${path}?as=${userId}`;
}
