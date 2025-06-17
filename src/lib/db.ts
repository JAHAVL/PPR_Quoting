import Database from 'better-sqlite3';
type DatabaseInstance = ReturnType<typeof Database>;
import path from 'path';
import fs from 'fs';

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Database file path
const dbPath = path.join(dataDir, 'ppr-database.sqlite');

// Initialize database connection
let db: DatabaseInstance;

// This function ensures we don't create multiple connections
export function getDb(): DatabaseInstance {
  if (!db) {
    // Using type assertion to fix the constructor type issue
    db = new (Database as any)(dbPath);
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON');
    
    // For better performance
    db.pragma('journal_mode = WAL');
  }
  
  return db;
}

// Initialize database schema
export function initDb(): void {
  const db = getDb();
  
  // Create clients table
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      address TEXT,
      joinDate TEXT,
      status TEXT CHECK(status IN ('active', 'inactive', 'prospect')) NOT NULL DEFAULT 'prospect',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Create projects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      clientId TEXT NOT NULL,
      address TEXT,
      startDate TEXT,
      endDate TEXT,
      total REAL,
      status TEXT CHECK(status IN ('pending', 'in_progress', 'completed', 'cancelled')) NOT NULL DEFAULT 'pending',
      type TEXT CHECK(type IN ('Install', 'Mx')),
      squareFootage INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE
    )
  `);
  
  // Create quotes table with all fields needed by the quote calculator
  db.exec(`
    CREATE TABLE IF NOT EXISTS quotes (
      id TEXT PRIMARY KEY,
      clientId TEXT NOT NULL,
      projectId TEXT,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      expiryDate TEXT,
      total REAL NOT NULL,
      status TEXT CHECK(status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')) NOT NULL DEFAULT 'draft',
      type TEXT CHECK(type IN ('Install', 'Mx')) NOT NULL DEFAULT 'Install',
      
      -- Quote calculator specific fields
      serviceName TEXT,
      rawServiceCost REAL,
      paverCost REAL,
      materialCostDetail REAL,
      laborCost REAL,
      installCost REAL,
      marketingCost REAL,
      profit REAL,
      profitMargin REAL,
      finalCustomerPrice REAL,
      squareFootage REAL,
      pricePerSqFt REAL,
      inputs TEXT, -- JSON string
      calculations TEXT, -- JSON string
      lineItems TEXT, -- JSON string
      
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE,
      FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE SET NULL
    )
  `);
  
  // Create employees table
  db.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      position TEXT,
      clockHours REAL DEFAULT 0,
      hireDate TEXT,
      status TEXT CHECK(status IN ('On', 'Off', 'Out', 'Archived')) NOT NULL DEFAULT 'On',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Create quote_items table for line items in quotes
  db.exec(`
    CREATE TABLE IF NOT EXISTS quote_items (
      id TEXT PRIMARY KEY,
      quoteId TEXT NOT NULL,
      description TEXT NOT NULL,
      quantity REAL NOT NULL DEFAULT 1,
      unitPrice REAL NOT NULL,
      total REAL NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quoteId) REFERENCES quotes(id) ON DELETE CASCADE
    )
  `);
  
  // Create project_assignments table to track which employees are assigned to which projects
  db.exec(`
    CREATE TABLE IF NOT EXISTS project_assignments (
      id TEXT PRIMARY KEY,
      projectId TEXT NOT NULL,
      employeeId TEXT NOT NULL,
      role TEXT,
      hoursLogged REAL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
      UNIQUE(projectId, employeeId)
    )
  `);
  
  // Create activities table to track client-related activities and notes
  db.exec(`
    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      clientId TEXT NOT NULL,
      userId TEXT, -- For future user association, nullable for now
      type TEXT CHECK(type IN ('system', 'user', 'other')) NOT NULL,
      content TEXT NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      eventType TEXT CHECK(eventType IN ('quote_accepted', 'quote_created', 'project_status', 'call', 'email', 'note')),
      details TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE
    )
  `);
}

// Helper function to close the database connection
export function closeDb(): void {
  if (db) {
    db.close();
    db = undefined as any;
  }
}

// Helper to generate UUIDs for IDs
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Initialize the database on import
try {
  initDb();
  console.log('Database initialized successfully');
} catch (error) {
  console.error('Failed to initialize database:', error);
}
