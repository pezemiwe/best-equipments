import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '@/server/adminAuth';
import { listEnquiries, updateEnquiryStatus, EnquiryStatus } from '@/server/enquiryStore';

const VALID_STATUSES: EnquiryStatus[] = ['new', 'handled'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return;

  if (req.method === 'GET') {
    try {
      return res.status(200).json(await listEnquiries());
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  if (req.method === 'PATCH') {
    const { id, status } = req.body || {};
    if (!id) return res.status(400).json({ error: 'id is required' });
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    try {
      const enquiry = await updateEnquiryStatus(id, status);
      if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
      return res.status(200).json(enquiry);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
