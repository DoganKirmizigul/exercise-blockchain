const Database = require('better-sqlite3');
const path = require('path');

let db;

function getDb() {
  if (!db) {
    db = new Database(process.env.DB_PATH || './db.sqlite');
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    migrate(db);
  }
  return db;
}

function migrate(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      name           TEXT NOT NULL,
      description    TEXT,
      location       TEXT,
      event_date     DATETIME NOT NULL,
      seller_address TEXT NOT NULL,
      created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ticket_categories (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id          INTEGER NOT NULL REFERENCES events(id),
      name              TEXT NOT NULL,
      price_eth         TEXT NOT NULL,
      price_eur         INTEGER NOT NULL,
      max_supply        INTEGER NOT NULL,
      contract_address  TEXT,
      ipfs_metadata_uri TEXT,
      created_at        DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS purchases (
      id                   INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_category_id   INTEGER NOT NULL REFERENCES ticket_categories(id),
      buyer_wallet_address TEXT NOT NULL,
      amount_eur           INTEGER NOT NULL,
      status               TEXT NOT NULL DEFAULT 'pending',
      token_id             INTEGER,
      tx_hash              TEXT,
      created_at           DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

module.exports = { getDb };