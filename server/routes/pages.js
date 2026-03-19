const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/pages/:slug - get page content (public)
router.get('/:slug', (req, res) => {
  try {
    const page = db.prepare('SELECT * FROM pages WHERE slug = ?').get(req.params.slug);

    if (!page) {
      return res.status(404).json({ error: 'Page not found.' });
    }

    res.json(page);
  } catch (err) {
    console.error('Get page error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/pages/:slug - update page content (admin)
router.put('/:slug', authMiddleware, (req, res) => {
  try {
    const { title, content } = req.body;

    const existing = db.prepare('SELECT * FROM pages WHERE slug = ?').get(req.params.slug);

    if (existing) {
      // Update existing page
      db.prepare(`
        UPDATE pages SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP
        WHERE slug = ?
      `).run(
        title !== undefined ? title : existing.title,
        content !== undefined ? content : existing.content,
        req.params.slug
      );
    } else {
      // Create new page with this slug
      db.prepare(`
        INSERT INTO pages (slug, title, content, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `).run(req.params.slug, title || req.params.slug, content || '');
    }

    const page = db.prepare('SELECT * FROM pages WHERE slug = ?').get(req.params.slug);

    res.json(page);
  } catch (err) {
    console.error('Update page error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
