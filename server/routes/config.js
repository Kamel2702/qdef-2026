const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/config - get all config (public)
router.get('/', (_req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM config').all();
    const config = {};
    for (const row of rows) {
      try {
        config[row.key] = JSON.parse(row.value);
      } catch {
        config[row.key] = row.value;
      }
    }
    res.json(config);
  } catch (err) {
    console.error('Get config error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/config/:key - get single config value (public)
router.get('/:key', (req, res) => {
  try {
    const row = db.prepare('SELECT value FROM config WHERE key = ?').get(req.params.key);
    if (!row) return res.status(404).json({ error: 'Config key not found.' });
    try {
      res.json(JSON.parse(row.value));
    } catch {
      res.json(row.value);
    }
  } catch (err) {
    console.error('Get config key error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/config - update multiple config values (admin)
router.put('/', authMiddleware, (req, res) => {
  try {
    const upsert = db.prepare(`
      INSERT INTO config (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `);

    const updateMany = db.transaction((entries) => {
      for (const [key, value] of Object.entries(entries)) {
        upsert.run(key, typeof value === 'string' ? value : JSON.stringify(value));
      }
    });

    updateMany(req.body);
    res.json({ message: 'Config updated successfully.' });
  } catch (err) {
    console.error('Update config error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/config/:key - update single config value (admin)
router.put('/:key', authMiddleware, (req, res) => {
  try {
    const { value } = req.body;
    db.prepare(`
      INSERT INTO config (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `).run(req.params.key, typeof value === 'string' ? value : JSON.stringify(value));

    res.json({ message: 'Config key updated.' });
  } catch (err) {
    console.error('Update config key error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
