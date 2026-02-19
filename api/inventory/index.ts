import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabase, getUserIdFromAuth } from '../lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = await getUserIdFromAuth(req.headers.authorization ?? null);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized. Sign in required.' });
  }

  const supabase = getSupabase();

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('inventory')
      .select(
        `
        card_id,
        quantity,
        cards (id, name, rarity, value)
      `
      )
      .eq('user_id', userId)
      .gt('quantity', 0);

    if (error) {
      console.error('Inventory fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch inventory' });
    }

    const rows = (data ?? []).map(
      (row: {
        cards: Record<string, unknown>;
        card_id: string;
        quantity: number;
      }) => ({
        ...(row.cards as Record<string, unknown>),
        quantity: row.quantity,
      })
    );
    return res.json(rows);
  }

  if (req.method === 'DELETE') {
    const card_id = (req.body?.card_id ?? req.query?.card_id) as
      | string
      | undefined;
    if (!card_id) {
      return res.status(400).json({ error: 'card_id is required' });
    }

    const { data: row } = await supabase
      .from('inventory')
      .select('quantity')
      .eq('user_id', userId)
      .eq('card_id', card_id)
      .single();

    if (!row || (row.quantity ?? 0) < 1) {
      return res.status(404).json({ error: 'Card not in inventory' });
    }

    const newQty = (row.quantity ?? 1) - 1;
    if (newQty <= 0) {
      await supabase
        .from('inventory')
        .delete()
        .eq('user_id', userId)
        .eq('card_id', card_id);
    } else {
      await supabase
        .from('inventory')
        .update({ quantity: newQty })
        .eq('user_id', userId)
        .eq('card_id', card_id);
    }
    return res.json({ success: true });
  }

  if (req.method === 'POST') {
    const { card_id } = req.body ?? {};
    if (!card_id) {
      return res.status(400).json({ error: 'card_id is required' });
    }

    const { data: card } = await supabase
      .from('cards')
      .select('id')
      .eq('id', card_id)
      .single();
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    const { data: existing } = await supabase
      .from('inventory')
      .select('quantity')
      .eq('user_id', userId)
      .eq('card_id', card_id)
      .single();

    if (existing) {
      const { error: updateError } = await supabase
        .from('inventory')
        .update({ quantity: existing.quantity + 1 })
        .eq('user_id', userId)
        .eq('card_id', card_id);
      if (updateError) {
        console.error('Inventory update error:', updateError);
        return res.status(500).json({ error: 'Failed to add card' });
      }
    } else {
      const { error: insertError } = await supabase
        .from('inventory')
        .insert({ user_id: userId, card_id, quantity: 1 });
      if (insertError) {
        console.error('Inventory insert error:', insertError);
        return res.status(500).json({ error: 'Failed to add card' });
      }
    }

    const { data: updated } = await supabase
      .from('inventory')
      .select(
        `
        quantity,
        cards (id, name, rarity, value)
      `
      )
      .eq('user_id', userId)
      .eq('card_id', card_id)
      .single();

    const row = updated as { cards: Record<string, unknown>; quantity: number };
    return res.json({ ...(row?.cards ?? {}), quantity: row?.quantity ?? 1 });
  }

  res.setHeader('Allow', 'GET, POST, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
}
