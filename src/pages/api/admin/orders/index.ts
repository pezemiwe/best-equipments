import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '@/server/adminAuth';
import { listOrders } from '@/server/orderStore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    res.status(200).json(await listOrders());
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
