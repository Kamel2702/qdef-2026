const express = require('express');
const supabase = require('../supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/sessions - list all sessions (public)
router.get('/', async (req, res) => {
  try {
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) throw error;

    const { data: allSpeakers, error: speakersError } = await supabase
      .from('speakers')
      .select('id, name, title, organization, photo_url');

    if (speakersError) throw speakersError;

    const speakerMap = {};
    allSpeakers.forEach(s => { speakerMap[s.id] = s; });

    const parsed = sessions.map(session => {
      const ids = JSON.parse(session.speaker_ids || '[]');
      return {
        ...session,
        speaker_ids: ids,
        speakers: ids.map(id => speakerMap[id]).filter(Boolean),
        tags: session.tags ? session.tags.split(',').map(t => t.trim()) : []
      };
    });

    res.json(parsed);
  } catch (err) {
    console.error('List sessions error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/sessions/:id - get single session (public)
router.get('/:id', async (req, res) => {
  try {
    const { data: session, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !session) {
      return res.status(404).json({ error: 'Session not found.' });
    }

    session.speaker_ids = JSON.parse(session.speaker_ids || '[]');

    // Also fetch the speaker details for this session
    if (session.speaker_ids.length > 0) {
      const { data: speakers, error: speakersError } = await supabase
        .from('speakers')
        .select('*')
        .in('id', session.speaker_ids);

      if (speakersError) throw speakersError;
      session.speakers = speakers;
    } else {
      session.speakers = [];
    }

    res.json(session);
  } catch (err) {
    console.error('Get session error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/sessions - create session (admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, type, start_time, end_time, speaker_ids, tags, location } = req.body;

    if (!title || !type || !start_time || !end_time) {
      return res.status(400).json({ error: 'Title, type, start_time, and end_time are required.' });
    }

    const validTypes = ['keynote', 'panel', 'presentation', 'break', 'workshop', 'fireside'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: `Type must be one of: ${validTypes.join(', ')}` });
    }

    const speakerIdsJson = JSON.stringify(speaker_ids || []);

    const { data: session, error } = await supabase
      .from('sessions')
      .insert({
        title,
        description: description || null,
        type,
        start_time,
        end_time,
        speaker_ids: speakerIdsJson,
        tags: tags || null,
        location: location || null
      })
      .select()
      .single();

    if (error) throw error;

    session.speaker_ids = JSON.parse(session.speaker_ids || '[]');

    res.status(201).json(session);
  } catch (err) {
    console.error('Create session error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/sessions/:id - update session (admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: 'Session not found.' });
    }

    const { title, description, type, start_time, end_time, speaker_ids, tags, location } = req.body;

    if (type) {
      const validTypes = ['keynote', 'panel', 'presentation', 'break', 'workshop', 'fireside'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({ error: `Type must be one of: ${validTypes.join(', ')}` });
      }
    }

    const speakerIdsJson = speaker_ids !== undefined ? JSON.stringify(speaker_ids) : existing.speaker_ids;

    const { data: session, error } = await supabase
      .from('sessions')
      .update({
        title: title || existing.title,
        description: description !== undefined ? description : existing.description,
        type: type || existing.type,
        start_time: start_time || existing.start_time,
        end_time: end_time || existing.end_time,
        speaker_ids: speakerIdsJson,
        tags: tags !== undefined ? tags : existing.tags,
        location: location !== undefined ? location : existing.location
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    session.speaker_ids = JSON.parse(session.speaker_ids || '[]');

    res.json(session);
  } catch (err) {
    console.error('Update session error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/sessions/:id - delete session (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: 'Session not found.' });
    }

    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Session deleted successfully.' });
  } catch (err) {
    console.error('Delete session error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
