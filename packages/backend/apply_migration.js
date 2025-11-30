const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../../audit.db');
const db = new sqlite3.Database(dbPath);

const migrationPath = path.join(__dirname, 'migrations', '001_add_hype_metrics.sql');
const migrationSql = fs.readFileSync(migrationPath, 'utf8');

db.serialize(() => {
    db.exec(migrationSql, (err) => {
        if (err) {
            console.error('Migration failed:', err.message);
            process.exit(1);
        } else {
            console.log('Migration applied successfully.');
            process.exit(0);
        }
    });
});
