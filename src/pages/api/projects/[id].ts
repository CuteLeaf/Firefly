import type { APIRoute } from "astro";
import { getProject, updateProject, deleteProject } from "@/lib/db";

export const GET: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  const project = await getProject(id);
  if (!project) return new Response("Not found", { status: 404 });
  return new Response(JSON.stringify(project), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const PUT: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);
  const data = await request.json();
  const project = await updateProject(id, data);
  if (!project) return new Response("Not found", { status: 404 });
  return new Response(JSON.stringify(project), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  const ok = await deleteProject(id);
  if (!ok) return new Response("Not found", { status: 404 });
  return new Response(null, { status: 204 });
};
