function tok(req){const m=(req.headers.get("Cookie")||"").match(/tt_token=([^;]+)/);return m&&m[1];}
export async function onRequestGet({ request }) {
  const t = tok(request);
  if (!t) return new Response(JSON.stringify({ conectado: false }), { headers: { "Content-Type": "application/json" } });
  const r = await fetch("https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url", { headers: { Authorization: `Bearer ${t}` } });
  const j = await r.json();
  return new Response(JSON.stringify({ conectado: !!j.data, usuario: j.data && j.data.user }), { headers: { "Content-Type": "application/json" } });
}
