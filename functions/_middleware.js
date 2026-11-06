// Quem abrir o endereço provisório (.pages.dev) vai direto para o domínio oficial.
// As prévias de cada versão (xxxx.ethosmarketingjuridico.pages.dev) continuam abrindo normalmente.
// O www -> domínio sem www fica numa Redirect Rule da Cloudflare, fora daqui.
export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.hostname === "ethosmarketingjuridico.pages.dev") {
    url.hostname = "ethosmarketingjuridico.com.br";
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
