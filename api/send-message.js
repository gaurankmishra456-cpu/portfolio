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
    const { name, email, message } = req.body || {};

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

    await resend.emails.send({
      from: 'Portfolio Site <site@lallanchitra.com>',
      to: 'gaurank@lallanchitra.com',
      reply_to: cleanEmail,
      subject: `New message from ${cleanName} (via lallanchitra.com)`,
      text: `Name: ${cleanName}\nEmail: ${cleanEmail}\n\nMessage:\n${cleanMessage}`,
      html: `
        <div style="font-family:sans-serif; font-size:14px; color:#16160f;">
          <p><strong>Name:</strong> ${cleanName}</p>
          <p><strong>Email:</strong> ${cleanEmail}</p>
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
