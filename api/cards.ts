import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabase } from './lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('cards')
    .select('id, name, rarity, value');

  if (error) {
    console.error('Cards fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch cards' });
  }

  return res.json(data ?? []);
}
