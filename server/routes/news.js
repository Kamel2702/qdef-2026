const express = require('express');
const supabase = require('../supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 100);
}

// GET /api/news - list all articles (public: published only, admin: all)
router.get('/', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let query = supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (!(authHeader && authHeader.startsWith('Bearer '))) {
      query = query.eq('published', 1);
    }

    const { data: articles, error } = await query;

    if (error) throw error;

    res.json(articles);
  } catch (err) {
    console.error('List news error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/news/:id - get single article (public)
router.get('/:id', async (req, res) => {
  try {
    // Try by id first
    let { data: article, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', req.params.id)
      .single();

    // If not found by id, try by slug
    if (error || !article) {
      const { data: bySlug, error: slugError } = await supabase
        .from('news')
        .select('*')
        .eq('slug', req.params.id)
        .single();

      if (slugError || !bySlug) {
        return res.status(404).json({ error: 'Article not found.' });
      }
      article = bySlug;
    }

    res.json(article);
  } catch (err) {
    console.error('Get article error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/news - create article (admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, excerpt, content, image_url, published } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required.' });

    const slug = slugify(title) + '-' + Date.now().toString(36);

    const { data: article, error } = await supabase
      .from('news')
      .insert({
        title,
        slug,
        excerpt: excerpt || null,
        content: content || null,
        image_url: image_url || null,
        published: published ? 1 : 0
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(article);
  } catch (err) {
    console.error('Create article error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/news/:id - update article (admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('news')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !existing) return res.status(404).json({ error: 'Article not found.' });

    const { title, excerpt, content, image_url, published } = req.body;

    const { data: article, error } = await supabase
      .from('news')
      .update({
        title: title || existing.title,
        excerpt: excerpt !== undefined ? excerpt : existing.excerpt,
        content: content !== undefined ? content : existing.content,
        image_url: image_url !== undefined ? image_url : existing.image_url,
        published: published !== undefined ? (published ? 1 : 0) : existing.published,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(article);
  } catch (err) {
    console.error('Update article error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/news/:id/publish - toggle publish status (admin)
router.put('/:id/publish', authMiddleware, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('news')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !existing) return res.status(404).json({ error: 'Article not found.' });

    const newStatus = existing.published ? 0 : 1;

    const { error } = await supabase
      .from('news')
      .update({ published: newStatus, updated_at: new Date().toISOString() })
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Publish status toggled.', published: !!newStatus });
  } catch (err) {
    console.error('Toggle publish error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/news/:id - delete article (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('news')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !existing) return res.status(404).json({ error: 'Article not found.' });

    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Article deleted successfully.' });
  } catch (err) {
    console.error('Delete article error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
