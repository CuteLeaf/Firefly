import { getSortedPosts } from "@/utils/content-utils";

export async function GET() {
	const posts = await getSortedPosts();
	const data = posts.map((post) => ({
		path: `src/content/posts/${post.id}.md`,
		sha: "mock",
		title: post.data.title,
		description: post.data.description || "",
		published: post.data.published,
		updated: post.data.updated || post.data.published,
		draft: post.data.draft ?? false,
		tags: post.data.tags || [],
		category: post.data.category || "",
		image: post.data.image || "",
		pinned: post.data.pinned ?? false,
		comment: post.data.comment ?? true,
		author: post.data.author || "",
		sourceLink: post.data.sourceLink || "",
		password: post.data.password || "",
		content: post.body || "",
	}));
	return new Response(JSON.stringify(data), {
		headers: { "Content-Type": "application/json" },
	});
}
