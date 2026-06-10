import type {
	PrivateSpaceComposeFieldConfig,
	PrivateSpaceEntry,
	PrivateSpaceStats,
	PrivateSpaceUser,
} from "./types";

export const privateSpaceUsers: PrivateSpaceUser[] = [
	{
		id: "you",
		name: "你",
		roleLabel: "主理人",
		bio: "负责把琐碎的日子慢慢记下来，也负责让这个小站一直亮着。",
		accent: "#e07a5f",
	},
	{
		id: "partner",
		name: "TA",
		roleLabel: "共同记录者",
		bio: "可以直接在线写内容、保存草稿、把想说的话留在这里的人。",
		accent: "#3d405b",
	},
];

export const privateSpaceEntries: PrivateSpaceEntry[] = [
	{
		id: "shared-evening-walk",
		title: "河边散步后的十分钟",
		excerpt: "只是很普通的一次散步，但风吹过来的时候，突然觉得这一天值得被记住。",
		content:
			"我们走得很慢，也没说什么大事。回来的时候我在想，这类没有明确主题的傍晚，反而最适合留下来。",
		authorId: "you",
		type: "daily",
		visibility: "shared",
		recipient: "partner",
		status: "saved",
		tags: ["日常", "散步"],
		coverImage: "/gallery/firefly-2026/1.avif",
		createdAt: "2026-06-01T20:10:00+08:00",
		updatedAt: "2026-06-01T20:15:00+08:00",
		savedAt: "2026-06-01T20:15:00+08:00",
	},
	{
		id: "joint-june-plan",
		title: "六月的共同节奏",
		excerpt: "先不用做很满的计划，只保留真正能一起坚持下去的几件事。",
		content:
			"本月优先级：规律作息、每周三次轻运动、每周至少一次一起看完一部作品。",
		authorId: "you",
		type: "fitness",
		visibility: "joint",
		recipient: "both",
		status: "saved",
		tags: ["计划", "锻炼"],
		createdAt: "2026-06-02T08:00:00+08:00",
		updatedAt: "2026-06-05T21:00:00+08:00",
		savedAt: "2026-06-05T21:00:00+08:00",
	},
	{
		id: "partner-book-note",
		title: "这本书为什么想第一时间分享给你",
		excerpt: "不是因为它宏大，而是因为它很像我们平时会认真聊很久的那种作品。",
		content:
			"如果以后做成在线写作，这类内容会从页面编辑器直接进 KV，再同步到前台阅读页。",
		authorId: "partner",
		type: "recommendation",
		visibility: "shared",
		recipient: "you",
		status: "saved",
		tags: ["书", "推荐"],
		coverImage: "/gallery/firefly-2026/cover.avif",
		createdAt: "2026-05-20T22:10:00+08:00",
		updatedAt: "2026-05-20T22:10:00+08:00",
		savedAt: "2026-05-20T22:10:00+08:00",
	},
	{
		id: "self-unsent-note",
		title: "今天先只给自己看",
		excerpt: "有些情绪还没整理好，先不要直接推给对方，但也不想让它消失。",
		content:
			"这类内容未来最适合 visibility=self。页面上能写、能保存，但只有作者本人能进入。",
		authorId: "partner",
		type: "hard_to_say",
		visibility: "self",
		recipient: "self",
		status: "saved",
		tags: ["情绪", "私密"],
		createdAt: "2026-06-08T23:20:00+08:00",
		updatedAt: "2026-06-08T23:20:00+08:00",
		savedAt: "2026-06-08T23:20:00+08:00",
	},
	{
		id: "shared-draft-message",
		title: "还没发出去的话",
		excerpt: "如果以后做在线编辑，这条会停留在 draft，不会立刻进入共享内容流。",
		content:
			"这是一条草稿示例，用来展示未来在线写作的状态流转：draft -> saved(shared/self/joint) -> archived。",
		authorId: "you",
		type: "hard_to_say",
		visibility: "shared",
		recipient: "partner",
		status: "draft",
		tags: ["草稿", "想说的话"],
		createdAt: "2026-06-10T09:00:00+08:00",
		updatedAt: "2026-06-10T11:40:00+08:00",
	},
];

export const privateSpaceComposeFields: PrivateSpaceComposeFieldConfig[] = [
	{
		id: "title",
		label: "标题",
		placeholder: "例如：今天想留给你的那段话",
		helpText: "未来会进入在线编辑器的首行字段，对应 KV entry.title。",
	},
	{
		id: "content",
		label: "正文",
		placeholder: "把今天的记录、推荐、计划或难开口的话写在这里",
		helpText: "未来会支持 Markdown/富文本二选一，这里先保留结构。",
	},
	{
		id: "visibility",
		label: "可见范围",
		placeholder: "self / shared / joint",
		helpText: "决定这条内容只给自己看、双方共享，还是归入共同内容。",
	},
	{
		id: "recipient",
		label: "写给谁",
		placeholder: "self / partner / both",
		helpText: "让内容天然带上对象感，后续可形成“写给我的”视图。",
	},
];

export function buildPrivateSpaceStats(
	entries: PrivateSpaceEntry[],
): PrivateSpaceStats {
	return {
		totalEntries: entries.length,
		sharedEntries: entries.filter((entry) => entry.visibility === "shared")
			.length,
		jointEntries: entries.filter((entry) => entry.visibility === "joint").length,
		draftEntries: entries.filter((entry) => entry.status === "draft").length,
	};
}

