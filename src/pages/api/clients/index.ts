import { NextApiRequest, NextApiResponse } from 'next';
import { getDb, generateId } from '../../../lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = getDb();
    
    switch (req.method) {
      case 'GET':
        // Get all clients
        const clients = db.prepare('SELECT * FROM clients ORDER BY name').all();
        return res.status(200).json(clients);
        
      case 'POST':
        // Create a new client
        const { name, email, phone, address, status } = req.body;
        
        if (!name) {
          return res.status(400).json({ error: 'Name is required' });
        }
        
        const id = generateId();
        const joinDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        
        const insertClient = db.prepare(`
          INSERT INTO clients (id, name, email, phone, address, joinDate, status)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        
        insertClient.run(id, name, email || null, phone || null, address || null, joinDate, status || 'prospect');
        
        const newClient = db.prepare('SELECT * FROM clients WHERE id = ?').get(id);
        return res.status(201).json(newClient);
        
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
