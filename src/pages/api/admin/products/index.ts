import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '@/server/adminAuth';
import { createProduct, listProducts } from '@/server/productStore';
import { listCategories } from '@/server/categoryStore';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '6mb',
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!requireAdmin(req, res)) return;
  try {
    if (req.method === 'GET') {
      return res.status(200).json(await listProducts());
    }
    if (req.method === 'POST') {
      const { name, amount } = req.body || {};
      if (!name || !amount) {
        return res.status(400).json({ error: 'Name and price are required' });
      }
      const category = req.body.category;
      if (category) {
        const categories = await listCategories();
        if (!categories.find(c => c.value === category)) {
          return res.status(400).json({ error: 'Invalid category' });
        }
      } else {
        return res.status(400).json({ error: 'Category is required' });
      }
      const product = await createProduct(req.body);
      return res.status(201).json(product);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
