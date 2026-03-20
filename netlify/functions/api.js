// Netlify Function - Express API with Supabase backend
process.env.JWT_SECRET = process.env.JWT_SECRET || 'qdef-netlify-secret-key-2026';

const serverless = require('serverless-http');
const app = require('../../server/index');

const handler = serverless(app);

module.exports = { handler };
