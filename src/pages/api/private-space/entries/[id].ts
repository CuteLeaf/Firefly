import type { APIRoute } from "astro";
import {
	deletePrivateSpaceEntry,
	updatePrivateSpaceEntry,
	updatePrivateSpaceEntryStatus,
} from "@/lib/private-space/repository";
import {
	buildPrivateSpaceUrl,
	isPrivateSpaceUserId,
} from "@/lib/private-space/viewer";
import type {
	PrivateSpaceEntryType,
	PrivateSpaceRecipient,
	PrivateSpaceStatus,
	PrivateSpaceVisibility,
} from "@/lib/private-space/types";

export const prerender = false;

type EntryAction = "publish" | "archive" | "delete" | "update";

const validTypes: PrivateSpaceEntryType[] = [
	"daily",
	"recommendation",
	"fitness",
	"hard_to_say",
];

const validVisibility: PrivateSpaceVisibility[] = ["self", "shared", "joint"];
const validRecipients: PrivateSpaceRecipient[] = ["self", "you", "partner", "both"];
const validStatuses: PrivateSpaceStatus[] = ["draft", "saved", "archived"];

function isInList<T extends string>(value: string, list: readonly T[]): value is T {
	return list.includes(value as T);
}

async function readRequestFields(request: Request): Promise<Record<string, string>> {
	const contentType = request.headers.get("content-type") || "";

	if (
		contentType.includes("multipart/form-data") ||
		contentType.includes("application/x-www-form-urlencoded")
	) {
		const formData = await request.formData();
		return Object.fromEntries(
			Array.from(formData.entries()).map(([key, value]) => [key, String(value)]),
		);
	}

	const rawText = await request.text();
	if (!rawText.trim()) return {};

	const urlEncoded = new URLSearchParams(rawText);
	if (Array.from(urlEncoded.keys()).length > 0) {
		return Object.fromEntries(urlEncoded.entries());
	}

	const lines = rawText
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean);

	return Object.fromEntries(
		lines.map((line) => {
			const [key, ...rest] = line.split("=");
			return [key, rest.join("=")];
		}),
	);
}

function normalizeRedirectTo(value: string, userId: "you" | "partner"): string {
	if (!value.startsWith("/")) {
		return buildPrivateSpaceUrl("/space/mine/", userId);
	}

	return value.includes("?") ? value : buildPrivateSpaceUrl(value, userId);
}

export const POST: APIRoute = async ({ params, request, redirect }) => {
	const entryId = params.id;
	const fields = await readRequestFields(request);
	const action = String(fields.action || "") as EntryAction;
	const userIdValue = String(fields.userId || "");
	const redirectToValue = String(fields.redirectTo || "/space/mine/");

	if (!entryId || !isPrivateSpaceUserId(userIdValue)) {
		return redirect(buildPrivateSpaceUrl("/space/mine/", "you") + "&error=action", 303);
	}

	const redirectTo = normalizeRedirectTo(redirectToValue, userIdValue);

	if (action === "publish") {
		await updatePrivateSpaceEntryStatus(entryId, userIdValue, "saved");
		return redirect(`${redirectTo}&savedAction=publish`, 303);
	}

	if (action === "archive") {
		await updatePrivateSpaceEntryStatus(entryId, userIdValue, "archived");
		return redirect(`${redirectTo}&savedAction=archive`, 303);
	}

	if (action === "delete") {
		await deletePrivateSpaceEntry(entryId, userIdValue);
		return redirect(`${redirectTo}&savedAction=delete`, 303);
	}

	if (action === "update") {
		const title = String(fields.title || "").trim();
		const content = String(fields.content || "").trim();
		const type = String(fields.type || "");
		const visibility = String(fields.visibility || "");
		const recipient = String(fields.recipient || "");
		const status = String(fields.status || "draft");
		const tags = String(fields.tags || "")
			.split(",")
			.map((tag) => tag.trim())
			.filter(Boolean);

		if (
			!title ||
			!content ||
			!isInList(type, validTypes) ||
			!isInList(visibility, validVisibility) ||
			!isInList(recipient, validRecipients) ||
			!isInList(status, validStatuses)
		) {
			return redirect(
				`${buildPrivateSpaceUrl(`/space/edit/${entryId}/`, userIdValue)}&error=1`,
				303,
			);
		}

		await updatePrivateSpaceEntry(entryId, userIdValue, {
			title,
			content,
			type,
			visibility,
			recipient,
			status,
			tags,
		});
		return redirect(`${redirectTo}&savedAction=update`, 303);
	}

	return redirect(`${redirectTo}&error=action`, 303);
};
