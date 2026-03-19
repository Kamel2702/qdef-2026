const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email);

    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const validPassword = bcrypt.compareSync(password, admin.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  try {
    const admin = db.prepare('SELECT id, email, name, created_at FROM admins WHERE id = ?').get(req.admin.id);

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found.' });
    }

    res.json(admin);
  } catch (err) {
    console.error('Get admin error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
