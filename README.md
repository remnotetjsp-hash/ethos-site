# Site da Ethos Marketing Jurídico

Site estático de uma página, publicado na Cloudflare Pages (sem etapa de build: a pasta raiz é o site).

- `index.html`: a página
- `img/` e `ig/`: fotos dos sócios e posts do Instagram
- `_headers`: cabeçalhos de segurança e cache

## TikTok (envio de rascunho)
Ferramenta interna em `/tiktok/` com funções em `functions/api/tiktok/`. Variáveis no Cloudflare Pages: `TIKTOK_CLIENT_KEY` e `TIKTOK_CLIENT_SECRET` (segredo). Hoje apontam para o sandbox do app; trocar pelas credenciais de produção quando o TikTok aprovar.
