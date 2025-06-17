import { NextApiRequest, NextApiResponse } from 'next';
import { getDb, generateId } from '../../../lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = getDb();
    
    switch (req.method) {
      case 'GET':
        // Default to getting all activities if no clientId is provided
        const activities = db.prepare(`
          SELECT * FROM activities 
          ORDER BY timestamp DESC
        `).all();
        
        return res.status(200).json(activities);
        
      case 'POST':
        // Create a new activity
        const { clientId, userId, type, content, eventType, details } = req.body;
        
        if (!clientId) {
          return res.status(400).json({ error: 'Client ID is required' });
        }
        
        if (!type || !['system', 'user', 'other'].includes(type)) {
          return res.status(400).json({ error: 'Valid type is required' });
        }
        
        if (!content) {
          return res.status(400).json({ error: 'Content is required' });
        }
        
        const id = generateId();
        const timestamp = new Date().toISOString();
        
        const insertActivity = db.prepare(`
          INSERT INTO activities (id, clientId, userId, type, content, timestamp, eventType, details)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        insertActivity.run(
          id, 
          clientId, 
          userId || null, 
          type, 
          content, 
          timestamp, 
          eventType || null, 
          details || null
        );
        
        const newActivity = db.prepare('SELECT * FROM activities WHERE id = ?').get(id);
        return res.status(201).json(newActivity);
        
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
