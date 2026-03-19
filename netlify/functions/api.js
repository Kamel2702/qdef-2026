// Netlify Function wrapping Express backend
const path = require('path');
const fs = require('fs');

// Set env defaults before requiring the app
process.env.NETLIFY = 'true';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'qdef-netlify-secret-key-2026';
process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@qdef.lu';
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Swap the Windows .node binary with the Linux one before better-sqlite3 loads
const linuxBinary = path.join(__dirname, '..', '..', 'server', 'prebuilds', 'linux-x64', 'better_sqlite3.node');
const targetBinary = path.join(__dirname, '..', '..', 'node_modules', 'better-sqlite3', 'build', 'Release', 'better_sqlite3.node');

// Also check server/node_modules path
const targetBinary2 = path.join(__dirname, '..', '..', 'server', 'node_modules', 'better-sqlite3', 'build', 'Release', 'better_sqlite3.node');

if (fs.existsSync(linuxBinary)) {
  // Copy Linux binary over Windows binary
  for (const target of [targetBinary, targetBinary2]) {
    try {
      const dir = path.dirname(target);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.copyFileSync(linuxBinary, target);
    } catch (e) {
      // Target path may not exist, that's OK
    }
  }
}

const serverless = require('serverless-http');
const app = require('../../server/index');

const handler = serverless(app);

module.exports = { handler };
