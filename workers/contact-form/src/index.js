/**
 * Contact form API for englishstudy.club (GitHub Pages front).
 * Delivers to info@englishstudy.club — never expose private Gmail on the site.
 *
 * Secrets (optional but recommended):
 *   RESEND_API_KEY — https://resend.com
 *
 * Without RESEND_API_KEY the Worker still validates + stores nothing and returns 503
 * so the site can fall back to mailto.
 */

const PROFILE_LABELS = {
  ninos: 'Niños',
  jovenes: 'Jóvenes',
  adultos: 'Adultos',
  negocios: 'Negocios locales',
  otro: 'Otro',
};

function corsHeaders(origin, allowOrigin) {
  const allowed = !origin || origin === allowOrigin || origin.endsWith('englishstudy.club') || origin.startsWith('http://127.0.0.1') || origin.startsWith('http://localhost');
  return {
    'Access-Control-Allow-Origin': allowed ? (origin || allowOrigin) : allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Max-Age': '86400',
  };
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
  });
}

function sanitize(value, max) {
  return String(value || '').trim().slice(0, max);
}

export default {
  async fetch(request, env) {
    const allowOrigin = env.ALLOW_ORIGIN || 'https://englishstudy.club';
    const headers = corsHeaders(request.headers.get('Origin'), allowOrigin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== 'POST') {
      return json({ ok: false, error: 'method_not_allowed' }, 405, headers);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: 'invalid_json' }, 400, headers);
    }

    // Honeypot
    if (body.website) {
      return json({ ok: true }, 200, headers);
    }

    const name = sanitize(body.name, 120);
    const email = sanitize(body.email, 160);
    const profile = sanitize(body.profile, 40);
    const locality = sanitize(body.locality, 120);
    const message = sanitize(body.message, 4000);
    const consent = !!body.consent;

    if (!name || !email || !message || !consent) {
      return json({ ok: false, error: 'missing_fields' }, 400, headers);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ ok: false, error: 'invalid_email' }, 400, headers);
    }

    const to = env.TO_EMAIL || 'info@englishstudy.club';
    const from = env.FROM_EMAIL || 'noreply@englishstudy.club';
    const profileLabel = PROFILE_LABELS[profile] || profile || '—';
    const text = [
      'Nueva solicitud desde englishstudy.club',
      '',
      `Nombre: ${name}`,
      `Email: ${email}`,
      `Perfil: ${profileLabel}`,
      `Localidad: ${locality || '—'}`,
      `Fuente: ${sanitize(body.source, 120) || '/contacto/'}`,
      `Enviado: ${sanitize(body.sentAt, 40) || new Date().toISOString()}`,
      '',
      'Mensaje:',
      message,
    ].join('\n');

    if (!env.RESEND_API_KEY) {
      return json({ ok: false, error: 'mail_not_configured' }, 503, headers);
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Aula de Inglés Nava <${from}>`,
        to: [to],
        reply_to: email,
        subject: `Solicitud de información — ${name}`,
        text,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error('Resend error', res.status, detail);
      return json({ ok: false, error: 'mail_failed' }, 502, headers);
    }

    return json({ ok: true }, 200, headers);
  },
};
