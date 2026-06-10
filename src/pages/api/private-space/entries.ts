import type { APIRoute } from "astro";
import { createPrivateSpaceEntry } from "@/lib/private-space/repository";
import { buildPrivateSpaceUrl, isPrivateSpaceUserId } from "@/lib/private-space/viewer";
import type {
	PrivateSpaceEntryType,
	PrivateSpaceRecipient,
	PrivateSpaceStatus,
	PrivateSpaceVisibility,
} from "@/lib/private-space/types";

const validTypes: PrivateSpaceEntryType[] = [
	"daily",
	"recommendation",
	"fitness",
	"hard_to_say",
];

const validVisibility: PrivateSpaceVisibility[] = ["self", "shared", "joint"];
const validRecipients: PrivateSpaceRecipient[] = ["self", "you", "partner", "both"];
const validStatuses: PrivateSpaceStatus[] = ["draft", "saved"];

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

	if (!rawText.trim()) {
		return {};
	}

	if (contentType.includes("application/json")) {
		const parsed = JSON.parse(rawText) as Record<string, unknown>;
		return Object.fromEntries(
			Object.entries(parsed).map(([key, value]) => [key, String(value ?? "")]),
		);
	}

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

export const POST: APIRoute = async ({ request, redirect }) => {
	const fields = await readRequestFields(request);

	const authorId = String(fields.authorId || "");
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
		!isPrivateSpaceUserId(authorId) ||
		!title ||
		!content ||
		!isInList(type, validTypes) ||
		!isInList(visibility, validVisibility) ||
		!isInList(recipient, validRecipients) ||
		!isInList(status, validStatuses)
	) {
		return redirect(buildPrivateSpaceUrl("/space/write/", isPrivateSpaceUserId(authorId) ? authorId : "you") + "&error=1", 303);
	}

	await createPrivateSpaceEntry({
		authorId,
		title,
		content,
		type,
		visibility,
		recipient,
		status,
		tags,
	});

	return redirect(buildPrivateSpaceUrl("/space/write/", authorId) + "&saved=1", 303);
};
