import fs from 'fs';
import path from 'path';
import sql3 from 'sqlite3';

const sqlite3 = sql3.verbose();

const root = process.cwd();
const db_filename = 'sports_calendar.db';

const DB_FILE = path.join(root, db_filename);
const schema_file = path.join(root, 'db', 'schema.sql');

const schemaSql = fs.readFileSync(schema_file, 'utf-8');

const db = new sqlite3.Database(DB_FILE);

db.exec(schemaSql, (err) => {
  if (err) {
    console.error('Error applying the schema:', err.message);
    process.exit(1);
  }
  console.log('Schema was applied sucessfully');
  db.close();
});

export {db_filename};