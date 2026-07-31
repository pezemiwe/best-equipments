import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '@/server/adminAuth';
import { deleteProducts } from '@/server/productStore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!requireAdmin(req, res)) return;
  try {
    if (req.method === 'DELETE') {
      const { ids } = req.body;
      if (!Array.isArray(ids)) {
        return res.status(400).json({ error: 'Expected an array of ids' });
      }
      const removedCount = await deleteProducts(ids);
      return res.status(200).json({ success: true, removedCount });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
