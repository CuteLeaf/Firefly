import type { APIRoute } from "astro";
import { getProjects, createProject } from "@/lib/db";

export const GET: APIRoute = async () => {
  const projects = await getProjects();
  return new Response(JSON.stringify(projects), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  const project = await createProject(data);
  return new Response(JSON.stringify(project), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
