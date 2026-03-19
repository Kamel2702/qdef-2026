const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/speakers - list all speakers (public)
router.get('/', (req, res) => {
  try {
    const speakers = db.prepare('SELECT * FROM speakers ORDER BY name ASC').all();
    res.json(speakers);
  } catch (err) {
    console.error('List speakers error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/speakers/:id - get single speaker (public)
router.get('/:id', (req, res) => {
  try {
    const speaker = db.prepare('SELECT * FROM speakers WHERE id = ?').get(req.params.id);

    if (!speaker) {
      return res.status(404).json({ error: 'Speaker not found.' });
    }

    // Also fetch sessions this speaker is part of
    const sessions = db.prepare('SELECT * FROM sessions ORDER BY start_time ASC').all();
    speaker.sessions = sessions.filter(session => {
      const speakerIds = JSON.parse(session.speaker_ids || '[]');
      return speakerIds.includes(speaker.id);
    }).map(session => ({
      ...session,
      speaker_ids: JSON.parse(session.speaker_ids || '[]')
    }));

    res.json(speaker);
  } catch (err) {
    console.error('Get speaker error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/speakers - create speaker (admin)
router.post('/', authMiddleware, (req, res) => {
  try {
    const { name, title, organization, bio, photo_url } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required.' });
    }

    const result = db.prepare(`
      INSERT INTO speakers (name, title, organization, bio, photo_url)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, title || null, organization || null, bio || null, photo_url || null);

    const speaker = db.prepare('SELECT * FROM speakers WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(speaker);
  } catch (err) {
    console.error('Create speaker error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/speakers/:id - update speaker (admin)
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM speakers WHERE id = ?').get(req.params.id);

    if (!existing) {
      return res.status(404).json({ error: 'Speaker not found.' });
    }

    const { name, title, organization, bio, photo_url } = req.body;

    db.prepare(`
      UPDATE speakers
      SET name = ?, title = ?, organization = ?, bio = ?, photo_url = ?
      WHERE id = ?
    `).run(
      name || existing.name,
      title !== undefined ? title : existing.title,
      organization !== undefined ? organization : existing.organization,
      bio !== undefined ? bio : existing.bio,
      photo_url !== undefined ? photo_url : existing.photo_url,
      req.params.id
    );

    const speaker = db.prepare('SELECT * FROM speakers WHERE id = ?').get(req.params.id);

    res.json(speaker);
  } catch (err) {
    console.error('Update speaker error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/speakers/:id - delete speaker (admin)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM speakers WHERE id = ?').get(req.params.id);

    if (!existing) {
      return res.status(404).json({ error: 'Speaker not found.' });
    }

    db.prepare('DELETE FROM speakers WHERE id = ?').run(req.params.id);

    res.json({ message: 'Speaker deleted successfully.' });
  } catch (err) {
    console.error('Delete speaker error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
