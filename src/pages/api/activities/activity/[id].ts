import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../../../lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = getDb();
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Valid activity ID is required' });
    }
    
    // Check if the activity exists
    const activity = db.prepare('SELECT * FROM activities WHERE id = ?').get(id);
    
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    switch (req.method) {
      case 'GET':
        // Return the activity details
        return res.status(200).json(activity);
        
      case 'DELETE':
        // Delete the activity
        db.prepare('DELETE FROM activities WHERE id = ?').run(id);
        return res.status(200).json({ message: 'Activity deleted successfully' });
        
      default:
        res.setHeader('Allow', ['GET', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
