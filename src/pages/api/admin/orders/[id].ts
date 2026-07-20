import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '@/server/adminAuth';
import { updateOrderStatus, OrderStatus } from '@/server/orderStore';

const VALID_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'delivered',
  'cancelled',
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== 'PUT' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { status } = req.body || {};
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  try {
    const order = await updateOrderStatus(req.query.id as string, status);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}
