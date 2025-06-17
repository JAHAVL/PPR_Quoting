import { NextApiRequest, NextApiResponse } from 'next';
import { getDb, generateId } from '../../../lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = getDb();
    
    switch (req.method) {
      case 'GET':
        // Get all employees
        const employees = db.prepare('SELECT * FROM employees ORDER BY name').all();
        return res.status(200).json(employees);
        
      case 'POST':
        // Create a new employee
        const { name, email, phone, position, clockHours, hireDate, status } = req.body;
        
        if (!name) {
          return res.status(400).json({ error: 'Name is required' });
        }
        
        const id = generateId();
        const employeeHireDate = hireDate || new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        
        const insertEmployee = db.prepare(`
          INSERT INTO employees (id, name, email, phone, position, clockHours, hireDate, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        insertEmployee.run(
          id, 
          name, 
          email || null, 
          phone || null, 
          position || null, 
          clockHours || 0, 
          employeeHireDate, 
          status || 'active'
        );
        
        const newEmployee = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);
        return res.status(201).json(newEmployee);
        
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
