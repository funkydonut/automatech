/**
 * Vercel Serverless Function: POST /api/contact
 *
 * Env vars (Vercel Project Settings -> Environment Variables):
 * - RESEND_API_KEY (required)
 * - RESEND_FROM (optional) e.g. "Automatech <no-reply@automatech.cx>"
 * - CONTACT_TO (optional)  defaults to "diego@automatech.cx"
 * - ALLOWED_ORIGINS (optional) comma-separated list to validate Origin header
 */
 
function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}
 
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
 
function getClientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length) return xff.split(',')[0].trim();
  const xrip = req.headers['x-real-ip'];
  if (typeof xrip === 'string' && xrip.length) return xrip.trim();
  return (req.socket && req.socket.remoteAddress) || '';
}
 
function parseAllowedOrigins() {
  const raw = process.env.ALLOWED_ORIGINS;
  if (!raw) return null;
  const list = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length ? list : null;
}
 
module.exports = async function handler(req, res) {
  // Basic CORS support (mostly for safety; same-origin calls won't need it)
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Vary', 'Origin');
 
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    return res.status(204).end();
  }
 
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
 
  const allowedOrigins = parseAllowedOrigins();
  const origin = req.headers.origin;
  if (allowedOrigins && origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ ok: false, error: 'Forbidden' });
  }
  if (origin) {
    // If Origin exists, reflect it (or "*" when not enforcing)
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins ? origin : '*');
  }
 
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ ok: false, error: 'Server not configured (missing RESEND_API_KEY)' });
  }
 
  const body =
    typeof req.body === 'string'
      ? (() => {
          try {
            return JSON.parse(req.body);
          } catch {
            return {};
          }
        })()
      : (req.body || {});
 
  // Honeypot field: should be empty (bots often fill it)
  if (isNonEmptyString(body.company)) {
    return res.status(200).json({ ok: true }); // pretend success to discourage bots
  }
 
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
 
  if (!name || name.length > 120) {
    return res.status(400).json({ ok: false, error: 'Nombre inválido' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || email.length > 254 || !emailRegex.test(email)) {
    return res.status(400).json({ ok: false, error: 'Email inválido' });
  }
  if (!message || message.length > 5000) {
    return res.status(400).json({ ok: false, error: 'Mensaje inválido' });
  }
 
  const to = process.env.CONTACT_TO || 'diego@automatech.cx';
  const from = process.env.RESEND_FROM || 'Automatech <onboarding@resend.dev>';
 
  const ip = getClientIp(req);
  const userAgent = req.headers['user-agent'] || '';
  const referer = req.headers.referer || '';
 
  const subject = `Nueva solicitud — ${name}`;
  const text =
    `Nueva solicitud desde Automatech\n\n` +
    `Nombre: ${name}\n` +
    `Email: ${email}\n\n` +
    `Mensaje:\n${message}\n\n` +
    `---\n` +
    `IP: ${ip}\n` +
    `User-Agent: ${userAgent}\n` +
    `Referer: ${referer}\n`;
 
  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
      <h2>Nueva solicitud</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Mensaje:</strong></p>
      <pre style="white-space: pre-wrap; background:#f6f6f6; padding:12px; border-radius:8px; border:1px solid #eee;">${escapeHtml(message)}</pre>
      <hr style="border:none;border-top:1px solid #eee;margin:16px 0;" />
      <p style="color:#666;font-size:12px;">
        IP: ${escapeHtml(ip)}<br/>
        User-Agent: ${escapeHtml(userAgent)}<br/>
        Referer: ${escapeHtml(referer)}
      </p>
    </div>
  `.trim();
 
  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
        html,
        reply_to: email,
      }),
    });
 
    const data = await resp.json().catch(() => ({}));
 
    if (!resp.ok) {
      // Avoid leaking provider details to the client
      console.error('Resend error:', resp.status, data);
      return res.status(502).json({ ok: false, error: 'No se pudo enviar el mensaje. Inténtalo de nuevo.' });
    }
 
    return res.status(200).json({ ok: true, id: data.id });
  } catch (err) {
    console.error('Contact endpoint error:', err);
    return res.status(500).json({ ok: false, error: 'Error del servidor. Inténtalo de nuevo.' });
  }
};

