// Inicia o login do TikTok (Login Kit) e manda o usuário para a tela de autorização.
export async function onRequestGet({ env, request }) {
  const state = crypto.randomUUID();
  const redirect = new URL("/tiktok/callback", request.url).toString();
  const u = new URL("https://www.tiktok.com/v2/auth/authorize/");
  u.searchParams.set("client_key", env.TIKTOK_CLIENT_KEY);
  u.searchParams.set("scope", "user.info.basic,video.upload");
  u.searchParams.set("response_type", "code");
  u.searchParams.set("redirect_uri", redirect);
  u.searchParams.set("state", state);
  return new Response(null, {
    status: 302,
    headers: { Location: u.toString(), "Set-Cookie": `tt_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600` },
  });
}
