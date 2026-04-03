const express = require('express');
const supabase = require('../supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/gallery - list all photos (public: published, admin: all)
router.get('/', async (req, res) => {
  try {
    let query = supabase
      .from('gallery')
      .select('*')
      .order('sort_order', { ascending: true });

    // Only show published photos to non-admin requests
    if (!req.headers.authorization) {
      query = query.eq('published', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('List gallery error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/gallery - add photo (admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { image_url, caption, category, sort_order } = req.body;
    if (!image_url) return res.status(400).json({ error: 'Image URL is required.' });

    const { data, error } = await supabase
      .from('gallery')
      .insert({
        image_url,
        caption: caption || null,
        category: category || 'general',
        sort_order: sort_order || 99,
        published: true,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error('Create gallery error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/gallery/:id - update photo (admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('gallery')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !existing) return res.status(404).json({ error: 'Photo not found.' });

    const { image_url, caption, category, sort_order, published } = req.body;

    const { data, error } = await supabase
      .from('gallery')
      .update({
        image_url: image_url !== undefined ? image_url : existing.image_url,
        caption: caption !== undefined ? caption : existing.caption,
        category: category !== undefined ? category : existing.category,
        sort_order: sort_order !== undefined ? sort_order : existing.sort_order,
        published: published !== undefined ? published : existing.published,
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Update gallery error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/gallery/:id - delete photo (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { error: fetchError } = await supabase.from('gallery').select('id').eq('id', req.params.id).single();
    if (fetchError) return res.status(404).json({ error: 'Photo not found.' });

    const { error } = await supabase.from('gallery').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Photo deleted.' });
  } catch (err) {
    console.error('Delete gallery error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
