const express = require('express');
const supabase = require('../supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/exhibitions - list all exhibitions (public)
router.get('/', async (_req, res) => {
  try {
    const { data: exhibitions, error } = await supabase
      .from('exhibitions')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;

    res.json(exhibitions);
  } catch (err) {
    console.error('List exhibitions error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/exhibitions/:id - get single exhibition (public)
router.get('/:id', async (req, res) => {
  try {
    const { data: exhibition, error } = await supabase
      .from('exhibitions')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !exhibition) return res.status(404).json({ error: 'Exhibition not found.' });

    res.json(exhibition);
  } catch (err) {
    console.error('Get exhibition error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/exhibitions - create exhibition (admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, image_url, tag, website_url, sort_order } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required.' });

    const { data: exhibition, error } = await supabase
      .from('exhibitions')
      .insert({
        name,
        description: description || null,
        image_url: image_url || null,
        tag: tag || null,
        website_url: website_url || null,
        sort_order: sort_order || 0
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(exhibition);
  } catch (err) {
    console.error('Create exhibition error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/exhibitions/:id - update exhibition (admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('exhibitions')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !existing) return res.status(404).json({ error: 'Exhibition not found.' });

    const { name, description, image_url, tag, website_url, sort_order } = req.body;

    const { data: exhibition, error } = await supabase
      .from('exhibitions')
      .update({
        name: name || existing.name,
        description: description !== undefined ? description : existing.description,
        image_url: image_url !== undefined ? image_url : existing.image_url,
        tag: tag !== undefined ? tag : existing.tag,
        website_url: website_url !== undefined ? website_url : existing.website_url,
        sort_order: sort_order !== undefined ? sort_order : existing.sort_order
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(exhibition);
  } catch (err) {
    console.error('Update exhibition error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/exhibitions/:id - delete exhibition (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('exhibitions')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !existing) return res.status(404).json({ error: 'Exhibition not found.' });

    const { error } = await supabase
      .from('exhibitions')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Exhibition deleted successfully.' });
  } catch (err) {
    console.error('Delete exhibition error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
