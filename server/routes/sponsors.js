const express = require('express');
const supabase = require('../supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/sponsors - list all sponsors (public)
router.get('/', async (req, res) => {
  try {
    const tier = req.query.tier;
    let query = supabase
      .from('sponsors')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (tier) {
      query = query.eq('tier', tier);
    }

    const { data: sponsors, error } = await query;

    if (error) throw error;

    res.json(sponsors);
  } catch (err) {
    console.error('List sponsors error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/sponsors/:id - get single sponsor (public)
router.get('/:id', async (req, res) => {
  try {
    const { data: sponsor, error } = await supabase
      .from('sponsors')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !sponsor) return res.status(404).json({ error: 'Sponsor not found.' });

    res.json(sponsor);
  } catch (err) {
    console.error('Get sponsor error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/sponsors - create sponsor (admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, tier, logo_url, website_url, description, sort_order } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required.' });

    const { data: sponsor, error } = await supabase
      .from('sponsors')
      .insert({
        name,
        tier: tier || 'gold',
        logo_url: logo_url || null,
        website_url: website_url || null,
        description: description || null,
        sort_order: sort_order || 0
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(sponsor);
  } catch (err) {
    console.error('Create sponsor error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/sponsors/:id - update sponsor (admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('sponsors')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !existing) return res.status(404).json({ error: 'Sponsor not found.' });

    const { name, tier, logo_url, website_url, description, sort_order } = req.body;

    const { data: sponsor, error } = await supabase
      .from('sponsors')
      .update({
        name: name || existing.name,
        tier: tier !== undefined ? tier : existing.tier,
        logo_url: logo_url !== undefined ? logo_url : existing.logo_url,
        website_url: website_url !== undefined ? website_url : existing.website_url,
        description: description !== undefined ? description : existing.description,
        sort_order: sort_order !== undefined ? sort_order : existing.sort_order
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(sponsor);
  } catch (err) {
    console.error('Update sponsor error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/sponsors/:id - delete sponsor (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('sponsors')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !existing) return res.status(404).json({ error: 'Sponsor not found.' });

    const { error } = await supabase
      .from('sponsors')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Sponsor deleted successfully.' });
  } catch (err) {
    console.error('Delete sponsor error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
