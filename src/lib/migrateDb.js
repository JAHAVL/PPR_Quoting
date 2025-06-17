const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Database file path
const dbPath = path.join(dataDir, 'ppr-database.sqlite');

// Initialize database connection
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

console.log('Starting database migration for quotes table...');

try {
  // Check if the quotes table exists
  const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='quotes'").get();
  if (!tableExists) {
    console.log('Quotes table does not exist. No migration needed.');
    process.exit(0);
  }
  
  // Get the current table schema
  const tableInfo = db.prepare("PRAGMA table_info(quotes)").all();
  const columnNames = tableInfo.map(col => col.name.toLowerCase());
  
  console.log('Current columns in quotes table:', columnNames);
  
  // List of calculator fields that should be in the quotes table
  const calculatorFields = [
    { name: 'serviceName', type: 'TEXT' },
    { name: 'rawServiceCost', type: 'REAL' },
    { name: 'paverCost', type: 'REAL' },
    { name: 'materialCostDetail', type: 'REAL' },
    { name: 'laborCost', type: 'REAL' },
    { name: 'installCost', type: 'REAL' },
    { name: 'marketingCost', type: 'REAL' },
    { name: 'profit', type: 'REAL' },
    { name: 'profitMargin', type: 'REAL' },
    { name: 'finalCustomerPrice', type: 'REAL' },
    { name: 'squareFootage', type: 'REAL' },
    { name: 'pricePerSqFt', type: 'REAL' },
    { name: 'inputs', type: 'TEXT' },
    { name: 'calculations', type: 'TEXT' },
    { name: 'lineItems', type: 'TEXT' }
  ];
  
  // Add missing columns
  let columnsAdded = 0;
  for (const field of calculatorFields) {
    if (!columnNames.includes(field.name.toLowerCase())) {
      console.log(`Adding missing column: ${field.name}`);
      db.exec(`ALTER TABLE quotes ADD COLUMN ${field.name} ${field.type}`);
      columnsAdded++;
    }
  }
  
  // Fix the type constraint if needed
  try {
    // Check if the type column has the correct constraint
    const result = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='quotes'").get();
    const typeConstraint = result ? result.sql : '';
    
    // If the type constraint doesn't include 'Install' and 'Mx', we need to recreate the table
    if (typeConstraint && !typeConstraint.includes("type IN ('Install', 'Mx')")) {
      console.log('Updating type constraint to allow only Install or Mx...');
      
      // SQLite doesn't support modifying constraints directly, so we need to recreate the table
      // This is a complex operation that requires backing up data, dropping the table, recreating it, and restoring data
      // For now, we'll just log this and recommend a manual fix
      console.log('WARNING: The type column constraint needs to be updated manually.');
      console.log('Current quotes with invalid type values:');
      const invalidTypes = db.prepare("SELECT id, type FROM quotes WHERE type NOT IN ('Install', 'Mx')").all();
      console.log(invalidTypes);
    }
  } catch (error) {
    console.error('Error checking type constraint:', error);
  }
  
  if (columnsAdded > 0) {
    console.log(`Migration complete. Added ${columnsAdded} new columns to the quotes table.`);
  } else {
    console.log('No migration needed. All calculator fields already exist in the quotes table.');
  }
  
  // Close the database connection
  db.close();
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
