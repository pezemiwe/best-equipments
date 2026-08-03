import type { NextApiRequest, NextApiResponse } from 'next';
import { getProduct, addReview } from '@/server/productStore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    
    if (req.method === 'GET') {
      const product = await getProduct(id as string);
      if (!product) {
        return res.status(404).json(null);
      }
      return res.status(200).json(product);
    } 
    
    if (req.method === 'POST') {
      const { name, rating, comment } = req.body;
      if (!name || !rating || !comment) {
        return res.status(400).json({ error: 'Missing review fields' });
      }
      
      const updated = await addReview(id as string, {
        name,
        rating: Number(rating),
        comment,
        date: Date.now(),
      });
      
      if (!updated) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      return res.status(200).json(updated);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

