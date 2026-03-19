const path = require('path');
const fs = require('fs');

const isNetlify = !!process.env.NETLIFY;

let db;

if (isNetlify) {
  // ---- SERVERLESS MODE: use global sql.js wrapper set by the function handler ----
  // The sql.js Database is initialized async in netlify/functions/api.js
  // and stored in global.__qdefDb before this module is required.

  const DB_PATH = '/tmp/qdef.db';

  class StatementWrapper {
    constructor(sqlDb, sql) { this._db = sqlDb; this._sql = sql; }

    run(...params) {
      this._db.run(this._sql, params);
      const id = this._db.exec('SELECT last_insert_rowid() as id');
      return { changes: this._db.getRowsModified(), lastInsertRowid: id[0]?.values[0]?.[0] || 0 };
    }

    get(...params) {
      const stmt = this._db.prepare(this._sql);
      if (params.length > 0) stmt.bind(params);
      if (stmt.step()) {
        const cols = stmt.getColumnNames();
        const vals = stmt.get();
        stmt.free();
        const row = {};
        cols.forEach((c, i) => row[c] = vals[i]);
        return row;
      }
      stmt.free();
      return undefined;
    }

    all(...params) {
      const results = [];
      const stmt = this._db.prepare(this._sql);
      if (params.length > 0) stmt.bind(params);
      const cols = stmt.getColumnNames();
      while (stmt.step()) {
        const vals = stmt.get();
        const row = {};
        cols.forEach((c, i) => row[c] = vals[i]);
        results.push(row);
      }
      stmt.free();
      return results;
    }
  }

  db = {
    prepare(sql) { return new StatementWrapper(global.__qdefSqlDb, sql); },
    exec(sql) { global.__qdefSqlDb.exec(sql); return db; },
    pragma(str) { try { global.__qdefSqlDb.exec('PRAGMA ' + str); } catch {} },
    transaction(fn) {
      return (...args) => {
        global.__qdefSqlDb.exec('BEGIN');
        try { const r = fn(...args); global.__qdefSqlDb.exec('COMMIT'); return r; }
        catch (e) { global.__qdefSqlDb.exec('ROLLBACK'); throw e; }
      };
    },
    _save() {
      try {
        const data = global.__qdefSqlDb.export();
        fs.writeFileSync(DB_PATH, Buffer.from(data));
      } catch {}
    }
  };

} else {
  // ---- LOCAL MODE: use better-sqlite3 (native) ----
  const Database = require('better-sqlite3');
  const dbPath = path.join(__dirname, 'qdef.db');
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  const tableInfo = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='sessions'").get();
  if (tableInfo && !tableInfo.sql.includes("'workshop'")) {
    db.exec('DROP TABLE IF EXISTS sessions');
  }
}

// Create tables (works for both modes)
db.exec(`
  CREATE TABLE IF NOT EXISTS speakers (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, title TEXT,
    organization TEXT, bio TEXT, photo_url TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT,
    type TEXT NOT NULL CHECK(type IN ('keynote','panel','presentation','break','workshop','fireside')),
    start_time DATETIME NOT NULL, end_time DATETIME NOT NULL, speaker_ids TEXT DEFAULT '[]',
    tags TEXT, location TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT NOT NULL, last_name TEXT NOT NULL,
    organization TEXT, position TEXT, email TEXT NOT NULL UNIQUE, country TEXT,
    dietary_requirements TEXT, accessibility_needs TEXT, gdpr_consent INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, name TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL UNIQUE,
    title TEXT, content TEXT, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY, value TEXT, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS sponsors (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, tier TEXT NOT NULL DEFAULT 'gold',
    logo_url TEXT, website_url TEXT, description TEXT, sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, slug TEXT UNIQUE,
    excerpt TEXT, content TEXT, image_url TEXT, published INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL,
    subject TEXT, message TEXT, status TEXT DEFAULT 'new', created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS newsletter (
    id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE,
    source TEXT DEFAULT 'website', created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS exhibitions (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT,
    image_url TEXT, tag TEXT, website_url TEXT, sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Auto-seed on Netlify cold start
if (isNetlify) {
  const adminExists = db.prepare('SELECT id FROM admins LIMIT 1').get();
  if (!adminExists) {
    try {
      require('./seed-fn')();
      db._save();
      console.log('Auto-seeded on cold start');
    } catch (e) { console.warn('Seed failed:', e.message); }
  }
}

module.exports = db;
