const express = require('express');
const nodemailer = require('nodemailer');
const supabase = require('../supabase');
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
router.post('/', async (req, res) => {
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
    const { data: existing } = await supabase
      .from('registrations')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return res.status(409).json({ error: 'This email address is already registered.' });
    }

    const { data: registration, error } = await supabase
      .from('registrations')
      .insert({
        first_name,
        last_name,
        organization: organization || null,
        position: position || null,
        email,
        country: country || null,
        dietary_requirements: dietary_requirements || null,
        accessibility_needs: accessibility_needs || null,
        gdpr_consent: gdpr_consent ? 1 : 0
      })
      .select()
      .single();

    if (error) throw error;

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
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data: registrations, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(registrations);
  } catch (err) {
    console.error('List registrations error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/registrations/export - export as CSV (admin)
router.get('/export', authMiddleware, async (req, res) => {
  try {
    const { data: registrations, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

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
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    // Total count
    const { count: total, error: totalError } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true });

    if (totalError) throw totalError;

    // All registrations for grouping
    const { data: allRegs, error: allError } = await supabase
      .from('registrations')
      .select('country, organization, created_at');

    if (allError) throw allError;

    // Recent registrations (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const recentCount = allRegs.filter(r => r.created_at && r.created_at >= sevenDaysAgo).length;

    // Group by country
    const countryMap = {};
    for (const reg of allRegs) {
      if (reg.country) {
        countryMap[reg.country] = (countryMap[reg.country] || 0) + 1;
      }
    }
    const byCountry = Object.entries(countryMap)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);

    // Group by organization
    const orgMap = {};
    for (const reg of allRegs) {
      if (reg.organization) {
        orgMap[reg.organization] = (orgMap[reg.organization] || 0) + 1;
      }
    }
    const byOrganization = Object.entries(orgMap)
      .map(([organization, count]) => ({ organization, count }))
      .sort((a, b) => b.count - a.count);

    res.json({
      total,
      recent_week: recentCount,
      by_country: byCountry,
      by_organization: byOrganization
    });
  } catch (err) {
    console.error('Registration stats error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/registrations/:id - update registration (admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: 'Registration not found.' });
    }

    const { first_name, last_name, organization, position, email, country, dietary_requirements, accessibility_needs } = req.body;

    const { data: registration, error } = await supabase
      .from('registrations')
      .update({
        first_name: first_name !== undefined ? first_name : existing.first_name,
        last_name: last_name !== undefined ? last_name : existing.last_name,
        organization: organization !== undefined ? organization : existing.organization,
        position: position !== undefined ? position : existing.position,
        email: email !== undefined ? email : existing.email,
        country: country !== undefined ? country : existing.country,
        dietary_requirements: dietary_requirements !== undefined ? dietary_requirements : existing.dietary_requirements,
        accessibility_needs: accessibility_needs !== undefined ? accessibility_needs : existing.accessibility_needs
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(registration);
  } catch (err) {
    console.error('Update registration error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/registrations/:id - delete registration (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: 'Registration not found.' });
    }

    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Registration deleted successfully.' });
  } catch (err) {
    console.error('Delete registration error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
