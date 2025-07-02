import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Log the error details to the server console
  const { error, stack, info } = req.body || {};
  // Only log if error message is present
  if (typeof error === 'string') {
    // You could enhance this to log to a file or external service
    // For now, just log to the server console
    // eslint-disable-next-line no-console
    console.error('[Client Error]', { error, stack, info });
  }

  // Always respond with 200 OK to avoid leaking details
  return res.status(200).json({ status: 'logged' });
} 