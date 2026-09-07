> **Status (2026-09-07):** Public site is a **coming-soon** page (apertura verano 2027). Full site snapshot: branch `site-full-ready-2027`. See `SITE-ARCHIVE.md`.

# Aula de Inglés Nava — englishstudy.club

Public site for **Aula de Inglés Nava** (Plaza centro - Nava).

## Live site

- Homepage hero: licensed classroom photo (`assets/hero-classroom-640/1000.webp`), “cerca de casa”, age strip, sticky mobile CTA.
- Logos: `assets/logo-sidebar.png` and `assets/logo-mobile-banner.png`.
- Fonts: Libre Baskerville + Inter.
- Public email: `info@englishstudy.club` (see `ops/EMAIL-ROUTING.md`).
- Public address: **Plaza centro - Nava**.
- Intake: Google Forms on `/contacto/` and `/prueba-de-nivel/` (responses go to the operator Google Sheets). Email Routing is still needed for `mailto:info@englishstudy.club`.
- There is no shop, products page, or merch storefront.

## Local preview

```bash
python3 -m http.server 8080
# open http://127.0.0.1:8080/
```

## Ops

- Email routing checklist: `ops/EMAIL-ROUTING.md`
- Performance note: `proyecto-valnalon-29julio.html` (~9MB) is **not** linked from site navigation.
