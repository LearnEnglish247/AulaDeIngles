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

## 2) Live intake: Google Forms

Public intake on the site is **Google Forms** (not a bot and not the unused `/api/contact` Worker).

- **Contacto** (`/contacto/`): embed + open-in-new-tab fallback.
- **Prueba de nivel** (`/prueba-de-nivel/`): embed + open-in-new-tab fallback (long form; iframe ≥ 1600px).

Responses are delivered to the operator Gmail / Google Sheets that own the forms. Do **not** publish that Gmail on the site.

`mailto:info@englishstudy.club` remains on Contacto (and elsewhere) as an extra path. **Email Routing (step 1) is still required** so those messages reach Gmail.

Privacy policy linked from the Contacto form: `https://englishstudy.club/privacy.html`.

The Cloudflare Worker in `workers/contact-form/` is unused on the live site.

## 3) Checklist (Mark)

- [ ] Email Routing onboarded; MX records healthy
- [ ] `info@` → Gmail verified (needed for mailto extras)
- [ ] Google Forms receiving Contacto and Prueba de nivel responses
- [ ] Test form submission end-to-end (embed + fallback link)
- [ ] Confirm site never shows `coppercloud47@gmail.com`
- [ ] Confirm public address shows **Plaza centro - Nava**
