import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '@/server/adminAuth';
import { deleteCategory, updateCategory, getCategory } from '@/server/categoryStore';
import { countProductsByCategory, reassignProductCategory } from '@/server/productStore';

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
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Valid ID is required' });
  }

  try {
    if (req.method === 'PUT') {
      const { name, value } = req.body || {};
      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }
      const existing = await getCategory(id);
      if (!existing) return res.status(404).json({ error: 'Not found' });
      
      const updated = await updateCategory(id, req.body);
      if (!updated) return res.status(404).json({ error: 'Not found' });
      
      if (value && value !== existing.value) {
        await reassignProductCategory(existing.value, value);
      }
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      const existing = await getCategory(id);
      if (!existing) return res.status(404).json({ error: 'Not found' });
      const count = await countProductsByCategory(existing.value);
      if (count > 0) {
        return res.status(409).json({ error: `Cannot delete category. There are ${count} products using it.` });
      }
      const ok = await deleteCategory(id);
      if (!ok) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
