const express = require('express');
const supabase = require('../supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// POST /api/contacts - submit contact form (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const { data: contact, error } = await supabase
      .from('contacts')
      .insert({
        name: name.trim().slice(0, 200),
        email: email.trim().slice(0, 200),
        subject: (subject || '').trim().slice(0, 300),
        message: (message || '').trim().slice(0, 5000),
        status: 'new'
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Message sent successfully.', id: contact.id });
  } catch (err) {
    console.error('Submit contact error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/contacts - list all contacts (admin)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data: contacts, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(contacts);
  } catch (err) {
    console.error('List contacts error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/contacts/:id - full edit contact (admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !existing) return res.status(404).json({ error: 'Contact not found.' });

    const { name, email, subject, message, status } = req.body;

    const { data: contact, error } = await supabase
      .from('contacts')
      .update({
        name: name !== undefined ? name : existing.name,
        email: email !== undefined ? email : existing.email,
        subject: subject !== undefined ? subject : existing.subject,
        message: message !== undefined ? message : existing.message,
        status: status !== undefined ? status : existing.status
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(contact);
  } catch (err) {
    console.error('Update contact error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/contacts/:id/status - update status (admin)
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !existing) return res.status(404).json({ error: 'Contact not found.' });

    const status = req.body.status || 'read';

    const { error } = await supabase
      .from('contacts')
      .update({ status })
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Status updated.' });
  } catch (err) {
    console.error('Update contact status error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/contacts/:id - delete contact (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !existing) return res.status(404).json({ error: 'Contact not found.' });

    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Contact deleted successfully.' });
  } catch (err) {
    console.error('Delete contact error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
