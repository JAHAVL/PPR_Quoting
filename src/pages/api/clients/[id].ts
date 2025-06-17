import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../../lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = getDb();
    const { id } = req.query;
    
    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid client ID' });
    }
    
    switch (req.method) {
      case 'GET':
        // Get a single client
        const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(id);
        
        if (!client) {
          return res.status(404).json({ error: 'Client not found' });
        }
        
        return res.status(200).json(client);
        
      case 'PUT':
        // Update a client
        const { name, email, phone, address, status } = req.body;
        
        if (!name) {
          return res.status(400).json({ error: 'Name is required' });
        }
        
        const updateClient = db.prepare(`
          UPDATE clients 
          SET name = ?, email = ?, phone = ?, address = ?, status = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `);
        
        updateClient.run(name, email || null, phone || null, address || null, status || 'prospect', id);
        
        const updatedClient = db.prepare('SELECT * FROM clients WHERE id = ?').get(id);
        
        if (!updatedClient) {
          return res.status(404).json({ error: 'Client not found' });
        }
        
        return res.status(200).json(updatedClient);
        
      case 'DELETE':
        // Delete a client
        const checkClient = db.prepare('SELECT id FROM clients WHERE id = ?').get(id);
        
        if (!checkClient) {
          return res.status(404).json({ error: 'Client not found' });
        }
        
        db.prepare('DELETE FROM clients WHERE id = ?').run(id);
        
        return res.status(200).json({ message: 'Client deleted successfully' });
        
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
