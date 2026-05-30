import type { APIRoute } from "astro";
import { getWork, updateWork, deleteWork } from "@/lib/db";

export const GET: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  const work = await getWork(id);
  if (!work) return new Response("Not found", { status: 404 });
  return new Response(JSON.stringify(work), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const PUT: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);
  const data = await request.json();
  const work = await updateWork(id, data);
  if (!work) return new Response("Not found", { status: 404 });
  return new Response(JSON.stringify(work), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  const ok = await deleteWork(id);
  if (!ok) return new Response("Not found", { status: 404 });
  return new Response(null, { status: 204 });
};
