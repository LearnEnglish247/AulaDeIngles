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

## 2) Live intake

- **Prueba de nivel** (`/prueba-de-nivel/`): Google Form embed, open-in-new-tab fallback, plus email and WhatsApp as secondary options. Responses go to the operator Google account that owns the form. Do **not** publish that Gmail or the linked spreadsheet edit URL on the public site.
- **Contacto** (`/contacto/`): Google Form embed, open-in-new-tab fallback, plus email and WhatsApp. Responses go to the operator Google account that owns the form. Do **not** publish that Gmail or the linked spreadsheet edit URL on the public site.

`mailto:info@englishstudy.club` remains. **Email Routing (step 1) is still required** so those messages reach Gmail.

Privacy: `https://englishstudy.club/privacidad.html` (`/privacy.html` redirects there).

The Cloudflare Worker in `workers/contact-form/` is unused on the live site. Do not deploy it for this change.

## 3) Checklist (Mark)

- [ ] Email Routing onboarded; MX records healthy
- [ ] `info@` → Gmail verified
- [ ] Google Form on `/prueba-de-nivel/` receiving responses
- [ ] Google Form on `/contacto/` receiving responses
- [ ] Confirm site never shows `coppercloud47@gmail.com`
- [ ] Confirm public address shows **Nava** (no house number)
