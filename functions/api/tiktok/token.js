// Troca o código do TikTok pelo token e guarda em cookie HttpOnly (a chave secreta fica só no servidor).
export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookies = request.headers.get("Cookie") || "";
  if (!code || !cookies.includes(`tt_state=${state}`)) return new Response("Estado inválido", { status: 400 });
  const r = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key: env.TIKTOK_CLIENT_KEY,
      client_secret: env.TIKTOK_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: new URL("/tiktok/callback", request.url).toString(),
    }),
  });
  const j = await r.json();
  if (!j.access_token) return new Response(JSON.stringify({ erro: j.error_description || j.error || "falha" }), { status: 400 });
  return new Response(JSON.stringify({ ok: true, open_id: j.open_id }), {
    headers: { "Content-Type": "application/json", "Set-Cookie": `tt_token=${j.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${j.expires_in || 86400}` },
  });
}
