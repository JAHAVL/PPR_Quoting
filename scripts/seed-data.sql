-- Seed data SQL script for PPR database

-- Clear existing data if any
DELETE FROM project_assignments;
DELETE FROM quote_items;
DELETE FROM quotes;
DELETE FROM projects;
DELETE FROM employees;
DELETE FROM clients;

-- Seed clients
INSERT INTO clients (id, name, email, phone, address, joinDate, status)
VALUES 
  ('c1000000-0000-4000-a000-000000000001', 'Acme Corporation', 'contact@acme.com', '(813) 555-0100', '123 Business Ave, Tampa, FL', '2024-01-10', 'active'),
  ('c1000000-0000-4000-a000-000000000002', 'Sunshine Residences', 'info@sunshine-res.com', '(813) 555-0200', '456 Palm Dr, Tampa, FL', '2024-02-15', 'active'),
  ('c1000000-0000-4000-a000-000000000003', 'Bayshore Properties', 'contact@bayshore.com', '(813) 555-0300', '789 Bayshore Blvd, Tampa, FL', '2024-03-05', 'active'),
  ('c1000000-0000-4000-a000-000000000004', 'Tampa Tech Park', 'admin@tampatech.com', '(813) 555-0400', '101 Innovation Way, Tampa, FL', '2024-03-20', 'prospect'),
  ('c1000000-0000-4000-a000-000000000005', 'Gulf Coast Resorts', 'info@gulfcoast.com', '(813) 555-0500', '202 Beach Rd, Clearwater, FL', '2024-04-12', 'inactive');

-- Seed employees
INSERT INTO employees (id, name, email, phone, position, clockHours, hireDate, status)
VALUES
  ('e1000000-0000-4000-a000-000000000001', 'Alex Johnson', 'alex.johnson@ppr.com', '(813) 555-1111', 'Manager', 38.5, '2024-01-15', 'On'),
  ('e1000000-0000-4000-a000-000000000002', 'Maria Garcia', 'maria.garcia@ppr.com', '(813) 555-2222', 'Technician', 40.0, '2024-02-10', 'On'),
  ('e1000000-0000-4000-a000-000000000003', 'James Wilson', 'james.wilson@ppr.com', '(813) 555-3333', 'Sales', 35.5, '2024-03-05', 'On'),
  ('e1000000-0000-4000-a000-000000000004', 'Sophia Lee', 'sophia.lee@ppr.com', '(813) 555-4444', 'Technician', 0.0, '2024-03-20', 'Out'),
  ('e1000000-0000-4000-a000-000000000005', 'David Brown', 'david.brown@ppr.com', '(813) 555-5555', 'Installer', 42.5, '2024-04-12', 'Off');

-- Seed projects
INSERT INTO projects (id, clientId, address, startDate, endDate, total, status, type, squareFootage)
VALUES
  ('p1000000-0000-4000-a000-000000000001', 'c1000000-0000-4000-a000-000000000001', '123 Business Ave, Tampa, FL', '2024-05-01', '2024-06-15', 15000.00, 'in_progress', 'Install', 2500),
  ('p1000000-0000-4000-a000-000000000002', 'c1000000-0000-4000-a000-000000000002', '456 Palm Dr, Tampa, FL', '2024-05-15', '2024-06-01', 8500.00, 'pending', 'Mx', 1200),
  ('p1000000-0000-4000-a000-000000000003', 'c1000000-0000-4000-a000-000000000003', '789 Bayshore Blvd, Tampa, FL', '2024-04-10', '2024-05-10', 12000.00, 'completed', 'Install', 1800);

-- Seed quotes
INSERT INTO quotes (id, clientId, projectId, title, description, date, expiryDate, total, status, type)
VALUES
  ('q1000000-0000-4000-a000-000000000001', 'c1000000-0000-4000-a000-000000000001', 'p1000000-0000-4000-a000-000000000001', 'Office Building Pavers', 'Complete paver installation for office complex', '2024-04-15', '2024-05-15', 15000.00, 'accepted', 'Install'),
  ('q1000000-0000-4000-a000-000000000002', 'c1000000-0000-4000-a000-000000000002', 'p1000000-0000-4000-a000-000000000002', 'Residential Cleaning', 'Paver cleaning for residential property', '2024-05-01', '2024-06-01', 8500.00, 'sent', 'Mx'),
  ('q1000000-0000-4000-a000-000000000003', 'c1000000-0000-4000-a000-000000000003', NULL, 'Sealing Project', 'Paver sealing for commercial property', '2024-03-20', '2024-04-20', 12000.00, 'rejected', 'Mx'),
  ('q1000000-0000-4000-a000-000000000004', 'c1000000-0000-4000-a000-000000000004', NULL, 'New Installation', 'Initial planning and design for new installation', '2024-04-10', '2024-05-10', 5000.00, 'draft', 'Install');

-- Seed project assignments
INSERT INTO project_assignments (id, projectId, employeeId, role, hoursLogged)
VALUES
  ('pa1000000-0000-4000-a000-000000000001', 'p1000000-0000-4000-a000-000000000001', 'e1000000-0000-4000-a000-000000000001', 'Project Manager', 45),
  ('pa1000000-0000-4000-a000-000000000002', 'p1000000-0000-4000-a000-000000000001', 'e1000000-0000-4000-a000-000000000002', 'Technician', 80),
  ('pa1000000-0000-4000-a000-000000000003', 'p1000000-0000-4000-a000-000000000002', 'e1000000-0000-4000-a000-000000000003', 'Sales', 15),
  ('pa1000000-0000-4000-a000-000000000004', 'p1000000-0000-4000-a000-000000000002', 'e1000000-0000-4000-a000-000000000005', 'Installer', 60),
  ('pa1000000-0000-4000-a000-000000000005', 'p1000000-0000-4000-a000-000000000003', 'e1000000-0000-4000-a000-000000000001', 'Project Manager', 10);

-- Seed quote items
INSERT INTO quote_items (id, quoteId, description, quantity, unitPrice, total)
VALUES
  ('qi1000000-0000-4000-a000-000000000001', 'q1000000-0000-4000-a000-000000000001', 'Flooring installation', 2500, 3, 7500),
  ('qi1000000-0000-4000-a000-000000000002', 'q1000000-0000-4000-a000-000000000001', 'Lighting fixtures', 25, 200, 5000),
  ('qi1000000-0000-4000-a000-000000000003', 'q1000000-0000-4000-a000-000000000001', 'Labor', 50, 50, 2500),
  ('qi1000000-0000-4000-a000-000000000004', 'q1000000-0000-4000-a000-000000000002', 'Countertops', 30, 100, 3000),
  ('qi1000000-0000-4000-a000-000000000005', 'q1000000-0000-4000-a000-000000000002', 'Appliances', 1, 3500, 3500),
  ('qi1000000-0000-4000-a000-000000000006', 'q1000000-0000-4000-a000-000000000002', 'Labor', 40, 50, 2000);
