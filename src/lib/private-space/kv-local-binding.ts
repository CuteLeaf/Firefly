import { access, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
	PRIVATE_SPACE_KV_KEYS,
	type PrivateSpaceKVBinding,
	type PrivateSpaceKVShape,
} from "./kv-contract";
import { buildPrivateSpaceStats, privateSpaceEntries, privateSpaceUsers } from "./mock-data";

const STORE_URL = new URL("./kv-local-store.json", import.meta.url);
const STORE_PATH = fileURLToPath(STORE_URL);

function buildSeedKVShape(): PrivateSpaceKVShape {
	return {
		users: privateSpaceUsers,
		stats: buildPrivateSpaceStats(privateSpaceEntries),
		entryIndex: privateSpaceEntries.map((entry) => entry.id),
		entries: Object.fromEntries(
			privateSpaceEntries.map((entry) => [entry.id, entry]),
		),
	};
}

function kvShapeToRecord(shape: PrivateSpaceKVShape): Record<string, string> {
	const record: Record<string, string> = {
		[PRIVATE_SPACE_KV_KEYS.users]: JSON.stringify(shape.users),
		[PRIVATE_SPACE_KV_KEYS.stats]: JSON.stringify(shape.stats),
		[PRIVATE_SPACE_KV_KEYS.entryIndex]: JSON.stringify(shape.entryIndex),
		[PRIVATE_SPACE_KV_KEYS.sharedFeed]: JSON.stringify(
			shape.entryIndex.filter(
				(id) => shape.entries[id]?.visibility === "shared",
			),
		),
		[PRIVATE_SPACE_KV_KEYS.jointFeed]: JSON.stringify(
			shape.entryIndex.filter((id) => shape.entries[id]?.visibility === "joint"),
		),
		[PRIVATE_SPACE_KV_KEYS.drafts]: JSON.stringify(
			shape.entryIndex.filter((id) => shape.entries[id]?.status === "draft"),
		),
	};

	for (const id of shape.entryIndex) {
		const entry = shape.entries[id];
		if (!entry) continue;
		record[PRIVATE_SPACE_KV_KEYS.entry(id)] = JSON.stringify(entry);
		record[PRIVATE_SPACE_KV_KEYS.userFeed(entry.authorId)] = JSON.stringify(
			shape.entryIndex.filter(
				(entryId) => shape.entries[entryId]?.authorId === entry.authorId,
			),
		);
	}

	return record;
}

async function ensureKVStoreFile() {
	try {
		await access(STORE_PATH);
	} catch {
		await writeFile(
			STORE_PATH,
			JSON.stringify(kvShapeToRecord(buildSeedKVShape()), null, 2),
			"utf-8",
		);
	}
}

async function loadKVRecord(): Promise<Record<string, string>> {
	await ensureKVStoreFile();
	const raw = await readFile(STORE_PATH, "utf-8");
	return JSON.parse(raw) as Record<string, string>;
}

async function saveKVRecord(record: Record<string, string>): Promise<void> {
	await writeFile(STORE_PATH, JSON.stringify(record, null, 2), "utf-8");
}

export function createLocalPrivateSpaceKVBinding(): PrivateSpaceKVBinding {
	return {
		async get(key: string) {
			const record = await loadKVRecord();
			return record[key] ?? null;
		},
		async put(key: string, value: string) {
			const record = await loadKVRecord();
			record[key] = value;
			await saveKVRecord(record);
		},
		async delete(key: string) {
			const record = await loadKVRecord();
			delete record[key];
			await saveKVRecord(record);
		},
		async list(options) {
			const record = await loadKVRecord();
			const prefix = options?.prefix ?? "";
			return {
				keys: Object.keys(record)
					.filter((key) => key.startsWith(prefix))
					.map((name) => ({ name })),
			};
		},
	};
}
