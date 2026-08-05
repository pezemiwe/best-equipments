import type { NextApiRequest, NextApiResponse } from 'next';
import { createEnquiry } from '@/server/enquiryStore';

// Simple IP rate limiter: max 5 submissions per hour per IP
const MAX_PER_HOUR = 5;
const WINDOW_MS = 60 * 60 * 1000;
const ipLog = new Map<string, { count: number; resetAt: number }>();

const clientIp = (req: NextApiRequest): string => {
  const forwarded = req.headers['x-forwarded-for'];
  const first = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return (first || '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const ip = clientIp(req);
  const now = Date.now();
  const record = ipLog.get(ip);
  if (record && record.resetAt > now && record.count >= MAX_PER_HOUR) {
    return res.status(429).json({ error: 'Too many submissions. Please try again later.' });
  }
  const current =
    record && record.resetAt > now
      ? record
      : { count: 0, resetAt: now + WINDOW_MS };
  current.count += 1;
  ipLog.set(ip, current);

  // Validation
  const { name, email, vehicle, message } = req.body || {};

  const trimmed = {
    name: String(name || '').trim(),
    email: String(email || '').trim(),
    vehicle: String(vehicle || '').trim(),
    message: String(message || '').trim(),
  };

  if (!trimmed.name || trimmed.name.length < 2 || trimmed.name.length > 100) {
    return res.status(400).json({ error: 'Name must be between 2 and 100 characters.' });
  }
  if (!trimmed.email || !/^\S+@\S+\.\S+$/.test(trimmed.email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }
  if (trimmed.vehicle.length > 200) {
    return res.status(400).json({ error: 'Vehicle/equipment field must be 200 characters or less.' });
  }
  if (!trimmed.message || trimmed.message.length < 5 || trimmed.message.length > 2000) {
    return res.status(400).json({ error: 'Message must be between 5 and 2000 characters.' });
  }

  try {
    const enquiry = await createEnquiry(trimmed);
    return res.status(201).json(enquiry);
  } catch (error) {
    console.error('Error saving enquiry:', error);
    return res.status(500).json({ error: 'Failed to save your enquiry. Please try again.' });
  }
}
