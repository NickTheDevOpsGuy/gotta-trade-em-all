import { Router } from 'express';
import { db } from '../db';

const router = Router();

router.get('/', (_req, res) => {
  const rows = db
    .prepare(
      `
    SELECT c.id, c.name, c.rarity, c.value, i.quantity
    FROM inventory i
    JOIN cards c ON c.id = i.card_id
    WHERE i.quantity > 0
  `
    )
    .all();
  res.json(rows);
});

router.post('/', (req, res) => {
  const { card_id } = req.body;
  if (!card_id) {
    return res.status(400).json({ error: 'card_id is required' });
  }

  const card = db.prepare('SELECT id FROM cards WHERE id = ?').get(card_id);
  if (!card) {
    return res.status(404).json({ error: 'Card not found' });
  }

  const existing = db
    .prepare('SELECT id, quantity FROM inventory WHERE card_id = ?')
    .get(card_id) as { id: number; quantity: number } | undefined;

  if (existing) {
    db.prepare(
      'UPDATE inventory SET quantity = quantity + 1 WHERE card_id = ?'
    ).run(card_id);
  } else {
    db.prepare('INSERT INTO inventory (card_id, quantity) VALUES (?, 1)').run(
      card_id
    );
  }

  const updated = db
    .prepare(
      `
    SELECT c.id, c.name, c.rarity, c.value, i.quantity
    FROM inventory i
    JOIN cards c ON c.id = i.card_id
    WHERE i.card_id = ?
  `
    )
    .get(card_id);

  res.json(updated);
});

router.post('/trade', (req, res) => {
  const { offer_card_ids } = req.body as { offer_card_ids: string[] };
  if (!Array.isArray(offer_card_ids) || offer_card_ids.length === 0) {
    return res.status(400).json({ error: 'offer_card_ids array is required' });
  }

  const offerValue = db
    .prepare(
      `
    SELECT COALESCE(SUM(c.value), 0) as total
    FROM cards c
    WHERE c.id IN (${offer_card_ids.map(() => '?').join(',')})
  `
    )
    .get(...offer_card_ids) as { total: number };

  if (offerValue.total === 0) {
    return res.status(400).json({ error: 'Invalid card IDs' });
  }

  // Decrement inventory for offered cards
  for (const cardId of offer_card_ids) {
    const row = db
      .prepare('SELECT quantity FROM inventory WHERE card_id = ?')
      .get(cardId) as { quantity: number } | undefined;
    if (!row || row.quantity < 1) {
      return res
        .status(400)
        .json({ error: `Insufficient quantity for card ${cardId}` });
    }
    db.prepare(
      'UPDATE inventory SET quantity = quantity - 1 WHERE card_id = ?'
    ).run(cardId);
  }
  db.prepare('DELETE FROM inventory WHERE quantity <= 0').run();

  // Get available cards to receive (exclude offered to encourage variety; fallback to all if empty)
  const uniqueOffered = [...new Set(offer_card_ids)];
  let pool =
    uniqueOffered.length > 0
      ? (db
          .prepare(
            `
        SELECT id FROM cards
        WHERE id NOT IN (${uniqueOffered.map(() => '?').join(',')})
      `
          )
          .all(...uniqueOffered) as { id: string }[])
      : [];
  if (pool.length === 0) {
    pool = db.prepare('SELECT id FROM cards').all() as { id: string }[];
  }
  pool = pool.sort(() => Math.random() - 0.5);

  // Give random cards of similar total value (at least 1)
  const received: string[] = [];
  let remainingValue = offerValue.total;

  for (const { id } of pool) {
    if (remainingValue <= 0) break;
    const card = db.prepare('SELECT value FROM cards WHERE id = ?').get(id) as {
      value: number;
    };
    if (card && card.value <= remainingValue) {
      received.push(id);
      remainingValue -= card.value;

      const inv = db
        .prepare('SELECT quantity FROM inventory WHERE card_id = ?')
        .get(id) as { quantity: number } | undefined;
      if (inv) {
        db.prepare(
          'UPDATE inventory SET quantity = quantity + 1 WHERE card_id = ?'
        ).run(id);
      } else {
        db.prepare(
          'INSERT INTO inventory (card_id, quantity) VALUES (?, 1)'
        ).run(id);
      }
    }
  }

  // If we didn't give enough, give at least one random card
  if (received.length === 0 && pool.length > 0) {
    const giveId = pool[Math.floor(Math.random() * pool.length)].id;
    const inv = db
      .prepare('SELECT quantity FROM inventory WHERE card_id = ?')
      .get(giveId) as { quantity: number } | undefined;
    if (inv) {
      db.prepare(
        'UPDATE inventory SET quantity = quantity + 1 WHERE card_id = ?'
      ).run(giveId);
    } else {
      db.prepare('INSERT INTO inventory (card_id, quantity) VALUES (?, 1)').run(
        giveId
      );
    }
    received.push(giveId);
  }

  const receivedCards =
    received.length > 0
      ? db
          .prepare(
            `
        SELECT c.id, c.name, c.rarity, c.value
        FROM cards c
        WHERE c.id IN (${received.map(() => '?').join(',')})
      `
          )
          .all(...received)
      : [];

  res.json({
    received: receivedCards,
    offered_value: offerValue.total,
  });
});
