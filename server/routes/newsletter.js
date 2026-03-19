const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// POST /api/newsletter - subscribe (public)
router.post('/', (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: 'Valid email is required.' });
    }

    const existing = db.prepare('SELECT id FROM newsletter WHERE email = ?').get(email);
    if (existing) {
      return res.json({ message: 'Already subscribed.' });
    }

    const source = req.body.source || 'website';
    db.prepare('INSERT INTO newsletter (email, source) VALUES (?, ?)').run(email, source);

    res.status(201).json({ message: 'Subscribed successfully.' });
  } catch (err) {
    console.error('Newsletter subscribe error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/newsletter - list subscribers (admin)
router.get('/', authMiddleware, (req, res) => {
  try {
    const subscribers = db.prepare('SELECT * FROM newsletter ORDER BY created_at DESC').all();
    res.json(subscribers);
  } catch (err) {
    console.error('List newsletter error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/newsletter/export - export as CSV (admin)
router.get('/export', authMiddleware, (req, res) => {
  try {
    const subscribers = db.prepare('SELECT * FROM newsletter ORDER BY created_at DESC').all();

    const headers = ['ID', 'Email', 'Source', 'Subscribed At'];
    const csvRows = [headers.join(',')];

    for (const sub of subscribers) {
      const row = [
        sub.id,
        `"${(sub.email || '').replace(/"/g, '""')}"`,
        `"${(sub.source || '').replace(/"/g, '""')}"`,
        `"${sub.created_at || ''}"`
      ];
      csvRows.push(row.join(','));
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="qdef-newsletter.csv"');
    res.send(csvRows.join('\n'));
  } catch (err) {
    console.error('Export newsletter error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/newsletter/:id - unsubscribe (admin)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM newsletter WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Subscriber not found.' });

    db.prepare('DELETE FROM newsletter WHERE id = ?').run(req.params.id);
    res.json({ message: 'Subscriber removed.' });
  } catch (err) {
    console.error('Delete subscriber error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
