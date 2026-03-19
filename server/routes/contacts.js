const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// POST /api/contacts - submit contact form (public)
router.post('/', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const result = db.prepare(`
      INSERT INTO contacts (name, email, subject, message, status)
      VALUES (?, ?, ?, ?, 'new')
    `).run(
      name.trim().slice(0, 200),
      email.trim().slice(0, 200),
      (subject || '').trim().slice(0, 300),
      (message || '').trim().slice(0, 5000)
    );

    res.status(201).json({ message: 'Message sent successfully.', id: result.lastInsertRowid });
  } catch (err) {
    console.error('Submit contact error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/contacts - list all contacts (admin)
router.get('/', authMiddleware, (req, res) => {
  try {
    const contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
    res.json(contacts);
  } catch (err) {
    console.error('List contacts error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/contacts/:id/status - update status (admin)
router.put('/:id/status', authMiddleware, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Contact not found.' });

    const status = req.body.status || 'read';
    db.prepare('UPDATE contacts SET status = ? WHERE id = ?').run(status, req.params.id);

    res.json({ message: 'Status updated.' });
  } catch (err) {
    console.error('Update contact status error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/contacts/:id - delete contact (admin)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Contact not found.' });

    db.prepare('DELETE FROM contacts WHERE id = ?').run(req.params.id);
    res.json({ message: 'Contact deleted successfully.' });
  } catch (err) {
    console.error('Delete contact error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
