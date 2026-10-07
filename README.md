> **Status (2026-09-09):** Public site is the full academy site. Homepage first screen includes the line **Apertura 2027**. Snapshot of the older full-site drop: branch `site-full-ready-2027`. See `SITE-ARCHIVE.md`.

# Aula de Inglés Nava — englishstudy.club

Public site for **Aula de Inglés Nava** (Nava).

## Live site

- Homepage: academy hero (licensed classroom photo), age strip, sticky mobile CTA, with “Apertura 2027” centred on the first screen.
- Logos: `assets/logo-sidebar.png` and `assets/logo-mobile-banner.png`.
- Fonts: Libre Baskerville + Inter, self-hosted under `assets/fonts/` (no Google Fonts).
- Public email: `info@englishstudy.club` (see `ops/EMAIL-ROUTING.md`).
- Public address: **Nava** (no house or street number).
- Contact: email and WhatsApp (parents, tutors, or adults). Prueba de nivel: embedded Google Form, with open-in-new-tab, email, and WhatsApp as fallback.
- Legal pages: `/aviso-legal.html`, `/privacidad.html`, `/cookies.html`. `/privacy.html` redirects to privacidad. Footer is legal links only.
- There is no shop, products page, or merch storefront.

## Local preview

```bash
python3 -m http.server 8080
# open http://127.0.0.1:8080/
```

## Ops

- Email routing checklist: `ops/EMAIL-ROUTING.md`
- Performance note: `proyecto-valnalon-29julio.html` (~9MB) is **not** linked from site navigation.

## Hosting and deploy (Cloudflare Workers)

The site is served by the Cloudflare Worker `englishstudy-club` using Workers static assets, so Cloudflare issues and renews the TLS certificate. GitHub Pages on `main` is kept only as a fallback.

- Config: `wrangler.jsonc` (assets are the repo root; `.assetsignore` keeps docs, `workers/`, `ops/`, `merch/`, `CNAME` and the config itself off the public site).
- `cloudflare/worker.js` only keeps the old GitHub Pages URL behaviour: http and www redirect (301) to `https://englishstudy.club`, `/page.html` and `/dir/index.html` return 200, `/dir` redirects (301) to `/dir/`, and HSTS is sent.
- Custom domains `englishstudy.club` and `www.englishstudy.club` are Worker Custom Domains (`routes` in `wrangler.jsonc`).
- Preview URL: https://englishstudy-club.coppercloud47.workers.dev

Deploy by hand after merging to `main` (there is no CI deploy):

```bash
git checkout main && git pull
npx wrangler deploy        # needs Node 22+ and `wrangler login`
# On a machine with older Node: bun "$(npm root -g)/wrangler/bin/wrangler.js" deploy
```

Then check `https://englishstudy.club/`, `/aviso-legal.html`, `/prueba-de-nivel/`, `/robots.txt` and `/sitemap.xml` return 200.
