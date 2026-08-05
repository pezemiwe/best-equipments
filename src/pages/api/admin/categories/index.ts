import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '@/server/adminAuth';
import { createCategory, listCategories } from '@/server/categoryStore';

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
      return res.status(200).json(await listCategories());
    }
    if (req.method === 'POST') {
      const { name } = req.body || {};
      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }
      const category = await createCategory(req.body);
      return res.status(201).json(category);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
