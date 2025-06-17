// Script to run the SQL seed file
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Database file path
const dbPath = path.join(dataDir, 'ppr-database.sqlite');

// Read SQL files
const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
const seedSQL = fs.readFileSync(path.join(__dirname, 'seed-data.sql'), 'utf8');

// Connect to database
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// For better performance
db.pragma('journal_mode = WAL');

console.log('Initializing database schema...');

// Initialize the database schema first, then seed
try {
  // Apply schema
  db.exec(schemaSQL);
  console.log('Schema initialized successfully!');
  
  console.log('Seeding database...');
  
  // Execute the SQL seed script within a transaction
  try {
    db.exec('BEGIN TRANSACTION;');
    db.exec(seedSQL);
    db.exec('COMMIT;');
    console.log('Database seeded successfully!');
  } catch (error) {
    db.exec('ROLLBACK;');
    console.error('Error seeding database:', error);
  }
} catch (error) {
  console.error('Error initializing schema:', error);
} finally {
  // Close the database connection
  db.close();
}
