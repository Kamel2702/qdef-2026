const express = require('express');
const supabase = require('../supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/speakers - list all speakers (public)
router.get('/', async (req, res) => {
  try {
    const { data: speakers, error } = await supabase
      .from('speakers')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    res.json(speakers);
  } catch (err) {
    console.error('List speakers error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/speakers/:id - get single speaker (public)
router.get('/:id', async (req, res) => {
  try {
    const { data: speaker, error } = await supabase
      .from('speakers')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !speaker) {
      return res.status(404).json({ error: 'Speaker not found.' });
    }

    // Also fetch sessions this speaker is part of
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('*')
      .order('start_time', { ascending: true });

    if (sessionsError) throw sessionsError;

    speaker.sessions = sessions.filter(session => {
      const speakerIds = JSON.parse(session.speaker_ids || '[]');
      return speakerIds.includes(speaker.id);
    }).map(session => ({
      ...session,
      speaker_ids: JSON.parse(session.speaker_ids || '[]')
    }));

    res.json(speaker);
  } catch (err) {
    console.error('Get speaker error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/speakers - create speaker (admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, title, organization, bio, photo_url } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required.' });
    }

    const { data: speaker, error } = await supabase
      .from('speakers')
      .insert({
        name,
        title: title || null,
        organization: organization || null,
        bio: bio || null,
        photo_url: photo_url || null
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(speaker);
  } catch (err) {
    console.error('Create speaker error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/speakers/:id - update speaker (admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('speakers')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: 'Speaker not found.' });
    }

    const { name, title, organization, bio, photo_url } = req.body;

    const { data: speaker, error } = await supabase
      .from('speakers')
      .update({
        name: name || existing.name,
        title: title !== undefined ? title : existing.title,
        organization: organization !== undefined ? organization : existing.organization,
        bio: bio !== undefined ? bio : existing.bio,
        photo_url: photo_url !== undefined ? photo_url : existing.photo_url
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(speaker);
  } catch (err) {
    console.error('Update speaker error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/speakers/:id - delete speaker (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('speakers')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: 'Speaker not found.' });
    }

    const { error } = await supabase
      .from('speakers')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Speaker deleted successfully.' });
  } catch (err) {
    console.error('Delete speaker error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
