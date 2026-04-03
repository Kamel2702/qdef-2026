const express = require('express');
const bcrypt = require('bcryptjs');
const supabase = require('../supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/admins - list all admins (admin)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data: admins, error } = await supabase
      .from('admins')
      .select('id, email, name, created_at')
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.json(admins);
  } catch (err) {
    console.error('List admins error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/admins - create admin (admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const { data: existing } = await supabase
      .from('admins')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return res.status(409).json({ error: 'An admin with this email already exists.' });
    }

    const password_hash = bcrypt.hashSync(password, 10);

    const { data: admin, error } = await supabase
      .from('admins')
      .insert({ email, password_hash, name: name || null })
      .select('id, email, name, created_at')
      .single();

    if (error) throw error;

    res.status(201).json(admin);
  } catch (err) {
    console.error('Create admin error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/admins/:id - update admin (admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('admins')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: 'Admin not found.' });
    }

    const { email, password, name } = req.body;

    const updates = {
      email: email !== undefined ? email : existing.email,
      name: name !== undefined ? name : existing.name,
    };

    if (password) {
      updates.password_hash = bcrypt.hashSync(password, 10);
    }

    const { data: admin, error } = await supabase
      .from('admins')
      .update(updates)
      .eq('id', req.params.id)
      .select('id, email, name, created_at')
      .single();

    if (error) throw error;

    res.json(admin);
  } catch (err) {
    console.error('Update admin error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/admins/:id - delete admin (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Prevent self-deletion
    if (String(req.admin.id) === String(req.params.id)) {
      return res.status(400).json({ error: 'You cannot delete your own account.' });
    }

    const { data: existing, error: fetchError } = await supabase
      .from('admins')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: 'Admin not found.' });
    }

    const { error } = await supabase
      .from('admins')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Admin deleted successfully.' });
  } catch (err) {
    console.error('Delete admin error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
