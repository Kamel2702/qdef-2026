const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 100);
}

// GET /api/news - list all articles (public: published only, admin: all)
router.get('/', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let articles;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      articles = db.prepare('SELECT * FROM news ORDER BY created_at DESC').all();
    } else {
      articles = db.prepare('SELECT * FROM news WHERE published = 1 ORDER BY created_at DESC').all();
    }
    res.json(articles);
  } catch (err) {
    console.error('List news error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/news/:id - get single article (public)
router.get('/:id', (req, res) => {
  try {
    const article = db.prepare('SELECT * FROM news WHERE id = ? OR slug = ?').get(req.params.id, req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found.' });
    res.json(article);
  } catch (err) {
    console.error('Get article error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/news - create article (admin)
router.post('/', authMiddleware, (req, res) => {
  try {
    const { title, excerpt, content, image_url, published } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required.' });

    const slug = slugify(title) + '-' + Date.now().toString(36);

    const result = db.prepare(`
      INSERT INTO news (title, slug, excerpt, content, image_url, published)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(title, slug, excerpt || null, content || null, image_url || null, published ? 1 : 0);

    const article = db.prepare('SELECT * FROM news WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(article);
  } catch (err) {
    console.error('Create article error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/news/:id - update article (admin)
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Article not found.' });

    const { title, excerpt, content, image_url, published } = req.body;
    db.prepare(`
      UPDATE news SET title = ?, excerpt = ?, content = ?, image_url = ?, published = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title || existing.title,
      excerpt !== undefined ? excerpt : existing.excerpt,
      content !== undefined ? content : existing.content,
      image_url !== undefined ? image_url : existing.image_url,
      published !== undefined ? (published ? 1 : 0) : existing.published,
      req.params.id
    );

    const article = db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id);
    res.json(article);
  } catch (err) {
    console.error('Update article error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/news/:id/publish - toggle publish status (admin)
router.put('/:id/publish', authMiddleware, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Article not found.' });

    const newStatus = existing.published ? 0 : 1;
    db.prepare('UPDATE news SET published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newStatus, req.params.id);

    res.json({ message: 'Publish status toggled.', published: !!newStatus });
  } catch (err) {
    console.error('Toggle publish error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/news/:id - delete article (admin)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Article not found.' });

    db.prepare('DELETE FROM news WHERE id = ?').run(req.params.id);
    res.json({ message: 'Article deleted successfully.' });
  } catch (err) {
    console.error('Delete article error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
