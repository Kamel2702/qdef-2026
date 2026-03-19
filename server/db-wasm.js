// WASM-based SQLite for serverless (Netlify Functions)
// Wraps sql.js to match better-sqlite3 API
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = '/tmp/qdef.db';
let dbInstance = null;
let SQL = null;

function getDb() {
  if (dbInstance) return dbInstance;

  // sql.js must be initialized synchronously for compatibility
  // We use the synchronous require approach
  if (!SQL) {
    // sql.js ships a WASM file - locate it
    const wasmPath = path.join(require.resolve('sql.js'), '..', 'sql-wasm.wasm');
    const wasmBinary = fs.existsSync(wasmPath) ? fs.readFileSync(wasmPath) : undefined;
    // For synchronous init, we need a workaround
    throw new Error('sql.js needs async init - use initDb() first');
  }

  return dbInstance;
}

// Statement wrapper to match better-sqlite3 API
class StatementWrapper {
  constructor(db, sql) {
    this._db = db;
    this._sql = sql;
  }

  run(...params) {
    const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
    this._db.run(this._sql, flatParams);
    return { changes: this._db.getRowsModified(), lastInsertRowid: getLastInsertRowid(this._db) };
  }

  get(...params) {
    const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
    const stmt = this._db.prepare(this._sql);
    stmt.bind(flatParams.length > 0 ? flatParams : undefined);
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return row;
    }
    stmt.free();
    return undefined;
  }

  all(...params) {
    const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
    const results = [];
    const stmt = this._db.prepare(this._sql);
    stmt.bind(flatParams.length > 0 ? flatParams : undefined);
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  }
}

function getLastInsertRowid(db) {
  const stmt = db.prepare('SELECT last_insert_rowid() as id');
  stmt.step();
  const row = stmt.getAsObject();
  stmt.free();
  return row.id;
}

// Database wrapper matching better-sqlite3 API
class DatabaseWrapper {
  constructor(sqlDb) {
    this._db = sqlDb;
  }

  prepare(sql) {
    return new StatementWrapper(this._db, sql);
  }

  exec(sql) {
    this._db.exec(sql);
    return this;
  }

  pragma(str) {
    try {
      this._db.exec(`PRAGMA ${str}`);
    } catch (e) {
      // Ignore pragma errors in WASM mode
    }
  }

  transaction(fn) {
    return (...args) => {
      this._db.exec('BEGIN');
      try {
        const result = fn(...args);
        this._db.exec('COMMIT');
        return result;
      } catch (e) {
        this._db.exec('ROLLBACK');
        throw e;
      }
    };
  }

  close() {
    // Save to disk before closing
    try {
      const data = this._db.export();
      fs.writeFileSync(DB_PATH, Buffer.from(data));
    } catch (e) {
      console.warn('Failed to save DB:', e.message);
    }
    this._db.close();
    dbInstance = null;
  }
}

// Synchronous initialization using require hack
let _initPromise = null;

function initDbSync() {
  if (dbInstance) return dbInstance;

  // Use synchronous approach: load WASM from buffer
  const sqlJsPath = require.resolve('sql.js');
  const sqlJsDir = path.dirname(sqlJsPath);

  // Try to load existing DB from /tmp
  let data = null;
  if (fs.existsSync(DB_PATH)) {
    data = fs.readFileSync(DB_PATH);
  }

  // We need to do async init, but we'll cache the result
  return null; // Will be handled by async init
}

// Module-level async initialization
let _ready = false;
let _readyCallbacks = [];

async function ensureReady() {
  if (_ready) return dbInstance;

  const sqlJsPath = require.resolve('sql.js');
  const sqlJsDir = path.dirname(sqlJsPath);
  const wasmPath = path.join(sqlJsDir, 'sql-wasm.wasm');

  const initConfig = {};
  if (fs.existsSync(wasmPath)) {
    initConfig.wasmBinary = fs.readFileSync(wasmPath);
  }

  SQL = await initSqlJs(initConfig);

  let data = null;
  if (fs.existsSync(DB_PATH)) {
    data = fs.readFileSync(DB_PATH);
  }

  const sqlDb = data ? new SQL.Database(data) : new SQL.Database();
  dbInstance = new DatabaseWrapper(sqlDb);
  _ready = true;
  return dbInstance;
}

module.exports = { ensureReady, DB_PATH };
