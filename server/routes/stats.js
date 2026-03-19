const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/stats - dashboard statistics (admin)
router.get('/', authMiddleware, (req, res) => {
  try {
    const speakers = db.prepare('SELECT COUNT(*) as count FROM speakers').get();
    const sessions = db.prepare('SELECT COUNT(*) as count FROM sessions').get();
    const registrations = db.prepare('SELECT COUNT(*) as count FROM registrations').get();
    const sponsors = db.prepare('SELECT COUNT(*) as count FROM sponsors').get();
    const news = db.prepare('SELECT COUNT(*) as count FROM news').get();
    const contacts = db.prepare('SELECT COUNT(*) as count FROM contacts').get();
    const newContacts = db.prepare("SELECT COUNT(*) as count FROM contacts WHERE status = 'new'").get();
    const newsletter = db.prepare('SELECT COUNT(*) as count FROM newsletter').get();
    const exhibitions = db.prepare('SELECT COUNT(*) as count FROM exhibitions').get();
    const recentRegistrations = db.prepare("SELECT COUNT(*) as count FROM registrations WHERE created_at >= datetime('now', '-7 days')").get();

    res.json({
      speakers: speakers.count,
      sessions: sessions.count,
      registrations: registrations.count,
      sponsors: sponsors.count,
      news: news.count,
      contacts: contacts.count,
      newContacts: newContacts.count,
      newsletter: newsletter.count,
      exhibitions: exhibitions.count,
      recentRegistrations: recentRegistrations.count,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
