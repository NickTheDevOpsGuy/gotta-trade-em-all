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

  const { offer_card_ids } = (req.body ?? {}) as { offer_card_ids?: string[] };
  if (!Array.isArray(offer_card_ids) || offer_card_ids.length === 0) {
    return res.status(400).json({ error: 'offer_card_ids array is required' });
  }

  const supabase = getSupabase();

  const { data: cardValues } = await supabase
    .from('cards')
    .select('id, value')
    .in('id', offer_card_ids);

  const totalValue = (cardValues ?? []).reduce((sum, c) => sum + (c.value ?? 0), 0);
  if (totalValue === 0) {
    return res.status(400).json({ error: 'Invalid card IDs' });
  }

  for (const cardId of offer_card_ids) {
    const { data: row } = await supabase
      .from('inventory')
      .select('quantity')
      .eq('user_id', userId)
      .eq('card_id', cardId)
      .single();

    if (!row || (row.quantity ?? 0) < 1) {
      return res.status(400).json({ error: `Insufficient quantity for card ${cardId}` });
    }
  }

  for (const cardId of offer_card_ids) {
    const { data: row } = await supabase
      .from('inventory')
      .select('quantity')
      .eq('user_id', userId)
      .eq('card_id', cardId)
      .single();

    const newQty = (row?.quantity ?? 1) - 1;
    if (newQty <= 0) {
      await supabase.from('inventory').delete().eq('user_id', userId).eq('card_id', cardId);
    } else {
      await supabase.from('inventory').update({ quantity: newQty }).eq('user_id', userId).eq('card_id', cardId);
    }
  }

  const uniqueOffered = new Set(offer_card_ids);
  const { data: allCards } = await supabase.from('cards').select('id, value');
  let pool = ((allCards ?? []) as { id: string; value: number }[]).filter(
    (c) => !uniqueOffered.has(c.id)
  );
  if (pool.length === 0) {
    pool = (allCards ?? []) as { id: string; value: number }[];
  }
  pool = pool.sort(() => Math.random() - 0.5);

  const received: string[] = [];
  let remainingValue = totalValue;

  for (const card of pool) {
    if (remainingValue <= 0) break;
    if (card.value <= remainingValue) {
      received.push(card.id);
      remainingValue -= card.value;

      const { data: inv } = await supabase
        .from('inventory')
        .select('quantity')
        .eq('user_id', userId)
        .eq('card_id', card.id)
        .single();

      if (inv) {
        await supabase.from('inventory').update({ quantity: (inv.quantity ?? 0) + 1 }).eq('user_id', userId).eq('card_id', card.id);
      } else {
        await supabase.from('inventory').insert({ user_id: userId, card_id: card.id, quantity: 1 });
      }
    }
  }

  if (received.length === 0 && pool.length > 0) {
    const give = pool[Math.floor(Math.random() * pool.length)];
    const { data: inv } = await supabase
      .from('inventory')
      .select('quantity')
      .eq('user_id', userId)
      .eq('card_id', give.id)
      .single();

    if (inv) {
      await supabase.from('inventory').update({ quantity: (inv.quantity ?? 0) + 1 }).eq('user_id', userId).eq('card_id', give.id);
    } else {
      await supabase.from('inventory').insert({ user_id: userId, card_id: give.id, quantity: 1 });
    }
    received.push(give.id);
  }

  const { data: receivedCards } = received.length > 0
    ? await supabase.from('cards').select('id, name, rarity, value').in('id', received)
    : { data: [] };

  return res.json({
    received: receivedCards ?? [],
    offered_value: totalValue,
  });
}
