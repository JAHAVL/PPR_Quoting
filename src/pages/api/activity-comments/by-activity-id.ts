import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Path to the activity comments database file
const activityCommentsDbPath = path.join(process.cwd(), 'data', 'activityComments.json');

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create the activity comments file if it doesn't exist
if (!fs.existsSync(activityCommentsDbPath)) {
  fs.writeFileSync(activityCommentsDbPath, JSON.stringify([]));
}

// Helper function to get all activity comments
const getActivityComments = (): any[] => {
  try {
    const fileContent = fs.readFileSync(activityCommentsDbPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading activity comments file:', error);
    return [];
  }
};

// Helper function to save activity comments
const saveActivityComments = (comments: any[]): void => {
  try {
    fs.writeFileSync(activityCommentsDbPath, JSON.stringify(comments, null, 2));
  } catch (error) {
    console.error('Error writing to activity comments file:', error);
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { activityId } = req.query;

  if (typeof activityId !== 'string') {
    return res.status(400).json({ error: 'Invalid activity ID' });
  }

  // Handle GET request to retrieve comments for a specific activity
  if (req.method === 'GET') {
    try {
      console.log(`GET request for activityId: ${activityId} (type: ${typeof activityId})`);
      const allComments = getActivityComments();
      console.log(`Retrieved ${allComments.length} total comments from database`);
      
      // Log some sample activity IDs to check format match
      if (allComments.length > 0) {
        console.log('Sample activity IDs in database:', 
          allComments.slice(0, 3).map(c => ({ id: c.id, activityId: c.activityId, idType: typeof c.activityId })));
      }
      
      const activityComments = allComments.filter(comment => {
        const match = comment.activityId === activityId;
        if (match) console.log(`Found matching comment: ${comment.id} for activity ${activityId}`);
        return match;
      });
      console.log(`Found ${activityComments.length} comments for activity ID: ${activityId}`);
      return res.status(200).json(activityComments);
    } catch (error) {
      console.error('Error retrieving activity comments:', error);
      return res.status(500).json({ error: 'Failed to retrieve activity comments' });
    }
  }
  
  // Return 405 for other methods
  else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
