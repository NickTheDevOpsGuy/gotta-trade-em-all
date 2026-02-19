import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabase, getUserIdFromAuth } from './lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = await getUserIdFromAuth(req.headers.authorization ?? null);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized. Sign in required.' });
  }

  const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

  const { data, error } = await getSupabase()
    .from('trades')
    .select('id, offered_card_ids, received_card_ids, offered_value, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Trades fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch trade history' });
  }

  return res.json({ trades: data ?? [] });
}
