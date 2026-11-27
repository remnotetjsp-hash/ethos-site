// Envia um vídeo da Ethos como RASCUNHO para a conta conectada (video.upload).
function tok(req){const m=(req.headers.get("Cookie")||"").match(/tt_token=([^;]+)/);return m&&m[1];}
export async function onRequestPost({ request }) {
  const t = tok(request);
  if (!t) return new Response(JSON.stringify({ erro: "Conecte o TikTok primeiro" }), { status: 401 });
  const buf = await request.arrayBuffer();
  const size = buf.byteLength;
  const init = await fetch("https://open.tiktokapis.com/v2/post/publish/inbox/video/init/", {
    method: "POST",
    headers: { Authorization: `Bearer ${t}`, "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ source_info: { source: "FILE_UPLOAD", video_size: size, chunk_size: size, total_chunk_count: 1 } }),
  });
  const j = await init.json();
  if (!j.data || !j.data.upload_url) return new Response(JSON.stringify({ erro: j.error || j }), { status: 400 });
  const put = await fetch(j.data.upload_url, {
    method: "PUT",
    headers: { "Content-Type": "video/mp4", "Content-Range": `bytes 0-${size - 1}/${size}`, "Content-Length": String(size) },
    body: buf,
  });
  return new Response(JSON.stringify({ ok: put.ok, status: put.status, publish_id: j.data.publish_id }), { headers: { "Content-Type": "application/json" } });
}
