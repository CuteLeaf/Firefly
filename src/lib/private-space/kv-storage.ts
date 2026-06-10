import { buildPrivateSpaceStats } from "./mock-data";
import {
	PRIVATE_SPACE_KV_KEYS,
	type PrivateSpaceKVBinding,
	type PrivateSpaceKVShape,
} from "./kv-contract";
import { createLocalPrivateSpaceKVBinding } from "./kv-local-binding";
import type { PrivateSpaceEntry } from "./types";

let cachedBinding: PrivateSpaceKVBinding | null = null;

function parseJSON<T>(value: string | null, fallback: T): T {
	if (!value) return fallback;
	try {
		return JSON.parse(value) as T;
	} catch {
		return fallback;
	}
}

export function getPrivateSpaceKVBinding(): PrivateSpaceKVBinding {
	if (!cachedBinding) {
		cachedBinding = createLocalPrivateSpaceKVBinding();
	}
	return cachedBinding;
}

export async function readPrivateSpaceKVShape(): Promise<PrivateSpaceKVShape> {
	const binding = getPrivateSpaceKVBinding();
	const [usersRaw, statsRaw, entryIndexRaw] = await Promise.all([
		binding.get(PRIVATE_SPACE_KV_KEYS.users),
		binding.get(PRIVATE_SPACE_KV_KEYS.stats),
		binding.get(PRIVATE_SPACE_KV_KEYS.entryIndex),
	]);

	const entryIndex = parseJSON<string[]>(entryIndexRaw, []);
	const entries = Object.fromEntries(
		await Promise.all(
			entryIndex.map(async (id) => {
				const raw = await binding.get(PRIVATE_SPACE_KV_KEYS.entry(id));
				return [id, parseJSON<PrivateSpaceEntry | null>(raw, null)];
			}),
		),
	);

	const normalizedEntries = Object.fromEntries(
		Object.entries(entries).filter(([, entry]) => entry !== null),
	) as Record<string, PrivateSpaceEntry>;

	return {
		users: parseJSON(usersRaw, []),
		stats: parseJSON(statsRaw, buildPrivateSpaceStats(Object.values(normalizedEntries))),
		entryIndex: entryIndex.filter((id) => normalizedEntries[id]),
		entries: normalizedEntries,
	};
}

export async function writePrivateSpaceKVShape(
	shape: PrivateSpaceKVShape,
): Promise<void> {
	const binding = getPrivateSpaceKVBinding();
	const entryIdsByUser = new Map<string, string[]>();

	for (const id of shape.entryIndex) {
		const entry = shape.entries[id];
		if (!entry) continue;

		const current = entryIdsByUser.get(entry.authorId) ?? [];
		current.push(id);
		entryIdsByUser.set(entry.authorId, current);
	}

	await Promise.all([
		binding.put(PRIVATE_SPACE_KV_KEYS.users, JSON.stringify(shape.users)),
		binding.put(PRIVATE_SPACE_KV_KEYS.stats, JSON.stringify(shape.stats)),
		binding.put(
			PRIVATE_SPACE_KV_KEYS.entryIndex,
			JSON.stringify(shape.entryIndex),
		),
		binding.put(
			PRIVATE_SPACE_KV_KEYS.sharedFeed,
			JSON.stringify(
				shape.entryIndex.filter(
					(id) => shape.entries[id]?.visibility === "shared",
				),
			),
		),
		binding.put(
			PRIVATE_SPACE_KV_KEYS.jointFeed,
			JSON.stringify(
				shape.entryIndex.filter(
					(id) => shape.entries[id]?.visibility === "joint",
				),
			),
		),
		binding.put(
			PRIVATE_SPACE_KV_KEYS.drafts,
			JSON.stringify(
				shape.entryIndex.filter((id) => shape.entries[id]?.status === "draft"),
			),
		),
		...shape.entryIndex.map((id) =>
			binding.put(PRIVATE_SPACE_KV_KEYS.entry(id), JSON.stringify(shape.entries[id])),
		),
		...Array.from(entryIdsByUser.entries()).map(([userId, ids]) =>
			binding.put(PRIVATE_SPACE_KV_KEYS.userFeed(userId as "you" | "partner"), JSON.stringify(ids)),
		),
	]);
}
