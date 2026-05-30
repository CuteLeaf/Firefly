import type { APIRoute } from "astro";
import { getBlogPostById, updateBlogPost, deleteBlogPost } from "@/lib/db";

export const GET: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  const post = await getBlogPostById(id);
  if (!post) return new Response("Not found", { status: 404 });
  return new Response(JSON.stringify(post), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const PUT: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);
  const data = await request.json();
  const post = await updateBlogPost(id, data);
  if (!post) return new Response("Not found", { status: 404 });
  return new Response(JSON.stringify(post), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  const ok = await deleteBlogPost(id);
  if (!ok) return new Response("Not found", { status: 404 });
  return new Response(null, { status: 204 });
};
