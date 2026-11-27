// /api/send-message.js
// Vercel Serverless Function — sends the contact form message to your inbox via Resend.

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function sanitize(str = '') {
  return String(str).replace(/[<>]/g, '').trim();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message, phone, project, budget, timeline, source } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const cleanName = sanitize(name).slice(0, 200);
    const cleanEmail = sanitize(email).slice(0, 200);
    const cleanMessage = sanitize(message).slice(0, 5000);
    const extras = [
      ['Phone / WhatsApp', phone],
      ['Project', project],
      ['Budget', budget],
      ['Timeline', timeline],
      ['Found via', source]
    ].map(([k, v]) => [k, sanitize(v).slice(0, 200)]).filter(([, v]) => v);
    const extrasText = extras.map(([k, v]) => `${k}: ${v}`).join('\n');
    const extrasHtml = extras.map(([k, v]) => `<p><strong>${k}:</strong> ${v}</p>`).join('');
    const cleanProject = extras.find(([k]) => k === 'Project');

    await resend.emails.send({
      from: 'Portfolio Site <site@lallanchitra.com>',
      to: 'gaurank@lallanchitra.com',
      reply_to: cleanEmail,
      subject: `New enquiry${cleanProject ? ' — ' + cleanProject[1] : ''} from ${cleanName} (lallanchitra.com)`,
      text: `Name: ${cleanName}\nEmail: ${cleanEmail}\n${extrasText}\n\nMessage:\n${cleanMessage}`,
      html: `
        <div style="font-family:sans-serif; font-size:14px; color:#16160f;">
          <p><strong>Name:</strong> ${cleanName}</p>
          <p><strong>Email:</strong> ${cleanEmail}</p>
          ${extrasHtml}
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap;">${cleanMessage}</p>
        </div>
      `
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('send-message error:', err);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
