const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/sessions - list all sessions (public)
router.get('/', (req, res) => {
  try {
    const sessions = db.prepare('SELECT * FROM sessions ORDER BY start_time ASC').all();

    const allSpeakers = db.prepare('SELECT id, name, title, organization, photo_url FROM speakers').all();
    const speakerMap = {};
    allSpeakers.forEach(s => { speakerMap[s.id] = s; });

    const parsed = sessions.map(session => {
      const ids = JSON.parse(session.speaker_ids || '[]');
      return {
        ...session,
        speaker_ids: ids,
        speakers: ids.map(id => speakerMap[id]).filter(Boolean),
        tags: session.tags ? session.tags.split(',').map(t => t.trim()) : []
      };
    });

    res.json(parsed);
  } catch (err) {
    console.error('List sessions error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/sessions/:id - get single session (public)
router.get('/:id', (req, res) => {
  try {
    const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(req.params.id);

    if (!session) {
      return res.status(404).json({ error: 'Session not found.' });
    }

    session.speaker_ids = JSON.parse(session.speaker_ids || '[]');

    // Also fetch the speaker details for this session
    if (session.speaker_ids.length > 0) {
      const placeholders = session.speaker_ids.map(() => '?').join(',');
      const speakers = db.prepare(`SELECT * FROM speakers WHERE id IN (${placeholders})`).all(...session.speaker_ids);
      session.speakers = speakers;
    } else {
      session.speakers = [];
    }

    res.json(session);
  } catch (err) {
    console.error('Get session error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/sessions - create session (admin)
router.post('/', authMiddleware, (req, res) => {
  try {
    const { title, description, type, start_time, end_time, speaker_ids, tags, location } = req.body;

    if (!title || !type || !start_time || !end_time) {
      return res.status(400).json({ error: 'Title, type, start_time, and end_time are required.' });
    }

    const validTypes = ['keynote', 'panel', 'presentation', 'break', 'workshop', 'fireside'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: `Type must be one of: ${validTypes.join(', ')}` });
    }

    const speakerIdsJson = JSON.stringify(speaker_ids || []);

    const result = db.prepare(`
      INSERT INTO sessions (title, description, type, start_time, end_time, speaker_ids, tags, location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, description || null, type, start_time, end_time, speakerIdsJson, tags || null, location || null);

    const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(result.lastInsertRowid);
    session.speaker_ids = JSON.parse(session.speaker_ids || '[]');

    res.status(201).json(session);
  } catch (err) {
    console.error('Create session error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/sessions/:id - update session (admin)
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM sessions WHERE id = ?').get(req.params.id);

    if (!existing) {
      return res.status(404).json({ error: 'Session not found.' });
    }

    const { title, description, type, start_time, end_time, speaker_ids, tags, location } = req.body;

    if (type) {
      const validTypes = ['keynote', 'panel', 'presentation', 'break', 'workshop', 'fireside'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({ error: `Type must be one of: ${validTypes.join(', ')}` });
      }
    }

    const speakerIdsJson = speaker_ids !== undefined ? JSON.stringify(speaker_ids) : existing.speaker_ids;

    db.prepare(`
      UPDATE sessions
      SET title = ?, description = ?, type = ?, start_time = ?, end_time = ?, speaker_ids = ?, tags = ?, location = ?
      WHERE id = ?
    `).run(
      title || existing.title,
      description !== undefined ? description : existing.description,
      type || existing.type,
      start_time || existing.start_time,
      end_time || existing.end_time,
      speakerIdsJson,
      tags !== undefined ? tags : existing.tags,
      location !== undefined ? location : existing.location,
      req.params.id
    );

    const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(req.params.id);
    session.speaker_ids = JSON.parse(session.speaker_ids || '[]');

    res.json(session);
  } catch (err) {
    console.error('Update session error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/sessions/:id - delete session (admin)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM sessions WHERE id = ?').get(req.params.id);

    if (!existing) {
      return res.status(404).json({ error: 'Session not found.' });
    }

    db.prepare('DELETE FROM sessions WHERE id = ?').run(req.params.id);

    res.json({ message: 'Session deleted successfully.' });
  } catch (err) {
    console.error('Delete session error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
