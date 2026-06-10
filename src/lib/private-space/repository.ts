import {
	buildPrivateSpaceStats,
	privateSpaceComposeFields,
	privateSpaceUsers,
} from "./mock-data";
import { readPrivateSpaceKVShape, writePrivateSpaceKVShape } from "./kv-storage";
import type {
	CreatePrivateSpaceEntryInput,
	PrivateSpaceComposeFieldConfig,
	PrivateSpaceEntry,
	PrivateSpaceEntryType,
	PrivateSpaceStats,
	PrivateSpaceStatus,
	PrivateSpaceUser,
	PrivateSpaceUserId,
	PrivateSpaceVisibility,
	UpdatePrivateSpaceEntryInput,
} from "./types";

function sortByUpdated(entries: PrivateSpaceEntry[]) {
	return [...entries].sort((a, b) =>
		new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
	);
}

function isEntryVisibleToUser(
	entry: PrivateSpaceEntry,
	userId: PrivateSpaceUserId,
): boolean {
	if (entry.status === "archived") return false;
	if (entry.status === "draft") return entry.authorId === userId;
	if (entry.visibility === "self") return entry.authorId === userId;
	return true;
}

function filterVisibleEntries(
	entries: PrivateSpaceEntry[],
	userId: PrivateSpaceUserId,
): PrivateSpaceEntry[] {
	return entries.filter((entry) => isEntryVisibleToUser(entry, userId));
}

export async function getPrivateSpaceUsers(): Promise<PrivateSpaceUser[]> {
	return privateSpaceUsers;
}

export async function getPrivateSpaceUserById(
	userId: PrivateSpaceUserId,
): Promise<PrivateSpaceUser | undefined> {
	return privateSpaceUsers.find((user) => user.id === userId);
}

export async function getPrivateSpaceStats(): Promise<PrivateSpaceStats> {
	return buildPrivateSpaceStats(Object.values((await readPrivateSpaceKVShape()).entries));
}

export async function getVisiblePrivateSpaceStats(
	userId: PrivateSpaceUserId,
): Promise<PrivateSpaceStats> {
	const shape = await readPrivateSpaceKVShape();
	return buildPrivateSpaceStats(
		filterVisibleEntries(Object.values(shape.entries), userId),
	);
}

export async function getPrivateSpaceFeed(): Promise<PrivateSpaceEntry[]> {
	const entries = Object.values((await readPrivateSpaceKVShape()).entries);
	return sortByUpdated(
		entries.filter((entry) => entry.status !== "archived"),
	);
}

export async function getVisiblePrivateSpaceFeed(
	userId: PrivateSpaceUserId,
): Promise<PrivateSpaceEntry[]> {
	const entries = Object.values((await readPrivateSpaceKVShape()).entries);
	return sortByUpdated(
		filterVisibleEntries(entries, userId),
	);
}

export async function getPrivateSpaceEntriesByUser(
	userId: PrivateSpaceUserId,
): Promise<PrivateSpaceEntry[]> {
	const entries = Object.values((await readPrivateSpaceKVShape()).entries);
	return sortByUpdated(
		entries.filter((entry) => entry.authorId === userId),
	);
}

export async function getPrivateSpaceEntryById(
	entryId: string,
): Promise<PrivateSpaceEntry | null> {
	const shape = await readPrivateSpaceKVShape();
	return shape.entries[entryId] ?? null;
}

export async function getPrivateSpaceEntriesByViewer(
	userId: PrivateSpaceUserId,
): Promise<PrivateSpaceEntry[]> {
	const entries = Object.values((await readPrivateSpaceKVShape()).entries);
	return sortByUpdated(
		entries.filter(
			(entry) => entry.authorId === userId && entry.status !== "archived",
		),
	);
}

export async function getSharedEntries(): Promise<PrivateSpaceEntry[]> {
	const entries = Object.values((await readPrivateSpaceKVShape()).entries);
	return sortByUpdated(
		entries.filter(
			(entry) => entry.visibility === "shared" && entry.status !== "archived",
		),
	);
}

export async function getVisibleSharedEntries(
	userId: PrivateSpaceUserId,
): Promise<PrivateSpaceEntry[]> {
	const entries = Object.values((await readPrivateSpaceKVShape()).entries);
	return sortByUpdated(
		entries.filter(
			(entry) =>
				entry.visibility === "shared" &&
				entry.status === "saved" &&
				isEntryVisibleToUser(entry, userId),
		),
	);
}

export async function getJointEntries(): Promise<PrivateSpaceEntry[]> {
	const entries = Object.values((await readPrivateSpaceKVShape()).entries);
	return sortByUpdated(
		entries.filter(
			(entry) => entry.visibility === "joint" && entry.status !== "archived",
		),
	);
}

export async function getVisibleJointEntries(
	userId: PrivateSpaceUserId,
): Promise<PrivateSpaceEntry[]> {
	const entries = Object.values((await readPrivateSpaceKVShape()).entries);
	return sortByUpdated(
		entries.filter(
			(entry) =>
				entry.visibility === "joint" &&
				entry.status === "saved" &&
				isEntryVisibleToUser(entry, userId),
		),
	);
}

export async function getDraftEntries(): Promise<PrivateSpaceEntry[]> {
	const entries = Object.values((await readPrivateSpaceKVShape()).entries);
	return sortByUpdated(
		entries.filter((entry) => entry.status === "draft"),
	);
}

export async function getVisibleDraftEntries(
	userId: PrivateSpaceUserId,
): Promise<PrivateSpaceEntry[]> {
	const entries = Object.values((await readPrivateSpaceKVShape()).entries);
	return sortByUpdated(
		entries.filter(
			(entry) => entry.status === "draft" && entry.authorId === userId,
		),
	);
}

export async function getEntriesByType(
	type: PrivateSpaceEntryType,
): Promise<PrivateSpaceEntry[]> {
	const entries = Object.values((await readPrivateSpaceKVShape()).entries);
	return sortByUpdated(
		entries.filter((entry) => entry.type === type),
	);
}

export async function getVisibilityBuckets(): Promise<
	Record<PrivateSpaceVisibility, PrivateSpaceEntry[]>
> {
	const entries = Object.values((await readPrivateSpaceKVShape()).entries);
	return {
		self: sortByUpdated(entries.filter((entry) => entry.visibility === "self")),
		shared: sortByUpdated(
			entries.filter(
				(entry) => entry.visibility === "shared" && entry.status !== "archived",
			),
		),
		joint: sortByUpdated(
			entries.filter(
				(entry) => entry.visibility === "joint" && entry.status !== "archived",
			),
		),
	};
}

export async function getComposeFieldConfig(): Promise<
	PrivateSpaceComposeFieldConfig[]
> {
	return privateSpaceComposeFields;
}

function createEntryExcerpt(content: string): string {
	const normalized = content.replace(/\s+/g, " ").trim();
	return normalized.length <= 72
		? normalized
		: `${normalized.slice(0, 72).trim()}...`;
}

function createEntryId(title: string): string {
	const slug = title
		.toLowerCase()
		.replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 36);

	return `${slug || "entry"}-${Date.now()}`;
}

export async function createPrivateSpaceEntry(
	input: CreatePrivateSpaceEntryInput,
): Promise<PrivateSpaceEntry> {
	const shape = await readPrivateSpaceKVShape();
	const now = new Date().toISOString();
	const entry: PrivateSpaceEntry = {
		id: createEntryId(input.title),
		title: input.title.trim(),
		excerpt: createEntryExcerpt(input.content),
		content: input.content.trim(),
		authorId: input.authorId,
		type: input.type,
		visibility: input.visibility,
		recipient: input.recipient,
		status: input.status,
		tags: input.tags?.filter(Boolean) ?? [],
		createdAt: now,
		updatedAt: now,
		savedAt: input.status === "draft" ? undefined : now,
	};

	shape.entries[entry.id] = entry;
	shape.entryIndex.unshift(entry.id);
	shape.stats = buildPrivateSpaceStats(
		shape.entryIndex
			.map((id) => shape.entries[id])
			.filter(Boolean),
	);
	await writePrivateSpaceKVShape(shape);
	return entry;
}

export async function updatePrivateSpaceEntryStatus(
	entryId: string,
	userId: PrivateSpaceUserId,
	status: PrivateSpaceStatus,
): Promise<PrivateSpaceEntry | null> {
	const shape = await readPrivateSpaceKVShape();
	const entry = shape.entries[entryId];

	if (!entry || entry.authorId !== userId) {
		return null;
	}

	const now = new Date().toISOString();
	const nextEntry: PrivateSpaceEntry = {
		...entry,
		status,
		updatedAt: now,
		savedAt: status === "saved" ? now : entry.savedAt,
	};

	shape.entries[entryId] = nextEntry;
	shape.stats = buildPrivateSpaceStats(
		shape.entryIndex.map((id) => shape.entries[id]).filter(Boolean),
	);
	await writePrivateSpaceKVShape(shape);
	return nextEntry;
}

export async function updatePrivateSpaceEntry(
	entryId: string,
	userId: PrivateSpaceUserId,
	input: UpdatePrivateSpaceEntryInput,
): Promise<PrivateSpaceEntry | null> {
	const shape = await readPrivateSpaceKVShape();
	const entry = shape.entries[entryId];

	if (!entry || entry.authorId !== userId) {
		return null;
	}

	const now = new Date().toISOString();
	const nextEntry: PrivateSpaceEntry = {
		...entry,
		title: input.title.trim(),
		content: input.content.trim(),
		excerpt: createEntryExcerpt(input.content),
		type: input.type,
		visibility: input.visibility,
		recipient: input.recipient,
		status: input.status,
		tags: input.tags?.filter(Boolean) ?? [],
		updatedAt: now,
		savedAt: input.status === "saved" ? now : entry.savedAt,
	};

	shape.entries[entryId] = nextEntry;
	shape.stats = buildPrivateSpaceStats(
		shape.entryIndex.map((id) => shape.entries[id]).filter(Boolean),
	);
	await writePrivateSpaceKVShape(shape);
	return nextEntry;
}

export async function deletePrivateSpaceEntry(
	entryId: string,
	userId: PrivateSpaceUserId,
): Promise<boolean> {
	const shape = await readPrivateSpaceKVShape();
	const entry = shape.entries[entryId];

	if (!entry || entry.authorId !== userId) {
		return false;
	}

	delete shape.entries[entryId];
	shape.entryIndex = shape.entryIndex.filter((id) => id !== entryId);
	shape.stats = buildPrivateSpaceStats(
		shape.entryIndex.map((id) => shape.entries[id]).filter(Boolean),
	);
	await writePrivateSpaceKVShape(shape);
	return true;
}
