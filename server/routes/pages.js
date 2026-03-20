const express = require('express');
const supabase = require('../supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/pages/:slug - get page content (public)
router.get('/:slug', async (req, res) => {
  try {
    const { data: page, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', req.params.slug)
      .single();

    if (error || !page) {
      return res.status(404).json({ error: 'Page not found.' });
    }

    res.json(page);
  } catch (err) {
    console.error('Get page error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/pages/:slug - update page content (admin)
router.put('/:slug', authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;

    const { data: existing } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', req.params.slug)
      .single();

    if (existing) {
      // Update existing page
      const { error: updateError } = await supabase
        .from('pages')
        .update({
          title: title !== undefined ? title : existing.title,
          content: content !== undefined ? content : existing.content,
          updated_at: new Date().toISOString()
        })
        .eq('slug', req.params.slug);

      if (updateError) throw updateError;
    } else {
      // Create new page with this slug
      const { error: insertError } = await supabase
        .from('pages')
        .insert({
          slug: req.params.slug,
          title: title || req.params.slug,
          content: content || '',
          updated_at: new Date().toISOString()
        });

      if (insertError) throw insertError;
    }

    const { data: page, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', req.params.slug)
      .single();

    if (error) throw error;

    res.json(page);
  } catch (err) {
    console.error('Update page error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
