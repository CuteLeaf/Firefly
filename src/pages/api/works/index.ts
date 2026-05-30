import type { APIRoute } from "astro";
import { getWorks, createWork } from "@/lib/db";

export const GET: APIRoute = async () => {
  const works = await getWorks();
  return new Response(JSON.stringify(works), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  const work = await createWork(data);
  return new Response(JSON.stringify(work), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
