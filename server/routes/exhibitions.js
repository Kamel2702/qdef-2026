const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/exhibitions - list all exhibitions (public)
router.get('/', (_req, res) => {
  try {
    const exhibitions = db.prepare('SELECT * FROM exhibitions ORDER BY sort_order ASC, name ASC').all();
    res.json(exhibitions);
  } catch (err) {
    console.error('List exhibitions error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/exhibitions/:id - get single exhibition (public)
router.get('/:id', (req, res) => {
  try {
    const exhibition = db.prepare('SELECT * FROM exhibitions WHERE id = ?').get(req.params.id);
    if (!exhibition) return res.status(404).json({ error: 'Exhibition not found.' });
    res.json(exhibition);
  } catch (err) {
    console.error('Get exhibition error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/exhibitions - create exhibition (admin)
router.post('/', authMiddleware, (req, res) => {
  try {
    const { name, description, image_url, tag, website_url, sort_order } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required.' });

    const result = db.prepare(`
      INSERT INTO exhibitions (name, description, image_url, tag, website_url, sort_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, description || null, image_url || null, tag || null, website_url || null, sort_order || 0);

    const exhibition = db.prepare('SELECT * FROM exhibitions WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(exhibition);
  } catch (err) {
    console.error('Create exhibition error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/exhibitions/:id - update exhibition (admin)
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM exhibitions WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Exhibition not found.' });

    const { name, description, image_url, tag, website_url, sort_order } = req.body;
    db.prepare(`
      UPDATE exhibitions SET name = ?, description = ?, image_url = ?, tag = ?, website_url = ?, sort_order = ?
      WHERE id = ?
    `).run(
      name || existing.name,
      description !== undefined ? description : existing.description,
      image_url !== undefined ? image_url : existing.image_url,
      tag !== undefined ? tag : existing.tag,
      website_url !== undefined ? website_url : existing.website_url,
      sort_order !== undefined ? sort_order : existing.sort_order,
      req.params.id
    );

    const exhibition = db.prepare('SELECT * FROM exhibitions WHERE id = ?').get(req.params.id);
    res.json(exhibition);
  } catch (err) {
    console.error('Update exhibition error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/exhibitions/:id - delete exhibition (admin)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM exhibitions WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Exhibition not found.' });

    db.prepare('DELETE FROM exhibitions WHERE id = ?').run(req.params.id);
    res.json({ message: 'Exhibition deleted successfully.' });
  } catch (err) {
    console.error('Delete exhibition error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
