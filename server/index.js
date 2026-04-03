require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Serve uploaded files
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// API Routes
const authRoutes = require('./routes/auth');
const programmeRoutes = require('./routes/programme');
const speakersRoutes = require('./routes/speakers');
const registrationsRoutes = require('./routes/registrations');
const pagesRoutes = require('./routes/pages');
const configRoutes = require('./routes/config');
const sponsorsRoutes = require('./routes/sponsors');
const newsRoutes = require('./routes/news');
const contactsRoutes = require('./routes/contacts');
const newsletterRoutes = require('./routes/newsletter');
const exhibitionsRoutes = require('./routes/exhibitions');
const uploadsRoutes = require('./routes/uploads');
const statsRoutes = require('./routes/stats');
const adminsRoutes = require('./routes/admins');
const customPagesRoutes = require('./routes/custom-pages');

app.use('/api/auth', authRoutes);
app.use('/api/sessions', programmeRoutes);
app.use('/api/speakers', speakersRoutes);
app.use('/api/register', registrationsRoutes);
app.use('/api/registrations', registrationsRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/config', configRoutes);
app.use('/api/sponsors', sponsorsRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/exhibitions', exhibitionsRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admins', adminsRoutes);
app.use('/api/custom-pages', customPagesRoutes);

// Serve static files from the client build (production)
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

// SPA fallback - serve index.html for non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found.' });
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('Q-DEF Conference Server is running. Client build not found.');
    }
  });
});

// Only start server when run directly (not in serverless)
if (!process.env.NETLIFY) {
  app.listen(PORT, () => {
    console.log(`Q-DEF Conference server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
