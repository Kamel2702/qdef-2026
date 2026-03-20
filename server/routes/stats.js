const express = require('express');
const supabase = require('../supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/stats - dashboard statistics (admin)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [
      { count: speakers },
      { count: sessions },
      { count: registrations },
      { count: sponsors },
      { count: news },
      { count: contacts },
      { count: newContacts },
      { count: newsletter },
      { count: exhibitions }
    ] = await Promise.all([
      supabase.from('speakers').select('*', { count: 'exact', head: true }).then(r => { if (r.error) throw r.error; return r; }),
      supabase.from('sessions').select('*', { count: 'exact', head: true }).then(r => { if (r.error) throw r.error; return r; }),
      supabase.from('registrations').select('*', { count: 'exact', head: true }).then(r => { if (r.error) throw r.error; return r; }),
      supabase.from('sponsors').select('*', { count: 'exact', head: true }).then(r => { if (r.error) throw r.error; return r; }),
      supabase.from('news').select('*', { count: 'exact', head: true }).then(r => { if (r.error) throw r.error; return r; }),
      supabase.from('contacts').select('*', { count: 'exact', head: true }).then(r => { if (r.error) throw r.error; return r; }),
      supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('status', 'new').then(r => { if (r.error) throw r.error; return r; }),
      supabase.from('newsletter').select('*', { count: 'exact', head: true }).then(r => { if (r.error) throw r.error; return r; }),
      supabase.from('exhibitions').select('*', { count: 'exact', head: true }).then(r => { if (r.error) throw r.error; return r; }),
    ]);

    // Recent registrations (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { count: recentRegistrations, error: recentError } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo);

    if (recentError) throw recentError;

    res.json({
      speakers,
      sessions,
      registrations,
      sponsors,
      news,
      contacts,
      newContacts,
      newsletter,
      exhibitions,
      recentRegistrations,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
