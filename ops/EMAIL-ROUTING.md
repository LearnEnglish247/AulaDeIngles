# Email routing — info@englishstudy.club

**Public address on the site:** `info@englishstudy.club`  
**Never publish on the site:** `coppercloud47@gmail.com`

Goal: people write to `info@englishstudy.club`; mail is forwarded privately to Mark’s Gmail.

## 1) Cloudflare Email Routing (preferred)

Requires the domain `englishstudy.club` on Cloudflare DNS.

1. Cloudflare Dashboard → **Email** / **Email Service** → **Email Routing**.
2. **Onboard Domain** for `englishstudy.club` (Cloudflare adds MX + SPF + DKIM).
3. Add destination address: `coppercloud47@gmail.com` and confirm the verification email from Cloudflare.
4. Create a routing rule:
   - Custom address: `info@englishstudy.club`
   - Action: Forward to `coppercloud47@gmail.com`
5. Send a test message to `info@englishstudy.club` and confirm it arrives in Gmail.
6. Optional: catch-all forward for other aliases; keep only `info@` public on the website.

Docs: [Route emails](https://developers.cloudflare.com/email-service/get-started/route-emails/)

## 2) Contact form delivery

The native form on `/contacto/` posts JSON to `/api/contact` (Cloudflare Worker in `workers/contact-form/`).

Until the Worker is deployed:

- The form falls back to a `mailto:info@englishstudy.club` draft with the same fields.
- That still lands in Gmail once Email Routing (step 1) is live.

### Deploy the Worker

```bash
cd workers/contact-form
npx wrangler login
npx wrangler secret put RESEND_API_KEY   # or leave unset to use Email Routing + Resend later
npx wrangler deploy
```

Recommended route (Cloudflare in front of GitHub Pages):

- Worker route: `englishstudy.club/api/contact*`
- Or dedicated host: `contact-api.englishstudy.club`

Set public endpoint override if needed (before `script.js`):

```html
<script>window.CONTACT_FORM_ENDPOINT='https://contact-api.englishstudy.club';</script>
```

The Worker sends mail **to** `info@englishstudy.club` (public identity). Routing then forwards privately to Gmail.

## 3) DNS / Shopify checklist (Mark)

- [ ] Email Routing onboarded; MX records healthy
- [ ] `info@` → Gmail verified
- [ ] Worker deployed for `/api/contact` (or endpoint override set)
- [ ] Test form submission end-to-end
- [ ] Shopify store created; products use files in `merch/shopify-print/`
- [ ] `shop.englishstudy.club` CNAME → Shopify (when ready)
- [ ] Replace placeholder shop link on `/tienda/`
- [ ] Confirm site never shows `coppercloud47@gmail.com`
- [ ] Confirm public address shows **Plaza centro - Nava**
