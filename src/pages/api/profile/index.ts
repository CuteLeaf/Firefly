import type { APIRoute } from "astro";
import { getProfile, saveProfile } from "@/lib/db";

export const GET: APIRoute = async () => {
  const profile = await getProfile();
  return new Response(JSON.stringify(profile), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const PUT: APIRoute = async ({ request }) => {
  const data = await request.json();
  const profile = await saveProfile(data);
  return new Response(JSON.stringify(profile), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
