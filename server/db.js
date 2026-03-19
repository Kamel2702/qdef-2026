const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// In Netlify Functions, use /tmp for writable storage
const isNetlify = !!process.env.NETLIFY;
const dbPath = isNetlify ? '/tmp/qdef.db' : path.join(__dirname, 'qdef.db');

// Check if DB needs seeding (for serverless cold starts)
const needsSeed = isNetlify && !fs.existsSync(dbPath);

const db = new Database(dbPath);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Migrate: if the sessions table exists with old CHECK constraint, recreate it
const tableInfo = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='sessions'").get();
if (tableInfo && !tableInfo.sql.includes("'workshop'")) {
  db.exec('DROP TABLE IF EXISTS sessions');
}

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS speakers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    title TEXT,
    organization TEXT,
    bio TEXT,
    photo_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK(type IN ('keynote', 'panel', 'presentation', 'break', 'workshop', 'fireside')),
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    speaker_ids TEXT DEFAULT '[]',
    tags TEXT,
    location TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    organization TEXT,
    position TEXT,
    email TEXT NOT NULL UNIQUE,
    country TEXT,
    dietary_requirements TEXT,
    accessibility_needs TEXT,
    gdpr_consent INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT,
    content TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sponsors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    tier TEXT NOT NULL DEFAULT 'gold',
    logo_url TEXT,
    website_url TEXT,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    excerpt TEXT,
    content TEXT,
    image_url TEXT,
    published INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT,
    status TEXT DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS newsletter (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    source TEXT DEFAULT 'website',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS exhibitions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    tag TEXT,
    website_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Auto-seed on Netlify cold start
if (needsSeed) {
  try {
    require('./seed-fn')();
    console.log('Database auto-seeded on cold start');
  } catch (err) {
    console.warn('Auto-seed failed:', err.message);
  }
}

module.exports = db;
