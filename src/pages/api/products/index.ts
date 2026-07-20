import type { NextApiRequest, NextApiResponse } from 'next';
import { listProducts } from '@/server/productStore';

export type { Product } from '@/server/productStore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const products = await listProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
