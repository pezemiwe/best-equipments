import type { NextApiRequest, NextApiResponse } from 'next';
import { createOrder } from '@/server/orderStore';
import { sendOrderConfirmationEmail } from '@/server/emailer';

// Public endpoint: creates a pending order from cart contents. Every line is
// re-priced server-side; the response carries the authoritative totals.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { items, customerName, customerPhone, customerCity } = req.body || {};
    const order = await createOrder({ items, customerName, customerPhone, customerCity });
    
    // Dispatch email asynchronously so it doesn't block the response
    sendOrderConfirmationEmail(order).catch(console.error);

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}
