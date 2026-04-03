const express = require('express');
const supabase = require('../supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// POST /api/newsletter - subscribe (public)
router.post('/', async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: 'Valid email is required.' });
    }

    const { data: existing } = await supabase
      .from('newsletter')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return res.json({ message: 'Already subscribed.' });
    }

    const source = req.body.source || 'website';

    const { error } = await supabase
      .from('newsletter')
      .insert({ email, source });

    if (error) throw error;

    res.status(201).json({ message: 'Subscribed successfully.' });
  } catch (err) {
    console.error('Newsletter subscribe error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/newsletter - list subscribers (admin)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data: subscribers, error } = await supabase
      .from('newsletter')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(subscribers);
  } catch (err) {
    console.error('List newsletter error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/newsletter/export - export as CSV (admin)
router.get('/export', authMiddleware, async (req, res) => {
  try {
    const { data: subscribers, error } = await supabase
      .from('newsletter')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const headers = ['ID', 'Email', 'Source', 'Subscribed At'];
    const csvRows = [headers.join(',')];

    for (const sub of subscribers) {
      const row = [
        sub.id,
        `"${(sub.email || '').replace(/"/g, '""')}"`,
        `"${(sub.source || '').replace(/"/g, '""')}"`,
        `"${sub.created_at || ''}"`
      ];
      csvRows.push(row.join(','));
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="qdef-newsletter.csv"');
    res.send(csvRows.join('\n'));
  } catch (err) {
    console.error('Export newsletter error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/newsletter/:id - update subscriber (admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('newsletter')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !existing) return res.status(404).json({ error: 'Subscriber not found.' });

    const { email, source } = req.body;

    const { data: subscriber, error } = await supabase
      .from('newsletter')
      .update({
        email: email !== undefined ? email : existing.email,
        source: source !== undefined ? source : existing.source
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(subscriber);
  } catch (err) {
    console.error('Update subscriber error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/newsletter/:id - unsubscribe (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('newsletter')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !existing) return res.status(404).json({ error: 'Subscriber not found.' });

    const { error } = await supabase
      .from('newsletter')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Subscriber removed.' });
  } catch (err) {
    console.error('Delete subscriber error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
