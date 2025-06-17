import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { getDb } from './db';

/**
 * This script migrates the existing database to include all calculator fields
 * for the quotes table if they don't already exist.
 */
function migrateQuotesTable() {
  console.log('Starting database migration for quotes table...');
  const db = getDb();
  
  try {
    // Check if the quotes table exists
    const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='quotes'").get();
    if (!tableExists) {
      console.log('Quotes table does not exist. No migration needed.');
      return;
    }
    
    // Get the current table schema
    const tableInfo = db.prepare("PRAGMA table_info(quotes)").all();
    const columnNames = tableInfo.map((col: any) => col.name.toLowerCase());
    
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
      const typeConstraint = result ? (result as {sql: string}).sql : '';
      
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
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run the migration
try {
  migrateQuotesTable();
} catch (error) {
  console.error('Migration script failed:', error);
  process.exit(1);
}
