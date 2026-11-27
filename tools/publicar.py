#!/usr/bin/env python3
"""Ponte "posta em tudo" da Ethos.

Uso:  python3 tools/publicar.py post.json [--executar]
Sem --executar só mostra o plano (nada é publicado).

post.json:
{ "titulo": "...", "legenda": "...", "video": "caminho/ou.mp4", "tags": ["..."],
  "youtube_publish_at": "2026-12-01T21:00:00Z",      # opcional (agenda)
  "plataformas": ["youtube", "tiktok", "linkedin", "instagram"] }

Credenciais (variáveis de ambiente, nunca no código):
  YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN   -> YouTube Data API
Estado por plataforma:
  youtube   -> automático por API (este script)
  tiktok    -> rascunho pelo site /tiktok/ (até o TikTok aprovar o app); depois, direct post
  linkedin  -> página da Ethos pelo Chrome (a API de página precisa de aprovação)
  instagram -> API já ligada em outra conversa
"""
import json, os, sys, urllib.parse, urllib.request

def yt_token():
    d = urllib.parse.urlencode(dict(client_id=os.environ["YT_CLIENT_ID"], client_secret=os.environ["YT_CLIENT_SECRET"],
        refresh_token=os.environ["YT_REFRESH_TOKEN"], grant_type="refresh_token")).encode()
    return json.load(urllib.request.urlopen("https://oauth2.googleapis.com/token", d))["access_token"]

def yt_upload(p, at):
    status = {"privacyStatus": "private" if p.get("youtube_publish_at") else "public", "selfDeclaredMadeForKids": False}
    if p.get("youtube_publish_at"): status["publishAt"] = p["youtube_publish_at"]
    meta = {"snippet": {"title": p["titulo"], "description": p["legenda"], "tags": p.get("tags", []), "categoryId": "27",
            "defaultLanguage": "pt-BR"}, "status": status}
    H = {"Authorization": "Bearer " + at, "Content-Type": "application/json; charset=UTF-8",
         "X-Upload-Content-Type": "video/mp4"}
    req = urllib.request.Request("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
                                 data=json.dumps(meta).encode(), headers=H, method="POST")
    url = urllib.request.urlopen(req).headers["Location"]
    data = open(p["video"], "rb").read()
    up = urllib.request.Request(url, data=data, headers={"Content-Type": "video/mp4"}, method="PUT")
    return json.load(urllib.request.urlopen(up))["id"]

def yt_metricas(at):
    H = {"Authorization": "Bearer " + at}
    g = lambda u: json.load(urllib.request.urlopen(urllib.request.Request(u, headers=H)))
    up = g("https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true")["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]
    ids = ",".join(i["snippet"]["resourceId"]["videoId"] for i in g(f"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId={up}")["items"])
    for v in g(f"https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id={ids}")["items"]:
        s = v["statistics"]; print(v["snippet"]["title"][:50], "| views", s.get("viewCount"), "| likes", s.get("likeCount"))

if __name__ == "__main__":
    if sys.argv[1] == "metricas": yt_metricas(yt_token()); sys.exit()
    p = json.load(open(sys.argv[1])); go = "--executar" in sys.argv
    for pl in p.get("plataformas", ["youtube", "tiktok", "linkedin", "instagram"]):
        if pl == "youtube":
            print("youtube:", yt_upload(p, yt_token()) if go else "(plano) subir e agendar via API")
        elif pl == "tiktok": print("tiktok: abrir https://ethosmarketingjuridico.com.br/tiktok/ e enviar o vídeo (rascunho)")
        elif pl == "linkedin": print("linkedin: agendar na página pelo Chrome (ver memória linkedin-agendamento-pagina-ethos)")
        elif pl == "instagram": print("instagram: publicar pela API da outra conversa")
