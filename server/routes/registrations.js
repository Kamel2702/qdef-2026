const express = require('express');
const nodemailer = require('nodemailer');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Helper: send confirmation email (non-blocking, won't fail registration)
async function sendConfirmationEmail(registration) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"Q-DEF Conference" <${process.env.SMTP_USER || 'noreply@qdef.lu'}>`,
      to: registration.email,
      subject: 'Registration Confirmed - Q-DEF Conference Luxembourg 2026',
      html: `
        <h1>Registration Confirmed</h1>
        <p>Dear ${registration.first_name} ${registration.last_name},</p>
        <p>Thank you for registering for the <strong>Q-DEF Conference Luxembourg 2026</strong>.</p>
        <p><strong>Date:</strong> June 12, 2026</p>
        <p><strong>Venue:</strong> European Convention Center Luxembourg (ECCL)</p>
        <p><strong>Your registration details:</strong></p>
        <ul>
          <li>Name: ${registration.first_name} ${registration.last_name}</li>
          <li>Organization: ${registration.organization || 'N/A'}</li>
          <li>Email: ${registration.email}</li>
        </ul>
        <p>We look forward to seeing you at the conference!</p>
        <p>Best regards,<br>Q-DEF Conference Team</p>
      `
    });

    console.log(`Confirmation email sent to ${registration.email}`);
  } catch (err) {
    console.warn(`Failed to send confirmation email to ${registration.email}:`, err.message);
    // Do not throw - email failure should not block registration
  }
}

// POST /api/register - public registration
router.post('/', (req, res) => {
  try {
    const {
      first_name, last_name, organization, position,
      email, country, dietary_requirements,
      accessibility_needs, gdpr_consent
    } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !email) {
      return res.status(400).json({ error: 'First name, last name, and email are required.' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    // Check GDPR consent
    if (!gdpr_consent) {
      return res.status(400).json({ error: 'GDPR consent is required to register.' });
    }

    // Check duplicate email
    const existing = db.prepare('SELECT id FROM registrations WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ error: 'This email address is already registered.' });
    }

    const result = db.prepare(`
      INSERT INTO registrations (first_name, last_name, organization, position, email, country, dietary_requirements, accessibility_needs, gdpr_consent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      first_name, last_name,
      organization || null, position || null,
      email, country || null,
      dietary_requirements || null, accessibility_needs || null,
      gdpr_consent ? 1 : 0
    );

    const registration = db.prepare('SELECT * FROM registrations WHERE id = ?').get(result.lastInsertRowid);

    // Send confirmation email in the background (don't await / don't block response)
    sendConfirmationEmail(registration);

    res.status(201).json({
      message: 'Registration successful. A confirmation email will be sent shortly.',
      registration
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/registrations - list all registrations (admin)
router.get('/', authMiddleware, (req, res) => {
  try {
    const registrations = db.prepare('SELECT * FROM registrations ORDER BY created_at DESC').all();
    res.json(registrations);
  } catch (err) {
    console.error('List registrations error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/registrations/export - export as CSV (admin)
router.get('/export', authMiddleware, (req, res) => {
  try {
    const registrations = db.prepare('SELECT * FROM registrations ORDER BY created_at DESC').all();

    const headers = [
      'ID', 'First Name', 'Last Name', 'Organization', 'Position',
      'Email', 'Country', 'Dietary Requirements', 'Accessibility Needs',
      'GDPR Consent', 'Registered At'
    ];

    const csvRows = [headers.join(',')];

    for (const reg of registrations) {
      const row = [
        reg.id,
        `"${(reg.first_name || '').replace(/"/g, '""')}"`,
        `"${(reg.last_name || '').replace(/"/g, '""')}"`,
        `"${(reg.organization || '').replace(/"/g, '""')}"`,
        `"${(reg.position || '').replace(/"/g, '""')}"`,
        `"${(reg.email || '').replace(/"/g, '""')}"`,
        `"${(reg.country || '').replace(/"/g, '""')}"`,
        `"${(reg.dietary_requirements || '').replace(/"/g, '""')}"`,
        `"${(reg.accessibility_needs || '').replace(/"/g, '""')}"`,
        reg.gdpr_consent ? 'Yes' : 'No',
        `"${reg.created_at || ''}"`
      ];
      csvRows.push(row.join(','));
    }

    const csv = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="qdef-registrations.csv"');
    res.send(csv);
  } catch (err) {
    console.error('Export registrations error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/registrations/stats - get count stats (admin)
router.get('/stats', authMiddleware, (req, res) => {
  try {
    const total = db.prepare('SELECT COUNT(*) as count FROM registrations').get();
    const byCountry = db.prepare('SELECT country, COUNT(*) as count FROM registrations WHERE country IS NOT NULL GROUP BY country ORDER BY count DESC').all();
    const byOrganization = db.prepare('SELECT organization, COUNT(*) as count FROM registrations WHERE organization IS NOT NULL GROUP BY organization ORDER BY count DESC').all();
    const recent = db.prepare("SELECT COUNT(*) as count FROM registrations WHERE created_at >= datetime('now', '-7 days')").get();

    res.json({
      total: total.count,
      recent_week: recent.count,
      by_country: byCountry,
      by_organization: byOrganization
    });
  } catch (err) {
    console.error('Registration stats error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/registrations/:id - delete registration (admin)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM registrations WHERE id = ?').get(req.params.id);

    if (!existing) {
      return res.status(404).json({ error: 'Registration not found.' });
    }

    db.prepare('DELETE FROM registrations WHERE id = ?').run(req.params.id);

    res.json({ message: 'Registration deleted successfully.' });
  } catch (err) {
    console.error('Delete registration error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
