export async function onRequest(context) {
  const { env, request } = context;
  const clientId = env.GITHUB_CLIENT_ID;
  
  if (!clientId) {
    return new Response("GITHUB_CLIENT_ID not configured", { status: 500 });
  }

  const url = new URL(request.url);
  const redirectUri = `${url.origin}/callback`;
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "repo,user",
    state: crypto.randomUUID(),
  });

  return Response.redirect(
    `https://github.com/login/oauth/authorize?${params}`,
    302
  );
}
