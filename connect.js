import { db_filename } from './scripts/init_database.js';

import sql from 'sqlite3';

const sqlite3 = sql.verbose();

const DB = new sqlite3.Database(db_filename, sql.OPEN_READWRITE, connected);

function connected(err) {
  if (err) {
    console.log('Error connecting to DB:', err.message);
    process.exit(0);
  }
  console.log('Connected to SQLite sports_calendar.db');
}

export { DB };
