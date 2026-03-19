// Netlify Function - Express API wrapper with sql.js (WASM SQLite)
const fs = require('fs');
const path = require('path');

process.env.NETLIFY = 'true';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'qdef-netlify-secret-key-2026';
process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@qdef.lu';
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const DB_PATH = '/tmp/qdef.db';
let _handler = null;

async function getHandler() {
  if (_handler) return _handler;

  // 1. Initialize sql.js (async WASM load)
  const initSqlJs = require('sql.js');
  const SQL = await initSqlJs();

  // 2. Load existing DB from /tmp or create new
  let sqlDb;
  if (fs.existsSync(DB_PATH)) {
    const data = fs.readFileSync(DB_PATH);
    sqlDb = new SQL.Database(data);
  } else {
    sqlDb = new SQL.Database();
  }

  // 3. Store globally BEFORE requiring the Express app
  global.__qdefSqlDb = sqlDb;

  // 4. Now require Express app (db.js will use the global)
  const serverless = require('serverless-http');
  const app = require('../../server/index');
  _handler = serverless(app);

  return _handler;
}

exports.handler = async (event, context) => {
  const handler = await getHandler();
  const result = await handler(event, context);
  return result;
};
