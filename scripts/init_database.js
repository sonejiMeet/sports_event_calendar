const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');

const root = process.cwd();
const DB_FILE = path.join(root, 'sports_calendar.db');
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
