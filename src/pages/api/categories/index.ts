import type { NextApiRequest, NextApiResponse } from 'next';
import { listCategories } from '@/server/categoryStore';

export type { Category } from '@/server/categoryStore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const categories = await listCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
