import { getDb, generateId } from './db';

/**
 * Seed the database with initial data
 */
export function seedDatabase() {
  const db = getDb();
  
  // Check if database already has data
  const clientCount = db.prepare('SELECT COUNT(*) as count FROM clients').get();
  if (clientCount.count > 0) {
    console.log('Database already seeded, skipping...');
    return;
  }
  
  console.log('Seeding database with initial data...');
  
  // Begin transaction
  db.prepare('BEGIN TRANSACTION').run();
  
  try {
    // Seed clients
    const clients = [
      {
        id: generateId(),
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '(813) 555-0100',
        address: '123 Business Ave, Tampa, FL',
        joinDate: '2024-01-10',
        status: 'active'
      },
      {
        id: generateId(),
        name: 'Sunshine Residences',
        email: 'info@sunshine-res.com',
        phone: '(813) 555-0200',
        address: '456 Palm Dr, Tampa, FL',
        joinDate: '2024-02-15',
        status: 'active'
      },
      {
        id: generateId(),
        name: 'Bayshore Properties',
        email: 'contact@bayshore.com',
        phone: '(813) 555-0300',
        address: '789 Bayshore Blvd, Tampa, FL',
        joinDate: '2024-03-05',
        status: 'active'
      },
      {
        id: generateId(),
        name: 'Tampa Tech Park',
        email: 'admin@tampatech.com',
        phone: '(813) 555-0400',
        address: '101 Innovation Way, Tampa, FL',
        joinDate: '2024-03-20',
        status: 'prospect'
      },
      {
        id: generateId(),
        name: 'Gulf Coast Resorts',
        email: 'info@gulfcoast.com',
        phone: '(813) 555-0500',
        address: '202 Beach Rd, Clearwater, FL',
        joinDate: '2024-04-12',
        status: 'inactive'
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
    
    // Seed employees
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
      },
      {
        id: generateId(),
        name: 'David Brown',
        email: 'david.brown@ppr.com',
        phone: '(813) 555-5555',
        position: 'Installer',
        clockHours: 42.5,
        hireDate: '2024-04-12',
        status: 'active'
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
    
    // Seed projects
    const projects = [
      {
        id: generateId(),
        clientId: clients[0].id,
        address: '123 Business Ave, Tampa, FL',
        startDate: '2024-02-01',
        endDate: '2024-03-15',
        total: 15000,
        status: 'completed',
        type: 'commercial',
        squareFootage: 2500
      },
      {
        id: generateId(),
        clientId: clients[1].id,
        address: '456 Palm Dr, Tampa, FL',
        startDate: '2024-03-10',
        endDate: null,
        total: 8500,
        status: 'in_progress',
        type: 'residential',
        squareFootage: 1800
      },
      {
        id: generateId(),
        clientId: clients[2].id,
        address: '789 Bayshore Blvd, Tampa, FL',
        startDate: '2024-04-05',
        endDate: null,
        total: 12000,
        status: 'pending',
        type: 'residential',
        squareFootage: 2200
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
    
    // Seed quotes
    const quotes = [
      {
        id: generateId(),
        clientId: clients[0].id,
        projectId: projects[0].id,
        title: 'Office Renovation',
        description: 'Complete renovation of office space including flooring and lighting',
        date: '2024-01-25',
        expiryDate: '2024-02-25',
        total: 15000,
        status: 'accepted',
        type: 'commercial'
      },
      {
        id: generateId(),
        clientId: clients[1].id,
        projectId: projects[1].id,
        title: 'Kitchen Remodel',
        description: 'Full kitchen remodel with new appliances and countertops',
        date: '2024-03-01',
        expiryDate: '2024-04-01',
        total: 8500,
        status: 'accepted',
        type: 'residential'
      },
      {
        id: generateId(),
        clientId: clients[2].id,
        projectId: projects[2].id,
        title: 'Bathroom Renovation',
        description: 'Master bathroom renovation with new fixtures and tile',
        date: '2024-03-25',
        expiryDate: '2024-04-25',
        total: 12000,
        status: 'sent',
        type: 'residential'
      },
      {
        id: generateId(),
        clientId: clients[3].id,
        projectId: null,
        title: 'Office Space Planning',
        description: 'Initial planning and design for new office space',
        date: '2024-04-10',
        expiryDate: '2024-05-10',
        total: 5000,
        status: 'draft',
        type: 'commercial'
      }
    ];
    
    const insertQuote = db.prepare(`
      INSERT INTO quotes (id, clientId, projectId, title, description, date, expiryDate, total, status, type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    quotes.forEach(quote => {
      insertQuote.run(
        quote.id,
        quote.clientId,
        quote.projectId,
        quote.title,
        quote.description,
        quote.date,
        quote.expiryDate,
        quote.total,
        quote.status,
        quote.type
      );
    });
    
    // Seed project assignments
    const projectAssignments = [
      {
        id: generateId(),
        projectId: projects[0].id,
        employeeId: employees[0].id,
        role: 'Project Manager',
        hoursLogged: 45
      },
      {
        id: generateId(),
        projectId: projects[0].id,
        employeeId: employees[1].id,
        role: 'Technician',
        hoursLogged: 80
      },
      {
        id: generateId(),
        projectId: projects[1].id,
        employeeId: employees[2].id,
        role: 'Sales',
        hoursLogged: 15
      },
      {
        id: generateId(),
        projectId: projects[1].id,
        employeeId: employees[4].id,
        role: 'Installer',
        hoursLogged: 60
      },
      {
        id: generateId(),
        projectId: projects[2].id,
        employeeId: employees[0].id,
        role: 'Project Manager',
        hoursLogged: 10
      }
    ];
    
    const insertProjectAssignment = db.prepare(`
      INSERT INTO project_assignments (id, projectId, employeeId, role, hoursLogged)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    projectAssignments.forEach(assignment => {
      insertProjectAssignment.run(
        assignment.id,
        assignment.projectId,
        assignment.employeeId,
        assignment.role,
        assignment.hoursLogged
      );
    });
    
    // Seed quote items
    const quoteItems = [
      {
        id: generateId(),
        quoteId: quotes[0].id,
        description: 'Flooring installation',
        quantity: 2500,
        unitPrice: 3,
        total: 7500
      },
      {
        id: generateId(),
        quoteId: quotes[0].id,
        description: 'Lighting fixtures',
        quantity: 25,
        unitPrice: 200,
        total: 5000
      },
      {
        id: generateId(),
        quoteId: quotes[0].id,
        description: 'Labor',
        quantity: 50,
        unitPrice: 50,
        total: 2500
      },
      {
        id: generateId(),
        quoteId: quotes[1].id,
        description: 'Countertops',
        quantity: 30,
        unitPrice: 100,
        total: 3000
      },
      {
        id: generateId(),
        quoteId: quotes[1].id,
        description: 'Appliances',
        quantity: 1,
        unitPrice: 3500,
        total: 3500
      },
      {
        id: generateId(),
        quoteId: quotes[1].id,
        description: 'Labor',
        quantity: 40,
        unitPrice: 50,
        total: 2000
      }
    ];
    
    const insertQuoteItem = db.prepare(`
      INSERT INTO quote_items (id, quoteId, description, quantity, unitPrice, total)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    quoteItems.forEach(item => {
      insertQuoteItem.run(
        item.id,
        item.quoteId,
        item.description,
        item.quantity,
        item.unitPrice,
        item.total
      );
    });
    
    // Commit transaction
    db.prepare('COMMIT').run();
    
    console.log('Database seeded successfully');
  } catch (error) {
    // Rollback on error
    db.prepare('ROLLBACK').run();
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run the seeding function if this file is executed directly
if (require.main === module) {
  seedDatabase();
}
