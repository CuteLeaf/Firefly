import type { APIRoute } from "astro";
import { getBlogPosts, createBlogPost } from "@/lib/db";

export const GET: APIRoute = async () => {
  const posts = await getBlogPosts();
  return new Response(JSON.stringify(posts), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  const post = await createBlogPost(data);
  return new Response(JSON.stringify(post), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
