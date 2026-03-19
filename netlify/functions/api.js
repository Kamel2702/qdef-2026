// Netlify Function wrapping Express backend
// Set env defaults before requiring the app
process.env.NETLIFY = 'true';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'qdef-netlify-secret-key-2026';
process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@qdef.lu';
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const serverless = require('serverless-http');
const app = require('../../server/index');

const handler = serverless(app);

module.exports = { handler };
