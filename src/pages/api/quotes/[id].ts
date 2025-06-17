import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../../lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = getDb();
    const { id } = req.query;
    
    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid quote ID' });
    }
    
    switch (req.method) {
      case 'GET':
        // Get a single quote with client information
        const quote = db.prepare(`
          SELECT q.*, c.name as clientName 
          FROM quotes q
          LEFT JOIN clients c ON q.clientId = c.id
          WHERE q.id = ?
        `).get(id);
        
        if (!quote) {
          return res.status(404).json({ error: 'Quote not found' });
        }
        
        // Get line items for this quote
        const quoteLineItems = db.prepare(`
          SELECT * FROM quote_items
          WHERE quoteId = ?
          ORDER BY id
        `).all(id);
        
        // Add the line items to the quote
        quote.lineItems = quoteLineItems;
        
        return res.status(200).json(quote);
        
      case 'PUT':
        // Update a quote with all calculator fields
        const { 
          clientId, projectId, title, description, date, expiryDate, total, status, type,
          // Quote calculator specific fields
          serviceName, rawServiceCost, paverCost, materialCostDetail, laborCost, 
          installCost, marketingCost, profit, profitMargin, finalCustomerPrice, 
          squareFootage, pricePerSqFt, inputs, calculations, lineItems 
        } = req.body;
        
        if (!clientId || !title || !total) {
          return res.status(400).json({ error: 'Client ID, title, and total are required' });
        }
        
        // Check if client exists
        const clientExists = db.prepare('SELECT id FROM clients WHERE id = ?').get(clientId);
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
        
        // Convert JSON objects to strings if they're not already
        const inputsStr = typeof inputs === 'object' ? JSON.stringify(inputs) : inputs;
        const calculationsStr = typeof calculations === 'object' ? JSON.stringify(calculations) : calculations;
        const lineItemsStr = typeof lineItems === 'object' ? JSON.stringify(lineItems) : lineItems;
        
        // Log the update payload for debugging
        console.log('Quote update payload:', {
          id,
          clientId, 
          projectId: projectId || null, 
          title, 
          description: description || null,
          total,
          status: status || 'draft',
          type: type || 'Install',  // Default should be 'Install' to match schema constraint
        });
        
        try {
          // Updated SQL to include all calculator fields
          const updateQuote = db.prepare(`
            UPDATE quotes 
            SET clientId = ?, projectId = ?, title = ?, description = ?, 
                date = ?, expiryDate = ?, total = ?, status = ?, type = ?,
                serviceName = ?, rawServiceCost = ?, paverCost = ?, materialCostDetail = ?, laborCost = ?,
                installCost = ?, marketingCost = ?, profit = ?, profitMargin = ?, finalCustomerPrice = ?,
                squareFootage = ?, pricePerSqFt = ?, inputs = ?, calculations = ?, lineItems = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `);
          
          updateQuote.run(
            clientId, 
            projectId || null, 
            title, 
            description || null, 
            date || null, 
            expiryDate || null, 
            total, 
            status || 'draft', 
            type || 'Install',  // Changed from 'residential' to 'Install' to match schema constraint
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
            lineItemsStr || null,
            id
          );
          
          console.log('Quote updated successfully');
        } catch (error) {
          const sqlError = error as Error;
          console.error('SQL error during quote update:', sqlError);
          console.error('Error details:', sqlError.message);
          return res.status(500).json({ error: `Database error: ${sqlError.message}` });
        }
        
        const updatedQuote = db.prepare(`
          SELECT q.*, c.name as clientName 
          FROM quotes q
          LEFT JOIN clients c ON q.clientId = c.id
          WHERE q.id = ?
        `).get(id);
        
        if (!updatedQuote) {
          return res.status(404).json({ error: 'Quote not found' });
        }
        
        return res.status(200).json(updatedQuote);
        
      case 'DELETE':
        // Delete a quote
        const checkQuote = db.prepare('SELECT id FROM quotes WHERE id = ?').get(id);
        
        if (!checkQuote) {
          return res.status(404).json({ error: 'Quote not found' });
        }
        
        db.prepare('DELETE FROM quotes WHERE id = ?').run(id);
        
        return res.status(200).json({ message: 'Quote deleted successfully' });
        
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
