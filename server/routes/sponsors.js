const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/sponsors - list all sponsors (public)
router.get('/', (req, res) => {
  try {
    const tier = req.query.tier;
    let sponsors;
    if (tier) {
      sponsors = db.prepare('SELECT * FROM sponsors WHERE tier = ? ORDER BY sort_order ASC, name ASC').all(tier);
    } else {
      sponsors = db.prepare('SELECT * FROM sponsors ORDER BY sort_order ASC, name ASC').all();
    }
    res.json(sponsors);
  } catch (err) {
    console.error('List sponsors error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/sponsors/:id - get single sponsor (public)
router.get('/:id', (req, res) => {
  try {
    const sponsor = db.prepare('SELECT * FROM sponsors WHERE id = ?').get(req.params.id);
    if (!sponsor) return res.status(404).json({ error: 'Sponsor not found.' });
    res.json(sponsor);
  } catch (err) {
    console.error('Get sponsor error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/sponsors - create sponsor (admin)
router.post('/', authMiddleware, (req, res) => {
  try {
    const { name, tier, logo_url, website_url, description, sort_order } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required.' });

    const result = db.prepare(`
      INSERT INTO sponsors (name, tier, logo_url, website_url, description, sort_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, tier || 'gold', logo_url || null, website_url || null, description || null, sort_order || 0);

    const sponsor = db.prepare('SELECT * FROM sponsors WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(sponsor);
  } catch (err) {
    console.error('Create sponsor error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/sponsors/:id - update sponsor (admin)
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM sponsors WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Sponsor not found.' });

    const { name, tier, logo_url, website_url, description, sort_order } = req.body;
    db.prepare(`
      UPDATE sponsors SET name = ?, tier = ?, logo_url = ?, website_url = ?, description = ?, sort_order = ?
      WHERE id = ?
    `).run(
      name || existing.name,
      tier !== undefined ? tier : existing.tier,
      logo_url !== undefined ? logo_url : existing.logo_url,
      website_url !== undefined ? website_url : existing.website_url,
      description !== undefined ? description : existing.description,
      sort_order !== undefined ? sort_order : existing.sort_order,
      req.params.id
    );

    const sponsor = db.prepare('SELECT * FROM sponsors WHERE id = ?').get(req.params.id);
    res.json(sponsor);
  } catch (err) {
    console.error('Update sponsor error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/sponsors/:id - delete sponsor (admin)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM sponsors WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Sponsor not found.' });

    db.prepare('DELETE FROM sponsors WHERE id = ?').run(req.params.id);
    res.json({ message: 'Sponsor deleted successfully.' });
  } catch (err) {
    console.error('Delete sponsor error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
