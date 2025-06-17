// Database seeding script
const { getDb, initDb, generateId } = require('./db');

// Get database instance
const db = getDb();
// No need for uuid package as we're using generateId from db.js

// Initialize the database
initDb();

// We're using the generateId function from db.js
// No need to use uuid package

// Check if data already exists to avoid duplicate seeding
const hasData = () => {
  const clientCount = db.prepare('SELECT COUNT(*) as count FROM clients').get();
  return clientCount && clientCount.count > 0;
};

// Seed clients
const seedClients = () => {
  console.log('Seeding clients...');
  const clients = [
    {
      id: generateId(),
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '(813) 555-1234',
      address: '123 Main St, Tampa, FL',
      joinDate: '2025-01-10',
      status: 'active'
    },
    {
      id: generateId(),
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '(813) 555-2345',
      address: '456 Oak Ave, Tampa, FL',
      joinDate: '2025-02-15',
      status: 'active'
    },
    {
      id: generateId(),
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      phone: '(813) 555-3456',
      address: '789 Pine Rd, Tampa, FL',
      joinDate: '2025-03-20',
      status: 'inactive'
    },
    {
      id: generateId(),
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      phone: '(813) 555-4567',
      address: '101 Cedar Ln, Tampa, FL',
      joinDate: '2025-04-05',
      status: 'active'
    },
    {
      id: generateId(),
      name: 'Robert Wilson',
      email: 'robert.wilson@example.com',
      phone: '(813) 555-5678',
      address: '202 Maple Dr, Tampa, FL',
      joinDate: '2025-05-12',
      status: 'prospect'
    },
    {
      id: generateId(),
      name: 'Jennifer Miller',
      email: 'jennifer.miller@example.com',
      phone: '(813) 555-6789',
      address: '303 Elm St, Tampa, FL',
      joinDate: '2025-05-25',
      status: 'active'
    }
  ];

  const insertClient = db.prepare(`
    INSERT INTO clients (id, name, email, phone, address, joinDate, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  clients.forEach(client => {
    insertClient.run(
      client.id,
      client.name,
      client.email,
      client.phone,
      client.address,
      client.joinDate,
      client.status
    );
  });

  return clients;
};

// Seed employees
const seedEmployees = () => {
  console.log('Seeding employees...');
  const employees = [
    {
      id: generateId(),
      name: 'Alex Johnson',
      email: 'alex.johnson@ppr.com',
      phone: '(813) 555-1111',
      position: 'Manager',
      clockHours: 38.5,
      hireDate: '2024-01-15',
      status: 'active'
    },
    {
      id: generateId(),
      name: 'Maria Garcia',
      email: 'maria.garcia@ppr.com',
      phone: '(813) 555-2222',
      position: 'Technician',
      clockHours: 40.0,
      hireDate: '2024-02-10',
      status: 'active'
    },
    {
      id: generateId(),
      name: 'James Wilson',
      email: 'james.wilson@ppr.com',
      phone: '(813) 555-3333',
      position: 'Sales',
      clockHours: 35.5,
      hireDate: '2024-03-05',
      status: 'active'
    },
    {
      id: generateId(),
      name: 'Sophia Lee',
      email: 'sophia.lee@ppr.com',
      phone: '(813) 555-4444',
      position: 'Technician',
      clockHours: 0.0,
      hireDate: '2024-03-20',
      status: 'onleave'
    }
  ];

  const insertEmployee = db.prepare(`
    INSERT INTO employees (id, name, email, phone, position, clockHours, hireDate, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  employees.forEach(employee => {
    insertEmployee.run(
      employee.id,
      employee.name,
      employee.email,
      employee.phone,
      employee.position,
      employee.clockHours,
      employee.hireDate,
      employee.status
    );
  });

  return employees;
};

// Seed projects
const seedProjects = (clients) => {
  console.log('Seeding projects...');
  const clientMap = {};
  clients.forEach(client => {
    clientMap[client.name] = client.id;
  });

  const projects = [
    {
      id: generateId(),
      clientId: clientMap['John Smith'],
      address: '123 Main St, Tampa, FL',
      startDate: '2025-06-10',
      endDate: '2025-06-20',
      total: 5250.00,
      status: 'in_progress',
      type: 'install',
      squareFootage: 500
    },
    {
      id: generateId(),
      clientId: clientMap['Sarah Johnson'],
      address: '456 Oak Ave, Tampa, FL',
      startDate: '2025-06-09',
      endDate: '2025-06-15',
      total: 1200.00,
      status: 'pending',
      type: 'clean',
      squareFootage: 800
    },
    {
      id: generateId(),
      clientId: clientMap['Michael Brown'],
      address: '789 Pine Rd, Tampa, FL',
      startDate: '2025-05-20',
      endDate: '2025-06-01',
      total: 1850.00,
      status: 'completed',
      type: 'seal',
      squareFootage: 650
    },
    {
      id: generateId(),
      clientId: clientMap['Emily Davis'],
      address: '101 Cedar Ln, Tampa, FL',
      startDate: '2025-06-15',
      endDate: '2025-06-30',
      total: 7500.00,
      status: 'pending',
      type: 'install',
      squareFootage: 750
    }
  ];

  const insertProject = db.prepare(`
    INSERT INTO projects (id, clientId, address, startDate, endDate, total, status, type, squareFootage)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  projects.forEach(project => {
    insertProject.run(
      project.id,
      project.clientId,
      project.address,
      project.startDate,
      project.endDate,
      project.total,
      project.status,
      project.type,
      project.squareFootage
    );
  });

  return projects;
};

// Seed quotes
const seedQuotes = (clients) => {
  console.log('Seeding quotes...');
  const clientMap = {};
  clients.forEach(client => {
    clientMap[client.name] = client.id;
  });

  const quotes = [
    {
      id: generateId(),
      clientId: clientMap['John Smith'],
      title: 'Paver Installation',
      description: 'Install new pavers in backyard',
      date: '2025-06-05',
      expiryDate: '2025-07-05',
      total: 5250.00,
      status: 'accepted',
      type: 'residential',
      address: '123 Main St, Tampa, FL',
      squareFootage: 500
    },
    {
      id: generateId(),
      clientId: clientMap['Sarah Johnson'],
      title: 'Paver Cleaning',
      description: 'Clean existing pavers',
      date: '2025-06-02',
      expiryDate: '2025-07-02',
      total: 1200.00,
      status: 'sent',
      type: 'residential',
      address: '456 Oak Ave, Tampa, FL',
      squareFootage: 800
    },
    {
      id: generateId(),
      clientId: clientMap['Robert Wilson'],
      title: 'Paver Cleaning',
      description: 'Clean existing pavers',
      date: '2025-05-30',
      expiryDate: '2025-06-30',
      total: 900.00,
      status: 'rejected',
      type: 'residential',
      address: '202 Maple Dr, Tampa, FL',
      squareFootage: 700
    },
    {
      id: generateId(),
      clientId: clientMap['Jennifer Miller'],
      title: 'Paver Installation',
      description: 'Install new pavers in front yard',
      date: '2025-05-31',
      expiryDate: '2025-06-30',
      total: 4200.00,
      status: 'draft',
      type: 'residential',
      address: '303 Elm St, Tampa, FL',
      squareFootage: 450
    }
  ];

  const insertQuote = db.prepare(`
    INSERT INTO quotes (id, clientId, title, description, date, expiryDate, total, status, type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  quotes.forEach(quote => {
    insertQuote.run(
      quote.id,
      quote.clientId,
      quote.title,
      quote.description,
      quote.date,
      quote.expiryDate,
      quote.total,
      quote.status,
      quote.type
    );
  });

  return quotes;
};

// Main seeding function
const seedDatabase = () => {
  if (hasData()) {
    console.log('Database already has data. Skipping seeding.');
    return;
  }

  console.log('Starting database seeding...');
  
  try {
    // Begin transaction
    db.prepare('BEGIN').run();
    
    // Seed data in order of dependencies
    const clients = seedClients();
    seedEmployees();
    seedProjects(clients);
    seedQuotes(clients);
    
    // Commit transaction
    db.prepare('COMMIT').run();
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    // Rollback on error
    db.prepare('ROLLBACK').run();
    console.error('Error seeding database:', error);
  }
};

// Run the seeding function
seedDatabase();
