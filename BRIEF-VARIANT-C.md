# Variant C brief — englishstudy.club

Brand-locked homepage/layout upgrade for **Aula de Inglés Nava** (GitHub Pages: LearnEnglish247/AulaDeIngles).

## Direction

**Variant C** — local Asturias hills / “cerca de casa” / age strip / sticky mobile CTA / merch-ready.

Mood only; production uses **real logo files**.

## Hard locks

- **Logo:** ONLY existing `assets/logo-sidebar.png` and `assets/logo-mobile-banner.png`. Never invent crests or new wordmarks.
- **Fonts:** Libre Baskerville + Inter stay.
- **Colors:** existing cream/navy/burgundy/gold in `styles.css`.
- **NO photoreal AI images of children** (no generated kid faces). Age bands = icons / illustration / empty classroom / hills only.
- **Public address** MUST be **Plaza centro - Nava** everywhere (replace Calle Colegiata, 3; fix maps iframe + all JSON-LD `PostalAddress`).
- **Public email** MUST be **info@englishstudy.club** everywhere (replace `asturingles.nava@gmail.com` on pages). **NEVER** publish `coppercloud47@gmail.com`.
- **WhatsApp links:** leave as-is unless they break; do not print phone numbers in new copy blocks.
- Do not merge. One draft PR. No AdSense.

## Function

1. Implement Variant C homepage (and consistent chrome).
2. Native contact form (kill Google Forms iframe) that can deliver to `info@englishstudy.club`. Prefer a maintainable approach on Pages (Worker/Form backend if available; otherwise solid native form + clear ops doc). Add `ops/EMAIL-ROUTING.md`: Cloudflare Email Routing (or equivalent) so `info@` forwards to `coppercloud47@gmail.com` without showing that Gmail on the site.
3. Update privacy page contact identity as needed.
4. Merch: create `merch/shopify-print/` with SVG vector print files using the real logo for tote, mug, notebook, sticker + short README for Shopify upload. No fake AI product photos as the product files.
5. Performance: don’t ship the 9MB `proyecto-valnalon` page in nav; note in PR.
6. Level test: if quick, brand-native shell; else keep embed but style container — don’t regress.
7. Tienda: show merch designs + honest Shopify path (link placeholder OK).

## Ops checklist (Mark)

See PR body and `ops/EMAIL-ROUTING.md` for DNS / Email Routing / Shopify steps.
