// Endereço oficial único: ethosmarketingjuridico.com.br
// Quem abrir o endereço provisório (.pages.dev) ou o www vai direto para o domínio oficial.
// As prévias de cada versão (xxxx.ethosmarketingjuridico.pages.dev) continuam abrindo normalmente.
const OFICIAL = "ethosmarketingjuridico.com.br";
const REDIRECIONAR = new Set(["ethosmarketingjuridico.pages.dev", "www." + OFICIAL]);

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (REDIRECIONAR.has(url.hostname)) {
    url.hostname = OFICIAL;
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
