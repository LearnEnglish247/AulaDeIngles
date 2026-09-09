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

## 2) Live intake: email and WhatsApp

There is **no Google Form** on the public site. Contacto and prueba de nivel use:

- Email: `mailto:info@englishstudy.club`
- WhatsApp for mothers, fathers, tutors, or adults (existing `wa.me` link)

**Email Routing (step 1) is required** so those messages reach Gmail.

Privacy: `https://englishstudy.club/privacidad.html` (`/privacy.html` redirects there).

The Cloudflare Worker in `workers/contact-form/` is unused on the live site. Do not deploy it for this change.

## 3) Checklist (Mark)

- [ ] Email Routing onboarded; MX records healthy
- [ ] `info@` → Gmail verified
- [ ] Confirm site never shows `coppercloud47@gmail.com`
- [ ] Confirm public address shows **Plaza centro - Nava** (no house number)
