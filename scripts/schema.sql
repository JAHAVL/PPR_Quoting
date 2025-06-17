-- Database schema for PPR Quoting Software

-- Create clients table
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
);

-- Create projects table
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
);

-- Create quotes table
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE SET NULL
);

-- Create employees table
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
);

-- Create quote_items table for line items in quotes
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
);

-- Create project_assignments table to track which employees are assigned to which projects
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
);
