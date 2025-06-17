import { NextApiRequest, NextApiResponse } from 'next';
import { getDb, generateId } from '../../../lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Add detailed logging for debugging
  console.log('Quotes API called with method:', req.method);
  try {
    const db = getDb();
    
    switch (req.method) {
      case 'GET':
        // Get all quotes with client information
        console.log('GET /api/quotes - Fetching all quotes');
        
        const quotes = db.prepare(`
          SELECT q.*, c.name as clientName 
          FROM quotes q
          LEFT JOIN clients c ON q.clientId = c.id
          ORDER BY q.date DESC
        `).all();
        
        console.log(`GET /api/quotes - Found ${quotes.length} quotes`);
        // Log the first few quotes with their client IDs for debugging
        quotes.slice(0, 3).forEach((q: any) => {
          console.log(`Quote ID: ${q.id}, Client ID: ${q.clientId}, Title: ${q.title}`);
        });
        
        return res.status(200).json(quotes);
        
      case 'POST':
        // Create a new quote with all calculator fields
        console.log('POST request body:', JSON.stringify(req.body, null, 2));
        
        const { 
          clientId, projectId, title, description, date, expiryDate, total, status, type,
          // Quote calculator specific fields
          serviceName, rawServiceCost, paverCost, materialCostDetail, laborCost, 
          installCost, marketingCost, profit, profitMargin, finalCustomerPrice, 
          squareFootage, pricePerSqFt, inputs, calculations, lineItems 
        } = req.body;
        
        console.log('Extracted fields:', {
          clientId, title, total, // Required fields
          serviceName, rawServiceCost, paverCost, // Some calculator fields
          inputs: typeof inputs, // Check data types
          calculations: typeof calculations,
          lineItems: typeof lineItems
        });
        
        if (!clientId || !title || !total) {
          console.log('Validation failed:', { clientId, title, total });
          return res.status(400).json({ error: 'Client ID, title, and total are required' });
        }
        
        // Check if client exists
        const clientExists = db.prepare('SELECT id FROM clients WHERE id = ?').get(clientId);
        console.log('Client check:', { clientId, exists: !!clientExists });
        if (!clientExists) {
          return res.status(400).json({ error: 'Client not found' });
        }
        
        // Check if project exists if provided
        if (projectId) {
          const projectExists = db.prepare('SELECT id FROM projects WHERE id = ?').get(projectId);
          if (!projectExists) {
            return res.status(400).json({ error: 'Project not found' });
          }
        }
        
        const id = generateId();
        const quoteDate = date || new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        
        // Updated SQL to include all calculator fields
        const insertQuote = db.prepare(`
          INSERT INTO quotes (
            id, clientId, projectId, title, description, date, expiryDate, total, status, type,
            serviceName, rawServiceCost, paverCost, materialCostDetail, laborCost, 
            installCost, marketingCost, profit, profitMargin, finalCustomerPrice, 
            squareFootage, pricePerSqFt, inputs, calculations, lineItems
          )
          VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, 
            ?, ?, ?, ?, ?, 
            ?, ?, ?, ?, ?
          )
        `);
        
        // Convert JSON objects to strings if they're not already
        const inputsStr = typeof inputs === 'object' ? JSON.stringify(inputs) : inputs;
        const calculationsStr = typeof calculations === 'object' ? JSON.stringify(calculations) : calculations;
        const lineItemsStr = typeof lineItems === 'object' ? JSON.stringify(lineItems) : lineItems;
        
        console.log('JSON fields after processing:', {
          inputsStr: typeof inputsStr,
          calculationsStr: typeof calculationsStr,
          lineItemsStr: typeof lineItemsStr
        });
        
        // Ensure type is one of the allowed values in the database schema
        const validType = type === 'Mx' ? 'Mx' : 'Install'; // Default to 'Install' if not 'Mx'
        
        insertQuote.run(
          id, 
          clientId, 
          projectId || null, 
          title, 
          description || null, 
          quoteDate, 
          expiryDate || null, 
          total, 
          status || 'draft', 
          validType,
          // Quote calculator specific fields
          serviceName || null,
          rawServiceCost || null,
          paverCost || null,
          materialCostDetail || null,
          laborCost || null,
          installCost || null,
          marketingCost || null,
          profit || null,
          profitMargin || null,
          finalCustomerPrice || null,
          squareFootage || null,
          pricePerSqFt || null,
          inputsStr || null,
          calculationsStr || null,
          lineItemsStr || null
        );
        
        const newQuote = db.prepare(`
          SELECT q.*, c.name as clientName 
          FROM quotes q
          LEFT JOIN clients c ON q.clientId = c.id
          WHERE q.id = ?
        `).get(id);
        
        console.log('Quote created successfully:', { id: newQuote.id, title: newQuote.title });
        return res.status(201).json(newQuote);
        
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('API error:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
