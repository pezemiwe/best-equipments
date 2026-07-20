import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '@/server/adminAuth';
import { deleteProduct, updateProduct } from '@/server/productStore';

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
  const id = req.query.id as string;
  try {
    if (req.method === 'PUT' || req.method === 'PATCH') {
      const product = await updateProduct(id, req.body || {});
      if (!product) return res.status(404).json({ error: 'Product not found' });
      return res.status(200).json(product);
    }
    if (req.method === 'DELETE') {
      const removed = await deleteProduct(id);
      if (!removed) return res.status(404).json({ error: 'Product not found' });
      return res.status(200).json({ success: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
