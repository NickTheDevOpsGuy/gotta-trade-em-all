import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabase, getUserIdFromAuth } from '../lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = await getUserIdFromAuth(req.headers.authorization ?? null);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized. Sign in required.' });
  }

  const { items } = (req.body ?? {}) as {
    items?: Array<{ card_id: string; quantity?: number }>;
  };
  if (!Array.isArray(items) || items.length === 0 || items.length > 100) {
    return res.status(400).json({
      error: 'items must be an array of 1–100 { card_id, quantity? } objects',
    });
  }

  const supabase = getSupabase();

  for (const item of items) {
    const { card_id, quantity = 1 } = item;
    if (
      !card_id ||
      typeof quantity !== 'number' ||
      quantity < 1 ||
      quantity > 99
    )
      continue;

    const { data: card } = await supabase
      .from('cards')
      .select('id')
      .eq('id', card_id)
      .single();
    if (!card) continue;

    const { data: existing } = await supabase
      .from('inventory')
      .select('quantity')
      .eq('user_id', userId)
      .eq('card_id', card_id)
      .single();

    if (existing) {
      await supabase
        .from('inventory')
        .update({ quantity: (existing.quantity ?? 0) + quantity })
        .eq('user_id', userId)
        .eq('card_id', card_id);
    } else {
      await supabase
        .from('inventory')
        .insert({ user_id: userId, card_id, quantity });
    }
  }

  return res.json({ success: true });
}
