import type { NextApiRequest, NextApiResponse } from 'next';
import { getImage } from '@/server/productStore';

// Serves admin-uploaded product images stored in Postgres. Content is
// immutable (ids are unique per upload) so browsers/CDNs cache aggressively.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }
  try {
    const image = await getImage(req.query.id as string);
    if (!image) return res.status(404).end();
    res.setHeader('Content-Type', image.mime);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.status(200).send(image.data);
  } catch {
    res.status(500).end();
  }
}
