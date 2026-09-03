# Contact form Worker

Accepts `POST /api/contact` JSON from the native form on `/contacto/` and emails **info@englishstudy.club**.

## Deploy

```bash
cd workers/contact-form
npx wrangler deploy
npx wrangler secret put RESEND_API_KEY
```

Configure a route on the `englishstudy.club` zone so GitHub Pages static hosting and this API share the same host, or point `window.CONTACT_FORM_ENDPOINT` at the workers.dev URL.

Inbound forwarding of `info@` → private Gmail is documented in `ops/EMAIL-ROUTING.md` (never publish that Gmail on the site).
