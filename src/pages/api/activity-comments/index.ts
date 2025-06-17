import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// Path to the activity comments database file
const activityCommentsDbPath = path.join(process.cwd(), 'data', 'activityComments.json');

// Print the file path to verify it's correct
console.log('Activity comments DB path:', activityCommentsDbPath);

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'data');
console.log('Data directory path:', dataDir);

try {
  // Create data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    console.log('Data directory does not exist, creating...');
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('Data directory created successfully');
  } else {
    console.log('Data directory already exists');
  }

  // Create the activity comments file if it doesn't exist
  if (!fs.existsSync(activityCommentsDbPath)) {
    console.log('Activity comments file does not exist, creating...');
    fs.writeFileSync(activityCommentsDbPath, JSON.stringify([]));
    console.log('Activity comments file created successfully');
  } else {
    console.log('Activity comments file already exists');
    // Check if the file is readable
    const fileContent = fs.readFileSync(activityCommentsDbPath, 'utf-8');
    try {
      const parsedContent = JSON.parse(fileContent);
      console.log(`Activity comments file is readable and contains ${parsedContent.length} items`);
    } catch (parseError) {
      console.error('Activity comments file exists but contains invalid JSON:', parseError);
      // Reset the file with empty array if it contains invalid JSON
      fs.writeFileSync(activityCommentsDbPath, JSON.stringify([]));
      console.log('Activity comments file reset with empty array due to invalid JSON');
    }
  }
} catch (err) {
  console.error('Error during file/directory setup:', err);
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
  // Handle POST request to add a new comment
  if (req.method === 'POST') {
    try {
      console.log('POST request received on /api/activity-comments:', req.body);
      const { activityId, content, userId = 'system' } = req.body;
      
      if (!activityId || !content) {
        console.error('Missing required fields:', { activityId, content });
        return res.status(400).json({ error: 'Activity ID and content are required' });
      }
      
      const comments = getActivityComments();
      console.log(`Retrieved ${comments.length} existing comments from file`);
      
      // Create a new comment object
      const newComment = {
        id: uuidv4(),
        activityId,
        content,
        userId,
        timestamp: new Date().toISOString()
      };
      
      console.log('Created new comment:', newComment);
      
      // Add the new comment to the array
      comments.push(newComment);
      
      // Save the updated comments
      console.log(`Saving updated comments array with ${comments.length} items`);
      saveActivityComments(comments);
      
      // Verify the comment was saved by reading the file again
      const verifyComments = getActivityComments();
      console.log(`After save: File has ${verifyComments.length} comments`);
      const savedComment = verifyComments.find(c => c.id === newComment.id);
      console.log('Was comment saved successfully:', !!savedComment);
      
      // Return the new comment
      return res.status(201).json(newComment);
    } catch (error) {
      console.error('Error creating activity comment:', error);
      return res.status(500).json({ error: 'Failed to create activity comment' });
    }
  } 
  
  // Handle GET request to retrieve all comments
  else if (req.method === 'GET') {
    try {
      const comments = getActivityComments();
      return res.status(200).json(comments);
    } catch (error) {
      console.error('Error retrieving activity comments:', error);
      return res.status(500).json({ error: 'Failed to retrieve activity comments' });
    }
  }
  
  // Return 405 for other methods
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
