import type { NextApiRequest, NextApiResponse } from 'next';
import { checkPassword, issueToken } from '@/server/adminAuth';

// Basic brute-force protection: 5 failed attempts per IP per 15 minutes.
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

const clientIp = (req: NextApiRequest) => {
  const forwarded = req.headers['x-forwarded-for'];
  const first = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return (first || '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = clientIp(req);
  const now = Date.now();
  const record = attempts.get(ip);
  if (record && record.resetAt > now && record.count >= MAX_ATTEMPTS) {
    const minutes = Math.ceil((record.resetAt - now) / 60000);
    return res.status(429).json({
      error: `Too many failed attempts. Try again in ${minutes} minute${
        minutes === 1 ? '' : 's'
      }.`,
    });
  }

  const { password } = req.body || {};
  if (!checkPassword(password)) {
    const current =
      record && record.resetAt > now
        ? record
        : { count: 0, resetAt: now + WINDOW_MS };
    current.count += 1;
    attempts.set(ip, current);
    return res.status(401).json({ error: 'Invalid password' });
  }

  attempts.delete(ip);
  res.status(200).json({ token: issueToken() });
}
