const express = require('express');
const supabase = require('../supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/custom-pages - list all (public: published only, admin: all)
router.get('/', async (req, res) => {
  try {
    const isAdmin = req.headers.authorization;
    let query = supabase
      .from('custom_pages')
      .select('*')
      .order('nav_order', { ascending: true });

    if (!isAdmin) {
      query = query.eq('published', true);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Parse content JSON
    const pages = (data || []).map(p => ({
      ...p,
      content: typeof p.content === 'string' ? JSON.parse(p.content) : (p.content || [])
    }));

    res.json(pages);
  } catch (err) {
    console.error('List custom pages error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/custom-pages/nav - get pages for navigation (public, published + show_in_nav)
router.get('/nav', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('custom_pages')
      .select('id, title, slug, nav_order')
      .eq('published', true)
      .eq('show_in_nav', true)
      .order('nav_order', { ascending: true });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Nav pages error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/custom-pages/:slug - get single page by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const { data: page, error } = await supabase
      .from('custom_pages')
      .select('*')
      .eq('slug', req.params.slug)
      .eq('published', true)
      .single();

    if (error || !page) {
      return res.status(404).json({ error: 'Page not found.' });
    }

    page.content = typeof page.content === 'string' ? JSON.parse(page.content) : (page.content || []);
    res.json(page);
  } catch (err) {
    console.error('Get custom page error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/custom-pages - create page (admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, slug, content, hero_image, show_in_nav, nav_order, published } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ error: 'Title and slug are required.' });
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    const reserved = ['', 'about', 'programme', 'speakers', 'venue', 'register', 'contact', 'privacy', 'admin'];
    if (reserved.includes(cleanSlug)) {
      return res.status(400).json({ error: 'This URL is reserved. Choose a different one.' });
    }

    const { data: page, error } = await supabase
      .from('custom_pages')
      .insert({
        title,
        slug: cleanSlug,
        content: JSON.stringify(content || []),
        hero_image: hero_image || null,
        show_in_nav: show_in_nav !== false,
        nav_order: nav_order || 99,
        published: published !== false,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'A page with this URL already exists.' });
      throw error;
    }

    page.content = JSON.parse(page.content || '[]');
    res.status(201).json(page);
  } catch (err) {
    console.error('Create custom page error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/custom-pages/:id - update page (admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('custom_pages')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: 'Page not found.' });
    }

    const { title, slug, content, hero_image, show_in_nav, nav_order, published } = req.body;

    const updates = {
      title: title !== undefined ? title : existing.title,
      slug: slug !== undefined ? slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') : existing.slug,
      content: content !== undefined ? JSON.stringify(content) : existing.content,
      hero_image: hero_image !== undefined ? hero_image : existing.hero_image,
      show_in_nav: show_in_nav !== undefined ? show_in_nav : existing.show_in_nav,
      nav_order: nav_order !== undefined ? nav_order : existing.nav_order,
      published: published !== undefined ? published : existing.published,
    };

    const { data: page, error } = await supabase
      .from('custom_pages')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    page.content = typeof page.content === 'string' ? JSON.parse(page.content) : (page.content || []);
    res.json(page);
  } catch (err) {
    console.error('Update custom page error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/custom-pages/:id - delete page (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { error: fetchError } = await supabase
      .from('custom_pages')
      .select('id')
      .eq('id', req.params.id)
      .single();

    if (fetchError) return res.status(404).json({ error: 'Page not found.' });

    const { error } = await supabase
      .from('custom_pages')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Page deleted successfully.' });
  } catch (err) {
    console.error('Delete custom page error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
