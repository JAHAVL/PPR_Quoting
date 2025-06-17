import { NextApiRequest, NextApiResponse } from 'next';
import { getDb, generateId } from '../../../lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = getDb();
    
    switch (req.method) {
      case 'GET':
        // Get all projects with client information
        const projects = db.prepare(`
          SELECT p.*, c.name as clientName 
          FROM projects p
          LEFT JOIN clients c ON p.clientId = c.id
          ORDER BY p.startDate DESC
        `).all();
        
        return res.status(200).json(projects);
        
      case 'POST':
        // Create a new project
        const { clientId, address, startDate, endDate, total, status, type, squareFootage } = req.body;
        
        if (!clientId) {
          return res.status(400).json({ error: 'Client ID is required' });
        }
        
        // Check if client exists
        const clientExists = db.prepare('SELECT id FROM clients WHERE id = ?').get(clientId);
        if (!clientExists) {
          return res.status(400).json({ error: 'Client not found' });
        }
        
        const id = generateId();
        
        const insertProject = db.prepare(`
          INSERT INTO projects (id, clientId, address, startDate, endDate, total, status, type, squareFootage)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        insertProject.run(
          id, 
          clientId, 
          address || null, 
          startDate || new Date().toISOString().split('T')[0], 
          endDate || null, 
          total || 0, 
          status || 'pending', 
          type || null, 
          squareFootage || null
        );
        
        const newProject = db.prepare(`
          SELECT p.*, c.name as clientName 
          FROM projects p
          LEFT JOIN clients c ON p.clientId = c.id
          WHERE p.id = ?
        `).get(id);
        
        return res.status(201).json(newProject);
        
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
