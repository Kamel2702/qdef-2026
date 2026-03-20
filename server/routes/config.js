const express = require('express');
const supabase = require('../supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/config - get all config (public)
router.get('/', async (_req, res) => {
  try {
    const { data: rows, error } = await supabase
      .from('config')
      .select('key, value');

    if (error) throw error;

    const config = {};
    for (const row of rows) {
      try {
        config[row.key] = JSON.parse(row.value);
      } catch {
        config[row.key] = row.value;
      }
    }
    res.json(config);
  } catch (err) {
    console.error('Get config error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/config/:key - get single config value (public)
router.get('/:key', async (req, res) => {
  try {
    const { data: row, error } = await supabase
      .from('config')
      .select('value')
      .eq('key', req.params.key)
      .single();

    if (error || !row) return res.status(404).json({ error: 'Config key not found.' });

    try {
      res.json(JSON.parse(row.value));
    } catch {
      res.json(row.value);
    }
  } catch (err) {
    console.error('Get config key error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/config - update multiple config values (admin)
router.put('/', authMiddleware, async (req, res) => {
  try {
    const entries = Object.entries(req.body);

    for (const [key, value] of entries) {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);

      const { error } = await supabase
        .from('config')
        .upsert(
          { key, value: serialized, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        );

      if (error) throw error;
    }

    res.json({ message: 'Config updated successfully.' });
  } catch (err) {
    console.error('Update config error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/config/:key - update single config value (admin)
router.put('/:key', authMiddleware, async (req, res) => {
  try {
    const { value } = req.body;
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);

    const { error } = await supabase
      .from('config')
      .upsert(
        { key: req.params.key, value: serialized, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );

    if (error) throw error;

    res.json({ message: 'Config key updated.' });
  } catch (err) {
    console.error('Update config key error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
