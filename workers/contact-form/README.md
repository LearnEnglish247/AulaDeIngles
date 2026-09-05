# Contact form Worker

Unused. Live site intake is **Google Forms** on `/contacto/` and `/prueba-de-nivel/` (see `ops/EMAIL-ROUTING.md`).

This Worker is kept in the repo only as optional infrastructure. It is not wired into the public pages.

Accepts `POST /api/contact` JSON and emails **info@englishstudy.club**.

## Deploy (optional)

```bash
cd workers/contact-form
npx wrangler deploy
npx wrangler secret put RESEND_API_KEY
```

Configure a route on the `englishstudy.club` zone so GitHub Pages static hosting and this API share the same host, or point `window.CONTACT_FORM_ENDPOINT` at the workers.dev URL.

Inbound forwarding of `info@` → private Gmail is documented in `ops/EMAIL-ROUTING.md` (never publish that Gmail on the site).
