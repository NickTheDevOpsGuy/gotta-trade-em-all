import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabase } from './lib/supabase';

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('cards').select('id').limit(1);
    if (error) throw error;
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ status: 'ok', database: 'connected' });
  } catch (e) {
    console.error('Health check failed:', e);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).json({ status: 'error', database: 'disconnected' });
  }
}
