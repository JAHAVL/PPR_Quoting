import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../../lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = getDb();
    const { clientId } = req.query;

    if (!clientId || typeof clientId !== 'string') {
      return res.status(400).json({ error: 'Valid client ID is required' });
    }
    
    switch (req.method) {
      case 'GET':
        // Get all activities for a specific client, sorted by most recent first
        const activities = db.prepare(`
          SELECT * FROM activities 
          WHERE clientId = ? 
          ORDER BY timestamp DESC
        `).all(clientId);
        
        return res.status(200).json(activities);
        
      default:
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
