export type PrivateSpaceUserId = "you" | "partner";

export type PrivateSpaceVisibility = "self" | "shared" | "joint";

export type PrivateSpaceEntryType =
	| "daily"
	| "recommendation"
	| "fitness"
	| "hard_to_say";

export type PrivateSpaceStatus = "draft" | "saved" | "archived";

export type PrivateSpaceRecipient = "self" | PrivateSpaceUserId | "both";

export interface PrivateSpaceUser {
	id: PrivateSpaceUserId;
	name: string;
	roleLabel: string;
	bio: string;
	accent: string;
}

export interface PrivateSpaceEntry {
	id: string;
	title: string;
	excerpt: string;
	content: string;
	authorId: PrivateSpaceUserId;
	type: PrivateSpaceEntryType;
	visibility: PrivateSpaceVisibility;
	recipient: PrivateSpaceRecipient;
	status: PrivateSpaceStatus;
	tags: string[];
	coverImage?: string;
	createdAt: string;
	updatedAt: string;
	savedAt?: string;
}

export interface PrivateSpaceStats {
	totalEntries: number;
	sharedEntries: number;
	jointEntries: number;
	draftEntries: number;
}

export interface PrivateSpaceComposeFieldConfig {
	id: string;
	label: string;
	placeholder: string;
	helpText: string;
}

export interface CreatePrivateSpaceEntryInput {
	authorId: PrivateSpaceUserId;
	title: string;
	content: string;
	type: PrivateSpaceEntryType;
	visibility: PrivateSpaceVisibility;
	recipient: PrivateSpaceRecipient;
	status: PrivateSpaceStatus;
	tags?: string[];
}

export interface UpdatePrivateSpaceEntryInput {
	title: string;
	content: string;
	type: PrivateSpaceEntryType;
	visibility: PrivateSpaceVisibility;
	recipient: PrivateSpaceRecipient;
	status: PrivateSpaceStatus;
	tags?: string[];
}
