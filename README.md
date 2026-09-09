> **Status (2026-09-09):** Public site is the full academy site. Homepage first screen includes the line **Abrimos en verano de 2027**. Snapshot of the older full-site drop: branch `site-full-ready-2027`. See `SITE-ARCHIVE.md`.

# Aula de Inglés Nava — englishstudy.club

Public site for **Aula de Inglés Nava** (Plaza centro - Nava).

## Live site

- Homepage: academy hero (licensed classroom photo), age strip, sticky mobile CTA, with “Abrimos en verano de 2027” centred on the first screen.
- Logos: `assets/logo-sidebar.png` and `assets/logo-mobile-banner.png`.
- Fonts: Libre Baskerville + Inter, self-hosted under `assets/fonts/` (no Google Fonts).
- Public email: `info@englishstudy.club` (see `ops/EMAIL-ROUTING.md`).
- Public address: **Plaza centro - Nava** (no house or street number).
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
