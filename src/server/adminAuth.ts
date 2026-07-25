import crypto from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';

// Configure via env in production:
//   ADMIN_PASSWORD - password for the admin portal
//   ADMIN_SECRET   - secret used to sign session tokens
const SECRET = process.env.ADMIN_SECRET || 'best-equipments-dev-secret-change-me';
const PASSWORD = process.env.ADMIN_PASSWORD || 'best-equipments-admin';
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

const sign = (payload: string) =>
  crypto.createHmac('sha256', SECRET).update(payload).digest('hex');

export const checkPassword = (password: string) => {
  const expected = Buffer.from(PASSWORD);
  const given = Buffer.from(password || '');
  return (
    expected.length === given.length &&
    crypto.timingSafeEqual(expected, given)
  );
};

export const issueToken = () => {
  const expiry = Date.now() + TOKEN_TTL_MS;
  return `${expiry}.${sign(String(expiry))}`;
};

export const verifyToken = (token?: string) => {
  if (!token) return false;
  const [expiry, signature] = token.split('.');
  if (!expiry || !signature) return false;
  if (Number(expiry) < Date.now()) return false;
  const expected = sign(expiry);
  return (
    signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  );
};

// Returns true if authorized; otherwise responds 401 and returns false.
export const requireAdmin = (req: NextApiRequest, res: NextApiResponse) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (verifyToken(token)) return true;
  res.status(401).json({ error: 'Unauthorized' } as any);
  return false;
};
