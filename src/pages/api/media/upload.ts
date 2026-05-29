import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const backendBase = (import.meta.env.PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
  if (!backendBase) {
    return new Response("PUBLIC_API_BASE_URL is not configured", { status: 500 });
  }

  const token = request.headers.get("x-admin-token");
  if (!token) {
    return new Response("Missing X-ADMIN-TOKEN header", { status: 401 });
  }

  const formData = await request.formData();

  const upstream = await fetch(`${backendBase}/api/admin/media/upload`, {
    method: "POST",
    headers: { "X-ADMIN-TOKEN": token },
    body: formData,
  });

  const body = await upstream.text();
  return new Response(body, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
};
