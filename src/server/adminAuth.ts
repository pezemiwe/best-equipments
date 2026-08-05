import crypto from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';

const isProduction = process.env.NODE_ENV === 'production';
const DEV_SECRET = 'best-equipments-dev-secret-change-me';
const DEV_PASSWORD = 'best-equipments-admin';

if (isProduction) {
  if (!process.env.ADMIN_SECRET || process.env.ADMIN_SECRET === DEV_SECRET) {
    throw new Error('ADMIN_SECRET is missing or insecure. Please set a secure ADMIN_SECRET in Netlify > Site settings > Environment variables.');
  }
  if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD === DEV_PASSWORD) {
    throw new Error('ADMIN_PASSWORD is missing or insecure. Please set a secure ADMIN_PASSWORD in Netlify > Site settings > Environment variables.');
  }
  if (process.env.ADMIN_PASSWORD.length < 12) {
    throw new Error('ADMIN_PASSWORD must be at least 12 characters long. Please update it in Netlify > Site settings > Environment variables.');
  }
}

// Configure via env in production:
//   ADMIN_PASSWORD - password for the admin portal
//   ADMIN_SECRET   - secret used to sign session tokens
const SECRET = process.env.ADMIN_SECRET || DEV_SECRET;
const PASSWORD = process.env.ADMIN_PASSWORD || DEV_PASSWORD;
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
