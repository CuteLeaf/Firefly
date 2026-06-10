import type {
	PrivateSpaceEntry,
	PrivateSpaceStats,
	PrivateSpaceUser,
	PrivateSpaceUserId,
} from "./types";

// Placeholder contract for future Cloudflare KV integration.
// This file defines the data shape and key strategy only; no runtime binding yet.
export const PRIVATE_SPACE_KV_KEYS = {
	users: "space:users",
	stats: "space:stats",
	entry: (id: string) => `space:entry:${id}`,
	entryIndex: "space:entries:index",
	userFeed: (userId: PrivateSpaceUserId) => `space:feed:${userId}`,
	sharedFeed: "space:feed:shared",
	jointFeed: "space:feed:joint",
	drafts: "space:feed:drafts",
} as const;

export interface PrivateSpaceKVBinding {
	get(key: string): Promise<string | null>;
	put(key: string, value: string): Promise<void>;
	delete(key: string): Promise<void>;
	list?(options?: { prefix?: string }): Promise<{ keys: Array<{ name: string }> }>;
}

export interface PrivateSpaceKVShape {
	users: PrivateSpaceUser[];
	stats: PrivateSpaceStats;
	entryIndex: string[];
	entries: Record<string, PrivateSpaceEntry>;
}

