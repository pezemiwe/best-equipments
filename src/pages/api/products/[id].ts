import type { NextApiRequest, NextApiResponse } from 'next';
import { getProduct } from '@/server/productStore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { id } = req.query;
    const product = await getProduct(id as string);
    if (!product) {
      return res.status(404).json(null);
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
