import type { APIRoute } from "astro";
import { getBlogPost } from "@/lib/db";

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;
  if (!slug) return new Response("Missing slug", { status: 400 });
  const post = await getBlogPost(slug);
  if (!post) return new Response("Not found", { status: 404 });
  return new Response(JSON.stringify(post), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
