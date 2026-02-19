import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabase, getUserIdFromAuth } from './lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabase = getSupabase();
  const userId = await getUserIdFromAuth(req.headers.authorization ?? null);

  const { data: allInventory } = await supabase.from('inventory').select('user_id, card_id, quantity');

  const byUser = new Map<string, { unique: Set<string>; total: number }>();
  for (const row of allInventory ?? []) {
    const r = row as { user_id: string; card_id: string; quantity: number };
    let entry = byUser.get(r.user_id);
    if (!entry) {
      entry = { unique: new Set(), total: 0 };
      byUser.set(r.user_id, entry);
    }
    entry.unique.add(r.card_id);
    entry.total += r.quantity ?? 1;
  }

  const sorted = Array.from(byUser.entries())
    .map(([_, v]) => ({ uniqueCards: v.unique.size, totalCards: v.total }))
    .sort((a, b) => b.uniqueCards - a.uniqueCards)
    .slice(0, 10);

  const leaderboard = sorted.map((s, i) => ({ rank: i + 1, ...s }));

  let yourRank: number | null = null;
  let yourUniqueCards: number | null = null;
  if (userId) {
    const you = byUser.get(userId);
    if (you) {
      yourUniqueCards = you.unique.size;
      yourRank = 1 + Array.from(byUser.values()).filter((v) => v.unique.size > you.unique.size).length;
    }
  }

  return res.json({ leaderboard, yourRank, yourUniqueCards });
}
