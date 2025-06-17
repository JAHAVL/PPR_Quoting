import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Path to the activity comments database file
const activityCommentsDbPath = path.join(process.cwd(), 'data', 'activityComments.json');

// Helper function to get all activity comments
const getActivityComments = (): any[] => {
  try {
    // Check if file exists first
    if (!fs.existsSync(activityCommentsDbPath)) {
      // Create empty file if it doesn't exist
      fs.writeFileSync(activityCommentsDbPath, JSON.stringify([], null, 2));
      return [];
    }
    
    const fileContent = fs.readFileSync(activityCommentsDbPath, 'utf-8');
    
    // Handle empty file case
    if (!fileContent || fileContent.trim() === '') {
      return [];
    }
    
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading activity comments file:', error);
    // Create a fresh file with empty array if there was an error
    fs.writeFileSync(activityCommentsDbPath, JSON.stringify([], null, 2));
    return [];
  }
};

// Helper function to save activity comments
const saveActivityComments = (comments: any[]): boolean => {
  try {
    fs.writeFileSync(activityCommentsDbPath, JSON.stringify(comments, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing to activity comments file:', error);
    return false;
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid comment ID' });
  }

  // Handle DELETE request to remove a specific comment
  if (req.method === 'DELETE') {
    try {
      console.log(`API: Attempting to delete comment with ID: ${id}`);
      
      // Get all comments
      const allComments = getActivityComments();
      console.log(`API: Found ${allComments.length} total comments`);
      
      // Find the index of the comment to delete
      const commentIndex = allComments.findIndex(comment => comment.id === id);
      console.log(`API: Comment index: ${commentIndex}`);
      
      // If the comment doesn't exist, return 404
      if (commentIndex === -1) {
        console.log(`API: Comment with ID ${id} not found`);
        return res.status(404).json({ error: 'Comment not found' });
      }
      
      // Remove the comment from the array
      const deletedComment = allComments.splice(commentIndex, 1)[0];
      console.log(`API: Removed comment:`, deletedComment);
      
      // Save the updated comments
      const saveResult = saveActivityComments(allComments);
      
      if (!saveResult) {
        console.error(`API: Failed to save updated comments after deletion`);
        return res.status(500).json({ error: 'Failed to save updated comments' });
      }
      
      console.log(`API: Comment deleted successfully`);
      return res.status(200).json({ 
        message: 'Comment deleted successfully',
        deletedComment
      });
    } catch (error) {
      console.error('Error deleting activity comment:', error);
      return res.status(500).json({ error: 'Failed to delete activity comment' });
    }
  }
  
  // Return 405 for other methods
  else {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
