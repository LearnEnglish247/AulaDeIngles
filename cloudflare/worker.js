// englishstudy.club on Cloudflare Workers static assets.
// The site itself is the static files in the repo root (see .assetsignore).
// This small Worker only keeps the URL behaviour the site had on GitHub Pages:
//   - http -> https and www -> apex (301), /dir -> /dir/ (301)
//   - /page.html and /dir/index.html answer 200 (Workers would otherwise redirect them)
//   - HSTS header, same value GitHub Pages sent

const CANONICAL_HOST = "englishstudy.club";
const HSTS = "max-age=31556952";

function withHsts(res) {
  // Assets answer /clases with a 307 to /clases/; GitHub Pages used a 301.
  if (res.status === 307) {
    const location = res.headers.get("Location");
    if (location) {
      return new Response(null, {
        status: 301,
        headers: { Location: location, "Strict-Transport-Security": HSTS },
      });
    }
  }
  const out = new Response(res.body, res);
  out.headers.set("Strict-Transport-Security", HSTS);
  return out;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isSiteHost = url.hostname === CANONICAL_HOST || url.hostname === "www." + CANONICAL_HOST;

    if (isSiteHost && (url.protocol === "http:" || url.hostname !== CANONICAL_HOST)) {
      url.protocol = "https:";
      url.hostname = CANONICAL_HOST;
      return Response.redirect(url.toString(), 301);
    }

    // GitHub Pages served /aviso-legal.html and /clases/index.html directly.
    // Workers assets would 307 them to /aviso-legal and /clases/, so look up the
    // clean path and return that file with a 200 at the .html URL.
    if (url.pathname.endsWith(".html")) {
      const alt = new URL(url);
      alt.pathname = url.pathname.endsWith("/index.html")
        ? url.pathname.slice(0, -"index.html".length)
        : url.pathname.slice(0, -".html".length);
      const res = await env.ASSETS.fetch(new Request(alt, request));
      if (res.status === 200 || res.status === 304) return withHsts(res);
    }

    return withHsts(await env.ASSETS.fetch(request));
  },
};
