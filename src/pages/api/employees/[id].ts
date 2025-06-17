import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../../lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = getDb();
    const { id } = req.query;
    
    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }
    
    switch (req.method) {
      case 'GET':
        // Get a single employee
        const employee = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);
        
        if (!employee) {
          return res.status(404).json({ error: 'Employee not found' });
        }
        
        // Get project assignments for this employee
        const projectAssignments = db.prepare(`
          SELECT pa.*, p.address, p.status as projectStatus
          FROM project_assignments pa
          JOIN projects p ON pa.projectId = p.id
          WHERE pa.employeeId = ?
        `).all(id);
        
        // Add the project assignments to the employee
        employee.projectAssignments = projectAssignments;
        
        return res.status(200).json(employee);
        
      case 'PUT':
        // Update an employee
        const { name, email, phone, position, clockHours, hireDate, status } = req.body;
        
        if (!name) {
          return res.status(400).json({ error: 'Name is required' });
        }
        
        const updateEmployee = db.prepare(`
          UPDATE employees 
          SET name = ?, email = ?, phone = ?, position = ?, 
              clockHours = ?, hireDate = ?, status = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `);
        
        updateEmployee.run(
          name, 
          email || null, 
          phone || null, 
          position || null, 
          clockHours || 0, 
          hireDate || null, 
          status || 'active',
          id
        );
        
        const updatedEmployee = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);
        
        if (!updatedEmployee) {
          return res.status(404).json({ error: 'Employee not found' });
        }
        
        return res.status(200).json(updatedEmployee);
        
      case 'DELETE':
        // Delete an employee
        const checkEmployee = db.prepare('SELECT id FROM employees WHERE id = ?').get(id);
        
        if (!checkEmployee) {
          return res.status(404).json({ error: 'Employee not found' });
        }
        
        db.prepare('DELETE FROM employees WHERE id = ?').run(id);
        
        return res.status(200).json({ message: 'Employee deleted successfully' });
        
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
